# HealthCloud — Sistema de interfaz

## Dirección: "Señalética clínica"

Como las franjas de color pintadas en los pasillos de un hospital ("siga la
línea verde"), cada rol tiene una línea de guía que recorre el borde izquierdo
de la pantalla y marca dónde estás. Sensación: la calma y autoridad de la buena
señalética hospitalaria — limpio, luminoso, muy legible, un solo color saturado
por rol y todo lo demás en silencio.

## Firma

La **línea de guía del rol**: franja vertical de 4px (`w-1 bg-role-*`) en el
borde izquierdo del viewport. Se repite como segmento corto (`h-[3px] w-6
rounded-full`) en la miga de ubicación, el marcador de sección activa del
sidebar, el selector de rol de la demo, el tablero "Direcciones" del landing y
la lista de roles del vestíbulo de auth. Cualquier referencia a un rol lleva su
segmento de línea, nunca un punto.

## Tipografía

- **Display / navegación / cifras:** Archivo (`--font-archivo`, clase
  `font-display` = 600, tracking −0.02em). ADN de rotulación de letreros.
- **Cuerpo:** Atkinson Hyperlegible (`--font-atkinson`) — elección deliberada
  de accesibilidad del producto, no se sustituye.
- **Rótulo de señalética:** clase `signage-label` (Archivo 11px / 600 /
  tracking 0.12em / uppercase). Se usa en títulos de Panel, etiquetas de
  métricas, cabeceras de tabla, labels de formulario, eyebrows y contexto de
  rol en el sidebar.
- Cifras dinámicas siempre con `tabular-nums`.

## Color (tokens en tailwind.config.ts)

- `canvas #f4f6f5` (muro clínico) · `surface #ffffff` · `sunken #edf1ef`
  (campos de formulario: hundidos, no elevados; en focus pasan a surface).
- Tinta: `ink #14231e` · `inkBody #24332d` · `inkMuted #5d6f67`.
- Bordes rgba que se funden con el fondo: `line rgba(20,35,30,.10)` ·
  `lineStrong .18` (el modo alto contraste los refuerza desde globals.css).
- Marca: `brand #0f5747` (verde quirúrgico profundo), dark/mid/light/soft.
- Destructivo: `accent #9d3030`. Semánticos: `ok #176151/ok-soft`,
  `warn #8a5e16/warn-soft`.
- Líneas de rol: `role-admin #5d47a6` · `role-org #1f6f9e` ·
  `role-spec #177a58` · `role-patient #a34d72`. Registro de clases estáticas en
  `src/components/platform/role-theme.ts` (módulo sin 'use client' para poder
  importarse desde server components).

## Profundidad y radios

- Estrategia: **solo bordes + tintes de superficie**. `shadow-card` (1px casi
  invisible) en tarjetas; `shadow-lift` reservado a overlays (modales, guía) y
  al tablero del hero.
- Radios: controles `rounded-lg` (8px) · tarjetas `rounded-xl` (12px) ·
  modales `rounded-2xl` (16px). Badges `rounded-md` (plaquitas, no píldoras).

## Estructura

- Shell (`platform-shell.tsx` / `demo-shell.tsx`): línea de guía + sidebar
  `w-64` (mismo fondo que el canvas, borde derecho) + cabecera con miga
  "Estás en:" y contenido `max-w-[1200px]`. En móvil el sidebar se apila y la
  nav se vuelve fila desplazable. Anclas de la guía: `data-tour="header|nav|content"`.
- Sección activa del sidebar: fondo `role/10` + barra izquierda de 3px que
  apunta a la línea de guía (solo lg).
- Métricas ("placa"): `signage-label` arriba, cifra Archivo 30px tabular abajo,
  detalle a la derecha en secundario.
- Tablas: cabecera `signage-label` sobre `sunken/60`, primera columna en
  negrita como ancla, hover `canvas/60`, celdas `px-5 py-3.5`.

## Componentes registrados

- Button primary — h-11 · px-4 · rounded-lg · Archivo 600 · brand → brand-dark ·
  `active:scale-[0.98]` · ring brand-soft con offset.
- Campo de formulario (`fieldStyles`) — rounded-lg · bg-sunken · border-line ·
  focus: border-brand-mid + bg-surface + ring brand-soft. Label `signage-label`.
- Panel — cabecera min-h-[56px] px-5, título `signage-label text-inkMuted`.
- Badge de estado/rol — rounded-md px-2 py-1 text-xs font-bold, tono soft + texto.
- Easing global: `ease-out-soft` cubic-bezier(0.2,0.8,0.2,1), 150–250ms.

## Reglas de consistencia

- Ningún hex suelto en páginas: todo pasa por tokens (los verdes/ámbar de
  estado usan `ok`/`warn`).
- Un color de rol solo aparece como línea/segmento o tinte al 10%; nunca como
  fondo sólido de grandes áreas.
- `prefers-reduced-motion` respetado globalmente (globals.css).
- Las preferencias de accesibilidad (tamaño de texto en rem, alto contraste
  vía data-attributes) deben seguir funcionando tras cualquier cambio.
