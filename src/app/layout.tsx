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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link
          rel="preload"
          href="/lottie/639-people-queue.json"
          as="fetch"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${playfair.variable} ${monteCarlo.variable} ${jetbrains.variable}
                        font-sans antialiased bg-cream text-dark`}>
        {children}
      </body>
    </html>
  );
}