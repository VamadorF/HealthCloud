'use client';

import {
  SURVEY_INSTRUMENTS,
  SurveyConfig,
  SurveyInstrumentId,
  getSurveyAvailability,
} from '@/lib/clinical/survey-schedule';
import { updatePatientSurveyInstrument } from '@/app/specialist/survey-actions';
import { SubmitButton } from '@/components/ui/submit-button';

export function AuthSpecialistSurveyControls({
  patientId,
  patientName,
  initialConfig,
}: {
  patientId: string;
  patientName: string;
  initialConfig: SurveyConfig;
}) {
  const instruments = Object.keys(SURVEY_INSTRUMENTS) as SurveyInstrumentId[];

  return (
    <div className="space-y-4">
      <div>
        <p className="signage-label text-inkMuted">Encuestas clínicas</p>
        <p className="mt-1 text-sm text-inkMuted">
          {patientName} · Cada 2 meses por defecto. Desactiva o fuerza la ventana actual.
        </p>
      </div>

      <ul className="divide-y divide-line rounded-xl border border-line bg-canvas/40">
        {instruments.map((id) => {
          const meta = SURVEY_INSTRUMENTS[id];
          const assignment = initialConfig[id]!;
          const availability = getSurveyAvailability(assignment);

          return (
            <li key={id} className="px-4 py-4 sm:px-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-ink">{meta.shortLabel}</p>
                  <p className="mt-0.5 text-sm text-inkMuted">{meta.description}</p>
                  <p className="mt-2 text-xs text-inkMuted">{availability.reason}</p>
                </div>
                <StatusChip availability={availability} enabled={assignment.enabled} />
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <form action={updatePatientSurveyInstrument}>
                  <input type="hidden" name="patientId" value={patientId} />
                  <input type="hidden" name="instrument" value={id} />
                  <input type="hidden" name="action" value="toggle" />
                  <SubmitButton size="sm" variant="secondary">
                    {assignment.enabled ? 'Desactivar' : 'Activar encuesta'}
                  </SubmitButton>
                </form>
                <form action={updatePatientSurveyInstrument}>
                  <input type="hidden" name="patientId" value={patientId} />
                  <input type="hidden" name="instrument" value={id} />
                  <input type="hidden" name="action" value="force" />
                  <SubmitButton size="sm" disabled={!assignment.enabled}>
                    Activar ahora
                  </SubmitButton>
                </form>
                {assignment.forceActive && (
                  <form action={updatePatientSurveyInstrument}>
                    <input type="hidden" name="patientId" value={patientId} />
                    <input type="hidden" name="instrument" value={id} />
                    <input type="hidden" name="action" value="clear-force" />
                    <SubmitButton size="sm" variant="ghost">
                      Quitar forzado
                    </SubmitButton>
                  </form>
                )}
              </div>
            </li>
          );
        })}
      </ul>
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
        Desactivada
      </span>
    );
  }
  if (availability.status === 'available') {
    return (
      <span className="rounded-md bg-ok-soft px-2 py-1 text-xs font-bold text-ok">
        {availability.dueToForce ? 'Forzada' : 'Disponible'}
      </span>
    );
  }
  return (
    <span className="rounded-md bg-warn-soft px-2 py-1 text-xs font-bold text-warn">
      En espera · {availability.daysRemaining}d
    </span>
  );
}
