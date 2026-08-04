import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Mundo "señalética clínica": muro claro con matiz verde, superficies
        // blancas y campos hundidos (reciben contenido, no lo emiten).
        canvas: '#f4f6f5',
        surface: '#ffffff',
        sunken: '#edf1ef',
        ink: '#14231e',
        inkBody: '#24332d',
        inkMuted: '#5d6f67',
        brand: {
          DEFAULT: '#0f5747',
          dark: '#0b4437',
          mid: '#1f7460',
          light: '#eaf2ee',
          soft: '#d3e6db',
        },
        accent: {
          DEFAULT: '#9d3030',
          dark: '#822626',
          soft: '#fdf0f0',
        },
        // Semánticos de estado: verde quirófano y ámbar de espera.
        ok: {
          DEFAULT: '#176151',
          soft: '#e8f3ec',
        },
        warn: {
          DEFAULT: '#8a5e16',
          soft: '#fdf5e3',
        },
        // Bordes en rgba: se funden con el fondo y marcan el límite sin
        // pedir atención (alto contraste los refuerza desde globals.css).
        line: 'rgba(20, 35, 30, 0.10)',
        lineStrong: 'rgba(20, 35, 30, 0.18)',
        // Líneas de guía por rol, como las franjas de color pintadas en los
        // pasillos de un hospital: saturadas, distinguibles entre sí y del
        // rojo destructivo.
        role: {
          admin: '#5d47a6',
          org: '#1f6f9e',
          spec: '#177a58',
          patient: '#a34d72',
        },
      },
      fontFamily: {
        sans: ['var(--font-atkinson)', 'system-ui', 'sans-serif'],
        display: ['var(--font-archivo)', 'var(--font-atkinson)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(20, 35, 30, 0.04)',
        lift: '0 0 0 1px rgba(20, 35, 30, 0.05), 0 18px 50px rgba(20, 35, 30, 0.18)',
      },
      // Curva de easing del prototipo: se usa en hovers, lifts y transiciones.
      transitionTimingFunction: {
        'out-soft': 'cubic-bezier(0.2, 0.8, 0.2, 1)',
        'out-quart': 'cubic-bezier(0.25, 1, 0.5, 1)',
      },
    },
  },
  plugins: [],
};
export default config;
