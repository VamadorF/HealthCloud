import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth/session';
import { PlatformShell, StatCard } from '@/components/platform/platform-shell';

export default async function PatientDashboardPage() {
  const user = await requireRole('PATIENT');

  const [appointments, symptomReports, consultations] = await Promise.all([
    prisma.appointment.count({ where: { patientId: user.id } }),
    prisma.symptomReport.count({ where: { patientId: user.id } }),
    prisma.consultation.count({
      where: { appointment: { patientId: user.id } },
    }),
  ]);

  return (
    <PlatformShell
      user={user}
      title="Panel del Paciente"
      description="Solicita atención, registra síntomas y consulta tu historial médico"
    >
      {/* Acciones primero: es lo que el paciente viene a hacer */}
      <h2 className="font-display text-lg text-ink">¿Qué necesitas hacer hoy?</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {[
          { href: '/patient/appointments', title: 'Solicitar hora', desc: 'Agenda una cita de atención médica' },
          { href: '/patient/symptoms', title: 'Registrar síntomas', desc: 'Reporta síntomas visuales o de urgencia' },
          { href: '/patient/history', title: 'Historial médico', desc: 'Consulta tus atenciones previas' },
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

      {/* Resumen de actividad, secundario */}
      <h2 className="mt-10 font-display text-lg text-ink">Tu actividad</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <StatCard label="Citas solicitadas" value={appointments} />
        <StatCard label="Reportes de síntomas" value={symptomReports} />
        <StatCard label="Consultas completadas" value={consultations} />
      </div>
    </PlatformShell>
  );
}
