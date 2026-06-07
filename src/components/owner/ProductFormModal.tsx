'use client';
import { useState, useRef } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { createProduct, updateProduct } from '@/actions/products';
import { Product } from '@/types';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
}

export function ProductFormModal({ isOpen, onClose, product }: ProductFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(product?.image_url || null);
  const formRef = useRef<HTMLFormElement>(null);

  const isEdit = !!product;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(formRef.current!);

    const result = isEdit
      ? await updateProduct(product.id, formData)
      : await createProduct(formData);

    setLoading(false);

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success(isEdit ? 'Product updated!' : 'Product created!');
      onClose();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Product' : 'Add New Product'} size="lg">
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Input
              id="name"
              name="name"
              label="Product Name"
              placeholder="e.g. Rice 25kg Bag"
              defaultValue={product?.name}
              required
            />
          </div>
          <Input
            id="category"
            name="category"
            label="Category"
            placeholder="e.g. Grains, Spices"
            defaultValue={product?.category}
            required
          />
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            label="Price (₹)"
            placeholder="0.00"
            defaultValue={product?.price}
            required
          />
          <div className="col-span-2">
            <Input
              id="stock_quantity"
              name="stock_quantity"
              type="number"
              label="Stock Quantity"
              placeholder="0"
              defaultValue={product?.stock_quantity}
              required
            />
          </div>
          <div className="col-span-2">
            <Textarea
              id="description"
              name="description"
              label="Description (optional)"
              placeholder="Product description..."
              defaultValue={product?.description || ''}
              rows={3}
            />
          </div>

          {/* Image upload */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Image {isEdit && <span className="text-gray-400">(leave blank to keep current)</span>}
            </label>
            {preview && (
              <div className="relative w-full h-40 rounded-lg overflow-hidden border border-gray-200 mb-2">
                <Image src={preview} alt="Preview" fill className="object-cover" unoptimized />
              </div>
            )}
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 cursor-pointer"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {isEdit ? 'Save Changes' : 'Add Product'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
