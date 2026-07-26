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
        canvas: '#f5f6f3',
        ink: '#173f3b',
        inkBody: '#22312e',
        inkMuted: '#5c736b',
        brand: {
          DEFAULT: '#154d45',
          dark: '#103f39',
          mid: '#277166',
          light: '#edf4ef',
          soft: '#d8e9df',
        },
        accent: {
          DEFAULT: '#9d3030',
          dark: '#822626',
          soft: '#fdf0f0',
        },
        surface: '#ffffff',
        line: '#d7e1db',
        lineStrong: '#cbd4ce',
        role: {
          admin: '#5b4b8a',
          org: '#2a6f97',
          spec: '#1b7a5a',
          patient: '#b86b25',
        },
      },
      fontFamily: {
        sans: ['var(--font-atkinson)', 'system-ui', 'sans-serif'],
        display: ['var(--font-atkinson)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(23,63,59,0.03)',
        lift: '0 18px 50px rgba(24,61,53,0.2)',
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
