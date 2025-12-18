import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GOOGLE_API_KEY = Deno.env.get('GOOGLE_API_KEY');
const REMOVEBG_API_KEY = Deno.env.get('REMOVEBG_API_KEY');

async function removeBackground(imageBase64: string, mimeType: string): Promise<string> {
  if (!REMOVEBG_API_KEY) {
    console.log('Remove.bg API key not configured, skipping background removal');
    return `data:${mimeType};base64,${imageBase64}`;
  }

  try {
    // Convert base64 to binary
    const binaryString = atob(imageBase64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: mimeType });

    const formData = new FormData();
    formData.append('image_file', blob, 'image.png');
    formData.append('size', 'auto');

    console.log('Calling remove.bg API...');
    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': REMOVEBG_API_KEY,
      },
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Remove.bg error:', errorText);
      return `data:${mimeType};base64,${imageBase64}`;
    }

    const resultBuffer = await response.arrayBuffer();
    const resultBase64 = btoa(String.fromCharCode(...new Uint8Array(resultBuffer)));
    console.log('Background removed successfully');
    return `data:image/png;base64,${resultBase64}`;
  } catch (error) {
    console.error('Background removal error:', error);
    return `data:${mimeType};base64,${imageBase64}`;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!GOOGLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'Google API Key is not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Generating image with prompt:', prompt);

    // Use Gemini image generation model
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${GOOGLE_API_KEY}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Generate an image: ${prompt}`
          }]
        }],
        generationConfig: {
          responseModalities: ["TEXT", "IMAGE"]
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google API Error:', errorText);
      return new Response(
        JSON.stringify({ error: `Image generation failed: ${response.statusText}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('Image generated successfully');

    if (!data.candidates?.[0]?.content?.parts) {
      console.error('Unexpected response format:', JSON.stringify(data));
      return new Response(
        JSON.stringify({ error: 'Invalid response format from API' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const imagePart = data.candidates[0].content.parts.find((part: any) => part.inlineData);

    if (!imagePart?.inlineData?.data) {
      return new Response(
        JSON.stringify({ error: 'No image data in response' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const base64Image = imagePart.inlineData.data;
    const mimeType = imagePart.inlineData.mimeType || 'image/png';

    // Remove background
    console.log('Removing background...');
    const finalImageUrl = await removeBackground(base64Image, mimeType);
    console.log('Processing complete');

    return new Response(
      JSON.stringify({ imageUrl: finalImageUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-image function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
