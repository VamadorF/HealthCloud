import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth/session';
import { PlatformShell, Panel } from '@/components/platform/platform-shell';
import {
  SURVEY_INSTRUMENTS,
  SurveyConfig,
  SurveyInstrumentId,
  getSurveyAvailability,
  mergeSurveyConfig,
} from '@/lib/clinical/survey-schedule';

export default async function PatientSurveysPage() {
  const user = await requireRole('PATIENT');
  const profile = await prisma.patientProfile.findUnique({ where: { userId: user.id } });
  const config = mergeSurveyConfig((profile?.surveyConfig as SurveyConfig | null) ?? null);
  const instruments = Object.keys(SURVEY_INSTRUMENTS) as SurveyInstrumentId[];

  const rows = instruments.map((id) => ({
    id,
    meta: SURVEY_INSTRUMENTS[id],
    assignment: config[id]!,
    availability: getSurveyAvailability(config[id]),
    href: id === 'PSS-14' ? '/patient/surveys/pss' : '/patient/surveys/psqi',
  }));

  const available = rows.filter((r) => r.availability.status === 'available');
  const other = rows.filter((r) => r.availability.status !== 'available');

  return (
    <PlatformShell
      user={user}
      title="Encuestas clínicas"
      description="PSS-14 y PSQI · cada 2 meses, o cuando tu especialista las active"
    >
      <div className="space-y-6">
        {available.length > 0 ? (
          <section className="space-y-3">
            <h2 className="signage-label text-inkMuted">Pendientes ahora</h2>
            {available.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="block rounded-xl border border-line bg-surface p-5 shadow-card transition duration-200 ease-out-soft hover:border-brand/30"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-lg text-ink">{item.meta.label}</p>
                    <p className="mt-1 text-sm text-inkMuted">{item.meta.description}</p>
                    <p className="mt-2 text-xs text-brand-mid">{item.availability.reason}</p>
                  </div>
                  <span aria-hidden="true" className="text-inkMuted">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </section>
        ) : (
          <Panel title="Sin pendientes">
            <p className="px-5 py-6 text-sm text-inkMuted">
              No tienes encuestas disponibles. Se abren cada 2 meses o cuando tu especialista
              las active.
            </p>
          </Panel>
        )}

        {other.length > 0 && (
          <Panel title="Programación">
            <ul className="divide-y divide-line">
              {other.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-3 px-5 py-3.5"
                >
                  <div>
                    <p className="text-sm font-bold text-ink">{item.meta.shortLabel}</p>
                    <p className="text-xs text-inkMuted">{item.availability.reason}</p>
                  </div>
                  <span className="rounded-md bg-sunken px-2 py-1 text-xs font-bold text-inkMuted">
                    {item.availability.status === 'disabled' ? 'Desactivada' : 'En espera'}
                  </span>
                </li>
              ))}
            </ul>
          </Panel>
        )}
      </div>
    </PlatformShell>
  );
}
