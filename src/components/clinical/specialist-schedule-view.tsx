'use client';

import type { ReactNode } from 'react';
import {
  AgendaViewToggle,
  useAgendaViewPreference,
} from '@/components/clinical/agenda-view-preference';
import { ScheduleCalendar } from '@/components/clinical/schedule-calendar';
import type { ScheduleEvent } from '@/lib/clinical/schedule-events';

/**
 * Contenedor del cronograma del especialista.
 * Respeta la preferencia Agenda | Calendario (ajustes + toggle local).
 */
export function SpecialistScheduleView({
  title,
  summary,
  events,
  agenda,
  flushAgenda = true,
}: {
  title: string;
  summary?: ReactNode;
  events: ScheduleEvent[];
  /** Contenido de la vista lista (timeline). */
  agenda: ReactNode;
  /** Si el contenido agenda va a sangre (listas con divisores). */
  flushAgenda?: boolean;
}) {
  const { view, setView, ready } = useAgendaViewPreference();
  const mode = ready ? view : 'calendar';

  return (
    <section className="overflow-hidden rounded-xl border border-line bg-surface shadow-card">
      <div className="flex min-h-[56px] flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3">
        <div className="flex min-w-0 flex-wrap items-center gap-3">
          <h2 className="signage-label text-inkMuted">{title}</h2>
          {summary}
        </div>
        <AgendaViewToggle view={mode} onChange={setView} />
      </div>

      {mode === 'calendar' ? (
        <ScheduleCalendar events={events} />
      ) : flushAgenda ? (
        agenda
      ) : (
        <div className="p-6">{agenda}</div>
      )}
    </section>
  );
}
