'use client';

import { useState } from 'react';
import { DemoShell, Panel } from '@/components/demo/demo-shell';
import { PssScale } from '@/components/clinical/pss-scale';
import { markSurveyCompleted } from '@/components/clinical/survey-controls';
import { computePssScore } from '@/lib/clinical/pss';

export default function DemoPatientPssPage() {
  const [done, setDone] = useState(false);

  return (
    <DemoShell
      role="patient"
      title="PSS-14"
      subtitle="Escala de Estrés Percibido · último mes"
    >
      {done ? (
        <Panel title="Encuesta enviada">
          <p className="text-sm text-inkMuted">
            Gracias. Tu especialista verá el resultado. La próxima ventana será en unos 2
            meses, salvo activación anticipada.
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
            const answers = JSON.parse(String(form.get('pssAnswers') ?? '[]')) as number[];
            const score = computePssScore(answers);
            if (!score.complete) return;
            markSurveyCompleted('PSS-14', {
              total: score.total,
              band: score.band,
              bandLabel: score.bandLabel,
            });
            setDone(true);
          }}
        >
          <PssScale name="pss" required />
          <button
            type="submit"
            className="rounded-lg bg-brand px-5 py-2.5 text-sm font-display text-white transition-colors duration-200 ease-out-soft hover:bg-brand-dark active:scale-[0.98]"
          >
            Enviar PSS-14
          </button>
        </form>
      )}
    </DemoShell>
  );
}
