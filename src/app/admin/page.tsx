import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth/session';
import { PlatformShell, StatCard, Panel, Row } from '@/components/platform/platform-shell';
import { formatDate } from '@/utils/format';

export default async function AdminDashboardPage() {
  const user = await requireRole('ADMIN');

  const [organizations, users, appointments, reports] = await Promise.all([
    prisma.organization.count(),
    prisma.user.count(),
    prisma.appointment.count(),
    prisma.usageMetric.findMany({ orderBy: { date: 'desc' }, take: 5 }),
  ]);

  return (
    <PlatformShell
      user={user}
      title="Resumen global"
      description="Control global de la infraestructura, organizaciones y reportes de uso"
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Organizaciones" value={organizations} />
        <StatCard label="Usuarios totales" value={users} />
        <StatCard label="Citas registradas" value={appointments} />
        <StatCard label="Reportes generados" value={reports.length} />
      </div>

      <div className="mt-5 grid items-start gap-5 xl:grid-cols-[1.4fr_0.9fr]">
        <Panel title="Áreas de gestión">
          {[
            { href: '/admin/organizations', title: 'Organizaciones', desc: 'Invitar, supervisar o bloquear centros médicos' },
            { href: '/admin/reports', title: 'Reportes de uso', desc: 'Métricas generales de actividad de la plataforma' },
            { href: '/admin/invitations', title: 'Invitaciones', desc: 'Seguimiento de invitaciones institucionales' },
          ].map((item) => (
            <Link key={item.href} href={item.href} className="group block">
              <Row className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-ink group-hover:text-brand-mid">{item.title}</p>
                  <p className="mt-0.5 text-sm text-inkMuted">{item.desc}</p>
                </div>
                <span
                  aria-hidden="true"
                  className="text-inkMuted/50 transition duration-200 ease-out-soft group-hover:translate-x-0.5 group-hover:text-brand-mid"
                >
                  →
                </span>
              </Row>
            </Link>
          ))}
        </Panel>

        <Panel title="Últimos reportes">
          {reports.length > 0 ? (
            reports.map((metric) => (
              <Row key={metric.id} className="flex items-center justify-between text-sm">
                <span className="font-bold text-ink">{formatDate(metric.date)}</span>
                <span className="text-inkMuted">
                  {metric.activeUsers} activos · {metric.consultations} consultas
                </span>
              </Row>
            ))
          ) : (
            <p className="px-6 py-8 text-center text-sm text-inkMuted">
              Aún no se han generado reportes de uso.
            </p>
          )}
        </Panel>
      </div>
    </PlatformShell>
  );
}
