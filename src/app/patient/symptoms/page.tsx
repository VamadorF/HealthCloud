import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth/session';
import { PlatformShell, StatusBadge, Panel, DataTable } from '@/components/platform/platform-shell';
import { reportSymptoms } from '@/app/patient/actions';
import { SubmitButton } from '@/components/ui/submit-button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
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
      description="Reporta síntomas visuales, de urgencia o emergencias"
    >
      <div className="grid items-start gap-5 xl:grid-cols-[0.9fr_1.4fr]">
      <Panel title="Nuevo reporte">
      <form action={reportSymptoms} className="grid gap-4 px-6 py-5">
        <Textarea
          id="description"
          name="description"
          label="Descripción"
          required
          rows={4}
          placeholder="Describe tus síntomas..."
        />
        <Select id="urgencyLevel" name="urgencyLevel" label="Nivel de urgencia">
          <option value="LOW">Baja</option>
          <option value="MEDIUM">Media</option>
          <option value="HIGH">Alta</option>
          <option value="EMERGENCY">Emergencia</option>
        </Select>
        <Input name="duration" label="Duración" placeholder="2 días" />
        <Input
          name="bodyAreas"
          label="Zonas afectadas (JSON)"
          defaultValue='["cabeza","torax"]'
        />
        <Input
          name="visualSymptoms"
          label="Síntomas visuales (JSON)"
          defaultValue='{"erupcion":false,"inflamacion":true}'
        />
        <label className="flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            name="isEmergency"
            value="true"
            className="h-4 w-4 rounded border-line text-brand focus:ring-brand/30"
          />
          Marcar como emergencia
        </label>
        <div>
          <SubmitButton>Enviar reporte</SubmitButton>
        </div>
      </form>
      </Panel>

      <Panel title="Reportes anteriores">
        <DataTable
          headers={['Fecha', 'Descripción', 'Urgencia']}
          empty="No has registrado síntomas aún."
          rows={reports.map((report) => ({
            key: report.id,
            cells: [
              formatDateTime(report.createdAt),
              report.description,
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
