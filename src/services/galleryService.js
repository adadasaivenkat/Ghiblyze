import { supabase } from '../lib/supabaseClient';

// Custom event for gallery updates
export const GALLERY_UPDATE_EVENT = 'gallery-update';

export const saveToGallery = async (imageUrl, title, userId) => {
  if (!userId) {
    throw new Error('User ID is required');
  }

  try {
    const { data, error } = await supabase
      .from('gallery')
      .insert([
        {
          url: imageUrl,
          title: title || 'Generated Ghibli Image',
          created_at: new Date().toISOString(),
          clerk_user_id: userId
        }
      ])
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error saving to gallery:', error);
    throw error;
  }
};

export const getGallery = async (userId) => {
  if (!userId) {
    throw new Error('User ID is required');
  }

  try {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .eq('clerk_user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching gallery:', error);
    throw error;
  }
};

export const deleteFromGallery = async (id, userId) => {
  if (!userId) {
    throw new Error('User ID is required');
  }

  try {
    // First verify the image belongs to the user
    const { data: image, error: fetchError } = await supabase
      .from('gallery')
      .select('clerk_user_id')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;
    if (!image || image.clerk_user_id !== userId) {
      throw new Error('Unauthorized to delete this image');
    }

    // If verification passes, delete the image
    const { error } = await supabase
      .from('gallery')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting from gallery:', error);
    throw error;
  }
}; 