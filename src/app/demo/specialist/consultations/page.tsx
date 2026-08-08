import { DemoShell, Panel } from '@/components/demo/demo-shell';
import { PssScoreSummary } from '@/components/clinical/pss-scale';
import { PsqiScoreSummary } from '@/components/clinical/psqi-scale';
import { PcsScoreSummary } from '@/components/clinical/pcs-scale';

const CONSULTATIONS = [
  {
    patient: 'Roberto Díaz',
    date: 'Hoy, 09:45',
    diagnosis: 'Diabetes tipo 2 — control trimestral',
    notes: 'HbA1c 6.8%. Mantener metformina 850mg. Reforzar plan alimentario.',
    vitals: 'PA 128/82 · FC 72',
    pss: { total: 24, band: 'moderate' as const, bandLabel: 'Estrés percibido moderado' },
    psqi: { global: 8, band: 'poor' as const, bandLabel: 'Mala calidad de sueño' },
    pcs: { total: 34, band: 'clinical' as const, bandLabel: 'Nivel clínicamente significativo' },
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
      subtitle="Resultados de encuestas en la atención · activa o desactiva desde Pacientes"
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
              {(c.pss || c.psqi || c.pcs) && (
                <div className="grid gap-3 sm:col-span-2 sm:grid-cols-3">
                  {c.pss && (
                    <PssScoreSummary
                      total={c.pss.total}
                      band={c.pss.band}
                      bandLabel={c.pss.bandLabel}
                    />
                  )}
                  {c.psqi && (
                    <PsqiScoreSummary
                      global={c.psqi.global}
                      band={c.psqi.band}
                      bandLabel={c.psqi.bandLabel}
                    />
                  )}
                  {c.pcs && (
                    <PcsScoreSummary
                      total={c.pcs.total}
                      band={c.pcs.band}
                      bandLabel={c.pcs.bandLabel}
                    />
                  )}
                </div>
              )}
            </div>
          </Panel>
        ))}

        <Panel title="Programación de encuestas">
          <p className="text-sm leading-6 text-inkMuted">
            Las escalas PSS-14, PSQI y PCS se responden en la cuenta del paciente. Desde{' '}
            <a href="/demo/specialist/patients" className="font-bold text-brand-mid hover:underline">
              Pacientes
            </a>{' '}
            puedes activarlas, desactivarlas o forzar una ventana fuera de la cadencia de 2
            meses.
          </p>
        </Panel>
      </div>
    </DemoShell>
  );
}
