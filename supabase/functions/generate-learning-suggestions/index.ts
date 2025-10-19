import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get JWT token from Authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    // Create client with service role for admin operations
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get the current user from the JWT token
    const {
      data: { user },
    } = await supabaseClient.auth.getUser(authHeader.replace("Bearer ", ""));

    if (!user) {
      throw new Error("No user found");
    }

    console.log("Generating AI suggestions for user:", user.id);

    // Fetch user's learning progress
    const { data: progressData, error: progressError } = await supabaseClient
      .from("learning_progress")
      .select("*")
      .eq("user_id", user.id);

    if (progressError) {
      console.error("Error fetching progress:", progressError);
      throw progressError;
    }

    // Fetch user's earned badges
    const { data: badgesData, error: badgesError } = await supabaseClient
      .from("user_badges")
      .select("badges(name, category)")
      .eq("user_id", user.id);

    if (badgesError) {
      console.error("Error fetching badges:", badgesError);
    }

    // Fetch user profile
    const { data: profileData, error: profileError } = await supabaseClient
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("Error fetching profile:", profileError);
    }

    // Build context for AI
    const context = {
      courses: progressData || [],
      earnedBadges: badgesData?.length || 0,
      currentStreak: profileData?.current_streak || 0,
      avgScore: profileData?.avg_score || 0,
    };

    // Create prompt for AI
    const prompt = `You are an AI learning coach for the MCE educational platform. Based on the following student data, provide 3 personalized learning suggestions that are actionable, motivating, and specific.

Student Context:
- Current courses: ${context.courses.map((c: any) => `${c.course_name} (${c.progress_percentage}% complete, weak concepts: ${c.weak_concepts.join(", ") || "none"})`).join(", ")}
- Earned badges: ${context.earnedBadges}
- Current learning streak: ${context.currentStreak} days
- Average test score: ${context.avgScore}%

Provide 3 suggestions in the following format, each on a new line:
1. [Specific actionable suggestion]
2. [Specific actionable suggestion]
3. [Specific actionable suggestion]

Keep each suggestion under 80 characters. Focus on areas where the student can improve based on their weak concepts and progress.`;

    console.log("Calling Lovable AI with prompt");

    // Call Lovable AI
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "You are a helpful AI learning coach that provides concise, actionable learning suggestions.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI API error:", aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        throw new Error("Rate limit exceeded. Please try again later.");
      }
      if (aiResponse.status === 402) {
        throw new Error("Payment required. Please add credits to your Lovable AI workspace.");
      }
      
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const suggestions = aiData.choices[0].message.content;

    console.log("AI suggestions generated:", suggestions);

    // Parse suggestions and save to database
    const suggestionLines = suggestions
      .split("\n")
      .filter((line: string) => line.trim().match(/^\d+\./))
      .map((line: string) => line.replace(/^\d+\.\s*/, "").trim());

    // Delete old suggestions
    await supabaseClient
      .from("ai_suggestions")
      .delete()
      .eq("user_id", user.id);

    // Insert new suggestions
    const { error: insertError } = await supabaseClient
      .from("ai_suggestions")
      .insert(
        suggestionLines.map((text: string, idx: number) => ({
          user_id: user.id,
          suggestion_text: text,
          category: "learning_tip",
          priority: idx + 1,
        }))
      );

    if (insertError) {
      console.error("Error saving suggestions:", insertError);
      throw insertError;
    }

    console.log("Suggestions saved successfully");

    return new Response(
      JSON.stringify({
        success: true,
        suggestions: suggestionLines,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in generate-learning-suggestions:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "An unexpected error occurred",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
