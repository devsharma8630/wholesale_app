import { getAllOrders } from '@/services/orders';
import { OrdersTable } from '@/components/owner/OrdersTable';

export default async function OwnerOrdersPage() {
  const orders = await getAllOrders();

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {orders.length} order{orders.length !== 1 ? 's' : ''} total
        </p>
      </div>
      <OrdersTable orders={orders} />
    </div>
  );
}
