import Link from 'next/link';
import { ReactNode } from 'react';

interface AuthCardProps {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}

// El "vestíbulo" de la plataforma: como en la entrada de una clínica, la
// señalética muestra las cuatro líneas de color y a dónde lleva cada una.
const ROLE_LINES = [
  { color: 'bg-role-admin', label: 'Administración' },
  { color: 'bg-role-org', label: 'Organizaciones' },
  { color: 'bg-role-spec', label: 'Especialistas' },
  { color: 'bg-role-patient', label: 'Pacientes' },
];

export function AuthCard({ title, description, children, footer }: AuthCardProps) {
  return (
    <div className="min-h-screen bg-canvas text-inkBody">
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between px-5 py-5 sm:px-8">
          <Link href="/" className="font-display text-lg text-ink">
            HealthCloud
          </Link>
          <span className="text-sm text-inkMuted">Acceso seguro</span>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1240px] gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:py-20">
        {/* Columna de bienvenida */}
        <section className="lg:pt-3">
          <p className="signage-label text-brand-mid">Bienvenido</p>
          <h1 className="mt-3 max-w-md font-display text-[2rem] leading-[1.15] text-ink">
            Accede a tu espacio de HealthCloud.
          </h1>
          <p className="mt-5 max-w-sm text-sm leading-6 text-inkMuted">
            Cada cuenta sigue su propia línea: administradores, clínicas, especialistas
            y pacientes trabajan en espacios separados pero coordinados.
          </p>

          <ul className="mt-8 max-w-sm space-y-3">
            {ROLE_LINES.map((role) => (
              <li key={role.label} className="flex items-center gap-3 text-sm text-inkMuted">
                <span aria-hidden="true" className={`h-[3px] w-8 shrink-0 rounded-full ${role.color}`} />
                {role.label}
              </li>
            ))}
          </ul>
        </section>

        {/* Tarjeta del formulario */}
        <section className="h-fit overflow-hidden rounded-xl border border-line bg-surface shadow-card">
          <div className="border-b border-line px-6 py-5">
            <h2 className="font-display text-lg text-ink">{title}</h2>
            <p className="mt-1 text-sm text-inkMuted">{description}</p>
          </div>
          <div className="p-6">{children}</div>
          {footer && (
            <div className="border-t border-line bg-sunken/40 px-6 py-4 text-sm text-inkMuted">
              {footer}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
