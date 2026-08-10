import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth/session';
import { PlatformShell, Panel } from '@/components/platform/platform-shell';
import {
  SURVEY_INSTRUMENT_IDS,
  SURVEY_INSTRUMENTS,
  SurveyConfig,
  getSurveyAvailability,
  mergeSurveyConfig,
} from '@/lib/clinical/survey-schedule';

export default async function PatientSurveysPage() {
  const user = await requireRole('PATIENT');
  const profile = await prisma.patientProfile.findUnique({ where: { userId: user.id } });
  const config = mergeSurveyConfig((profile?.surveyConfig as SurveyConfig | null) ?? null);

  const rows = SURVEY_INSTRUMENT_IDS.map((id) => ({
    id,
    meta: SURVEY_INSTRUMENTS[id],
    assignment: config[id]!,
    availability: getSurveyAvailability(config[id]),
    href: `/patient/surveys/${SURVEY_INSTRUMENTS[id].slug}`,
  }));

  const available = rows.filter((r) => r.availability.status === 'available');
  const waiting = rows.filter((r) => r.availability.status === 'waiting');

  return (
    <PlatformShell
      user={user}
      title="Encuestas clínicas"
      description="Solo ves las escalas que tu especialista te ha asignado y abierto"
    >
      <div className="space-y-8">
        <section className="space-y-3">
          <h2 className="signage-label text-inkMuted">Para completar ahora</h2>
          {available.length === 0 ? (
            <Panel title="Sin pendientes">
              <p className="px-5 py-6 text-sm text-inkMuted">
                No tienes encuestas abiertas por ahora.
              </p>
            </Panel>
          ) : (
            <div className="grid gap-4">
              {available.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="block rounded-xl border border-line bg-surface p-5 shadow-card transition duration-200 ease-out-soft hover:border-brand/30"
                >
                  <div className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-1 h-[3px] w-5 shrink-0 rounded-full bg-role-patient"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-lg text-ink">{item.meta.shortLabel}</p>
                      <p className="mt-0.5 text-sm font-medium text-ink">{item.meta.label}</p>
                      <p className="mt-1 text-sm text-inkMuted">{item.meta.description}</p>
                      <p className="mt-2 text-xs text-brand-mid">{item.availability.reason}</p>
                    </div>
                    <span aria-hidden="true" className="text-inkMuted">
                      →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {waiting.length > 0 && (
          <Panel title="Asignadas · en espera">
            <ul className="divide-y divide-line">
              {waiting.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-3 px-5 py-3.5"
                >
                  <div>
                    <p className="text-sm font-bold text-ink">{item.meta.shortLabel}</p>
                    <p className="text-xs text-inkMuted">{item.availability.reason}</p>
                  </div>
                  <span className="rounded-md bg-warn-soft px-2 py-1 text-xs font-bold text-warn">
                    En espera
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
