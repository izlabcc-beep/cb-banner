/**
 * Service to handle image generation API calls.
 * Currently uses Google Imagen 4 via Google AI Studio API.
 * Automatically removes background using API4.AI demo endpoint.
 */

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const REMOVEBG_API_KEY = import.meta.env.VITE_REMOVEBG_API_KEY;

/**
 * Remove background from image using remove.bg API
 */
const removeBackground = async (imageUrl: string): Promise<string> => {
    try {
        if (!REMOVEBG_API_KEY) {
            console.warn('Remove.bg API key not configured, skipping background removal');
            return imageUrl;
        }

        // Convert blob URL to blob
        const response = await fetch(imageUrl);
        const blob = await response.blob();

        // Create form data
        const formData = new FormData();
        formData.append('image_file', blob, 'image.png');
        formData.append('size', 'auto');

        // Call remove.bg API
        const bgRemovalResponse = await fetch('https://api.remove.bg/v1.0/removebg', {
            method: 'POST',
            headers: {
                'X-Api-Key': REMOVEBG_API_KEY,
            },
            body: formData
        });

        if (!bgRemovalResponse.ok) {
            const errorText = await bgRemovalResponse.text();
            console.warn('Background removal failed:', errorText);
            return imageUrl;
        }

        // Get the result as blob
        const resultBlob = await bgRemovalResponse.blob();

        // Convert blob to data URL (base64) for stable downloads
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                // Clean up old blob URL
                URL.revokeObjectURL(imageUrl);
                resolve(reader.result as string);
            };
            reader.readAsDataURL(resultBlob);
        });
    } catch (error) {
        console.error('Background removal error:', error);
        console.warn('Returning original image without background removal');
        return imageUrl;
    }
};

export const generateImage = async (prompt: string): Promise<string> => {
    try {
        console.log("🎨 Starting image generation...");
        console.log("📝 Prompt:", prompt);

        if (!GOOGLE_API_KEY) {
            throw new Error("Google API Key is not configured. Please add VITE_GOOGLE_API_KEY to .env.local");
        }

        // Google AI Studio - Nano Banana Pro (Gemini 3 Pro Image Preview)
        const url = `https://generativelanguage.googleapis.com/v1beta/models/nano-banana-pro-preview:generateContent?key=${GOOGLE_API_KEY}`;

        console.log("🚀 Sending request to Nano Banana Pro...");
        const startTime = Date.now();

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
                    temperature: 1,
                    topP: 0.95,
                    topK: 64,
                }
            })
        });

        const generationTime = ((Date.now() - startTime) / 1000).toFixed(1);
        console.log(`✅ Image generated in ${generationTime}s`);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("❌ Nano Banana API Error:", errorText);
            throw new Error(`Failed to generate image: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("📦 Nano Banana Response received");

        // Gemini models with image generation return inline data
        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts) {
            console.error("❌ Unexpected response format:", data);
            throw new Error("Invalid response format from Nano Banana API");
        }

        // Find the image part in the response
        const imagePart = data.candidates[0].content.parts.find((part: any) => part.inlineData);

        if (!imagePart || !imagePart.inlineData || !imagePart.inlineData.data) {
            throw new Error("No image data in response");
        }

        const base64Image = imagePart.inlineData.data;
        const mimeType = imagePart.inlineData.mimeType || 'image/png';

        // Convert base64 to data URL directly (more stable than blob URL)
        const dataUrl = `data:${mimeType};base64,${base64Image}`;

        // Automatically remove background
        console.log("🔄 Removing background...");
        const bgStartTime = Date.now();
        const finalImageUrl = await removeBackground(dataUrl);
        const bgTime = ((Date.now() - bgStartTime) / 1000).toFixed(1);
        console.log(`✅ Background removal complete in ${bgTime}s`);

        const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
        console.log(`🎉 Total processing time: ${totalTime}s`);

        return finalImageUrl;
    } catch (error) {
        console.error("❌ Error generating image:", error);
        throw error;
    }
};
