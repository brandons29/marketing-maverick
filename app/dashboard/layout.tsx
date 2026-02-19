// app/dashboard/layout.tsx — Auth guard for dashboard routes
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase-server';

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

  return <>{children}</>;
}
