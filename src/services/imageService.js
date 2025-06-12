import { supabase } from '../lib/supabaseClient';

const API_URL = 'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0';

const ghibliTransformationPrompts = [
  "Transform into a Studio Ghibli style illustration, featuring soft, diffused lighting, watercolor brushstrokes, lush natural scenery with vibrant greenery and detailed skies, and a slightly whimsical, fantastical atmosphere.",
  "Apply a Studio Ghibli art style filter, focusing on warm, gentle colors, intricate background details resembling hand-painted animation, and a serene, nostalgic mood.",
  "Render this image in the style of Studio Ghibli, emphasizing expressive character features (if present), dreamlike environmental elements, and a painterly texture.",
  "Convert to Studio Ghibli aesthetic, bringing out the natural beauty, adding subtle magical touches, and using a palette of earthy tones mixed with vibrant highlights."
];

export const generateImage = async (prompt) => {
  try {
    if (!prompt || prompt.trim().length === 0) {
      throw new Error('Please provide a valid prompt');
    }

    // Format the prompt to be more descriptive and specific
    const formattedPrompt = `Create a Studio Ghibli style illustration of ${prompt}. The image should have the characteristic Ghibli art style with soft colors, detailed backgrounds, and whimsical elements.`;

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: formattedPrompt,
        parameters: {
          negative_prompt: "ugly, blurry, low quality, distorted, deformed",
          num_inference_steps: 30,
          guidance_scale: 7.5
        }
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate image');
    }

    const blob = await response.blob();
    const file = new File([blob], `generated-${Date.now()}.png`, { type: 'image/png' });

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('ghiblyze-images')
      .upload(`generated/${file.name}`, file);

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('ghiblyze-images')
      .getPublicUrl(`generated/${file.name}`);

    return publicUrl;
  } catch (error) {
    console.error('Error generating image:', error);
    throw new Error(error.message || 'Failed to generate image. Please try again.');
  }
};

export const transformImage = async (imageFile, prompt) => {
  try {
    if (!imageFile) {
      throw new Error('Please provide a valid image file');
    }

    // Convert image to base64
    const base64Image = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result.split(',')[1];
        if (!base64) {
          reject(new Error('Failed to convert image to base64'));
        }
        resolve(base64);
      };
      reader.onerror = () => reject(new Error('Failed to read image file'));
      reader.readAsDataURL(imageFile);
    });

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: {
          image: base64Image,
          prompt: prompt || ghibliTransformationPrompts[Math.floor(Math.random() * ghibliTransformationPrompts.length)],
        },
        parameters: {
          negative_prompt: "ugly, blurry, low quality, distorted, deformed",
          num_inference_steps: 30,
          guidance_scale: 7.5
        }
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to transform image');
    }

    const blob = await response.blob();
    const file = new File([blob], `transformed-${Date.now()}.png`, { type: 'image/png' });

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('ghiblyze-images')
      .upload(`transformed/${file.name}`, file);

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('ghiblyze-images')
      .getPublicUrl(`transformed/${file.name}`);

    return publicUrl;
  } catch (error) {
    console.error('Error transforming image:', error);
    throw new Error(error.message || 'Failed to transform image. Please try again.');
  }
}; 