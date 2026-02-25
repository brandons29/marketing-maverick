'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Zap,
  FileText,
  Megaphone,
  BarChart3,
  Plug,
  Key,
  Settings,
  LogOut,
} from 'lucide-react';

interface DashboardNavProps {
  userEmail: string;
}

const mainLinks = [
  { href: '/dashboard', label: 'AI Copywriter', icon: Zap },
  { href: '/dashboard/outputs', label: 'My Outputs', icon: FileText },
  { href: '/dashboard/campaigns', label: 'Ad Campaigns', icon: Megaphone },
  { href: '/dashboard/performance', label: 'Performance', icon: BarChart3 },
];

const connectLinks = [
  { href: '/dashboard/integrations', label: 'Integrations', icon: Plug },
  { href: '/dashboard/api-key', label: 'API Key', icon: Key },
];

const accountLinks = [
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function DashboardNav({ userEmail }: DashboardNavProps) {
  const pathname = usePathname();

  const linkClass = (href: string) => {
    const active = pathname === href;
    return `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
      active
        ? 'bg-[#ff8400]/10 text-[#ff8400] font-medium'
        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
    }`;
  };

  return (
    <nav className="w-56 h-screen bg-zinc-950 border-r border-zinc-800 flex flex-col justify-between p-4">
      {/* Logo */}
      <div>
        <div className="flex items-center gap-2 px-3 mb-8">
          <Zap className="w-6 h-6 text-[#ff8400]" />
          <span className="text-lg font-bold text-white tracking-tight">Maverick</span>
        </div>

        {/* Main */}
        <div className="space-y-1 mb-6">
          <p className="text-[10px] uppercase tracking-widest text-zinc-600 px-3 mb-2">Main</p>
          {mainLinks.map((link) => (
            <Link key={link.href} href={link.href} className={linkClass(link.href)}>
              <link.icon className="w-4 h-4" />
              {link.label}
            </Link>
          ))}
        </div>

        {/* Connect */}
        <div className="space-y-1 mb-6">
          <p className="text-[10px] uppercase tracking-widest text-zinc-600 px-3 mb-2">Connect</p>
          {connectLinks.map((link) => (
            <Link key={link.href} href={link.href} className={linkClass(link.href)}>
              <link.icon className="w-4 h-4" />
              {link.label}
            </Link>
          ))}
        </div>

        {/* Account */}
        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-widest text-zinc-600 px-3 mb-2">Account</p>
          {accountLinks.map((link) => (
            <Link key={link.href} href={link.href} className={linkClass(link.href)}>
              <link.icon className="w-4 h-4" />
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* User footer */}
      <div className="border-t border-zinc-800 pt-4">
        <p className="text-xs text-zinc-500 truncate px-3 mb-2">{userEmail}</p>
        <Link
          href="/auth/login"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-red-400 hover:bg-zinc-800/60 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </Link>
      </div>
    </nav>
  );
}
