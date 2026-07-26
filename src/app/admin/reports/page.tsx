import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth/session';
import { PlatformShell, StatCard } from '@/components/platform/platform-shell';
import { recordDailyMetrics } from '@/app/admin/actions';
import { SubmitButton } from '@/components/ui/submit-button';
import { formatDate } from '@/utils/format';

export default async function AdminReportsPage() {
  const user = await requireRole('ADMIN');

  const metrics = await prisma.usageMetric.findMany({
    orderBy: { date: 'desc' },
    take: 10,
  });

  const latest = metrics[0];

  return (
    <PlatformShell
      user={user}
      title="Reportes de uso"
      description="Métricas generales de actividad en la plataforma"
    >
      <form action={recordDailyMetrics} className="mb-6">
        <SubmitButton>Generar reporte del día</SubmitButton>
      </form>

      {latest && (
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard label="Usuarios activos" value={latest.activeUsers} hint={formatDate(latest.date)} />
          <StatCard label="Consultas" value={latest.consultations} />
          <StatCard label="Reportes de síntomas" value={latest.symptomReports} />
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-line bg-[#f7f9f7]">
            <tr className="text-sm font-bold text-inkMuted">
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Usuarios</th>
              <th className="px-4 py-3">Activos</th>
              <th className="px-4 py-3">Citas</th>
              <th className="px-4 py-3">Consultas</th>
              <th className="px-4 py-3">Organizaciones</th>
            </tr>
          </thead>
          <tbody className="text-inkBody">
            {metrics.map((m) => (
              <tr key={m.id} className="border-b border-line/60 last:border-b-0 hover:bg-[#fafbfa]">
                <td className="px-4 py-3">{formatDate(m.date)}</td>
                <td className="px-4 py-3">{m.totalUsers}</td>
                <td className="px-4 py-3">{m.activeUsers}</td>
                <td className="px-4 py-3">{m.appointments}</td>
                <td className="px-4 py-3">{m.consultations}</td>
                <td className="px-4 py-3">{m.organizations}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {metrics.length === 0 && (
          <p className="p-6 text-center text-inkMuted">Genera el primer reporte para ver métricas.</p>
        )}
      </div>
    </PlatformShell>
  );
}
