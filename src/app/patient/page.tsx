import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth/session';
import { PlatformShell, StatCard, StatusBadge } from '@/components/platform/platform-shell';
import { WidgetGate } from '@/components/platform/widget-preferences';
import { formatDateTime } from '@/utils/format';

export default async function PatientDashboardPage() {
  const user = await requireRole('PATIENT');

  const [appointments, symptomReports, consultations, nextAppointment] = await Promise.all([
    prisma.appointment.count({ where: { patientId: user.id } }),
    prisma.symptomReport.count({ where: { patientId: user.id } }),
    prisma.consultation.count({
      where: { appointment: { patientId: user.id } },
    }),
    prisma.appointment.findFirst({
      where: {
        patientId: user.id,
        scheduledAt: { gte: new Date() },
        status: { in: ['REQUESTED', 'CONFIRMED', 'IN_PROGRESS'] },
      },
      include: { specialist: true },
      orderBy: { scheduledAt: 'asc' },
    }),
  ]);

  return (
    <PlatformShell
      user={user}
      title="Panel del Paciente"
      description="Solicita atención, registra síntomas y consulta tu historial médico"
    >
      {nextAppointment && (
        <section className="rounded-xl border border-line bg-surface px-5 py-5 shadow-card sm:px-6">
          <p className="signage-label text-inkMuted">Próxima cita</p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-display text-2xl text-ink">
                {formatDateTime(nextAppointment.scheduledAt)}
              </p>
              <p className="mt-1 text-sm text-inkMuted">
                {nextAppointment.specialist?.fullName ?? 'Especialista por asignar'}
                {nextAppointment.reason ? ` · ${nextAppointment.reason}` : ''}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={nextAppointment.status} />
              <Link
                href="/patient/appointments"
                className="text-sm font-bold text-brand-mid hover:underline"
              >
                Ver agenda
              </Link>
            </div>
          </div>
        </section>
      )}

      <WidgetGate id="patient.quickActions">
        <h2 className={`${nextAppointment ? 'mt-10' : ''} font-display text-lg text-ink`}>
          ¿Qué necesitas hacer hoy?
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {[
            {
              href: '/patient/appointments',
              title: 'Solicitar hora',
              desc: 'Agenda una cita de atención médica',
            },
            {
              href: '/patient/symptoms',
              title: 'Registrar síntomas',
              desc: 'Reporta dolor (EVA), urgencia y zonas afectadas',
            },
            {
              href: '/patient/history',
              title: 'Historial médico',
              desc: 'Consulta tus atenciones previas',
            },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex flex-col justify-between gap-4 rounded-xl border border-line bg-surface p-5 shadow-card transition duration-200 ease-out-quart hover:-translate-y-0.5 hover:border-brand/30"
            >
              <div>
                <h3 className="font-medium text-ink group-hover:text-brand">{item.title}</h3>
                <p className="mt-1 text-sm text-inkMuted">{item.desc}</p>
              </div>
              <span
                aria-hidden="true"
                className="text-inkMuted/50 transition duration-200 ease-out-quart group-hover:translate-x-0.5 group-hover:text-brand"
              >
                →
              </span>
            </Link>
          ))}
        </div>
      </WidgetGate>

      <WidgetGate id="patient.activity">
        <h2 className="mt-10 font-display text-lg text-ink">Tu actividad</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <StatCard label="Citas solicitadas" value={appointments} />
          <StatCard label="Reportes de síntomas" value={symptomReports} />
          <StatCard label="Consultas completadas" value={consultations} />
        </div>
      </WidgetGate>
    </PlatformShell>
  );
}
