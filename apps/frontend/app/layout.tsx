import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '700'],
  display: 'swap',
  preload: false,
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  weight: ['700'],
  display: 'swap',
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://stackoverkill.io'),
  title: 'StackOverkill.io - Ton infra est-elle overkill ?',
  description:
    'Découvre en 2 minutes si ta stack technique est adaptée à tes vrais besoins. Gratuit, fun, et partageable !',
  keywords: ['infrastructure', 'devops', 'audit', 'overkill', 'stack', 'tech'],
  authors: [{ name: 'StackOverkill' }],
  openGraph: {
    title: 'StackOverkill.io - Ton infra est-elle overkill ?',
    description:
      'Découvre en 2 minutes si ta stack technique est adaptée à tes vrais besoins.',
    url: 'https://stackoverkill.io',
    siteName: 'StackOverkill',
    locale: 'fr_FR',
    type: 'website',
    images: [
      {
        url: '/og-home.png',
        width: 1200,
        height: 630,
        alt: 'StackOverkill - Ton infra est-elle overkill ?',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StackOverkill.io - Ton infra est-elle overkill ?',
    description:
      'Découvre en 2 minutes si ta stack technique est adaptée à tes vrais besoins.',
    images: ['/og-home.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
