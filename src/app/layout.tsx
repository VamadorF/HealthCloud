import type { Metadata } from 'next';
import { Atkinson_Hyperlegible } from 'next/font/google';
import './globals.css';

const atkinson = Atkinson_Hyperlegible({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-atkinson',
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
    <html lang="es" className={atkinson.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
