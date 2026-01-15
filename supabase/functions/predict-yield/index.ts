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

    const { 
      cropType, 
      variety,
      farmSize, 
      soilType, 
      irrigationType,
      fertilizersUsed,
      sowingDate,
      location,
      previousYield,
      weatherConditions 
    } = await req.json();

    if (!cropType || !farmSize) {
      return new Response(
        JSON.stringify({ error: 'Crop type and farm size are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert agricultural yield prediction AI for Krushi Mitra - AI Smart Farming System.

Your role is to predict crop yields and provide optimization recommendations for Indian farmers. Consider:
1. Historical yield data for the region
2. Crop variety characteristics
3. Soil and irrigation factors
4. Weather patterns
5. Farming practices
6. Market timing recommendations

Provide realistic predictions based on Indian agricultural conditions and practical recommendations to maximize yield and profit.`;

    const userPrompt = `Predict the yield for the following farm and provide optimization recommendations:

Farm Details:
- Crop: ${cropType}
- Variety: ${variety ?? 'Standard variety'}
- Farm Size: ${farmSize} acres
- Soil Type: ${soilType ?? 'Not specified'}
- Irrigation: ${irrigationType ?? 'Not specified'}
- Fertilizers Used: ${fertilizersUsed ?? 'Not specified'}
- Sowing Date: ${sowingDate ?? 'Not specified'}
- Location: ${location ?? 'Not specified'}
- Previous Year Yield: ${previousYield ?? 'Not available'}
- Weather Conditions: ${weatherConditions ?? 'Normal'}

Provide yield prediction with confidence intervals and recommendations to improve yield.`;

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
              name: "predict_yield",
              description: "Provide structured yield prediction and farming recommendations",
              parameters: {
                type: "object",
                properties: {
                  predictedYield: {
                    type: "object",
                    properties: {
                      value: { type: "number", description: "Predicted yield in quintals" },
                      unit: { type: "string", description: "Unit of measurement (quintals/acre, kg/acre, etc.)" },
                      totalForFarm: { type: "number", description: "Total predicted yield for entire farm" }
                    },
                    required: ["value", "unit", "totalForFarm"]
                  },
                  confidenceInterval: {
                    type: "object",
                    properties: {
                      low: { type: "number" },
                      high: { type: "number" },
                      confidence: { type: "number", description: "Confidence percentage 0-100" }
                    },
                    required: ["low", "high", "confidence"]
                  },
                  yieldRating: {
                    type: "string",
                    enum: ["below_average", "average", "good", "excellent"],
                    description: "How this yield compares to regional averages"
                  },
                  marketEstimate: {
                    type: "object",
                    properties: {
                      estimatedPricePerQuintal: { type: "number" },
                      totalEstimatedRevenue: { type: "number" },
                      bestSellingPeriod: { type: "string" },
                      marketNotes: { type: "string" }
                    },
                    required: ["estimatedPricePerQuintal", "totalEstimatedRevenue"]
                  },
                  yieldOptimizationTips: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        tip: { type: "string" },
                        potentialImpact: { type: "string" },
                        priority: { type: "string", enum: ["high", "medium", "low"] }
                      },
                      required: ["tip", "potentialImpact", "priority"]
                    }
                  },
                  riskFactors: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        risk: { type: "string" },
                        likelihood: { type: "string", enum: ["low", "medium", "high"] },
                        mitigation: { type: "string" }
                      },
                      required: ["risk", "likelihood", "mitigation"]
                    }
                  },
                  harvestTimeline: {
                    type: "object",
                    properties: {
                      expectedHarvestDate: { type: "string" },
                      harvestWindow: { type: "string" },
                      preHarvestActivities: {
                        type: "array",
                        items: { type: "string" }
                      }
                    },
                    required: ["expectedHarvestDate", "harvestWindow"]
                  },
                  comparisonWithRegionalAverage: {
                    type: "object",
                    properties: {
                      regionalAverage: { type: "number" },
                      percentageDifference: { type: "number" },
                      notes: { type: "string" }
                    },
                    required: ["regionalAverage", "percentageDifference"]
                  },
                  additionalRecommendations: { type: "string" }
                },
                required: ["predictedYield", "confidenceInterval", "yieldRating", "yieldOptimizationTips", "riskFactors"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "predict_yield" } }
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
      throw new Error("No prediction received from AI");
    }

    const prediction = JSON.parse(toolCall.function.arguments);

    return new Response(
      JSON.stringify({
        success: true,
        prediction,
        inputParameters: { cropType, variety, farmSize, soilType, irrigationType, location },
        modelUsed: "google/gemini-3-flash-preview",
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Error in predict-yield:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error occurred" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
