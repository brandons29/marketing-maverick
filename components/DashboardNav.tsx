'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  Brain,
  BarChart3,
  Layers,
  Activity,
  Settings,
  Menu,
  X,
  Zap,
  TrendingUp,
  LogOut,
} from 'lucide-react';
import { Badge } from '@/components/ui/base/badges/badges';

const navItems = [
  { href: '/dashboard', label: 'Strategy Engine', icon: Brain, description: 'AI Copy & Skills' },
  { href: '/dashboard/ai', label: 'AI Playground', icon: Zap, description: 'Multi-Model Chat' },
  { href: '/dashboard/growth', label: 'Growth Hub', icon: TrendingUp, description: 'Growth Playbooks' },
  { href: '/dashboard/attribution', label: 'Attribution', icon: BarChart3, description: 'Revenue Mapping' },
  { href: '/dashboard/operations', label: 'Operations', icon: Layers, description: 'SaaS Integrations' },
  { href: '/dashboard/monitor', label: 'Monitor', icon: Activity, description: 'System Health' },
];

interface DashboardNavProps {
  userEmail: string;
}

export default function DashboardNav({ userEmail }: DashboardNavProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* ── Mobile Top Bar ── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-4" style={{ background: 'var(--swayze-bg-card)', borderBottom: '1px solid var(--swayze-border)' }}>
        <Link href="/" className="flex items-center gap-2">
          <Image src="/swayze-logo-white.png" alt="Swayze Media" width={90} height={30} className="h-7 w-auto object-contain" />
          <span className="text-white/15 font-light">|</span>
          <span className="text-white font-black text-xs tracking-wider uppercase">Maverick</span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-10 h-10 flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* ── Mobile Overlay ── */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ background: 'var(--swayze-bg-card)', borderRight: '1px solid var(--swayze-border)' }}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-5 gap-2" style={{ borderBottom: '1px solid var(--swayze-border)' }}>
          <Link href="/" className="flex items-center gap-2">
            <Image src="/swayze-logo-white.png" alt="Swayze Media" width={90} height={30} className="h-7 w-auto object-contain" />
            <span className="text-white/15 font-light">|</span>
            <span className="text-white font-black text-xs tracking-wider uppercase">Maverick</span>
          </Link>
        </div>

        {/* Free badge */}
        <div className="px-5 py-3">
          <Badge type="pill-color" color="success" size="sm">
            Free Tool — No Limits
          </Badge>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                  isActive
                    ? 'bg-[#ff8400]/10 text-[#ff8400]'
                    : 'text-white/50 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <item.icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? 'text-[#ff8400]' : 'text-white/30 group-hover:text-white/60'}`} />
                <div className="flex-1 min-w-0">
                  <div className="truncate">{item.label}</div>
                  <div className="text-[10px] text-white/25 truncate">{item.description}</div>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Settings + User */}
        <div className="px-3 py-4 space-y-2" style={{ borderTop: '1px solid var(--swayze-border)' }}>
          <Link
            href="/settings"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              pathname === '/settings'
                ? 'bg-[#ff8400]/10 text-[#ff8400]'
                : 'text-white/50 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Settings className="w-[18px] h-[18px] shrink-0" />
            <span>Settings & API Keys</span>
          </Link>

          {/* User email */}
          <div className="px-3 py-2">
            <p className="text-xs text-white/25 truncate font-mono">{userEmail}</p>
          </div>

          {/* Sign out */}
          <form action="/api/auth/signout" method="post">
            <button
              type="submit"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/30 hover:text-red-400 hover:bg-white/[0.03] transition-colors w-full"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
