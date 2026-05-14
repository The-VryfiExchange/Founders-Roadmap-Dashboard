import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';
import Dashboard from '@/components/Dashboard';

export default async function HomePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return <Dashboard userEmail={user.email || ''} />;
}
