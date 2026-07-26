import Link from 'next/link';
import { ARCHITECTURE_LAYERS } from '@/lib/mock/demo-data';

const ROLE_CARDS = [
  {
    role: 'admin',
    title: 'Administrador',
    desc: 'Invita organizaciones, supervisa el ecosistema y lee reportes de uso.',
    href: '/demo/admin',
    accent: 'border-role-admin/30 hover:border-role-admin',
    dot: 'bg-role-admin',
  },
  {
    role: 'organization',
    title: 'Organización',
    desc: 'Gestiona el perfil de la clínica y coordina su plantilla médica.',
    href: '/demo/organization',
    accent: 'border-role-org/30 hover:border-role-org',
    dot: 'bg-role-org',
  },
  {
    role: 'specialist',
    title: 'Especialista',
    desc: 'Agenda del día, consultas clínicas y seguimiento de pacientes.',
    href: '/demo/specialist',
    accent: 'border-role-spec/30 hover:border-role-spec',
    dot: 'bg-role-spec',
  },
  {
    role: 'patient',
    title: 'Paciente',
    desc: 'Solicita horas, registra síntomas y revisa su historial completo.',
    href: '/demo/patient',
    accent: 'border-role-patient/30 hover:border-role-patient',
    dot: 'bg-role-patient',
  },
];

export function ArchitectureMap() {
  return (
    <div className="space-y-8">
      {/* Flujo operativo */}
      <div className="rounded-2xl border border-line bg-surface p-8">
        <h3 className="font-display text-xl text-ink">Flujo entre actores</h3>
        <p className="mt-2 text-sm text-inkMuted">
          Cada rol opera en su módulo. Los permisos suben en cascada institucional.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {ROLE_CARDS.map((card, i) => (
            <Link
              key={card.role}
              href={card.href}
              className={`group relative rounded-2xl border-2 bg-canvas p-5 transition duration-200 ease-out-soft ${card.accent}`}
            >
              <span className={`inline-block h-2 w-2 rounded-full ${card.dot}`} />
              <h4 className="mt-3 font-medium text-ink">{card.title}</h4>
              <p className="mt-2 text-xs leading-relaxed text-inkMuted">{card.desc}</p>
              <span className="mt-4 inline-block text-xs font-medium text-brand group-hover:underline">
                Ver interfaz →
              </span>
              {i < 3 && (
                <span className="absolute -right-3 top-1/2 hidden text-inkMuted md:block">→</span>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Capas técnicas */}
      <div className="grid gap-4 sm:grid-cols-2">
        {ARCHITECTURE_LAYERS.map((layer) => (
          <div key={layer.title} className={`rounded-xl border p-5 ${layer.color}`}>
            <h4 className="text-sm font-semibold text-ink">{layer.title}</h4>
            <ul className="mt-3 space-y-1.5">
              {layer.items.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-inkMuted">
                  <span className="h-1 w-1 rounded-full bg-brand" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-dashed border-line bg-canvas/50 px-6 py-4 text-center text-sm text-inkMuted">
        Despliegue en <strong className="text-ink">Render</strong> · Base de datos{' '}
        <strong className="text-ink">PostgreSQL</strong> · Autenticación{' '}
        <strong className="text-ink">Supabase</strong>
      </div>
    </div>
  );
}
