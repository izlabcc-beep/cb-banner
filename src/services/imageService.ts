/**
 * Service to handle image generation API calls.
 * Uses edge function to securely call Google Gemini API and remove.bg
 */

import { supabase } from "@/integrations/supabase/client";

export const generateImage = async (prompt: string): Promise<string> => {
  try {
    console.log("🎨 Starting image generation...");
    console.log("📝 Prompt:", prompt);

    const startTime = Date.now();

    const { data, error } = await supabase.functions.invoke('generate-image', {
      body: { prompt }
    });

    if (error) {
      console.error("❌ Edge function error:", error);
      throw new Error(error.message || 'Failed to generate image');
    }

    if (data?.error) {
      console.error("❌ API error:", data.error);
      throw new Error(data.error);
    }

    if (!data?.imageUrl) {
      throw new Error('No image URL in response');
    }

    const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`🎉 Total processing time: ${totalTime}s`);

    return data.imageUrl;
  } catch (error) {
    console.error("❌ Error generating image:", error);
    throw error;
  }
};
