import type { Metadata } from 'next';
import { Archivo, Atkinson_Hyperlegible } from 'next/font/google';
import './globals.css';

const atkinson = Atkinson_Hyperlegible({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-atkinson',
});

// Archivo desciende de la rotulación de letreros: lleva títulos, navegación
// y cifras (la "señalética" de la interfaz). El cuerpo sigue en Atkinson.
const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-archivo',
});

export const metadata: Metadata = {
  title: 'HealthCloud — Gestión de servicios de salud',
  description: 'Plataforma que conecta organizaciones médicas, especialistas y pacientes',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${atkinson.variable} ${archivo.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
