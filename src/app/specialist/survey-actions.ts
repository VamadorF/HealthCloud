'use server';

import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth/session';
import {
  SurveyConfig,
  SurveyInstrumentId,
  mergeSurveyConfig,
} from '@/lib/clinical/survey-schedule';

export async function updatePatientSurveyInstrument(formData: FormData) {
  const user = await requireRole('SPECIALIST');
  const patientId = String(formData.get('patientId') ?? '');
  const instrument = String(formData.get('instrument') ?? '') as SurveyInstrumentId;
  const action = String(formData.get('action') ?? '');

  if (!patientId || !['PSS-14', 'PSQI'].includes(instrument)) return;

  const linked = await prisma.appointment.findFirst({
    where: { specialistId: user.id, patientId },
    select: { id: true },
  });
  if (!linked) return;

  const profile = await prisma.patientProfile.findUnique({ where: { userId: patientId } });
  const current = mergeSurveyConfig(
    (profile?.surveyConfig as SurveyConfig | null | undefined) ?? null
  );
  const item = { ...current[instrument]! };

  if (action === 'toggle') {
    item.enabled = !item.enabled;
    if (!item.enabled) {
      item.forceActive = false;
      item.forceActivatedAt = null;
    }
  } else if (action === 'force') {
    if (!item.enabled) return;
    item.forceActive = true;
    item.forceActivatedAt = new Date().toISOString();
  } else if (action === 'clear-force') {
    item.forceActive = false;
    item.forceActivatedAt = null;
  } else {
    return;
  }

  const next = { ...current, [instrument]: item } as unknown as Prisma.InputJsonValue;

  await prisma.patientProfile.upsert({
    where: { userId: patientId },
    create: { userId: patientId, surveyConfig: next },
    update: { surveyConfig: next },
  });

  revalidatePath('/specialist/patients');
  revalidatePath('/patient/surveys');
}
