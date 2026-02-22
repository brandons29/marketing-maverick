// app/dashboard/layout.tsx — Auth guard for dashboard routes
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { DashboardNav } from '@/components/DashboardNav';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Not authenticated → kick to signup
  if (!user) {
    redirect('/auth/signup');
  }

  return (
    <div className="min-h-screen bg-maverick-black">
      <DashboardNav userEmail={user.email} />
      <main className="lg:pl-64 pt-16 lg:pt-0">
        <div className="animate-in fade-in duration-700">
          {children}
        </div>
      </main>
    </div>
  );
}
