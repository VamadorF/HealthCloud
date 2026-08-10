'use client';

import { useState } from 'react';
import { DemoShell, Panel } from '@/components/demo/demo-shell';
import { PcsScale } from '@/components/clinical/pcs-scale';
import { markSurveyCompleted } from '@/components/clinical/survey-controls';
import { computePcsScore } from '@/lib/clinical/pcs';

export default function DemoPatientPcsPage() {
  const [done, setDone] = useState(false);

  return (
    <DemoShell
      role="patient"
      title="PCS"
      subtitle="Escala de Catastrofización del Dolor · cuando siente dolor"
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
            const answers = JSON.parse(String(form.get('pcsAnswers') ?? '[]')) as number[];
            const score = computePcsScore(answers);
            if (!score.complete) return;
            markSurveyCompleted('PCS', {
              total: score.total,
              band: score.band,
              bandLabel: score.bandLabel,
              subscales: score.subscales,
            });
            setDone(true);
          }}
        >
          <PcsScale name="pcs" required />
          <button
            type="submit"
            className="rounded-lg bg-brand px-5 py-2.5 text-sm font-display text-white transition-colors duration-200 ease-out-soft hover:bg-brand-dark active:scale-[0.98]"
          >
            Enviar PCS
          </button>
        </form>
      )}
    </DemoShell>
  );
}
