import Link from 'next/link';
import { ReactNode } from 'react';

interface AuthCardProps {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthCard({ title, description, children, footer }: AuthCardProps) {
  return (
    <div className="min-h-screen bg-canvas text-inkBody">
      <header className="border-b border-lineStrong">
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
          <p className="text-sm font-bold text-brand-mid">Bienvenido</p>
          <h1 className="mt-3 max-w-md font-display text-[32px] leading-[1.15] text-ink">
            Accede a tu espacio de HealthCloud.
          </h1>
          <p className="mt-5 max-w-sm text-sm leading-6 text-inkMuted">
            Cada cuenta opera en un entorno independiente: administradores, clínicas,
            especialistas y pacientes trabajan en espacios separados pero coordinados.
          </p>
        </section>

        {/* Tarjeta del formulario */}
        <section className="border border-line bg-surface">
          <div className="border-b border-line px-5 py-5">
            <h2 className="text-base font-bold text-ink">{title}</h2>
            <p className="mt-1 text-sm text-inkMuted">{description}</p>
          </div>
          <div className="p-5">{children}</div>
          {footer && (
            <div className="border-t border-line px-5 py-4 text-sm text-inkMuted">{footer}</div>
          )}
        </section>
      </main>
    </div>
  );
}
