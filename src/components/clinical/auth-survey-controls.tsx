'use client';

import {
  SURVEY_INSTRUMENT_IDS,
  SURVEY_INSTRUMENTS,
  SurveyConfig,
  SurveyInstrumentId,
  getSurveyAvailability,
} from '@/lib/clinical/survey-schedule';
import { updatePatientSurveyInstrument } from '@/app/specialist/survey-actions';
import { SubmitButton } from '@/components/ui/submit-button';
import { InstrumentRecords } from '@/components/clinical/survey-records';

export function AuthSpecialistSurveyControls({
  patientId,
  patientName,
  initialConfig,
}: {
  patientId: string;
  patientName: string;
  initialConfig: SurveyConfig;
}) {
  return (
    <div className="space-y-4">
      <div>
        <p className="signage-label text-inkMuted">Encuestas del paciente</p>
        <p className="mt-1 text-sm text-inkMuted">
          {patientName} · Asigna qué escalas debe completar y cuándo abrirlas. Los
          registros quedan en esta ficha.
        </p>
      </div>

      <div className="grid gap-4">
        {SURVEY_INSTRUMENT_IDS.map((id) => {
          const meta = SURVEY_INSTRUMENTS[id];
          const assignment = initialConfig[id]!;
          const availability = getSurveyAvailability(assignment);

          return (
            <section
              key={id}
              className="rounded-xl border border-line bg-canvas/40 p-4 sm:p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="h-[3px] w-5 rounded-full bg-role-spec"
                    />
                    <p className="font-display text-base text-ink">{meta.shortLabel}</p>
                  </div>
                  <p className="mt-1 text-sm text-inkMuted">{meta.label}</p>
                  <p className="mt-2 text-xs text-inkMuted">{availability.reason}</p>
                </div>
                <StatusChip availability={availability} enabled={assignment.enabled} />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {!assignment.enabled ? (
                  <form action={updatePatientSurveyInstrument}>
                    <input type="hidden" name="patientId" value={patientId} />
                    <input type="hidden" name="instrument" value={id} />
                    <input type="hidden" name="action" value="assign-open" />
                    <SubmitButton size="sm">Asignar y abrir</SubmitButton>
                  </form>
                ) : (
                  <>
                    <form action={updatePatientSurveyInstrument}>
                      <input type="hidden" name="patientId" value={patientId} />
                      <input type="hidden" name="instrument" value={id} />
                      <input type="hidden" name="action" value="unassign" />
                      <SubmitButton size="sm" variant="secondary">
                        Quitar asignación
                      </SubmitButton>
                    </form>
                    {availability.status === 'waiting' && (
                      <form action={updatePatientSurveyInstrument}>
                        <input type="hidden" name="patientId" value={patientId} />
                        <input type="hidden" name="instrument" value={id} />
                        <input type="hidden" name="action" value="force" />
                        <SubmitButton size="sm">Reabrir ahora</SubmitButton>
                      </form>
                    )}
                    {assignment.forceActive && (
                      <form action={updatePatientSurveyInstrument}>
                        <input type="hidden" name="patientId" value={patientId} />
                        <input type="hidden" name="instrument" value={id} />
                        <input type="hidden" name="action" value="clear-force" />
                        <SubmitButton size="sm" variant="ghost">
                          Cerrar ventana
                        </SubmitButton>
                      </form>
                    )}
                  </>
                )}
              </div>

              <div className="mt-4">
                <InstrumentRecords instrument={id as SurveyInstrumentId} assignment={assignment} />
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function StatusChip({
  availability,
  enabled,
}: {
  availability: ReturnType<typeof getSurveyAvailability>;
  enabled: boolean;
}) {
  if (!enabled || availability.status === 'disabled') {
    return (
      <span className="rounded-md bg-sunken px-2 py-1 text-xs font-bold text-inkMuted">
        No asignada
      </span>
    );
  }
  if (availability.status === 'available') {
    return (
      <span className="rounded-md bg-ok-soft px-2 py-1 text-xs font-bold text-ok">
        {availability.dueToForce ? 'Abierta ahora' : 'Pendiente'}
      </span>
    );
  }
  return (
    <span className="rounded-md bg-warn-soft px-2 py-1 text-xs font-bold text-warn">
      En espera · {availability.daysRemaining}d
    </span>
  );
}
