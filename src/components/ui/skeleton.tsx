export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-ink/[0.08] ${className}`} aria-hidden="true" />;
}

/**
 * Esqueleto de página para las secciones autenticadas: replica la estructura
 * del PlatformShell (línea de guía, barra lateral, cabecera y contenido)
 * mientras cargan los datos del servidor.
 */
export function PageSkeleton() {
  return (
    <div className="relative min-h-screen bg-canvas lg:flex">
      <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1 bg-ink/10" />

      {/* Barra lateral */}
      <div className="flex flex-col gap-5 border-b border-line px-5 pb-4 pt-5 lg:h-screen lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r lg:px-6 lg:pb-6 lg:pt-7">
        <div>
          <Skeleton className="h-5 w-32 rounded-lg" />
          <Skeleton className="mt-2.5 h-3 w-40 rounded-lg" />
        </div>
        <div className="flex gap-1 lg:flex-col">
          <Skeleton className="h-10 w-28 rounded-lg lg:w-full" />
          <Skeleton className="h-10 w-28 rounded-lg lg:w-full" />
          <Skeleton className="h-10 w-28 rounded-lg lg:w-full" />
        </div>
      </div>

      {/* Cabecera y contenido */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4 sm:px-8">
          <Skeleton className="h-4 w-56 rounded-lg" />
          <Skeleton className="h-8 w-24 rounded-lg" />
        </div>
        <div className="mx-auto w-full max-w-[1200px] px-5 py-8 sm:px-8 lg:py-10">
          <Skeleton className="h-9 w-72 max-w-full rounded-lg" />
          <Skeleton className="mt-3 h-4 w-96 max-w-full rounded-lg" />
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
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
    </div>
  );
}
