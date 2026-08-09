'use client';

import { useState } from 'react';
import { DemoShell, Panel } from '@/components/demo/demo-shell';
import { PainAssessmentForm } from '@/components/clinical/pain-assessment-form';
import { markSurveyCompleted } from '@/components/clinical/survey-controls';
import {
  isPainAssessmentComplete,
  painAssessmentScorePayload,
  type PainAssessmentAnswers,
} from '@/lib/clinical/pain-assessment';

export default function DemoPatientPainPage() {
  const [done, setDone] = useState(false);

  return (
    <DemoShell
      role="patient"
      title="Dolor"
      subtitle="Evaluación del dolor · aparición, localización, EVA/ENA, irradiación y alivio"
    >
      {done ? (
        <Panel title="Evaluación enviada">
          <p className="text-sm text-inkMuted">
            Gracias. Tu especialista verá este mapa del dolor en tu ficha. La próxima
            ventana será en unos 2 meses, salvo activación anticipada.
          </p>
          <a
            href="/demo/patient/surveys"
            className="mt-4 inline-flex text-sm font-bold text-brand-mid hover:underline"
          >
            Volver a encuestas
          </a>
        </Panel>
      ) : (
        <form
          className="space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            const form = new FormData(event.currentTarget);
            if (form.get('painComplete') !== 'true') return;
            try {
              const answers = JSON.parse(
                String(form.get('painAnswers') ?? '{}')
              ) as PainAssessmentAnswers;
              if (!isPainAssessmentComplete(answers)) return;
              const score = painAssessmentScorePayload(answers);
              markSurveyCompleted('DOLOR', score);
              setDone(true);
            } catch {
              // ignore
            }
          }}
        >
          <PainAssessmentForm name="pain" required />
          <button
            type="submit"
            className="rounded-lg bg-brand px-5 py-2.5 text-sm font-display text-white transition-colors duration-200 ease-out-soft hover:bg-brand-dark active:scale-[0.98]"
          >
            Enviar evaluación del dolor
          </button>
        </form>
      )}
    </DemoShell>
  );
}
