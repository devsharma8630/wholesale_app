import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  subtitle?: string;
  trend?: string;
}

export function StatsCard({ title, value, icon: Icon, color = 'blue', subtitle, trend }: StatsCardProps) {
  const colors = {
    blue:   { card: 'bg-blue-600',   light: 'bg-blue-50',   icon: 'bg-blue-100 text-blue-600',   text: 'text-blue-600' },
    green:  { card: 'bg-emerald-600', light: 'bg-emerald-50', icon: 'bg-emerald-100 text-emerald-600', text: 'text-emerald-600' },
    yellow: { card: 'bg-amber-500',  light: 'bg-amber-50',  icon: 'bg-amber-100 text-amber-600', text: 'text-amber-600' },
    red:    { card: 'bg-red-600',    light: 'bg-red-50',    icon: 'bg-red-100 text-red-600',     text: 'text-red-600' },
    purple: { card: 'bg-purple-600', light: 'bg-purple-50', icon: 'bg-purple-100 text-purple-600', text: 'text-purple-600' },
  };

  const c = colors[color];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
          {trend && (
            <span className="inline-flex items-center mt-2 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              {trend}
            </span>
          )}
        </div>
        <div className={cn('p-3 rounded-2xl', c.icon)}>
          <Icon size={24} />
        </div>
      </div>
      <div className={cn('mt-4 h-1 rounded-full opacity-20', c.card)} />
    </div>
  );
}