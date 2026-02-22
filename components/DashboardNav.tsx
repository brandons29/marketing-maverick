'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Activity, 
  Target, 
  ShieldCheck, 
  Menu, 
  X, 
  LayoutDashboard,
  Settings,
  Zap,
  LogOut,
  ChevronRight
} from 'lucide-react';

export function DashboardNav({ userEmail }: { userEmail: string | undefined }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { name: 'Analytics', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Attribution', href: '/dashboard/attribution', icon: Target },
    { name: 'Operations', href: '/dashboard/operations', icon: Zap },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const activeLink = links.find(l => l.href === pathname) || links[0];

  return (
    <>
      {/* --- Desktop Sidebar --- */}
      <aside className="hidden lg:flex flex-col w-64 fixed h-screen bg-maverick-black border-r border-white/5 z-50">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-maverick-neon rounded flex items-center justify-center">
            <Activity className="w-5 h-5 text-black" />
          </div>
          <div>
            <span className="block text-sm font-black tracking-tighter text-white uppercase italic">Maverick</span>
            <span className="block text-[8px] font-mono tracking-[0.3em] text-maverick-gold uppercase">Swayze Media Elite</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                  isActive 
                    ? 'bg-white/5 text-maverick-neon' 
                    : 'text-maverick-muted hover:text-white hover:bg-white/[0.02]'
                }`}
              >
                <link.icon className={`w-4 h-4 ${isActive ? 'text-maverick-neon' : 'text-maverick-muted'}`} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto border-t border-white/5 bg-white/[0.01]">
          <div className="flex items-center gap-3 px-2 py-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-maverick-dark-3 flex items-center justify-center text-[10px] font-bold text-maverick-gold">
              {userEmail?.[0].toUpperCase() || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-[10px] font-bold text-white truncate">{userEmail}</p>
              <p className="text-[8px] font-mono text-maverick-neon uppercase tracking-widest">Maverick Pro</p>
            </div>
          </div>
          <button className="w-full flex items-center gap-2 px-4 py-2 text-[10px] font-black text-maverick-muted hover:text-white transition-colors uppercase tracking-widest">
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* --- Mobile Bottom Nav & Header --- */}
      <div className="lg:hidden">
        <header className="fixed top-0 left-0 right-0 h-16 bg-maverick-black/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 z-40">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-maverick-neon" />
            <span className="text-xs font-black tracking-widest text-white uppercase italic">Maverick</span>
          </div>
          <button onClick={() => setIsOpen(!isOpen)} className="text-white">
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </header>

        {/* Mobile Sidebar Overlay */}
        {isOpen && (
          <div className="fixed inset-0 bg-maverick-black z-30 pt-20 px-6 animate-in fade-in slide-in-from-top-4 duration-300">
             <nav className="space-y-4">
              {links.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between p-4 bg-maverick-dark-1 border border-white/5 rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    <link.icon className="w-5 h-5 text-maverick-neon" />
                    <span className="text-sm font-black uppercase tracking-widest text-white">{link.name}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-maverick-muted" />
                </Link>
              ))}
            </nav>
          </div>
        )}

        {/* Floating Mobile Bottom Action Bar */}
        <nav className="fixed bottom-6 left-6 right-6 h-16 bg-maverick-dark-1/90 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-around px-2 z-40 shadow-2xl">
          {links.slice(0, 3).map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.name} 
                href={link.href} 
                className={`flex flex-col items-center gap-1 p-2 transition-all ${isActive ? 'text-maverick-neon' : 'text-maverick-muted'}`}
              >
                <link.icon className="w-5 h-5" />
                <span className="text-[8px] font-black uppercase tracking-widest">{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
