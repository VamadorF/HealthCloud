'use server';

import { revalidatePath } from 'next/cache';
import { UrgencyLevel } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth/session';

export async function requestAppointment(formData: FormData) {
  const user = await requireRole('PATIENT');
  const scheduledAt = String(formData.get('scheduledAt') ?? '');
  const reason = String(formData.get('reason') ?? '').trim();
  const organizationId = String(formData.get('organizationId') ?? '').trim() || null;

  if (!scheduledAt || !reason) {
    return;
  }

  await prisma.appointment.create({
    data: {
      patientId: user.id,
      organizationId,
      scheduledAt: new Date(scheduledAt),
      reason,
      status: 'REQUESTED',
      symptoms: { reportedAt: new Date().toISOString(), reason },
    },
  });

  revalidatePath('/patient');
  revalidatePath('/patient/appointments');
  revalidatePath('/patient/history');
  return;
}

export async function reportSymptoms(formData: FormData) {
  const user = await requireRole('PATIENT');
  const description = String(formData.get('description') ?? '').trim();
  const urgencyLevel = String(formData.get('urgencyLevel') ?? 'MEDIUM') as UrgencyLevel;
  const bodyAreas = String(formData.get('bodyAreas') ?? '[]');
  const duration = String(formData.get('duration') ?? '').trim();
  const isEmergency = formData.get('isEmergency') === 'true';
  const rawPain = formData.get('painScore');
  const painScore =
    rawPain == null || rawPain === ''
      ? null
      : Math.min(10, Math.max(0, Number.parseInt(String(rawPain), 10)));

  if (!description) return;
  if (painScore != null && Number.isNaN(painScore)) return;

  let bodyAreasData: string[];
  try {
    const parsed = JSON.parse(bodyAreas);
    bodyAreasData = Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return;
  }

  await prisma.symptomReport.create({
    data: {
      patientId: user.id,
      description,
      urgencyLevel,
      painScore,
      bodyAreas: bodyAreasData,
      duration: duration || null,
      isEmergency: isEmergency || (painScore != null && painScore >= 8),
    },
  });

  revalidatePath('/patient/symptoms');
  revalidatePath('/patient');
  return;
}
