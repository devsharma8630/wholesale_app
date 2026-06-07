'use client';

import { useEffect, useState } from 'react';
import { Product } from '@/types';
import { ProductsBrowser } from '@/components/customer/ProductsBrowser';
import { useCart } from '@/hooks/useCart';
import { createClient } from '@/lib/supabase/client';
import { PageLoader } from '@/components/ui/Spinner';
import toast from 'react-hot-toast';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export default function CustomerProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, totalItems } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {
        setProducts(data);
        const cats = [...new Set(data.map((p) => p.category))].sort();
        setCategories(cats);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product, quantity: number) => {
    addToCart(product, quantity);
    toast.success(`${product.name} added to cart`);
  };

  if (loading) return <PageLoader />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-0.5">{products.length} products available</p>
        </div>
        <Link
          href="/customer/cart"
          className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors relative"
        >
          <ShoppingCart size={16} />
          Cart
          {totalItems > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold">
              {totalItems > 9 ? '9+' : totalItems}
            </span>
          )}
        </Link>
      </div>

      <ProductsBrowser
        products={products}
        categories={categories}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}
