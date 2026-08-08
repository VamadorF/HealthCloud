import { DemoShell, Panel } from '@/components/demo/demo-shell';
import { PssScale, PssScoreSummary } from '@/components/clinical/pss-scale';

const CONSULTATIONS = [
  {
    patient: 'Roberto Díaz',
    date: 'Hoy, 09:45',
    diagnosis: 'Diabetes tipo 2 — control trimestral',
    notes: 'HbA1c 6.8%. Mantener metformina 850mg. Reforzar plan alimentario.',
    vitals: 'PA 128/82 · FC 72',
    pss: { total: 24, band: 'moderate' as const, bandLabel: 'Estrés percibido moderado' },
  },
  {
    patient: 'María José Vera',
    date: 'Ayer, 16:30',
    diagnosis: 'Dislipidemia leve',
    notes: 'Perfil lipídico dentro de metas. Control en 4 meses.',
    vitals: 'PA 118/76 · FC 68',
  },
];

export default function DemoSpecialistConsultationsPage() {
  return (
    <DemoShell
      role="specialist"
      title="Consultas clínicas"
      subtitle="Registro de atenciones con escalas clínicas estructuradas"
    >
      <div className="space-y-6">
        {CONSULTATIONS.map((c) => (
          <Panel key={c.patient} title={`${c.patient} · ${c.date}`}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="signage-label text-inkMuted">Diagnóstico</p>
                <p className="mt-1 text-ink">{c.diagnosis}</p>
              </div>
              <div>
                <p className="signage-label text-inkMuted">Signos vitales</p>
                <p className="mt-1 text-ink">{c.vitals}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="signage-label text-inkMuted">Notas clínicas</p>
                <p className="mt-1 text-sm leading-relaxed text-inkMuted">{c.notes}</p>
              </div>
              {c.pss && (
                <div className="sm:col-span-2">
                  <PssScoreSummary
                    total={c.pss.total}
                    band={c.pss.band}
                    bandLabel={c.pss.bandLabel}
                  />
                </div>
              )}
            </div>
          </Panel>
        ))}

        <Panel title="Nueva evaluación · PSS-14">
          <div className="space-y-4">
            <p className="text-sm leading-6 text-inkMuted">
              Complete la Escala de Estrés Percibido durante o tras la consulta. La puntuación
              se calcula en vivo invirtiendo los ítems de afrontamiento.
            </p>
            <PssScale
              name="demoPss"
              defaultAnswers={[2, 3, 3, 1, 2, 1, 2, 3, 1, 1, 2, 3, 2, 2]}
            />
          </div>
        </Panel>
      </div>
    </DemoShell>
  );
}
