'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Package, ClipboardList, LogOut, Store, Menu, X } from 'lucide-react';
import { logout } from '@/actions/auth';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface CustomerNavProps {
  cartCount?: number;
  customerName?: string;
}

const navItems = [
  { href: '/customer/products', label: 'Products', icon: Package },
  { href: '/customer/cart', label: 'Cart', icon: ShoppingCart },
  { href: '/customer/orders', label: 'My Orders', icon: ClipboardList },
];

export function CustomerNav({ cartCount = 0, customerName }: CustomerNavProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/customer/products" className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-md">
              <Store size={16} className="text-white" />
            </div>
            <div>
              <span className="font-bold text-gray-900 text-base">WholeSale Pro</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1 bg-gray-50 rounded-2xl p-1">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all relative',
                  pathname === href
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-900'
                )}
              >
                <Icon size={15} />
                {label}
                {href === '/customer/cart' && cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {customerName && (
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{customerName[0].toUpperCase()}</span>
                </div>
                <span className="text-sm font-medium text-gray-700">{customerName.split(' ')[0]}</span>
              </div>
            )}
            <form action={logout}>
              <button
                type="submit"
                className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-500 transition-colors px-3 py-2 rounded-xl hover:bg-red-50"
              >
                <LogOut size={15} />
                Sign Out
              </button>
            </form>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                pathname === href ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              <Icon size={16} />
              {label}
              {href === '/customer/cart' && cartCount > 0 && (
                <span className="ml-auto bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          ))}
          <form action={logout}>
            <button className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm text-red-500 hover:bg-red-50">
              <LogOut size={16} />Sign Out
            </button>
          </form>
        </div>
      )}
    </header>
  );
}