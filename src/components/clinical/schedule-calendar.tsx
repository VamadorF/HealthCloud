'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  SCHEDULE_DAY_END_HOUR,
  SCHEDULE_DAY_START_HOUR,
  ScheduleEvent,
  addDays,
  formatDayLabel,
  formatWeekRange,
  isSameDay,
  minutesSinceDayStart,
  startOfWeekMonday,
  statusTone,
} from '@/lib/clinical/schedule-events';

const HOURS = Array.from(
  { length: SCHEDULE_DAY_END_HOUR - SCHEDULE_DAY_START_HOUR },
  (_, i) => SCHEDULE_DAY_START_HOUR + i
);

/** Altura de una hora en la grilla (px). */
const HOUR_HEIGHT = 64;
const DAY_TOTAL_MINUTES = (SCHEDULE_DAY_END_HOUR - SCHEDULE_DAY_START_HOUR) * 60;

function formatHourLabel(hour: number): string {
  return `${String(hour).padStart(2, '0')}:00`;
}

function useIsNarrow(breakpoint = 900) {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const apply = () => setNarrow(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [breakpoint]);
  return narrow;
}

function NowLine({ day }: { day: Date }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  if (!isSameDay(day, now)) return null;
  const minutes = minutesSinceDayStart(now);
  if (minutes < 0 || minutes > DAY_TOTAL_MINUTES) return null;
  const top = (minutes / 60) * HOUR_HEIGHT;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 z-20"
      style={{ top }}
    >
      <div className="relative">
        <span className="absolute -left-1 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-accent" />
        <div className="h-px w-full bg-accent" />
      </div>
    </div>
  );
}

function EventBlock({ event }: { event: ScheduleEvent }) {
  const start = new Date(event.start);
  const end = new Date(event.end);
  const startMin = minutesSinceDayStart(start);
  const endMin = minutesSinceDayStart(end);
  const clampedStart = Math.max(0, startMin);
  const clampedEnd = Math.min(DAY_TOTAL_MINUTES, Math.max(clampedStart + 15, endMin));
  const top = (clampedStart / 60) * HOUR_HEIGHT;
  const height = ((clampedEnd - clampedStart) / 60) * HOUR_HEIGHT;
  const tone = statusTone(event.status);
  const timeLabel = new Intl.DateTimeFormat('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(start);

  return (
    <article
      title={`${event.title} · ${event.meta}`}
      className={`absolute inset-x-1 overflow-hidden rounded-md border px-1.5 py-1 shadow-card ${tone.block} ${
        event.accent ? 'ring-2 ring-brand/40 ring-offset-1 ring-offset-surface' : ''
      }`}
      style={{ top, height: Math.max(height, 28) }}
    >
      <p className="truncate text-[11px] font-bold leading-tight">{event.title}</p>
      {height >= 40 ? (
        <p className="mt-0.5 truncate text-[10px] leading-tight opacity-90">
          {timeLabel} · {event.meta}
        </p>
      ) : null}
    </article>
  );
}

function DayColumn({
  day,
  events,
  showHeader = true,
  today,
}: {
  day: Date;
  events: ScheduleEvent[];
  showHeader?: boolean;
  today: Date;
}) {
  const isToday = isSameDay(day, today);
  const dayEvents = events.filter((event) => isSameDay(new Date(event.start), day));

  return (
    <div className="relative min-w-0 flex-1">
      {showHeader ? (
        <div
          className={`sticky top-0 z-10 border-b border-line px-1 py-2 text-center ${
            isToday ? 'bg-brand-light/50' : 'bg-surface'
          }`}
        >
          <p
            className={`text-[11px] font-bold uppercase tracking-[0.08em] ${
              isToday ? 'text-brand-mid' : 'text-inkMuted'
            }`}
          >
            {formatDayLabel(day)}
          </p>
        </div>
      ) : null}
      <div
        className="relative border-l border-line"
        style={{ height: HOURS.length * HOUR_HEIGHT }}
      >
        {HOURS.map((hour) => (
          <div
            key={hour}
            className="absolute inset-x-0 border-t border-line/80"
            style={{ top: (hour - SCHEDULE_DAY_START_HOUR) * HOUR_HEIGHT }}
          />
        ))}
        <NowLine day={day} />
        {dayEvents.map((event) => (
          <EventBlock key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}

/**
 * Grilla horaria tipo Google Calendar / Calendly.
 * Semana en escritorio; día con navegación en móvil.
 */
export function ScheduleCalendar({
  events,
  initialDate,
}: {
  events: ScheduleEvent[];
  /** Día de referencia (ISO o Date). Por defecto hoy. */
  initialDate?: string | Date;
}) {
  const narrow = useIsNarrow();
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const seed = useMemo(() => {
    if (!initialDate) return today;
    const d = new Date(initialDate);
    d.setHours(0, 0, 0, 0);
    return Number.isNaN(d.getTime()) ? today : d;
  }, [initialDate, today]);

  const [cursor, setCursor] = useState(seed);
  useEffect(() => {
    setCursor(seed);
  }, [seed]);

  const weekStart = useMemo(() => startOfWeekMonday(cursor), [cursor]);
  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  );

  const goPrev = () => setCursor((d) => addDays(d, narrow ? -1 : -7));
  const goNext = () => setCursor((d) => addDays(d, narrow ? 1 : 7));
  const goToday = () => setCursor(today);

  const heading = narrow
    ? new Intl.DateTimeFormat('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      }).format(cursor)
    : formatWeekRange(weekStart);

  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-5">
        <div className="min-w-0">
          <p className="signage-label text-inkMuted">
            {narrow ? 'Día' : 'Semana'}
          </p>
          <p className="mt-1 truncate font-display text-lg capitalize text-ink">{heading}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goToday}
            className="rounded-lg border border-line bg-canvas px-3 py-1.5 text-xs font-bold text-ink transition-colors duration-150 ease-out-soft hover:bg-brand-light"
          >
            Hoy
          </button>
          <div className="inline-flex overflow-hidden rounded-lg border border-line">
            <button
              type="button"
              aria-label={narrow ? 'Día anterior' : 'Semana anterior'}
              onClick={goPrev}
              className="px-3 py-1.5 text-sm font-bold text-inkMuted transition-colors duration-150 ease-out-soft hover:bg-canvas hover:text-ink"
            >
              ←
            </button>
            <button
              type="button"
              aria-label={narrow ? 'Día siguiente' : 'Semana siguiente'}
              onClick={goNext}
              className="border-l border-line px-3 py-1.5 text-sm font-bold text-inkMuted transition-colors duration-150 ease-out-soft hover:bg-canvas hover:text-ink"
            >
              →
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="flex min-w-[640px]">
          <div className="sticky left-0 z-10 w-14 shrink-0 bg-surface sm:w-16">
            <div className="h-[45px] border-b border-line" />
            <div className="relative" style={{ height: HOURS.length * HOUR_HEIGHT }}>
              {HOURS.map((hour) => (
                <div
                  key={hour}
                  className="absolute inset-x-0 -translate-y-2 pr-2 text-right"
                  style={{ top: (hour - SCHEDULE_DAY_START_HOUR) * HOUR_HEIGHT }}
                >
                  <span className="text-[10px] font-medium tabular-nums text-inkMuted">
                    {formatHourLabel(hour)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex min-w-0 flex-1">
            {narrow ? (
              <DayColumn day={cursor} events={events} today={today} showHeader={false} />
            ) : (
              weekDays.map((day) => (
                <DayColumn key={day.toISOString()} day={day} events={events} today={today} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
