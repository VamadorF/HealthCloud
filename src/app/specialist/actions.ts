'use server';

import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth/session';
import { buildPssPayload } from '@/lib/clinical/pss';

export async function updateSchedule(formData: FormData) {
  const user = await requireRole('SPECIALIST');
  const scheduleRaw = String(formData.get('schedule') ?? '{}');

  let scheduleConfig: object;
  try {
    scheduleConfig = JSON.parse(scheduleRaw);
  } catch {
    return;
  }

  await prisma.specialistProfile.upsert({
    where: { userId: user.id },
    create: { userId: user.id, scheduleConfig },
    update: { scheduleConfig },
  });

  revalidatePath('/specialist');
  return;
}

export async function confirmAppointment(formData: FormData) {
  const user = await requireRole('SPECIALIST');
  const appointmentId = String(formData.get('appointmentId') ?? '');
  if (!appointmentId) return;

  await prisma.appointment.updateMany({
    where: { id: appointmentId, specialistId: user.id },
    data: { status: 'CONFIRMED' },
  });

  revalidatePath('/specialist');
  revalidatePath('/specialist/consultations');
  return;
}

function parsePssFromForm(formData: FormData) {
  const complete = formData.get('pssComplete') === 'true';
  if (!complete) return null;

  try {
    const answers = JSON.parse(String(formData.get('pssAnswers') ?? '[]')) as unknown;
    if (!Array.isArray(answers) || answers.length !== 14) return null;
    if (answers.some((a) => a == null || Number.isNaN(Number(a)))) return null;
    return buildPssPayload(answers.map(Number));
  } catch {
    return null;
  }
}

export async function recordConsultation(formData: FormData) {
  const user = await requireRole('SPECIALIST');
  const appointmentId = String(formData.get('appointmentId') ?? '');
  const diagnosis = String(formData.get('diagnosis') ?? '').trim();
  const clinicalNotes = String(formData.get('clinicalNotes') ?? '').trim();
  const treatment = String(formData.get('treatment') ?? '{}');
  const vitals = String(formData.get('vitals') ?? '{}');

  if (!appointmentId || !diagnosis) {
    return;
  }

  const appointment = await prisma.appointment.findFirst({
    where: { id: appointmentId, specialistId: user.id },
  });

  if (!appointment) return;

  let treatmentData: object;
  let vitalsData: object;
  try {
    treatmentData = JSON.parse(treatment);
    vitalsData = JSON.parse(vitals);
  } catch {
    return;
  }

  const pss = parsePssFromForm(formData);
  const clinicalData = {
    notes: clinicalNotes,
    ...(pss ? { pss } : {}),
  } as unknown as Prisma.InputJsonValue;

  await prisma.$transaction([
    prisma.consultation.upsert({
      where: { appointmentId },
      create: {
        appointmentId,
        specialistId: user.id,
        diagnosis,
        clinicalData,
        treatment: treatmentData,
        vitals: vitalsData,
      },
      update: {
        diagnosis,
        clinicalData,
        treatment: treatmentData,
        vitals: vitalsData,
      },
    }),
    prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: 'COMPLETED' },
    }),
  ]);

  revalidatePath('/specialist/consultations');
  revalidatePath('/patient/history');
  return;
}
