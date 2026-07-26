import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth/session';
import { PlatformShell, StatusBadge, EmptyState } from '@/components/platform/platform-shell';
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
      <form
        action={reportSymptoms}
        className="mb-8 grid max-w-2xl gap-4 rounded-2xl border border-line bg-surface p-6"
      >
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

      <div className="space-y-4">
        <h2 className="text-lg font-medium text-ink">Reportes anteriores</h2>
        {reports.map((report) => (
          <div
            key={report.id}
            className="rounded-2xl border border-line bg-surface p-5"
          >
            <div className="flex items-center gap-2">
              <StatusBadge status={report.isEmergency ? 'EMERGENCY' : report.urgencyLevel} />
              <span className="text-xs text-inkMuted">{formatDateTime(report.createdAt)}</span>
            </div>
            <p className="mt-2 text-sm text-ink">{report.description}</p>
          </div>
        ))}
        {reports.length === 0 && (
          <EmptyState>No has registrado síntomas aún.</EmptyState>
        )}
      </div>
    </PlatformShell>
  );
}
