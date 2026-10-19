import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';

export default async function AccountPage() {
  const session = await getSession();
  if (!session.userId) {
    redirect('/auth?next=/account');
  }

  // If user is predominantly an owner, direct to owner desk; otherwise to tenant activity
  if (session.roles?.includes('OWNER')) {
    redirect('/owner');
  }

  redirect('/account/activity');
}
