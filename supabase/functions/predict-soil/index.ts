import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { ph, nitrogen, phosphorus, potassium, moisture, organicMatter, location, cropType } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert soil scientist AI for Krushi Mitra - AI Smart Farming System.

Your role is to analyze soil parameters and provide comprehensive recommendations for Indian farmers. Consider:
1. Soil fertility assessment
2. Nutrient deficiencies and excesses
3. Soil health indicators
4. Crop-specific recommendations
5. Fertilizer recommendations (organic and chemical options)
6. Soil improvement strategies

Provide practical, cost-effective solutions suitable for small and medium Indian farmers.`;

    const userPrompt = `Analyze the following soil parameters and provide recommendations:

Soil Parameters:
- pH Level: ${ph ?? 'Not provided'}
- Nitrogen (N): ${nitrogen ?? 'Not provided'} kg/ha
- Phosphorus (P): ${phosphorus ?? 'Not provided'} kg/ha
- Potassium (K): ${potassium ?? 'Not provided'} kg/ha
- Moisture Content: ${moisture ?? 'Not provided'}%
- Organic Matter: ${organicMatter ?? 'Not provided'}%
- Location/Region: ${location ?? 'Not specified'}
- Intended Crop: ${cropType ?? 'General farming'}

Provide a comprehensive soil analysis with actionable recommendations.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "analyze_soil",
              description: "Provide structured soil analysis and recommendations",
              parameters: {
                type: "object",
                properties: {
                  fertilityScore: { 
                    type: "number", 
                    description: "Overall fertility score 0-100" 
                  },
                  fertilityRating: { 
                    type: "string", 
                    enum: ["poor", "below_average", "average", "good", "excellent"],
                    description: "Fertility rating category"
                  },
                  phAnalysis: {
                    type: "object",
                    properties: {
                      status: { type: "string", enum: ["acidic", "slightly_acidic", "neutral", "slightly_alkaline", "alkaline"] },
                      recommendation: { type: "string" }
                    },
                    required: ["status", "recommendation"]
                  },
                  nutrientAnalysis: {
                    type: "object",
                    properties: {
                      nitrogen: { 
                        type: "object",
                        properties: {
                          status: { type: "string", enum: ["deficient", "low", "adequate", "high", "excess"] },
                          recommendation: { type: "string" }
                        },
                        required: ["status", "recommendation"]
                      },
                      phosphorus: { 
                        type: "object",
                        properties: {
                          status: { type: "string", enum: ["deficient", "low", "adequate", "high", "excess"] },
                          recommendation: { type: "string" }
                        },
                        required: ["status", "recommendation"]
                      },
                      potassium: { 
                        type: "object",
                        properties: {
                          status: { type: "string", enum: ["deficient", "low", "adequate", "high", "excess"] },
                          recommendation: { type: "string" }
                        },
                        required: ["status", "recommendation"]
                      }
                    },
                    required: ["nitrogen", "phosphorus", "potassium"]
                  },
                  fertilizerRecommendations: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        type: { type: "string", enum: ["organic", "chemical", "bio-fertilizer"] },
                        quantity: { type: "string" },
                        applicationMethod: { type: "string" },
                        timing: { type: "string" }
                      },
                      required: ["name", "type", "quantity"]
                    }
                  },
                  soilImprovementTips: {
                    type: "array",
                    items: { type: "string" }
                  },
                  suitableCrops: {
                    type: "array",
                    items: { type: "string" },
                    description: "Crops suitable for this soil condition"
                  },
                  warnings: {
                    type: "array",
                    items: { type: "string" },
                    description: "Any warnings or concerns about soil health"
                  },
                  additionalNotes: { type: "string" }
                },
                required: ["fertilityScore", "fertilityRating", "nutrientAnalysis", "fertilizerRecommendations", "soilImprovementTips"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "analyze_soil" } }
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
      throw new Error("No analysis received from AI");
    }

    const analysis = JSON.parse(toolCall.function.arguments);

    return new Response(
      JSON.stringify({
        success: true,
        analysis,
        inputParameters: { ph, nitrogen, phosphorus, potassium, moisture, organicMatter },
        modelUsed: "google/gemini-3-flash-preview",
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Error in predict-soil:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error occurred" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
