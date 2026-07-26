import Link from 'next/link';
import { ArchitectureMap } from '@/components/demo/architecture-map';

export default function Home() {
  return (
    <div className="min-h-screen bg-canvas">
      {/* Nav */}
      <header className="border-b border-line/60 bg-surface/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="font-display text-xl text-ink">HealthCloud</span>
          <nav className="flex items-center gap-6 text-sm">
            <a href="#arquitectura" className="text-inkMuted hover:text-ink">Arquitectura</a>
            <a href="#roles" className="text-inkMuted hover:text-ink">Roles</a>
            <Link href="/login" className="text-inkMuted hover:text-ink">Acceso</Link>
            <Link
              href="/demo/admin"
              className="rounded-xl bg-brand px-4 py-2 text-sm font-medium text-white transition duration-200 ease-out-soft hover:bg-brand-dark"
            >
              Explorar plataforma
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-16 md:pt-24">
        <div className="grid items-end gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-brand">
              Gestión de salud
            </p>
            <h1 className="mt-4 font-display text-4xl leading-[1.1] text-ink md:text-5xl lg:text-[3.25rem]">
              Una plataforma donde cada actor sabe exactamente dónde está
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-inkMuted">
              HealthCloud conecta administradores, clínicas, especialistas y pacientes
              en flujos separados pero coordinados. Sin ruido, sin pantallas genéricas.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/demo/patient"
                className="rounded-xl bg-brand px-6 py-3 text-sm font-medium text-white shadow-lift transition duration-200 ease-out-soft hover:bg-brand-dark"
              >
                Entrar como paciente
              </Link>
              <Link
                href="/demo/admin"
                className="rounded-xl border border-line bg-surface px-6 py-3 text-sm font-medium text-ink transition duration-200 ease-out-soft hover:border-brand/40"
              >
                Ver panel administrativo
              </Link>
            </div>
          </div>

          {/* Visual preview card */}
          <div className="relative">
            <div className="rounded-2xl border border-line bg-surface p-6 shadow-lift">
              <div className="flex items-center gap-2 border-b border-line pb-4">
                <div className="h-3 w-3 rounded-full bg-role-spec" />
                <div className="h-3 w-3 rounded-full bg-role-org" />
                <div className="h-3 w-3 rounded-full bg-role-patient" />
                <span className="ml-2 text-xs text-inkMuted">Agenda · Dr. Tomás Figueroa</span>
              </div>
              <div className="mt-4 space-y-3">
                {[
                  { t: '09:00', p: 'Camila Soto', s: 'Confirmada' },
                  { t: '09:45', p: 'Roberto Díaz', s: 'En sala' },
                  { t: '10:30', p: 'María José Vera', s: 'Confirmada' },
                ].map((row) => (
                  <div key={row.t} className="flex items-center justify-between rounded-lg bg-canvas px-4 py-3">
                    <div>
                      <span className="text-xs font-medium text-brand">{row.t}</span>
                      <p className="text-sm font-medium text-ink">{row.p}</p>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-[#176151]">
                      {row.s}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -bottom-4 -left-4 -z-10 h-full w-full rounded-xl bg-brand/10" />
          </div>
        </div>
      </section>

      {/* Roles quick access — franja inmediata al hero */}
      <section id="roles" className="mx-auto max-w-6xl px-6 pb-20">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="font-display text-3xl text-ink">Cuatro interfaces, un solo sistema</h2>
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
              className="group flex flex-col rounded-2xl border border-line bg-surface p-5 transition duration-200 ease-out-quart hover:-translate-y-0.5 hover:border-brand/30"
            >
              <div className="flex items-center justify-between">
                <div className={`h-1.5 w-8 rounded-full ${card.color}`} />
                <span
                  aria-hidden="true"
                  className="text-inkMuted/50 transition duration-200 ease-out-quart group-hover:translate-x-0.5 group-hover:text-brand"
                >
                  →
                </span>
              </div>
              <h3 className="mt-4 font-medium text-ink transition duration-200 ease-out-soft group-hover:text-brand">
                {card.title}
              </h3>
              <p className="mt-1 text-sm text-inkMuted">{card.sub}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Architecture — banda con fondo */}
      <section id="arquitectura" className="border-y border-line bg-surface py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="font-display text-3xl text-ink">Dónde vive cada cosa</h2>
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
            <Link href="/login" className="hover:text-ink">Iniciar sesión</Link>
            <Link href="/signup" className="hover:text-ink">Registrarse</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
