import { createClient } from '@/lib/supabase/server';
import { getCustomerOrders } from '@/services/orders';
import { getProducts } from '@/services/products';
import { StatsCard } from '@/components/shared/StatsCard';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency, formatDate, getOrderStatusColor, getOrderStatusLabel } from '@/lib/utils';
import { ShoppingCart, Package, ClipboardList } from 'lucide-react';
import Link from 'next/link';

export default async function CustomerDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const [orders, products] = await Promise.all([
    getCustomerOrders(user.id),
    getProducts(),
  ]);

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single();

  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const recentOrders = orders.slice(0, 5);

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {profile?.full_name?.split(' ')[0] || 'Customer'}!
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">Here&apos;s your account overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <StatsCard
          title="Total Orders"
          value={orders.length}
          icon={ClipboardList}
          color="blue"
        />
        <StatsCard
          title="Pending Orders"
          value={pendingOrders}
          icon={ShoppingCart}
          color="yellow"
        />
        <StatsCard
          title="Products Available"
          value={products.length}
          icon={Package}
          color="green"
        />
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Link
          href="/customer/products"
          className="flex items-center gap-4 p-5 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition-colors"
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/20">
            <Package size={20} />
          </div>
          <div>
            <p className="font-semibold">Browse Products</p>
            <p className="text-sm text-brand-100">{products.length} products available</p>
          </div>
        </Link>
        <Link
          href="/customer/orders"
          className="flex items-center gap-4 p-5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100">
            <ClipboardList size={20} className="text-gray-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">My Orders</p>
            <p className="text-sm text-gray-500">{orders.length} orders placed</p>
          </div>
        </Link>
      </div>

      {/* Recent Orders */}
      {recentOrders.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Recent Orders</h2>
            <Link href="/customer/orders" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
              View all
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="text-xs text-gray-400 font-mono">#{order.id.slice(0, 8).toUpperCase()}</p>
                  <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-semibold text-gray-900">{formatCurrency(order.total_price)}</p>
                  <Badge className={getOrderStatusColor(order.status)}>
                    {getOrderStatusLabel(order.status)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
