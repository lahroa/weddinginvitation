import type { Metadata } from 'next';
import { JetBrains_Mono, MonteCarlo, Playfair } from 'next/font/google';
import './globals.css';

const playfair = Playfair({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  variable: '--font-sans',
  display: 'swap',
});

const monteCarlo = MonteCarlo({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-serif',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'Luis & Daniela - Nos Casamos',
  description: 'Te invitamos a celebrar nuestra boda el 27 de Julio de 2026.',
  openGraph: {
    title: 'Luis & Daniela - Nos Casamos',
    description: 'Te invitamos a celebrar nuestra boda el 27 de Julio de 2026.',
    images: [{ url: '/images/og-image.jpg', width: 1200, height: 630 }],
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${playfair.variable} ${monteCarlo.variable} ${jetbrains.variable} 
                        font-sans antialiased bg-cream text-dark`}>
        {children}
      </body>
    </html>
  );
}