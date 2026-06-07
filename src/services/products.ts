import { createClient } from '@/lib/supabase/server';
import { Product } from '@/types';

export async function getProducts(search?: string, category?: string): Promise<Product[]> {
  const supabase = await createClient();

  let query = supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (search) {
    query = query.ilike('name', `%${search}%`);
  }

  if (category && category !== 'all') {
    query = query.eq('category', category);
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);
  return data || [];
}

export async function getProductById(id: string): Promise<Product | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data;
}

export async function getCategories(): Promise<string[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('products')
    .select('category')
    .order('category');

  if (error) return [];

  const categories = [...new Set(data.map((p) => p.category))];
  return categories;
}
