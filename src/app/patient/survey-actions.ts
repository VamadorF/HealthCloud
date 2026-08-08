'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth/session';
import { buildPssPayload } from '@/lib/clinical/pss';
import { computePsqiScore, type PsqiAnswers } from '@/lib/clinical/psqi';
import { computePcsScore } from '@/lib/clinical/pcs';
import {
  SurveyConfig,
  appendSurveyRecord,
  formatScoreSummary,
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
    const score = {
      total: payload.total,
      band: payload.band,
      bandLabel: payload.bandLabel,
    };
    await saveConfig(user.id, {
      ...config,
      'PSS-14': appendSurveyRecord(
        config['PSS-14']!,
        score,
        formatScoreSummary('PSS-14', score)
      ),
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
    const result = computePsqiScore(answers);
    if (!result.complete) return;
    const score = {
      global: result.global,
      band: result.band,
      bandLabel: result.bandLabel,
      components: result.components,
      efficiencyPercent: result.efficiencyPercent,
    };
    await saveConfig(user.id, {
      ...config,
      PSQI: appendSurveyRecord(config.PSQI!, score, formatScoreSummary('PSQI', score)),
    });
  } catch {
    return;
  }

  revalidatePath('/patient/surveys');
  revalidatePath('/specialist/patients');
  redirect('/patient/surveys');
}

export async function submitPatientPcs(formData: FormData) {
  const user = await requireRole('PATIENT');
  const config = await loadWritableConfig(user.id);
  const availability = getSurveyAvailability(config.PCS);
  if (availability.status !== 'available') return;

  try {
    const answers = JSON.parse(String(formData.get('pcsAnswers') ?? '[]')) as number[];
    const result = computePcsScore(answers);
    if (!result.complete) return;
    const score = {
      total: result.total,
      band: result.band,
      bandLabel: result.bandLabel,
      subscales: result.subscales,
    };
    await saveConfig(user.id, {
      ...config,
      PCS: appendSurveyRecord(config.PCS!, score, formatScoreSummary('PCS', score)),
    });
  } catch {
    return;
  }

  revalidatePath('/patient/surveys');
  revalidatePath('/specialist/patients');
  redirect('/patient/surveys');
}
