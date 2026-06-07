import { Package, ShoppingCart, Clock, CheckCircle, TrendingUp, AlertCircle } from 'lucide-react';
import { getDashboardStats } from '@/services/orders';
import { getAllOrders } from '@/services/orders';
import { StatsCard } from '@/components/shared/StatsCard';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency, formatDate, getOrderStatusColor, getOrderStatusLabel } from '@/lib/utils';
import Link from 'next/link';

export default async function OwnerDashboardPage() {
  const [stats, recentOrders] = await Promise.all([
    getDashboardStats(),
    getAllOrders(),
  ]);

  const latestOrders = recentOrders.slice(0, 6);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1 text-sm">Welcome back! Here's what's happening in your shop.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard title="Total Products" value={stats.totalProducts} icon={Package} color="blue" subtitle="In catalog" />
        <StatsCard title="Total Orders" value={stats.totalOrders} icon={ShoppingCart} color="purple" subtitle="All time" />
        <StatsCard title="Pending Orders" value={stats.pendingOrders} icon={Clock} color="yellow" subtitle="Need attention" />
        <StatsCard title="Completed" value={stats.completedOrders} icon={CheckCircle} color="green" subtitle="Successfully done" />
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-gray-900">Recent Orders</h2>
            <p className="text-xs text-gray-400 mt-0.5">Latest customer orders</p>
          </div>
          <Link
            href="/owner/orders"
            className="text-sm text-blue-600 hover:text-blue-700 font-semibold bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
          >
            View all →
          </Link>
        </div>

        {latestOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
              <ShoppingCart size={24} className="text-gray-400" />
            </div>
            <p className="font-semibold text-gray-700">No orders yet</p>
            <p className="text-sm text-gray-400 mt-1">Orders will appear here when customers place them</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/80">
                  <th className="text-left px-6 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Order ID</th>
                  <th className="text-left px-6 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Customer</th>
                  <th className="text-left px-6 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Date</th>
                  <th className="text-right px-6 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Amount</th>
                  <th className="text-left px-6 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {latestOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-800">{order.profiles?.full_name || 'Unknown'}</p>
                      <p className="text-xs text-gray-400">{order.profiles?.phone}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">{formatDate(order.created_at)}</td>
                    <td className="px-6 py-4 text-right font-bold text-gray-900">{formatCurrency(order.total_price)}</td>
                    <td className="px-6 py-4">
                      <Badge className={getOrderStatusColor(order.status)}>
                        {getOrderStatusLabel(order.status)}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}