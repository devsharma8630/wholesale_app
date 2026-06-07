import { Order } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatCurrency, formatDate, getOrderStatusColor, getOrderStatusLabel } from '@/lib/utils';
import { ClipboardList, Package, Calendar, Hash } from 'lucide-react';

interface CustomerOrdersListProps {
  orders: Order[];
}

export function CustomerOrdersList({ orders }: CustomerOrdersListProps) {
  if (orders.length === 0) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="No orders yet"
        description="Your order history will appear here once you place an order."
      />
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
          {/* Order Header */}
          <div className="px-5 py-4 flex flex-wrap items-center justify-between gap-3 bg-gray-50/50 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                <Hash size={12} />
                <span className="font-mono font-semibold text-gray-700">{order.id.slice(0, 8).toUpperCase()}</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                <Calendar size={12} />
                <span>{formatDate(order.created_at)}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-gray-400">{order.total_items} items</p>
                <p className="font-bold text-gray-900 text-base">{formatCurrency(order.total_price)}</p>
              </div>
              <Badge className={getOrderStatusColor(order.status)}>
                {getOrderStatusLabel(order.status)}
              </Badge>
            </div>
          </div>

          {/* Order Items */}
          {order.order_items && order.order_items.length > 0 && (
            <div className="px-5 py-4">
              <div className="space-y-2.5">
                {order.order_items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <Package size={14} className="text-blue-500" />
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-800">{item.products?.name || 'Product'}</span>
                        <span className="text-xs text-gray-400 ml-2">× {item.quantity}</span>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-gray-700">
                      {formatCurrency(item.price_at_order * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}