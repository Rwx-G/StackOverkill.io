import { Metadata } from 'next';
import type { VerdictType } from '@stackoverkill/shared';

type SupportedLocale = 'fr' | 'en' | 'de' | 'it' | 'es';

// Verdict configuration for metadata (base config with colors/emoji)
const VERDICT_CONFIG: Record<string, { emoji: string }> = {
  OVERKILL_SEVERE: { emoji: '💀' },
  OVERKILL: { emoji: '🔥' },
  SLIGHT_OVERKILL: { emoji: '⚡' },
  BALANCED: { emoji: '✅' },
  SLIGHT_UNDERKILL: { emoji: '🌧️' },
  UNDERKILL: { emoji: '❄️' },
  UNDERKILL_SEVERE: { emoji: '🌊' },
};

// i18n for metadata
const METADATA_I18N: Record<SupportedLocale, {
  labels: Record<string, string>;
  defaultDescription: string;
  description: string;
  altText: string;
}> = {
  fr: {
    labels: {
      OVERKILL_SEVERE: 'OVERKILL SÉVÈRE',
      OVERKILL: 'OVERKILL',
      SLIGHT_OVERKILL: 'OVERKILL LÉGER',
      BALANCED: 'ÉQUILIBRÉ',
      SLIGHT_UNDERKILL: 'UNDERKILL LÉGER',
      UNDERKILL: 'UNDERKILL',
      UNDERKILL_SEVERE: 'UNDERKILL SÉVÈRE',
    },
    defaultDescription: 'Ta stack est-elle adaptée à tes besoins ?',
    description: 'Mon diagnostic : App {scoreApp} vs Infra {scoreInfra} (écart {gap}). Et toi, ta stack est-elle adaptée ? Fais le test !',
    altText: 'Résultat StackOverkill:',
  },
  en: {
    labels: {
      OVERKILL_SEVERE: 'SEVERE OVERKILL',
      OVERKILL: 'OVERKILL',
      SLIGHT_OVERKILL: 'LIGHT OVERKILL',
      BALANCED: 'BALANCED',
      SLIGHT_UNDERKILL: 'LIGHT UNDERKILL',
      UNDERKILL: 'UNDERKILL',
      UNDERKILL_SEVERE: 'SEVERE UNDERKILL',
    },
    defaultDescription: 'Is your stack right-sized for your needs?',
    description: 'My diagnosis: App {scoreApp} vs Infra {scoreInfra} (gap {gap}). Is your stack right-sized? Take the test!',
    altText: 'StackOverkill Result:',
  },
  de: {
    labels: {
      OVERKILL_SEVERE: 'SCHWERER OVERKILL',
      OVERKILL: 'OVERKILL',
      SLIGHT_OVERKILL: 'LEICHTER OVERKILL',
      BALANCED: 'AUSGEWOGEN',
      SLIGHT_UNDERKILL: 'LEICHTER UNDERKILL',
      UNDERKILL: 'UNDERKILL',
      UNDERKILL_SEVERE: 'SCHWERER UNDERKILL',
    },
    defaultDescription: 'Ist dein Stack richtig dimensioniert?',
    description: 'Meine Diagnose: App {scoreApp} vs Infra {scoreInfra} (Differenz {gap}). Ist dein Stack richtig dimensioniert? Mach den Test!',
    altText: 'StackOverkill Ergebnis:',
  },
  it: {
    labels: {
      OVERKILL_SEVERE: 'OVERKILL GRAVE',
      OVERKILL: 'OVERKILL',
      SLIGHT_OVERKILL: 'OVERKILL LEGGERO',
      BALANCED: 'EQUILIBRATO',
      SLIGHT_UNDERKILL: 'UNDERKILL LEGGERO',
      UNDERKILL: 'UNDERKILL',
      UNDERKILL_SEVERE: 'UNDERKILL GRAVE',
    },
    defaultDescription: 'Il tuo stack è ben dimensionato?',
    description: 'La mia diagnosi: App {scoreApp} vs Infra {scoreInfra} (divario {gap}). Il tuo stack è ben dimensionato? Fai il test!',
    altText: 'Risultato StackOverkill:',
  },
  es: {
    labels: {
      OVERKILL_SEVERE: 'OVERKILL SEVERO',
      OVERKILL: 'OVERKILL',
      SLIGHT_OVERKILL: 'OVERKILL LEVE',
      BALANCED: 'EQUILIBRADO',
      SLIGHT_UNDERKILL: 'UNDERKILL LEVE',
      UNDERKILL: 'UNDERKILL',
      UNDERKILL_SEVERE: 'UNDERKILL SEVERO',
    },
    defaultDescription: '¿Tu stack está bien dimensionado?',
    description: 'Mi diagnóstico: App {scoreApp} vs Infra {scoreInfra} (diferencia {gap}). ¿Tu stack está bien dimensionado? ¡Haz el test!',
    altText: 'Resultado StackOverkill:',
  },
};

const VERDICTS = Object.keys(VERDICT_CONFIG) as VerdictType[];

interface DecodedParams {
  scoreApp: number;
  scoreInfra: number;
  verdict: VerdictType;
  phraseIndex: number;
  locale: SupportedLocale;
}

function decodeId(id: string): DecodedParams | null {
  const parts = id.split('-');
  if (parts.length < 3) return null;

  const scoreApp = parseInt(parts[0], 10);
  const scoreInfra = parseInt(parts[1], 10);
  const verdictIndex = parseInt(parts[2], 10);
  const phraseIndex = parts[3] ? parseInt(parts[3], 10) : 0;
  // Locale is optional (5th part) - defaults to 'fr' for backwards compatibility
  const locale = (parts[4] && ['fr', 'en', 'de', 'it', 'es'].includes(parts[4]))
    ? parts[4] as SupportedLocale
    : 'fr';

  if (isNaN(scoreApp) || isNaN(scoreInfra) || isNaN(verdictIndex)) return null;
  if (scoreApp < 0 || scoreApp > 100 || scoreInfra < 0 || scoreInfra > 100) return null;
  if (verdictIndex < 0 || verdictIndex >= VERDICTS.length) return null;

  return {
    scoreApp,
    scoreInfra,
    verdict: VERDICTS[verdictIndex],
    phraseIndex,
    locale,
  };
}

type Props = {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const decoded = decodeId(id);

  if (!decoded) {
    return {
      title: 'StackOverkill.io',
      description: METADATA_I18N.fr.defaultDescription,
    };
  }

  const { scoreApp, scoreInfra, verdict, locale } = decoded;
  const config = VERDICT_CONFIG[verdict];
  const i18n = METADATA_I18N[locale] || METADATA_I18N.fr;
  const label = i18n.labels[verdict];
  const gap = scoreInfra - scoreApp;
  const gapStr = gap > 0 ? `+${gap}` : String(gap);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://stackoverkill.io';

  const title = `${config.emoji} ${label} — StackOverkill`;
  const description = i18n.description
    .replace('{scoreApp}', String(scoreApp))
    .replace('{scoreInfra}', String(scoreInfra))
    .replace('{gap}', gapStr);
  // OG image is served via frontend proxy (no separate API domain needed)
  const ogImageUrl = `${baseUrl}/api/v1/og/image/${id}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${baseUrl}/r/${id}`,
      siteName: 'StackOverkill.io',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${i18n.altText} ${label}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default function ShareableLayout({ children }: { children: React.ReactNode }) {
  return children;
}
