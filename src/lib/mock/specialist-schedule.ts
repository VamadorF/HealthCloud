import {
  SCHEDULE_SLOT_MINUTES,
  ScheduleEvent,
  atTimeOnDay,
  withDuration,
} from '@/lib/clinical/schedule-events';
import { SPECIALIST_AGENDA, SPECIALIST_WEEK_EXTRAS } from '@/lib/mock/demo-data';

/** Eventos de la semana demo anclados al día de referencia (hoy del cliente). */
export function buildDemoSpecialistScheduleEvents(reference = new Date()): ScheduleEvent[] {
  const today = new Date(reference);
  today.setHours(0, 0, 0, 0);

  const todayEvents: ScheduleEvent[] = SPECIALIST_AGENDA.map((item, index) => {
    const start = atTimeOnDay(today, item.time);
    const end = withDuration(start, SCHEDULE_SLOT_MINUTES);
    return {
      id: `today-${index}-${item.time}`,
      start: start.toISOString(),
      end: end.toISOString(),
      title: item.patient,
      meta: `${item.reason} · ${item.room}`,
      status: item.status,
      accent: item.status === 'En sala',
    };
  });

  const weekEvents: ScheduleEvent[] = SPECIALIST_WEEK_EXTRAS.map((item, index) => {
    const day = new Date(today);
    day.setDate(day.getDate() + item.dayOffset);
    const start = atTimeOnDay(day, item.time);
    const end = withDuration(start, SCHEDULE_SLOT_MINUTES);
    return {
      id: `week-${index}-${item.dayOffset}-${item.time}`,
      start: start.toISOString(),
      end: end.toISOString(),
      title: item.patient,
      meta: `${item.reason} · ${item.room}`,
      status: item.status,
    };
  });

  return [...todayEvents, ...weekEvents].sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
  );
}
