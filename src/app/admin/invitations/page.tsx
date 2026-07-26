import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth/session';
import { PlatformShell, Panel, DataTable, RoleBadge, StatusBadge } from '@/components/platform/platform-shell';
import { formatDate } from '@/utils/format';

export default async function AdminInvitationsPage() {
  const user = await requireRole('ADMIN');

  const invitations = await prisma.invitation.findMany({
    include: { invitedBy: true, organization: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <PlatformShell
      user={user}
      title="Invitaciones"
      description="Seguimiento de invitaciones enviadas a organizaciones y especialistas"
    >
      <Panel title="Invitaciones enviadas">
        <DataTable
          headers={['Destinatario', 'Rol', 'Organización', 'Enviada', 'Expira', 'Estado']}
          empty="No hay invitaciones registradas."
          rows={invitations.map((inv) => ({
            key: inv.id,
            cells: [
              inv.email,
              <RoleBadge key="role" role={inv.role} />,
              inv.organizationName ?? '—',
              formatDate(inv.createdAt),
              formatDate(inv.expiresAt),
              <StatusBadge key="status" status={inv.status} />,
            ],
          }))}
        />
      </Panel>
    </PlatformShell>
  );
}
