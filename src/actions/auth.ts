'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Authentication failed' };

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  revalidatePath('/', 'layout');

  if ((profile as any)?.role === 'owner') {
    redirect('/owner/dashboard');
  }
  redirect('/customer/dashboard');
}

export async function register(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const full_name = formData.get('full_name') as string;
  const phone = formData.get('phone') as string;
  const role = (formData.get('role') as string) || 'customer';

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name, phone, role },
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (!data.user) {
    return { error: 'Failed to create user' };
  }

  // Use any to bypass strict type checking on insert
  const sb = supabase as any;
  const { error: profileError } = await sb.from('profiles').insert({
    id: data.user.id,
    full_name,
    phone,
    role,
  });

  if (profileError) {
    return { error: profileError.message };
  }

  revalidatePath('/', 'layout');
  redirect('/login?registered=true');
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/login');
}