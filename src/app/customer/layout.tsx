import { createClient } from '@/lib/supabase/server';
import { CustomerNav } from '@/components/shared/CustomerNav';

export default async function CustomerLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let customerName = '';
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single();
    customerName = profile?.full_name || '';
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomerNav customerName={customerName} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {children}
      </main>
    </div>
  );
}