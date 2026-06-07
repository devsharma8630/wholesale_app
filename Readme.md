# WholeSale Pro

A production-ready wholesale ordering web application built with **Next.js 15**, **TypeScript**, **Tailwind CSS**, and **Supabase**.

---

## Features

**Owner Dashboard**
- Dashboard statistics (products, orders, pending, completed)
- Full product management (add / edit / delete + image upload)
- View all orders with customer details and ordered items
- Update order status (Pending → Accepted → Completed / Cancelled)
- Search and filter orders

**Customer Portal**
- Browse and search products with category filtering
- Add to cart with quantity control
- Cart management (update qty, remove items, clear)
- Place orders (stock auto-decrements)
- View full order history with status tracking

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| Deployment | Vercel |

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/login/page.tsx
│   ├── (auth)/register/page.tsx
│   ├── (owner)/dashboard/page.tsx
│   ├── (owner)/products/page.tsx
│   ├── (owner)/orders/page.tsx
│   ├── (customer)/dashboard/page.tsx
│   ├── (customer)/products/page.tsx
│   ├── (customer)/cart/page.tsx
│   └── (customer)/orders/page.tsx
├── components/
│   ├── ui/          # Button, Input, Modal, Badge, Card, Select, Spinner, Textarea, EmptyState
│   ├── owner/       # ProductsTable, OrdersTable, ProductFormModal
│   ├── customer/    # ProductCard, ProductsBrowser, CartPanel, CustomerOrdersList
│   └── shared/      # OwnerSidebar, CustomerNav, StatsCard
├── actions/         # auth.ts, products.ts, orders.ts
├── hooks/           # useCart.ts
├── lib/supabase/    # client.ts, server.ts
├── lib/utils.ts
├── services/        # products.ts, orders.ts
├── types/           # index.ts, database.ts
└── middleware.ts
```

---

## Quick Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create Supabase project

Go to [supabase.com](https://supabase.com) → New Project.

### 3. Run the schema

Paste `supabase/schema.sql` into **Supabase → SQL Editor → New Query** and run it.

### 4. Create Storage bucket

Supabase → **Storage → New Bucket** → name: `product-images` → toggle **Public** ON.

Then run these storage policies in SQL Editor:

```sql
create policy "product-images: public read"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "product-images: owner upload"
  on storage.objects for insert
  with check (
    bucket_id = 'product-images' and
    exists (select 1 from public.profiles where id = auth.uid() and role = 'owner')
  );

create policy "product-images: owner delete"
  on storage.objects for delete
  using (
    bucket_id = 'product-images' and
    exists (select 1 from public.profiles where id = auth.uid() and role = 'owner')
  );
```

### 5. Set environment variables

```bash
cp .env.local.example .env.local
```

Add your values from Supabase **Settings → API**:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### 6. Start dev server

```bash
npm run dev
```

### 7. Create your first owner account

Go to `/register` → fill details → select **Shop Owner** → sign in.

> Disable email confirmation in Supabase → **Authentication → Settings** if needed.

---

## Deploy to Vercel

1. Push to GitHub
2. Import repo at [vercel.com](https://vercel.com)
3. Add the two env vars
4. Deploy

Update Supabase → **Authentication → URL Configuration**:
- Site URL: `https://your-app.vercel.app`
- Redirect URLs: `https://your-app.vercel.app/**`

---

## Production Notes

- **RLS** enforced at DB level — queries are automatically scoped by role
- **Server Actions** validate auth before mutations
- **Middleware** blocks unauthorized route access
- **`decrement_stock()`** RPC is `security definer` — safe for anon callers
- **`price_at_order`** stored at order time — price changes don't affect history
- **Transactional order placement** — failed `order_items` insert rolls back the parent order
- **Stock constraint** — `check (stock_quantity >= 0)` + `greatest(0, ...)` in RPC

---

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |