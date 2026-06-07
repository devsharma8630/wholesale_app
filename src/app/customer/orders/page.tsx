import { createClient } from '@/lib/supabase/server';
import { getCustomerOrders } from '@/services/orders';
import { CustomerOrdersList } from '@/components/customer/CustomerOrdersList';

export default async function CustomerOrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const orders = await getCustomerOrders(user.id);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {orders.length} order{orders.length !== 1 ? 's' : ''} placed
        </p>
      </div>
      <CustomerOrdersList orders={orders} />
    </div>
  );
}
