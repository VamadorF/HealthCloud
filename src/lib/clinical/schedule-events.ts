/**
 * Eventos normalizados para la vista de horario del especialista.
 */

export type ScheduleEvent = {
  id: string;
  /** ISO start */
  start: string;
  /** ISO end */
  end: string;
  title: string;
  meta: string;
  /** Etiqueta legible de estado (demo o auth). */
  status: string;
  accent?: boolean;
};

export const SCHEDULE_DAY_START_HOUR = 8;
export const SCHEDULE_DAY_END_HOUR = 18;
export const SCHEDULE_SLOT_MINUTES = 45;

export function parseTimeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

export function startOfWeekMonday(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay(); // 0 Sun … 6 Sat
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function minutesSinceDayStart(date: Date, dayStartHour = SCHEDULE_DAY_START_HOUR): number {
  return date.getHours() * 60 + date.getMinutes() - dayStartHour * 60;
}

export function eventDurationMinutes(event: ScheduleEvent): number {
  const start = new Date(event.start).getTime();
  const end = new Date(event.end).getTime();
  return Math.max(15, Math.round((end - start) / 60000));
}

/** Construye un Date en el día base con hora HH:mm. */
export function atTimeOnDay(day: Date, time: string): Date {
  const [h, m] = time.split(':').map(Number);
  const d = new Date(day);
  d.setHours(h ?? 0, m ?? 0, 0, 0);
  return d;
}

export function withDuration(start: Date, minutes: number): Date {
  return new Date(start.getTime() + minutes * 60_000);
}

export function formatDayLabel(date: Date): string {
  return new Intl.DateTimeFormat('es-ES', { weekday: 'short', day: 'numeric' }).format(date);
}

export function formatWeekRange(weekStart: Date): string {
  const end = addDays(weekStart, 6);
  const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
  const a = new Intl.DateTimeFormat('es-ES', opts).format(weekStart);
  const b = new Intl.DateTimeFormat('es-ES', { ...opts, year: 'numeric' }).format(end);
  return `${a} – ${b}`;
}

export function statusTone(status: string): {
  block: string;
  text: string;
} {
  const normalized = status.toLowerCase();
  if (
    normalized.includes('sala') ||
    normalized.includes('progress') ||
    normalized === 'in_progress'
  ) {
    return {
      block: 'border-brand/50 bg-brand text-white',
      text: 'text-white',
    };
  }
  if (
    normalized.includes('solicit') ||
    normalized.includes('pend') ||
    normalized === 'requested'
  ) {
    return {
      block: 'border-warn/40 bg-warn-soft text-warn',
      text: 'text-warn',
    };
  }
  if (normalized.includes('cancel')) {
    return {
      block: 'border-line bg-sunken text-inkMuted',
      text: 'text-inkMuted',
    };
  }
  return {
    block: 'border-brand/30 bg-brand-light text-brand-mid',
    text: 'text-brand-mid',
  };
}

const AUTH_STATUS_LABEL: Record<string, string> = {
  REQUESTED: 'Solicitada',
  CONFIRMED: 'Confirmada',
  IN_PROGRESS: 'En sala',
  COMPLETED: 'Completada',
  CANCELLED: 'Cancelada',
};

export function toScheduleEventFromAppointment(input: {
  id: string;
  scheduledAt: Date | string;
  reason?: string | null;
  status: string;
  patientName: string;
  durationMinutes?: number;
}): ScheduleEvent {
  const start = new Date(input.scheduledAt);
  const end = withDuration(start, input.durationMinutes ?? SCHEDULE_SLOT_MINUTES);
  const status = AUTH_STATUS_LABEL[input.status] ?? input.status;
  return {
    id: input.id,
    start: start.toISOString(),
    end: end.toISOString(),
    title: input.patientName,
    meta: input.reason?.trim() || 'Sin motivo registrado',
    status,
    accent: input.status === 'IN_PROGRESS',
  };
}
