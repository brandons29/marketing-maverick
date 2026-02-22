import { redirect } from 'next/navigation';

// /dashboard/ai was the old route — redirect to the unified dashboard
export default function AiPage() {
  redirect('/dashboard');
}
