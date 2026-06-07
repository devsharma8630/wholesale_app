'use client';
import { useState } from 'react';
import { ShoppingCart, Package, Plus, Minus, Star } from 'lucide-react';
import { Product } from '@/types';
import { formatCurrency } from '@/lib/utils';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const isOutOfStock = product.stock_quantity === 0;
  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= 5;

  const handleAdd = () => {
    onAddToCart(product, qty);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      setQty(1);
    }, 1500);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden group">
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-50 overflow-hidden">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <Package size={36} className="text-gray-300" />
            <p className="text-xs text-gray-300 mt-2">No image</p>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          <span className="bg-white/95 backdrop-blur-sm text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
            {product.category}
          </span>
          {isOutOfStock && (
            <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              Out of Stock
            </span>
          )}
          {isLowStock && (
            <span className="bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              Low Stock
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-sm mb-1 truncate">{product.name}</h3>
        {product.description && (
          <p className="text-xs text-gray-400 mb-3 line-clamp-2 leading-relaxed">{product.description}</p>
        )}

        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xl font-bold text-blue-600">{formatCurrency(product.price)}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {product.stock_quantity > 0 ? (
                <span className={isLowStock ? 'text-orange-500 font-medium' : 'text-emerald-500 font-medium'}>
                  {product.stock_quantity} available
                </span>
              ) : (
                <span className="text-red-400">Not available</span>
              )}
            </p>
          </div>
        </div>

        {!isOutOfStock && (
          <div className="space-y-2">
            {/* Qty selector */}
            <div className="flex items-center gap-2">
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden flex-1">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 hover:bg-gray-100 transition-colors text-gray-600"
                >
                  <Minus size={13} />
                </button>
                <span className="flex-1 text-center text-sm font-bold text-gray-900">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(product.stock_quantity, q + 1))}
                  className="px-3 py-2 hover:bg-gray-100 transition-colors text-gray-600"
                >
                  <Plus size={13} />
                </button>
              </div>
              <button
                onClick={handleAdd}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                  added
                    ? 'bg-emerald-500 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30'
                }`}
              >
                <ShoppingCart size={14} />
                {added ? 'Added!' : 'Add'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}