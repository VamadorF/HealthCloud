'use client';

import { useState } from 'react';
import { FieldLabel } from '@/components/ui/input';

const BODY_AREAS = [
  { id: 'cabeza', label: 'Cabeza' },
  { id: 'cuello', label: 'Cuello' },
  { id: 'torax', label: 'Tórax' },
  { id: 'abdomen', label: 'Abdomen' },
  { id: 'espalda', label: 'Espalda' },
  { id: 'brazo_izq', label: 'Brazo izq.' },
  { id: 'brazo_der', label: 'Brazo der.' },
  { id: 'pierna_izq', label: 'Pierna izq.' },
  { id: 'pierna_der', label: 'Pierna der.' },
  { id: 'generalizado', label: 'Generalizado' },
] as const;

interface BodyAreasFieldProps {
  name?: string;
  label?: string;
  defaultValue?: string[];
  value?: string[];
  onChange?: (next: string[]) => void;
}

export function BodyAreasField({
  name = 'bodyAreas',
  label = 'Zonas afectadas',
  defaultValue = [],
  value,
  onChange,
}: BodyAreasFieldProps) {
  const [internal, setInternal] = useState<string[]>(defaultValue);
  const selected = value ?? internal;

  const toggle = (id: string) => {
    const next = selected.includes(id)
      ? selected.filter((item) => item !== id)
      : [...selected, id];
    if (value === undefined) setInternal(next);
    onChange?.(next);
  };

  return (
    <fieldset>
      <legend>
        <FieldLabel>{label}</FieldLabel>
      </legend>
      <input type="hidden" name={name} value={JSON.stringify(selected)} />
      <div className="flex flex-wrap gap-2">
        {BODY_AREAS.map((area) => {
          const active = selected.includes(area.id);
          return (
            <button
              key={area.id}
              type="button"
              aria-pressed={active}
              onClick={() => toggle(area.id)}
              className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors duration-150 ease-out-soft ${
                active
                  ? 'border-brand/40 bg-brand-light text-brand-mid'
                  : 'border-line bg-sunken text-inkMuted hover:border-lineStrong hover:text-ink'
              }`}
            >
              {area.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
