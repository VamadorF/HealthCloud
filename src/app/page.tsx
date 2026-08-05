import Link from 'next/link';
import { ArchitectureMap } from '@/components/demo/architecture-map';

// Tablero de señalética del vestíbulo: cada línea de color lleva a su espacio,
// como las franjas pintadas en los pasillos de un hospital.
const SIGN_ROWS = [
  { href: '/demo/admin', line: 'bg-role-admin', label: 'Administración', detail: '24 organizaciones' },
  { href: '/demo/organization', line: 'bg-role-org', label: 'Organizaciones', detail: 'Clínica Andes Norte' },
  { href: '/demo/specialist', line: 'bg-role-spec', label: 'Especialistas', detail: '4 citas hoy' },
  { href: '/demo/patient', line: 'bg-role-patient', label: 'Pacientes', detail: 'Próxima cita 09:00' },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-canvas">
      {/* Nav */}
      <header className="border-b border-line bg-surface/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="font-display text-xl text-ink">HealthCloud</span>
          <nav className="flex items-center gap-6 text-sm">
            <a href="#arquitectura" className="hidden text-inkMuted hover:text-ink sm:inline">
              Arquitectura
            </a>
            <a href="#roles" className="hidden text-inkMuted hover:text-ink sm:inline">
              Roles
            </a>
            <Link href="/login" className="text-inkMuted hover:text-ink">
              Acceso
            </Link>
            <Link
              href="/demo/admin"
              className="rounded-lg bg-brand px-4 py-2 text-sm font-display text-white transition duration-200 ease-out-soft hover:bg-brand-dark"
            >
              Explorar plataforma
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-16 md:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="signage-label text-brand-mid">Gestión de salud</p>
            <h1 className="mt-4 font-display text-4xl leading-[1.08] text-ink md:text-5xl lg:text-[3.4rem]">
              Una plataforma donde cada actor sabe exactamente dónde está
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-inkMuted">
              Como la línea de color que guía por los pasillos de una clínica, HealthCloud
              conduce a administradores, organizaciones, especialistas y pacientes por
              flujos separados pero coordinados.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/demo/patient"
                className="rounded-lg bg-brand px-6 py-3 text-sm font-display text-white shadow-lift transition duration-200 ease-out-soft hover:bg-brand-dark"
              >
                Entrar como paciente
              </Link>
              <Link
                href="/demo/admin"
                className="rounded-lg border border-lineStrong bg-surface px-6 py-3 text-sm font-display text-ink transition duration-200 ease-out-soft hover:border-brand/40"
              >
                Ver panel administrativo
              </Link>
            </div>
          </div>

          {/* Tablero de direcciones: la firma visual de la plataforma */}
          <div className="relative">
            <div className="overflow-hidden rounded-xl bg-brand-dark shadow-lift">
              <div className="border-b border-white/10 px-6 py-4">
                <p className="signage-label text-brand-soft">Direcciones</p>
              </div>
              <div className="divide-y divide-white/10">
                {SIGN_ROWS.map((row) => (
                  <Link
                    key={row.href}
                    href={row.href}
                    className="group flex items-center gap-4 px-6 py-4 transition-colors duration-200 ease-out-soft hover:bg-white/5"
                  >
                    <span aria-hidden="true" className={`h-[3px] w-8 shrink-0 rounded-full ${row.line}`} />
                    <span className="flex-1">
                      <span className="block font-display text-base text-white">{row.label}</span>
                      <span className="block text-xs text-white/60">{row.detail}</span>
                    </span>
                    <span
                      aria-hidden="true"
                      className="text-white/40 transition duration-200 ease-out-quart group-hover:translate-x-0.5 group-hover:text-white"
                    >
                      →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
            <p className="mt-3 text-center text-xs text-inkMuted">
              Siga la línea de su rol: cada una lleva a un espacio de demostración.
            </p>
          </div>
        </div>
      </section>

      {/* Roles quick access — franja inmediata al hero */}
      <section id="roles" className="mx-auto max-w-6xl px-6 pb-20">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="signage-label text-brand-mid">Roles</p>
            <h2 className="mt-3 font-display text-3xl text-ink">Cuatro interfaces, un solo sistema</h2>
            <p className="mt-3 max-w-2xl text-inkMuted">
              Cada rol tiene su propio espacio de trabajo. Entra a cualquiera para verlo.
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { href: '/demo/admin', title: 'Administrador', sub: '24 organizaciones · reportes globales', color: 'bg-role-admin' },
            { href: '/demo/organization', title: 'Organización', sub: 'Clínica Andes Norte · 18 especialistas', color: 'bg-role-org' },
            { href: '/demo/specialist', title: 'Especialista', sub: '4 citas hoy · 3 consultas pendientes', color: 'bg-role-spec' },
            { href: '/demo/patient', title: 'Paciente', sub: 'Próxima cita hoy 09:00', color: 'bg-role-patient' },
          ].map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group flex flex-col overflow-hidden rounded-xl border border-line bg-surface shadow-card transition duration-200 ease-out-quart hover:-translate-y-0.5 hover:border-brand/30"
            >
              <div aria-hidden="true" className={`h-1 w-full ${card.color}`} />
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-base text-ink transition duration-200 ease-out-soft group-hover:text-brand">
                    {card.title}
                  </h3>
                  <span
                    aria-hidden="true"
                    className="text-inkMuted/50 transition duration-200 ease-out-quart group-hover:translate-x-0.5 group-hover:text-brand"
                  >
                    →
                  </span>
                </div>
                <p className="mt-1.5 text-sm text-inkMuted">{card.sub}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Architecture — banda con fondo */}
      <section id="arquitectura" className="border-y border-line bg-surface py-20">
        <div className="mx-auto max-w-6xl px-6">
          <p className="signage-label text-brand-mid">Arquitectura</p>
          <h2 className="mt-3 font-display text-3xl text-ink">Dónde vive cada cosa</h2>
          <p className="mt-3 max-w-2xl text-inkMuted">
            La misma estructura que verás en producción: capas claras, roles aislados,
            datos clínicos en PostgreSQL y autenticación en Supabase.
          </p>
          <div className="mt-12">
            <ArchitectureMap />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-line py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-inkMuted md:flex-row">
          <span>HealthCloud · Next.js · Prisma · Supabase · Render</span>
          <div className="flex gap-6">
            <Link href="/login" className="hover:text-ink">
              Iniciar sesión
            </Link>
            <Link href="/signup" className="hover:text-ink">
              Registrarse
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
