import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth/session';
import { PlatformShell, StatusBadge, Panel, DataTable } from '@/components/platform/platform-shell';
import { reportSymptoms } from '@/app/patient/actions';
import { SubmitButton } from '@/components/ui/submit-button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { EvaScale, EvaScoreBadge } from '@/components/clinical/eva-scale';
import { BodyAreasField } from '@/components/clinical/body-areas-field';
import { formatDateTime } from '@/utils/format';

export default async function PatientSymptomsPage() {
  const user = await requireRole('PATIENT');

  const reports = await prisma.symptomReport.findMany({
    where: { patientId: user.id },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <PlatformShell
      user={user}
      title="Registrar síntomas"
      description="Documenta cómo te sientes, incluyendo la intensidad del dolor con escala EVA"
    >
      <div className="grid items-start gap-5 xl:grid-cols-[0.95fr_1.35fr]">
        <Panel title="Nuevo reporte">
          <form action={reportSymptoms} className="grid gap-5 px-6 py-5">
            <Textarea
              id="description"
              name="description"
              label="Descripción"
              required
              rows={4}
              placeholder="Describe tus síntomas: inicio, características, factores que alivian o agravan..."
            />

            <EvaScale name="painScore" defaultValue={0} />

            <BodyAreasField name="bodyAreas" />

            <div className="grid gap-4 sm:grid-cols-2">
              <Select id="urgencyLevel" name="urgencyLevel" label="Nivel de urgencia">
                <option value="LOW">Baja</option>
                <option value="MEDIUM">Media</option>
                <option value="HIGH">Alta</option>
                <option value="EMERGENCY">Emergencia</option>
              </Select>
              <Input name="duration" label="Duración" placeholder="p. ej. 2 días" />
            </div>

            <label className="flex items-start gap-2 text-sm text-ink">
              <input
                type="checkbox"
                name="isEmergency"
                value="true"
                className="mt-0.5 h-4 w-4 rounded border-line text-brand focus:ring-brand/30"
              />
              <span>
                Marcar como emergencia
                <span className="mt-0.5 block text-inkMuted">
                  Usa esta opción ante dolor intenso (EVA ≥ 8), dificultad respiratoria u otros
                  signos de alarma.
                </span>
              </span>
            </label>

            <div>
              <SubmitButton>Enviar reporte</SubmitButton>
            </div>
          </form>
        </Panel>

        <Panel title="Reportes anteriores">
          <DataTable
            headers={['Fecha', 'Descripción', 'EVA', 'Urgencia']}
            empty="No has registrado síntomas aún."
            rows={reports.map((report) => ({
              key: report.id,
              cells: [
                formatDateTime(report.createdAt),
                report.description,
                <EvaScoreBadge key="eva" score={report.painScore} />,
                <StatusBadge
                  key="status"
                  status={report.isEmergency ? 'EMERGENCY' : report.urgencyLevel}
                />,
              ],
            }))}
          />
        </Panel>
      </div>
    </PlatformShell>
  );
}
