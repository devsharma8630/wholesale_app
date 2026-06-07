'use client';
import { useState } from 'react';
import { Trash2, Minus, Plus, ShoppingCart, CheckCircle, Package, ArrowRight } from 'lucide-react';
import { CartItem } from '@/types';
import { placeOrder } from '@/actions/orders';
import { formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface CartPanelProps {
  cart: CartItem[];
  totalItems: number;
  totalPrice: number;
  onUpdateQuantity: (productId: string, qty: number) => void;
  onRemove: (productId: string) => void;
  onClear: () => void;
}

export function CartPanel({ cart, totalItems, totalPrice, onUpdateQuantity, onRemove, onClear }: CartPanelProps) {
  const [placing, setPlacing] = useState(false);
  const [ordered, setOrdered] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;
    setPlacing(true);
    const result = await placeOrder(cart);
    setPlacing(false);
    if (result?.error) {
      toast.error(result.error);
    } else {
      setOrderId(result.orderId || null);
      setOrdered(true);
      onClear();
    }
  };

  if (ordered) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center px-4">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-5">
          <CheckCircle size={40} className="text-emerald-500" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Order Placed!</h3>
        <p className="text-gray-500 mb-2">Your order has been submitted successfully.</p>
        {orderId && (
          <p className="text-xs font-mono bg-gray-100 text-gray-500 px-3 py-1.5 rounded-lg">
            Order ID: #{orderId.slice(0, 8).toUpperCase()}
          </p>
        )}
        <button
          onClick={() => setOrdered(false)}
          className="mt-6 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
          <ShoppingCart size={32} className="text-gray-300" />
        </div>
        <h3 className="font-bold text-gray-700 text-lg">Your cart is empty</h3>
        <p className="text-sm text-gray-400 mt-1">Add products to get started</p>
      </div>
    );
  }

  return (
    <div>
      {/* Items */}
      <div className="space-y-3 mb-6">
        {cart.map((item) => (
          <div key={item.product.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-white border border-gray-200 flex-shrink-0">
              {item.product.image_url ? (
                <Image src={item.product.image_url} alt={item.product.name} width={56} height={56} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package size={20} className="text-gray-300" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">{item.product.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{formatCurrency(item.product.price)} each</p>
            </div>

            <div className="flex items-center gap-1 bg-white rounded-xl border border-gray-200 px-1">
              <button onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                <Minus size={11} />
              </button>
              <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
              <button onClick={() => onUpdateQuantity(item.product.id, Math.min(item.product.stock_quantity, item.quantity + 1))} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                <Plus size={11} />
              </button>
            </div>

            <div className="text-right min-w-[60px]">
              <p className="text-sm font-bold text-gray-900">{formatCurrency(item.product.price * item.quantity)}</p>
            </div>

            <button onClick={() => onRemove(item.product.id)} className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-gray-50 rounded-2xl p-4 mb-4 space-y-3">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Items ({totalItems})</span>
          <span className="font-medium">{formatCurrency(totalPrice)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Delivery</span>
          <span className="text-emerald-600 font-medium">Free</span>
        </div>
        <div className="border-t border-gray-200 pt-3 flex justify-between">
          <span className="font-bold text-gray-900">Total</span>
          <span className="font-bold text-xl text-blue-600">{formatCurrency(totalPrice)}</span>
        </div>
      </div>

      <button
        onClick={handlePlaceOrder}
        disabled={placing}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-600/30"
      >
        {placing ? (
          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <>Place Order <ArrowRight size={18} /></>
        )}
      </button>

      <button onClick={onClear} className="w-full mt-2 text-sm text-red-400 hover:text-red-600 py-2 rounded-xl hover:bg-red-50 transition-colors">
        Clear Cart
      </button>
    </div>
  );
}