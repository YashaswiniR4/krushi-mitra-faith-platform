import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authentication check
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - Invalid or expired token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { imageBase64, cropType } = await req.json();

    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: 'Image data is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert agricultural disease detection AI for Krushi Mitra - AI Smart Farming System.
    
Your role is to analyze crop images and identify diseases with high accuracy. You must provide:
1. Disease name (if any detected)
2. Confidence level (0-100%)
3. Severity (mild, moderate, severe)
4. Affected plant parts
5. Detailed recommendations for treatment
6. Preventive measures for future

If the plant appears healthy, indicate that with appropriate confidence.
Be precise and practical in your recommendations, considering Indian farming practices.`;

    const userPrompt = `Analyze this ${cropType || 'crop'} image for any diseases or health issues. Provide a comprehensive diagnosis.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: systemPrompt },
          { 
            role: "user", 
            content: [
              { type: "text", text: userPrompt },
              { type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageBase64}` } }
            ]
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "diagnose_crop_disease",
              description: "Provide a structured diagnosis of crop disease from image analysis",
              parameters: {
                type: "object",
                properties: {
                  isHealthy: { type: "boolean", description: "Whether the plant appears healthy" },
                  diseaseName: { type: "string", description: "Name of the detected disease, or 'Healthy' if none" },
                  confidence: { type: "number", description: "Confidence level 0-100" },
                  severity: { type: "string", enum: ["none", "mild", "moderate", "severe"] },
                  affectedParts: { 
                    type: "array", 
                    items: { type: "string" },
                    description: "List of affected plant parts (leaves, stem, roots, fruits, etc.)"
                  },
                  symptoms: {
                    type: "array",
                    items: { type: "string" },
                    description: "Observable symptoms"
                  },
                  treatmentRecommendations: {
                    type: "array",
                    items: { type: "string" },
                    description: "Recommended treatments"
                  },
                  preventiveMeasures: {
                    type: "array",
                    items: { type: "string" },
                    description: "Preventive measures for future"
                  },
                  additionalNotes: { type: "string", description: "Any additional observations or notes" }
                },
                required: ["isHealthy", "diseaseName", "confidence", "severity", "treatmentRecommendations"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "diagnose_crop_disease" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds to continue." }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    
    if (!toolCall) {
      throw new Error("No diagnosis received from AI");
    }

    const diagnosis = JSON.parse(toolCall.function.arguments);

    return new Response(
      JSON.stringify({
        success: true,
        diagnosis,
        modelUsed: "google/gemini-2.5-pro",
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Error in predict-disease:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error occurred" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
