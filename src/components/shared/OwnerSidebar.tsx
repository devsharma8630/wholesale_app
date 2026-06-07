'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, LogOut, Store, X } from 'lucide-react';
import { logout } from '@/actions/auth';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/owner/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/owner/products', label: 'Products', icon: Package },
  { href: '/owner/orders', label: 'Orders', icon: ShoppingCart },
];

interface OwnerSidebarProps {
  onClose?: () => void;
}

export function OwnerSidebar({ onClose }: OwnerSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white flex flex-col shadow-2xl">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-slate-700/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg">
            <Store size={16} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-white text-sm">WholeSale Pro</p>
            <p className="text-xs text-slate-400">Owner Panel</p>
          </div>
        </div>
        {/* Close button - mobile only */}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:bg-slate-700 transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-5 space-y-1">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-3">
          Main Menu
        </p>
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={onClose}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
              pathname === href
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            )}
          >
            <Icon size={18} />
            {label}
            {pathname === href && (
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/70" />
            )}
          </Link>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-4 py-4 border-t border-slate-700/50">
        <form action={logout}>
          <button
            type="submit"
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  );
}