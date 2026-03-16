import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Leaderboard - StackOverkill.io',
  description:
    'Découvre les stacks les plus extrêmes de la communauté. Qui a la stack la plus overkill ?',
  openGraph: {
    title: 'Leaderboard - StackOverkill.io',
    description:
      'Découvre les stacks les plus extrêmes de la communauté. Qui a la stack la plus overkill ?',
    url: 'https://stackoverkill.io/leaderboard',
    siteName: 'StackOverkill',
    locale: 'fr_FR',
    type: 'website',
    images: [
      {
        url: '/og-leaderboard.png',
        width: 1200,
        height: 630,
        alt: 'Leaderboard StackOverkill',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Leaderboard - StackOverkill.io',
    description:
      'Découvre les stacks les plus extrêmes de la communauté. Qui a la stack la plus overkill ?',
    images: ['/og-leaderboard.png'],
  },
};

export default function LeaderboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
