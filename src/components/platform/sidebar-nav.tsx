'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { NavItem } from '@/lib/auth/navigation';

// Miga de ubicación: "Estás en: Rol / Sección", según la ruta activa.
export function LocationCrumb({ roleLabel, items }: { roleLabel: string; items: NavItem[] }) {
  const pathname = usePathname();
  const active = items.find((item) => item.href === pathname);

  return (
    <p className="text-sm font-bold text-brand-mid">
      Estás en: {roleLabel}
      {active ? ` / ${active.label}` : ''}
    </p>
  );
}

// Navegación de píldoras dentro de la tarjeta hero, como en el prototipo.
export function PillNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Secciones de la cuenta" className="mt-6 flex flex-wrap gap-2">
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={`rounded-xl px-4 py-2.5 text-sm font-bold transition-colors duration-200 ease-out-soft ${
              active
                ? 'bg-brand text-white'
                : 'bg-brand-light/70 text-brand-mid hover:bg-brand-soft/60 hover:text-ink'
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
