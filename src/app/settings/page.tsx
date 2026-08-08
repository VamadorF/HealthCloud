import Link from 'next/link';
import { requireAuth } from '@/lib/auth/session';
import { PlatformShell, Panel } from '@/components/platform/platform-shell';
import { WidgetSettingsPanel } from '@/components/platform/widget-preferences';
import { getTourRole } from '@/lib/tour/steps';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const user = await requireAuth();
  const role = getTourRole(user.role);

  return (
    <PlatformShell
      user={user}
      title="Ajustes"
      description="Personaliza qué ves en tu panel y cómo se presenta la información clínica"
    >
      <div className="grid max-w-3xl gap-6">
        <Panel title="Personalización del panel">
          <div className="px-6 py-5">
            <WidgetSettingsPanel role={role} />
          </div>
        </Panel>

        <Panel title="Cuenta y accesibilidad">
          <div className="divide-y divide-line">
            <Link
              href="/profile"
              className="flex items-center justify-between gap-4 px-6 py-4 transition-colors duration-200 ease-out-soft hover:bg-canvas/60"
            >
              <div>
                <p className="text-sm font-bold text-ink">Mi cuenta</p>
                <p className="mt-0.5 text-sm text-inkMuted">
                  Nombre, correo y foto de perfil
                </p>
              </div>
              <span aria-hidden="true" className="text-inkMuted">
                →
              </span>
            </Link>
            <p className="px-6 py-4 text-sm text-inkMuted">
              Los ajustes de lectura (tamaño de texto, contraste y movimiento) están en el
              botón Accesibilidad de la cabecera.
            </p>
          </div>
        </Panel>
      </div>
    </PlatformShell>
  );
}
