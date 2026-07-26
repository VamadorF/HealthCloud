export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-2xl bg-ink/10 ${className}`} aria-hidden="true" />;
}

/**
 * Esqueleto de página para las secciones autenticadas: replica la estructura
 * de PlatformShell (cabecera, tarjeta hero con navegación y contenido)
 * mientras cargan los datos del servidor.
 */
export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-canvas">
      <div className="border-b border-lineStrong">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-5 sm:px-8">
          <div>
            <Skeleton className="h-5 w-32 rounded-lg" />
            <Skeleton className="mt-2 h-3.5 w-44 rounded-lg" />
          </div>
          <Skeleton className="h-5 w-48 rounded-lg" />
        </div>
      </div>
      <div className="mx-auto max-w-[1600px] px-5 py-9 sm:px-8">
        <div className="rounded-2xl border border-line bg-surface px-6 py-6 sm:px-8">
          <Skeleton className="h-4 w-56 rounded-lg" />
          <Skeleton className="mt-3 h-9 w-72 max-w-full rounded-lg" />
          <Skeleton className="mt-3 h-4 w-96 max-w-full rounded-lg" />
          <div className="mt-6 flex gap-2">
            <Skeleton className="h-10 w-28 rounded-xl" />
            <Skeleton className="h-10 w-28 rounded-xl" />
            <Skeleton className="h-10 w-28 rounded-xl" />
          </div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
        <div className="mt-6 grid gap-5 xl:grid-cols-[1.4fr_0.9fr]">
          <Skeleton className="h-72" />
          <Skeleton className="h-72" />
        </div>
      </div>
    </div>
  );
}
