import {
  SCHEDULE_SLOT_MINUTES,
  ScheduleEvent,
  addDays,
  atTimeOnDay,
  startOfWeekMonday,
  withDuration,
} from '@/lib/clinical/schedule-events';
import { SPECIALIST_AGENDA, SPECIALIST_WEEK_EXTRAS } from '@/lib/mock/demo-data';

/**
 * Eventos de la semana demo.
 * Las citas de hoy van al día de referencia; el resto se reparte en la semana laboral.
 */
export function buildDemoSpecialistScheduleEvents(reference = new Date()): ScheduleEvent[] {
  const today = new Date(reference);
  today.setHours(0, 0, 0, 0);
  const weekStart = startOfWeekMonday(today);

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
    const day = addDays(weekStart, item.weekday);
    const target = day.getTime() === today.getTime() ? addDays(day, 1) : day;
    const start = atTimeOnDay(target, item.time);
    const end = withDuration(start, SCHEDULE_SLOT_MINUTES);
    return {
      id: `week-${index}-${item.weekday}-${item.time}`,
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
