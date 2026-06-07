'use client';

import { useCart } from '@/hooks/useCart';
import { CartPanel } from '@/components/customer/CartPanel';
import { PageLoader } from '@/components/ui/Spinner';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function CustomerCartPage() {
  const { cart, loaded, totalItems, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();

  if (!loaded) return <PageLoader />;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/customer/products"
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Cart</h1>
          <p className="text-sm text-gray-500">
            {totalItems > 0 ? `${totalItems} item${totalItems !== 1 ? 's' : ''}` : 'Empty'}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <CartPanel
          cart={cart}
          totalItems={totalItems}
          totalPrice={totalPrice}
          onUpdateQuantity={updateQuantity}
          onRemove={removeFromCart}
          onClear={clearCart}
        />
      </div>
    </div>
  );
}
