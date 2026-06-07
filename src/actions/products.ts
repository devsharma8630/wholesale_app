'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function createProduct(formData: FormData) {
  const supabase = await createClient();

  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const category = formData.get('category') as string;
  const price = parseFloat(formData.get('price') as string);
  const stock_quantity = parseInt(formData.get('stock_quantity') as string);
  const imageFile = formData.get('image') as File | null;

  let image_url: string | null = null;

  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, imageFile, { cacheControl: '3600', upsert: false });

    if (uploadError) {
      return { error: uploadError.message };
    }

    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(uploadData.path);

    image_url = urlData.publicUrl;
  }

  const { error } = await supabase.from('products').insert({
    name,
    description: description || null,
    category,
    price,
    stock_quantity,
    image_url,
  });

  if (error) return { error: error.message };

  revalidatePath('/owner/products');
  revalidatePath('/customer/products');
  return { success: true };
}

export async function updateProduct(id: string, formData: FormData) {
  const supabase = await createClient();

  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const category = formData.get('category') as string;
  const price = parseFloat(formData.get('price') as string);
  const stock_quantity = parseInt(formData.get('stock_quantity') as string);
  const imageFile = formData.get('image') as File | null;

  let image_url: string | undefined = undefined;

  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, imageFile, { cacheControl: '3600', upsert: false });

    if (uploadError) return { error: uploadError.message };

    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(uploadData.path);

    image_url = urlData.publicUrl;
  }

  const updateData: Record<string, unknown> = {
    name,
    description: description || null,
    category,
    price,
    stock_quantity,
  };

  if (image_url !== undefined) {
    updateData.image_url = image_url;
  }

  const { error } = await supabase.from('products').update(updateData).eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/owner/products');
  revalidatePath('/customer/products');
  return { success: true };
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from('products').delete().eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/owner/products');
  revalidatePath('/customer/products');
  return { success: true };
}
