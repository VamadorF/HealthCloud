'use client';

import { useState } from 'react';
import { DemoShell, Panel } from '@/components/demo/demo-shell';
import { PsqiScale } from '@/components/clinical/psqi-scale';
import { markSurveyCompleted } from '@/components/clinical/survey-controls';
import { computePsqiScore, type PsqiAnswers } from '@/lib/clinical/psqi';

export default function DemoPatientPsqiPage() {
  const [done, setDone] = useState(false);

  return (
    <DemoShell
      role="patient"
      title="PSQI"
      subtitle="Índice de Calidad del Sueño de Pittsburgh · último mes"
    >
      {done ? (
        <Panel title="Encuesta enviada">
          <p className="text-sm text-inkMuted">
            Gracias. Registramos tu calidad de sueño. La próxima evaluación corresponde en
            unos 2 meses, salvo que tu especialista la active antes.
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
            const answers = JSON.parse(
              String(form.get('psqiAnswers') ?? '{}')
            ) as PsqiAnswers;
            const score = computePsqiScore(answers);
            if (!score.complete) return;
            markSurveyCompleted('PSQI', {
              global: score.global,
              band: score.band,
              bandLabel: score.bandLabel,
              components: score.components,
              efficiencyPercent: score.efficiencyPercent,
            });
            setDone(true);
          }}
        >
          <PsqiScale name="psqi" required />
          <button
            type="submit"
            className="rounded-lg bg-brand px-5 py-2.5 text-sm font-display text-white transition-colors duration-200 ease-out-soft hover:bg-brand-dark active:scale-[0.98]"
          >
            Enviar PSQI
          </button>
        </form>
      )}
    </DemoShell>
  );
}
