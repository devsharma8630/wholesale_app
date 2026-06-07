import { createClient } from '@/lib/supabase/server';
import { Order, DashboardStats } from '@/types';

export async function getAllOrders(search?: string, status?: string): Promise<Order[]> {
  const supabase = await createClient();

  let query = supabase
    .from('orders')
    .select(`
      *,
      profiles (
        id,
        full_name,
        phone,
        role,
        created_at
      ),
      order_items (
        *,
        products (*)
      )
    `)
    .order('created_at', { ascending: false });

  if (status && status !== 'all') {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);

  let orders = (data as Order[]) || [];

  if (search) {
    const lower = search.toLowerCase();
    orders = orders.filter(
      (o) =>
        o.id.toLowerCase().includes(lower) ||
        o.profiles?.full_name.toLowerCase().includes(lower) ||
        o.profiles?.phone.includes(lower)
    );
  }

  return orders;
}

export async function getCustomerOrders(customerId: string): Promise<Order[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        products (*)
      )
    `)
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data as Order[]) || [];
}

export async function getOrderById(id: string): Promise<Order | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      profiles (
        id,
        full_name,
        phone,
        role,
        created_at
      ),
      order_items (
        *,
        products (*)
      )
    `)
    .eq('id', id)
    .single();

  if (error) return null;
  return data as Order;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient();

  const [productsResult, ordersResult] = await Promise.all([
    supabase.from('products').select('id', { count: 'exact', head: true }),
    supabase.from('orders').select('id, status'),
  ]);

  const totalProducts = productsResult.count || 0;
  const orders = ordersResult.data || [];
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const completedOrders = orders.filter((o) => o.status === 'completed').length;

  return { totalProducts, totalOrders, pendingOrders, completedOrders };
}
