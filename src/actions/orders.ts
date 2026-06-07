'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { CartItem, OrderStatus } from '@/types';

export async function placeOrder(cartItems: CartItem[]) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  if (cartItems.length === 0) return { error: 'Cart is empty' };

  const total_items = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const total_price = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // Create order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      customer_id: user.id,
      status: 'pending',
      total_items,
      total_price,
    })
    .select()
    .single();

  if (orderError || !order) {
    return { error: orderError?.message || 'Failed to create order' };
  }

  // Create order items
  const orderItems = cartItems.map((item) => ({
    order_id: order.id,
    product_id: item.product.id,
    quantity: item.quantity,
    price_at_order: item.product.price,
  }));

  const { error: itemsError } = await supabase.from('order_items').insert(orderItems);

  if (itemsError) {
    // Rollback order
    await supabase.from('orders').delete().eq('id', order.id);
    return { error: itemsError.message };
  }

  // Reduce stock quantities
  for (const item of cartItems) {
    await supabase.rpc('decrement_stock', {
      product_id: item.product.id,
      quantity: item.quantity,
    });
  }

  revalidatePath('/customer/orders');
  revalidatePath('/owner/orders');
  return { success: true, orderId: order.id };
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId);

  if (error) return { error: error.message };

  revalidatePath('/owner/orders');
  revalidatePath('/customer/orders');
  return { success: true };
}
