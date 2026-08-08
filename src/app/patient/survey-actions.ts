'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth/session';
import { buildPssPayload } from '@/lib/clinical/pss';
import { computePsqiScore, type PsqiAnswers } from '@/lib/clinical/psqi';
import {
  SurveyConfig,
  getSurveyAvailability,
  mergeSurveyConfig,
} from '@/lib/clinical/survey-schedule';

async function loadWritableConfig(patientId: string) {
  const profile = await prisma.patientProfile.findUnique({ where: { userId: patientId } });
  return mergeSurveyConfig((profile?.surveyConfig as SurveyConfig | null) ?? null);
}

async function saveConfig(patientId: string, config: SurveyConfig) {
  const json = config as unknown as Prisma.InputJsonValue;
  await prisma.patientProfile.upsert({
    where: { userId: patientId },
    create: { userId: patientId, surveyConfig: json },
    update: { surveyConfig: json },
  });
}

export async function submitPatientPss(formData: FormData) {
  const user = await requireRole('PATIENT');
  const config = await loadWritableConfig(user.id);
  const availability = getSurveyAvailability(config['PSS-14']);
  if (availability.status !== 'available') return;

  try {
    const answers = JSON.parse(String(formData.get('pssAnswers') ?? '[]')) as number[];
    const payload = buildPssPayload(answers);
    if (!payload) return;

    await saveConfig(user.id, {
      ...config,
      'PSS-14': {
        ...config['PSS-14']!,
        lastCompletedAt: payload.recordedAt,
        lastScore: {
          total: payload.total,
          band: payload.band,
          bandLabel: payload.bandLabel,
        },
        forceActive: false,
        forceActivatedAt: null,
      },
    });
  } catch {
    return;
  }

  revalidatePath('/patient/surveys');
  revalidatePath('/specialist/patients');
  redirect('/patient/surveys');
}

export async function submitPatientPsqi(formData: FormData) {
  const user = await requireRole('PATIENT');
  const config = await loadWritableConfig(user.id);
  const availability = getSurveyAvailability(config.PSQI);
  if (availability.status !== 'available') return;

  try {
    const answers = JSON.parse(String(formData.get('psqiAnswers') ?? '{}')) as PsqiAnswers;
    const score = computePsqiScore(answers);
    if (!score.complete) return;

    await saveConfig(user.id, {
      ...config,
      PSQI: {
        ...config.PSQI!,
        lastCompletedAt: new Date().toISOString(),
        lastScore: {
          global: score.global,
          band: score.band,
          bandLabel: score.bandLabel,
          components: score.components,
          efficiencyPercent: score.efficiencyPercent,
        },
        forceActive: false,
        forceActivatedAt: null,
      },
    });
  } catch {
    return;
  }

  revalidatePath('/patient/surveys');
  revalidatePath('/specialist/patients');
  redirect('/patient/surveys');
}
