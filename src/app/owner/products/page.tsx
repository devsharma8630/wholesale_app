import { getProducts } from '@/services/products';
import { ProductsTable } from '@/components/owner/ProductsTable';

export default async function OwnerProductsPage() {
  const products = await getProducts();

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {products.length} product{products.length !== 1 ? 's' : ''} in your catalog
        </p>
      </div>
      <ProductsTable products={products} />
    </div>
  );
}
