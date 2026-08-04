import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth/session';
import { PlatformShell } from '@/components/platform/platform-shell';
import { updateOrganizationProfile } from '@/app/organization/actions';
import { SubmitButton } from '@/components/ui/submit-button';
import { Input } from '@/components/ui/input';

export default async function OrganizationProfilePage() {
  const user = await requireRole('ORGANIZATION');

  const organization = await prisma.organization.findUnique({
    where: { ownerId: user.id },
  });

  return (
    <PlatformShell
      user={user}
      title="Perfil corporativo"
      description="Información institucional visible para tu red de especialistas"
    >
      <form
        action={updateOrganizationProfile}
        className="max-w-2xl space-y-4 rounded-xl border border-line bg-surface p-6 shadow-card"
      >
        <Input name="name" label="Nombre" required defaultValue={organization?.name ?? ''} />
        <Input name="description" label="Descripción" defaultValue={organization?.description ?? ''} />
        <Input name="address" label="Dirección" defaultValue={organization?.address ?? ''} />
        <Input name="phone" label="Teléfono" defaultValue={organization?.phone ?? ''} />
        <SubmitButton>Guardar perfil</SubmitButton>
      </form>
    </PlatformShell>
  );
}
