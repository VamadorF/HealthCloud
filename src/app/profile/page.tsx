import { getSignedUrl } from '@/lib/supabase/storage';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth/session';
import { PlatformShell } from '@/components/platform/platform-shell';
import { ProfileForm } from '@/components/profile/profile-form';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const user = await requireAuth();
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, avatar_url')
    .eq('id', user.supabaseId)
    .single();

  let avatarUrl: string | null = null;
  if (profile?.avatar_url) {
    try {
      avatarUrl = await getSignedUrl('avatars', profile.avatar_url);
    } catch {
      avatarUrl = null;
    }
  }

  return (
    <PlatformShell
      user={user}
      title="Mi cuenta"
      description="Administra tu información personal y tu avatar"
    >
      <div className="max-w-2xl rounded-xl border border-line bg-surface p-6 shadow-card">
        <ProfileForm
          userId={user.supabaseId}
          email={user.email}
          fullName={profile?.full_name ?? user.fullName ?? ''}
          avatarUrl={avatarUrl}
        />
      </div>
    </PlatformShell>
  );
}
