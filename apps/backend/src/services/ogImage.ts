import satori from 'satori';
import sharp from 'sharp';
import { readFile, writeFile, access, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { constants } from 'fs';
import type { VerdictType } from '@stackoverkill/shared';

// Data directory for persistent storage (Docker volume)
const DATA_DIR = process.env.DATA_DIR || join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'data');
const OG_IMAGES_DIR = join(DATA_DIR, 'og-images');

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Emoji SVG file mapping (Twemoji codepoints)
const EMOJI_FILES: Record<string, string> = {
  '💀': '1f480.svg',
  '🔥': '1f525.svg',
  '⚡': '26a1.svg',
  '✅': '2705.svg',
  '🌧️': '1f327.svg',
  '❄️': '2744.svg',
  '🌊': '1f30a.svg',
};

// Emoji SVG cache (base64 data URIs)
const emojiCache: Record<string, string> = {};

async function loadEmojiSvg(emoji: string): Promise<string> {
  if (emojiCache[emoji]) return emojiCache[emoji];

  const filename = EMOJI_FILES[emoji];
  if (!filename) return '';

  try {
    const svgPath = join(__dirname, '..', '..', 'assets', 'emojis', filename);
    const svgContent = await readFile(svgPath, 'utf-8');
    const base64 = Buffer.from(svgContent).toString('base64');
    const dataUri = `data:image/svg+xml;base64,${base64}`;
    emojiCache[emoji] = dataUri;
    return dataUri;
  } catch (e) {
    console.error(`Could not load emoji SVG for ${emoji}:`, e);
    return '';
  }
}

// Verdict configuration matching the frontend
const VERDICT_CONFIG: Record<string, {
  emoji: string;
  label: string;
  bgColor: string;
  effect: string;
}> = {
  OVERKILL_SEVERE: {
    emoji: '💀',
    label: 'OVERKILL SÉVÈRE',
    bgColor: '#dc2626',
    effect: 'storm',
  },
  OVERKILL: {
    emoji: '🔥',
    label: 'OVERKILL',
    bgColor: '#f97316',
    effect: 'smoke',
  },
  SLIGHT_OVERKILL: {
    emoji: '⚡',
    label: 'OVERKILL LÉGER',
    bgColor: '#eab308',
    effect: 'spark',
  },
  BALANCED: {
    emoji: '✅',
    label: 'ÉQUILIBRÉ',
    bgColor: '#22c55e',
    effect: 'glow',
  },
  SLIGHT_UNDERKILL: {
    emoji: '🌧️',
    label: 'UNDERKILL LÉGER',
    bgColor: '#06b6d4',
    effect: 'rain',
  },
  UNDERKILL: {
    emoji: '❄️',
    label: 'UNDERKILL',
    bgColor: '#3b82f6',
    effect: 'frost',
  },
  UNDERKILL_SEVERE: {
    emoji: '🌊',
    label: 'UNDERKILL SÉVÈRE',
    bgColor: '#a855f7',
    effect: 'flood',
  },
};

// Phrases by verdict (matching frontend) - default French
const VERDICT_PHRASES: Record<string, string[]> = {
  OVERKILL_SEVERE: [
    "Tu as déployé la Death Star pour chauffer ton café.",
    "NASA t'a appelé, ils veulent récupérer leur infrastructure.",
    "Ton cluster Kubernetes pleure la nuit.",
  ],
  OVERKILL: [
    "C'est beau, mais t'en fais peut-être un peu trop.",
    "Ton infra pourrait gérer 10x ta charge. Ou 100x.",
    "Tu as prévu la montée en charge... de 2045.",
  ],
  SLIGHT_OVERKILL: [
    "Un poil trop, mais ça reste raisonnable.",
    "Tu anticipes bien, peut-être un peu trop.",
    "C'est le luxe d'avoir de la marge, non ?",
  ],
  BALANCED: [
    "Bravo ! Tu as trouvé le sweet spot parfait.",
    "L'équilibre parfait entre besoins et moyens.",
    "Ni trop, ni trop peu. Tu gères.",
  ],
  SLIGHT_UNDERKILL: [
    "Ça tient, mais un petit effort serait bienvenu.",
    "Tu pourrais automatiser 2-3 trucs quand même.",
    "Tu vis dangereusement, mais ça passe.",
  ],
  UNDERKILL: [
    "Houston, on a un problème d'infrastructure.",
    "Ton FTP vers prod mérite mieux que ça.",
    "Tu testes en prod, avoue.",
  ],
  UNDERKILL_SEVERE: [
    "Miracle que ça tienne encore !",
    "Tu déploies en FTP le vendredi soir, pas vrai ?",
    "Ton bus factor est à 0.5.",
  ],
};

// i18n translations for OG image generation
const OG_I18N: Record<SupportedLocale, {
  labels: Record<string, string>;
  phrases: Record<string, string[]>;
  gap: string;
  pts: string;
  takeTest: string;
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
    phrases: VERDICT_PHRASES,
    gap: 'Écart :',
    pts: 'pts',
    takeTest: 'Fais le test',
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
    phrases: {
      OVERKILL_SEVERE: [
        "You deployed the Death Star to heat your coffee.",
        "NASA called, they want their infrastructure back.",
        "Your Kubernetes cluster cries at night.",
      ],
      OVERKILL: [
        "It's beautiful, but you might be overdoing it.",
        "Your infra could handle 10x your load. Or 100x.",
        "You planned for the traffic surge... of 2045.",
      ],
      SLIGHT_OVERKILL: [
        "A bit too much, but still reasonable.",
        "You're forward-thinking, maybe a bit too much.",
        "Your stack is ready for... optimistic growth.",
      ],
      BALANCED: [
        "Well done! You found the perfect sweet spot.",
        "The perfect balance between needs and resources.",
        "Not too much, not too little. You've got this.",
      ],
      SLIGHT_UNDERKILL: [
        "It holds, but a little effort would be welcome.",
        "You could automate a few things, you know.",
        "Monitoring? That's for other people?",
      ],
      UNDERKILL: [
        "Houston, we have an infrastructure problem.",
        "Your FTP to prod deserves better than this.",
        "Backups are overrated anyway...",
      ],
      UNDERKILL_SEVERE: [
        "It's a miracle it still works!",
        "You deploy via FTP on Friday nights, don't you?",
        "Your bus factor is 0.5.",
      ],
    },
    gap: 'Gap:',
    pts: 'pts',
    takeTest: 'Take the test',
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
    phrases: {
      OVERKILL_SEVERE: [
        "Du hast den Todesstern deployed, um deinen Kaffee zu wärmen.",
        "Die NASA hat angerufen, sie wollen ihre Infrastruktur zurück.",
        "Dein Kubernetes-Cluster weint nachts.",
      ],
      OVERKILL: [
        "Es ist schön, aber du übertreibst vielleicht ein bisschen.",
        "Deine Infra könnte 10x deine Last bewältigen. Oder 100x.",
        "Du hast den Traffic-Anstieg... von 2045 eingeplant.",
      ],
      SLIGHT_OVERKILL: [
        "Ein bisschen zu viel, aber noch vernünftig.",
        "Du denkst voraus, vielleicht ein bisschen zu viel.",
        "Dein Stack ist bereit für... optimistisches Wachstum.",
      ],
      BALANCED: [
        "Gut gemacht! Du hast den Sweet Spot gefunden.",
        "Die perfekte Balance zwischen Bedarf und Ressourcen.",
        "Nicht zu viel, nicht zu wenig. Du hast es drauf.",
      ],
      SLIGHT_UNDERKILL: [
        "Es hält, aber ein bisschen Aufwand wäre willkommen.",
        "Du könntest ein paar Sachen automatisieren, weißt du.",
        "Monitoring? Das ist für andere Leute?",
      ],
      UNDERKILL: [
        "Houston, wir haben ein Infrastrukturproblem.",
        "Dein FTP zu Prod verdient Besseres.",
        "Backups sind eh überbewertet...",
      ],
      UNDERKILL_SEVERE: [
        "Es ist ein Wunder, dass es noch funktioniert!",
        "Du deployest per FTP am Freitagabend, oder?",
        "Dein Bus Factor ist 0,5.",
      ],
    },
    gap: 'Differenz:',
    pts: 'Pkt',
    takeTest: 'Mach den Test',
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
    phrases: {
      OVERKILL_SEVERE: [
        "Hai deployato la Morte Nera per scaldare il caffè.",
        "La NASA ha chiamato, rivuole la sua infrastruttura.",
        "Il tuo cluster Kubernetes piange di notte.",
      ],
      OVERKILL: [
        "È bello, ma forse stai esagerando un po'.",
        "La tua infra potrebbe gestire 10x il tuo carico. O 100x.",
        "Hai pianificato il picco di traffico... del 2045.",
      ],
      SLIGHT_OVERKILL: [
        "Un po' troppo, ma ancora ragionevole.",
        "Pensi in anticipo, forse un po' troppo.",
        "Il tuo stack è pronto per... una crescita ottimistica.",
      ],
      BALANCED: [
        "Bravo! Hai trovato il punto perfetto.",
        "L'equilibrio perfetto tra esigenze e risorse.",
        "Né troppo, né troppo poco. Ci sei.",
      ],
      SLIGHT_UNDERKILL: [
        "Tiene, ma un piccolo sforzo sarebbe benvenuto.",
        "Potresti automatizzare un paio di cose, sai.",
        "Monitoring? È per gli altri?",
      ],
      UNDERKILL: [
        "Houston, abbiamo un problema di infrastruttura.",
        "Il tuo FTP verso prod merita di meglio.",
        "I backup sono sopravvalutati comunque...",
      ],
      UNDERKILL_SEVERE: [
        "È un miracolo che funzioni ancora!",
        "Deployi via FTP il venerdì sera, vero?",
        "Il tuo bus factor è 0,5.",
      ],
    },
    gap: 'Divario:',
    pts: 'pti',
    takeTest: 'Fai il test',
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
    phrases: {
      OVERKILL_SEVERE: [
        "Desplegaste la Estrella de la Muerte para calentar tu café.",
        "La NASA llamó, quieren su infraestructura de vuelta.",
        "Tu cluster de Kubernetes llora por las noches.",
      ],
      OVERKILL: [
        "Es bonito, pero quizás te estás pasando un poco.",
        "Tu infra podría manejar 10x tu carga. O 100x.",
        "Planificaste para el pico de tráfico... de 2045.",
      ],
      SLIGHT_OVERKILL: [
        "Un poco demasiado, pero aún razonable.",
        "Piensas a futuro, quizás demasiado.",
        "Tu stack está listo para un crecimiento... optimista.",
      ],
      BALANCED: [
        "¡Bien hecho! Encontraste el punto perfecto.",
        "El equilibrio perfecto entre necesidades y recursos.",
        "Ni mucho, ni poco. Lo tienes controlado.",
      ],
      SLIGHT_UNDERKILL: [
        "Aguanta, pero un pequeño esfuerzo vendría bien.",
        "Podrías automatizar un par de cosas, ¿sabes?",
        "¿Monitoreo? ¿Eso es para otros?",
      ],
      UNDERKILL: [
        "Houston, tenemos un problema de infraestructura.",
        "Tu FTP a prod merece algo mejor.",
        "Los backups están sobrevalorados de todos modos...",
      ],
      UNDERKILL_SEVERE: [
        "¡Es un milagro que aún funcione!",
        "Despliegas por FTP los viernes por la noche, ¿verdad?",
        "Tu bus factor es 0,5.",
      ],
    },
    gap: 'Diferencia:',
    pts: 'pts',
    takeTest: 'Haz el test',
  },
};

// Font loading cache
let fontData: Buffer | null = null;

async function loadFont(): Promise<Buffer> {
  if (fontData && fontData.byteLength > 1000) return fontData;

  try {
    // Load font from local file (assets folder is at backend root, not src)
    // Using WOFF format (Satori doesn't support WOFF2 or variable fonts)
    const fontPath = join(__dirname, '..', '..', 'assets', 'fonts', 'Inter-Regular.woff');
    fontData = await readFile(fontPath);
    console.log(`Font loaded from local file: ${fontPath} (${fontData.byteLength} bytes)`);
    return fontData;
  } catch (e) {
    console.error('Could not load local font:', e);
    // Return empty buffer - Satori will fail but at least we know why
    return Buffer.alloc(0);
  }
}

export type SupportedLocale = 'fr' | 'en' | 'de' | 'it' | 'es';

export interface OgImageParams {
  scoreApp: number;
  scoreInfra: number;
  verdict: VerdictType;
  phraseIndex?: number;
  locale?: SupportedLocale;
}

// Helper type for Satori elements
type SatoriElement = {
  type: string;
  props: {
    style?: Record<string, unknown>;
    children?: string | SatoriElement | (string | SatoriElement)[];
    [key: string]: unknown;
  };
};

function el(
  type: string,
  style: Record<string, unknown>,
  children?: string | SatoriElement | (string | SatoriElement)[],
  extraProps?: Record<string, unknown>
): SatoriElement {
  return { type, props: { style, children, ...extraProps } };
}

// Helper to create an img element
function img(src: string, style: Record<string, unknown>): SatoriElement {
  return { type: 'img', props: { src, style } };
}

// Generate visual effects layer based on verdict
function generateEffectElements(effect: string): SatoriElement[] {
  const elements: SatoriElement[] = [];

  switch (effect) {
    case 'storm':
      // Red gradient overlay - intensified
      elements.push(el('div', {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(to bottom, rgba(127, 29, 29, 0.45) 0%, rgba(69, 10, 10, 0.6) 100%)',
      }));
      // Meteor streaks using SVG - 7 meteors with varied angles and thickness
      elements.push({
        type: 'svg',
        props: {
          viewBox: '0 0 1200 630',
          style: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' },
          children: [
            { type: 'defs', props: { children: [
              { type: 'linearGradient', props: { id: 'meteor', x1: '0%', y1: '0%', x2: '0%', y2: '100%', children: [
                { type: 'stop', props: { offset: '0%', stopColor: '#fbbf24', stopOpacity: '1' } },
                { type: 'stop', props: { offset: '20%', stopColor: '#fb923c', stopOpacity: '0.9' } },
                { type: 'stop', props: { offset: '50%', stopColor: '#f97316', stopOpacity: '0.6' } },
                { type: 'stop', props: { offset: '100%', stopColor: '#f97316', stopOpacity: '0' } },
              ]}},
              { type: 'linearGradient', props: { id: 'meteor2', x1: '0%', y1: '0%', x2: '0%', y2: '100%', children: [
                { type: 'stop', props: { offset: '0%', stopColor: '#fcd34d', stopOpacity: '1' } },
                { type: 'stop', props: { offset: '30%', stopColor: '#fb923c', stopOpacity: '0.7' } },
                { type: 'stop', props: { offset: '100%', stopColor: '#ea580c', stopOpacity: '0' } },
              ]}},
            ]}},
            // 7 meteors with varied angles (35-45°)
            { type: 'line', props: { x1: '100', y1: '10', x2: '165', y2: '160', stroke: 'url(#meteor)', strokeWidth: '5', strokeLinecap: 'round' } },
            { type: 'line', props: { x1: '280', y1: '40', x2: '335', y2: '170', stroke: 'url(#meteor2)', strokeWidth: '3', strokeLinecap: 'round' } },
            { type: 'line', props: { x1: '450', y1: '5', x2: '520', y2: '155', stroke: 'url(#meteor)', strokeWidth: '6', strokeLinecap: 'round' } },
            { type: 'line', props: { x1: '620', y1: '50', x2: '680', y2: '180', stroke: 'url(#meteor2)', strokeWidth: '4', strokeLinecap: 'round' } },
            { type: 'line', props: { x1: '800', y1: '15', x2: '870', y2: '165', stroke: 'url(#meteor)', strokeWidth: '5', strokeLinecap: 'round' } },
            { type: 'line', props: { x1: '950', y1: '35', x2: '1005', y2: '155', stroke: 'url(#meteor2)', strokeWidth: '3.5', strokeLinecap: 'round' } },
            { type: 'line', props: { x1: '1100', y1: '20', x2: '1155', y2: '150', stroke: 'url(#meteor)', strokeWidth: '4.5', strokeLinecap: 'round' } },
          ],
        },
      });
      // Impact circles at bottom (explosion effects)
      [
        { x: '15%', size: 35 }, { x: '40%', size: 45 }, { x: '65%', size: 40 }, { x: '88%', size: 30 },
      ].forEach((impact) => {
        elements.push(el('div', {
          position: 'absolute',
          bottom: '5px',
          left: impact.x,
          width: `${impact.size}px`,
          height: `${impact.size * 0.4}px`,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(251, 146, 60, 0.6) 0%, rgba(249, 115, 22, 0.3) 50%, transparent 70%)',
        }));
      });
      // Impact glow at bottom - intensified
      elements.push(el('div', {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '220px',
        background: 'radial-gradient(ellipse at 50% 100%, rgba(239, 68, 68, 0.45) 0%, rgba(220, 38, 38, 0.2) 40%, transparent 75%)',
      }));
      break;

    case 'smoke':
      // Orange gradient overlay - enhanced
      elements.push(el('div', {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(to top, rgba(154, 52, 18, 0.5) 0%, rgba(154, 52, 18, 0.15) 60%, transparent 100%)',
      }));
      // Background smoke clouds (smaller, further away)
      [
        { x: '10%', y: '55%', w: 100, h: 70, opacity: 0.15 },
        { x: '35%', y: '50%', w: 120, h: 80, opacity: 0.12 },
        { x: '60%', y: '52%', w: 110, h: 75, opacity: 0.18 },
        { x: '85%', y: '48%', w: 90, h: 60, opacity: 0.14 },
      ].forEach((cloud) => {
        elements.push(el('div', {
          position: 'absolute',
          left: cloud.x,
          bottom: cloud.y,
          width: `${cloud.w}px`,
          height: `${cloud.h}px`,
          borderRadius: '50%',
          background: `radial-gradient(ellipse, rgba(251, 146, 60, ${cloud.opacity}) 0%, rgba(234, 88, 12, ${cloud.opacity * 0.5}) 50%, transparent 70%)`,
        }));
      });
      // Foreground smoke clouds (larger, closer) - 7 clouds
      [
        { x: '0%', y: '70%', w: 200, h: 130, opacity: 0.35 },
        { x: '15%', y: '80%', w: 180, h: 120, opacity: 0.3 },
        { x: '30%', y: '75%', w: 160, h: 100, opacity: 0.28 },
        { x: '48%', y: '68%', w: 220, h: 140, opacity: 0.32 },
        { x: '65%', y: '78%', w: 170, h: 110, opacity: 0.25 },
        { x: '78%', y: '72%', w: 190, h: 125, opacity: 0.3 },
        { x: '90%', y: '76%', w: 150, h: 95, opacity: 0.22 },
      ].forEach((cloud) => {
        elements.push(el('div', {
          position: 'absolute',
          left: cloud.x,
          bottom: cloud.y,
          width: `${cloud.w}px`,
          height: `${cloud.h}px`,
          borderRadius: '50%',
          background: `radial-gradient(ellipse, rgba(251, 146, 60, ${cloud.opacity}) 0%, rgba(234, 88, 12, ${cloud.opacity * 0.5}) 50%, transparent 70%)`,
        }));
      });
      // Glow at bottom - intensified
      elements.push(el('div', {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '180px',
        background: 'radial-gradient(ellipse at 50% 100%, rgba(249, 115, 22, 0.45) 0%, rgba(234, 88, 12, 0.2) 50%, transparent 75%)',
      }));
      break;

    case 'spark':
      // Yellow gradient overlay with central glow
      elements.push(el('div', {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(to bottom, rgba(234, 179, 8, 0.12) 0%, rgba(161, 98, 7, 0.18) 100%)',
      }));
      // Central flash/glow
      elements.push(el('div', {
        position: 'absolute',
        top: '20%',
        left: '30%',
        right: '30%',
        height: '40%',
        background: 'radial-gradient(ellipse at 50% 50%, rgba(250, 204, 21, 0.15) 0%, transparent 70%)',
      }));
      // Lightning bolts with branches using SVG
      elements.push({
        type: 'svg',
        props: {
          viewBox: '0 0 1200 630',
          style: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' },
          children: [
            // Main bolt 1 + branches
            { type: 'path', props: { d: 'M200 25 L176 180 L220 190 L140 340', stroke: '#facc15', strokeWidth: '3.5', fill: 'none', opacity: '0.6' } },
            { type: 'path', props: { d: 'M176 180 L130 220 L115 280', stroke: '#facc15', strokeWidth: '2', fill: 'none', opacity: '0.4' } },
            { type: 'path', props: { d: 'M220 190 L270 230 L255 290', stroke: '#fde047', strokeWidth: '1.5', fill: 'none', opacity: '0.35' } },

            // Main bolt 2 + branches
            { type: 'path', props: { d: 'M480 40 L430 200 L490 215 L400 370', stroke: '#fde047', strokeWidth: '3', fill: 'none', opacity: '0.5' } },
            { type: 'path', props: { d: 'M430 200 L380 250 L390 310', stroke: '#facc15', strokeWidth: '1.8', fill: 'none', opacity: '0.35' } },
            { type: 'path', props: { d: 'M490 215 L530 260 L510 320', stroke: '#fde047', strokeWidth: '1.5', fill: 'none', opacity: '0.3' } },

            // Main bolt 3 + branches
            { type: 'path', props: { d: 'M780 15 L730 170 L790 185 L700 340', stroke: '#facc15', strokeWidth: '4', fill: 'none', opacity: '0.55' } },
            { type: 'path', props: { d: 'M730 170 L680 220 L695 285', stroke: '#fde047', strokeWidth: '2', fill: 'none', opacity: '0.4' } },
            { type: 'path', props: { d: 'M790 185 L840 235 L820 300', stroke: '#facc15', strokeWidth: '1.8', fill: 'none', opacity: '0.35' } },

            // Main bolt 4 + branches
            { type: 'path', props: { d: 'M1040 50 L980 220 L1050 235 L960 400', stroke: '#fde047', strokeWidth: '3', fill: 'none', opacity: '0.5' } },
            { type: 'path', props: { d: 'M980 220 L920 275 L940 340', stroke: '#facc15', strokeWidth: '1.8', fill: 'none', opacity: '0.35' } },
            { type: 'path', props: { d: 'M1050 235 L1100 285 L1080 350', stroke: '#fde047', strokeWidth: '1.5', fill: 'none', opacity: '0.3' } },
          ],
        },
      });
      break;

    case 'glow':
      // Enhanced green glow background
      elements.push(el('div', {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(ellipse at 50% 50%, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0.08) 40%, transparent 70%)',
      }));
      // Checkmark SVG
      elements.push({
        type: 'svg',
        props: {
          viewBox: '0 0 100 100',
          style: {
            position: 'absolute',
            top: '50%',
            left: '70%',
            width: '80px',
            height: '80px',
            transform: 'translate(-50%, -50%)',
          },
          children: [
            // Circle background
            { type: 'circle', props: { cx: '50', cy: '50', r: '45', fill: 'none', stroke: 'rgba(34, 197, 94, 0.35)', strokeWidth: '4' } },
            // Checkmark
            { type: 'path', props: { d: 'M28 52 L42 66 L72 36', fill: 'none', stroke: '#22c55e', strokeWidth: '6', strokeLinecap: 'round', strokeLinejoin: 'round' } },
          ],
        },
      });
      // Impact particles around checkmark
      [
        { x: '73%', y: '42%', size: 6 },
        { x: '67%', y: '42%', size: 5 },
        { x: '75%', y: '50%', size: 7 },
        { x: '65%', y: '50%', size: 5 },
        { x: '72%', y: '58%', size: 6 },
        { x: '68%', y: '58%', size: 5 },
        { x: '70%', y: '40%', size: 4 },
        { x: '70%', y: '60%', size: 4 },
      ].forEach((particle) => {
        elements.push(el('div', {
          position: 'absolute',
          top: particle.y,
          left: particle.x,
          width: `${particle.size}px`,
          height: `${particle.size}px`,
          borderRadius: '50%',
          background: '#22c55e',
        }));
      });
      break;

    case 'rain':
      // Cyan gradient overlay - enhanced
      elements.push(el('div', {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(to bottom, rgba(8, 145, 178, 0.18) 0%, rgba(14, 116, 144, 0.3) 100%)',
      }));
      // Rain drops using SVG - 18 drops with varied lengths
      elements.push({
        type: 'svg',
        props: {
          viewBox: '0 0 1200 630',
          style: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' },
          children: [
            { type: 'defs', props: { children: [
              { type: 'linearGradient', props: { id: 'rain', x1: '0%', y1: '0%', x2: '0%', y2: '100%', children: [
                { type: 'stop', props: { offset: '0%', stopColor: '#67e8f9', stopOpacity: '0.9' } },
                { type: 'stop', props: { offset: '40%', stopColor: '#22d3ee', stopOpacity: '0.5' } },
                { type: 'stop', props: { offset: '100%', stopColor: '#22d3ee', stopOpacity: '0' } },
              ]}},
              { type: 'linearGradient', props: { id: 'rain2', x1: '0%', y1: '0%', x2: '0%', y2: '100%', children: [
                { type: 'stop', props: { offset: '0%', stopColor: '#a5f3fc', stopOpacity: '0.8' } },
                { type: 'stop', props: { offset: '50%', stopColor: '#67e8f9', stopOpacity: '0.4' } },
                { type: 'stop', props: { offset: '100%', stopColor: '#22d3ee', stopOpacity: '0' } },
              ]}},
            ]}},
            // 18 rain drops with varied lengths
            ...[
              { x: 65, y: 20, len: 70 }, { x: 130, y: 100, len: 55 }, { x: 200, y: 40, len: 80 },
              { x: 280, y: 150, len: 50 }, { x: 350, y: 70, len: 65 }, { x: 420, y: 180, len: 45 },
              { x: 500, y: 30, len: 75 }, { x: 570, y: 120, len: 60 }, { x: 640, y: 200, len: 40 },
              { x: 720, y: 50, len: 70 }, { x: 790, y: 160, len: 55 }, { x: 860, y: 90, len: 65 },
              { x: 930, y: 220, len: 45 }, { x: 1000, y: 60, len: 75 }, { x: 1070, y: 140, len: 50 },
              { x: 1130, y: 80, len: 60 }, { x: 170, y: 250, len: 35 }, { x: 750, y: 280, len: 40 },
            ].map((drop, i) => ({
              type: 'line',
              props: { x1: String(drop.x), y1: String(drop.y), x2: String(drop.x), y2: String(drop.y + drop.len), stroke: i % 2 === 0 ? 'url(#rain)' : 'url(#rain2)', strokeWidth: i % 3 === 0 ? '2.5' : '2', strokeLinecap: 'round' },
            })),
          ],
        },
      });
      // Ripple circles at bottom
      [
        { x: '15%', y: 10 }, { x: '35%', y: 5 }, { x: '55%', y: 12 }, { x: '75%', y: 8 }, { x: '90%', y: 6 },
      ].forEach((ripple) => {
        elements.push(el('div', {
          position: 'absolute',
          bottom: `${ripple.y}px`,
          left: ripple.x,
          width: '30px',
          height: '10px',
          borderRadius: '50%',
          border: '1.5px solid rgba(103, 232, 249, 0.4)',
        }));
      });
      // Cyan glow - enhanced
      elements.push(el('div', {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(ellipse at 50% 30%, rgba(34, 211, 238, 0.18) 0%, transparent 65%)',
      }));
      break;

    case 'frost':
      // Blue gradient overlay - enhanced
      elements.push(el('div', {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(to bottom, rgba(59, 130, 246, 0.18) 0%, rgba(30, 64, 175, 0.25) 100%)',
      }));
      // Snowflakes - 18 flakes with mixed shapes (circles and 6-point stars)
      [
        // Regular circular snowflakes
        { x: '5%', y: '10%', size: 12, star: false }, { x: '15%', y: '30%', size: 9, star: false },
        { x: '25%', y: '55%', size: 14, star: false }, { x: '35%', y: '18%', size: 10, star: false },
        { x: '48%', y: '42%', size: 13, star: false }, { x: '58%', y: '8%', size: 8, star: false },
        { x: '68%', y: '62%', size: 11, star: false }, { x: '78%', y: '25%', size: 10, star: false },
        { x: '88%', y: '48%', size: 7, star: false }, { x: '95%', y: '15%', size: 9, star: false },
      ].forEach((flake) => {
        elements.push(el('div', {
          position: 'absolute',
          left: flake.x,
          top: flake.y,
          width: `${flake.size}px`,
          height: `${flake.size}px`,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.95), rgba(191, 219, 254, 0.7))',
        }));
      });
      // 6-pointed star snowflakes using SVG
      elements.push({
        type: 'svg',
        props: {
          viewBox: '0 0 1200 630',
          style: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' },
          children: [
            // Star at 12%, 45%
            { type: 'g', props: { transform: 'translate(144, 284)', children: [
              { type: 'line', props: { x1: '0', y1: '-10', x2: '0', y2: '10', stroke: 'rgba(255,255,255,0.9)', strokeWidth: '2' } },
              { type: 'line', props: { x1: '-8.7', y1: '-5', x2: '8.7', y2: '5', stroke: 'rgba(255,255,255,0.9)', strokeWidth: '2' } },
              { type: 'line', props: { x1: '-8.7', y1: '5', x2: '8.7', y2: '-5', stroke: 'rgba(255,255,255,0.9)', strokeWidth: '2' } },
            ]}},
            // Star at 42%, 68%
            { type: 'g', props: { transform: 'translate(504, 428)', children: [
              { type: 'line', props: { x1: '0', y1: '-12', x2: '0', y2: '12', stroke: 'rgba(255,255,255,0.85)', strokeWidth: '2' } },
              { type: 'line', props: { x1: '-10.4', y1: '-6', x2: '10.4', y2: '6', stroke: 'rgba(255,255,255,0.85)', strokeWidth: '2' } },
              { type: 'line', props: { x1: '-10.4', y1: '6', x2: '10.4', y2: '-6', stroke: 'rgba(255,255,255,0.85)', strokeWidth: '2' } },
            ]}},
            // Star at 72%, 38%
            { type: 'g', props: { transform: 'translate(864, 239)', children: [
              { type: 'line', props: { x1: '0', y1: '-11', x2: '0', y2: '11', stroke: 'rgba(255,255,255,0.88)', strokeWidth: '2' } },
              { type: 'line', props: { x1: '-9.5', y1: '-5.5', x2: '9.5', y2: '5.5', stroke: 'rgba(255,255,255,0.88)', strokeWidth: '2' } },
              { type: 'line', props: { x1: '-9.5', y1: '5.5', x2: '9.5', y2: '-5.5', stroke: 'rgba(255,255,255,0.88)', strokeWidth: '2' } },
            ]}},
            // Star at 92%, 58%
            { type: 'g', props: { transform: 'translate(1104, 365)', children: [
              { type: 'line', props: { x1: '0', y1: '-9', x2: '0', y2: '9', stroke: 'rgba(255,255,255,0.82)', strokeWidth: '1.5' } },
              { type: 'line', props: { x1: '-7.8', y1: '-4.5', x2: '7.8', y2: '4.5', stroke: 'rgba(255,255,255,0.82)', strokeWidth: '1.5' } },
              { type: 'line', props: { x1: '-7.8', y1: '4.5', x2: '7.8', y2: '-4.5', stroke: 'rgba(255,255,255,0.82)', strokeWidth: '1.5' } },
            ]}},
            // Additional star snowflakes
            { type: 'g', props: { transform: 'translate(300, 150)', children: [
              { type: 'line', props: { x1: '0', y1: '-8', x2: '0', y2: '8', stroke: 'rgba(255,255,255,0.8)', strokeWidth: '1.5' } },
              { type: 'line', props: { x1: '-6.9', y1: '-4', x2: '6.9', y2: '4', stroke: 'rgba(255,255,255,0.8)', strokeWidth: '1.5' } },
              { type: 'line', props: { x1: '-6.9', y1: '4', x2: '6.9', y2: '-4', stroke: 'rgba(255,255,255,0.8)', strokeWidth: '1.5' } },
            ]}},
            { type: 'g', props: { transform: 'translate(620, 520)', children: [
              { type: 'line', props: { x1: '0', y1: '-10', x2: '0', y2: '10', stroke: 'rgba(255,255,255,0.85)', strokeWidth: '2' } },
              { type: 'line', props: { x1: '-8.7', y1: '-5', x2: '8.7', y2: '5', stroke: 'rgba(255,255,255,0.85)', strokeWidth: '2' } },
              { type: 'line', props: { x1: '-8.7', y1: '5', x2: '8.7', y2: '-5', stroke: 'rgba(255,255,255,0.85)', strokeWidth: '2' } },
            ]}},
            { type: 'g', props: { transform: 'translate(950, 100)', children: [
              { type: 'line', props: { x1: '0', y1: '-7', x2: '0', y2: '7', stroke: 'rgba(255,255,255,0.75)', strokeWidth: '1.5' } },
              { type: 'line', props: { x1: '-6.1', y1: '-3.5', x2: '6.1', y2: '3.5', stroke: 'rgba(255,255,255,0.75)', strokeWidth: '1.5' } },
              { type: 'line', props: { x1: '-6.1', y1: '3.5', x2: '6.1', y2: '-3.5', stroke: 'rgba(255,255,255,0.75)', strokeWidth: '1.5' } },
            ]}},
            { type: 'g', props: { transform: 'translate(80, 500)', children: [
              { type: 'line', props: { x1: '0', y1: '-9', x2: '0', y2: '9', stroke: 'rgba(255,255,255,0.8)', strokeWidth: '1.5' } },
              { type: 'line', props: { x1: '-7.8', y1: '-4.5', x2: '7.8', y2: '4.5', stroke: 'rgba(255,255,255,0.8)', strokeWidth: '1.5' } },
              { type: 'line', props: { x1: '-7.8', y1: '4.5', x2: '7.8', y2: '-4.5', stroke: 'rgba(255,255,255,0.8)', strokeWidth: '1.5' } },
            ]}},
          ],
        },
      });
      // Ice crystals at edges
      [
        { x: '0%', y: '30%', size: 20 }, { x: '0%', y: '60%', size: 15 },
        { x: '97%', y: '25%', size: 18 }, { x: '97%', y: '55%', size: 16 },
      ].forEach((crystal) => {
        elements.push(el('div', {
          position: 'absolute',
          left: crystal.x,
          top: crystal.y,
          width: `${crystal.size}px`,
          height: `${crystal.size * 0.6}px`,
          background: 'linear-gradient(135deg, rgba(191, 219, 254, 0.4) 0%, rgba(147, 197, 253, 0.2) 100%)',
          borderRadius: '2px',
        }));
      });
      // Icy glow - enhanced
      elements.push(el('div', {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(ellipse at 50% 50%, rgba(147, 197, 253, 0.25) 0%, transparent 65%)',
      }));
      break;

    case 'flood':
      // Water gradient at bottom - enhanced depth
      elements.push(el('div', {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '260px',
        background: 'linear-gradient(to bottom, rgba(147, 51, 234, 0.22) 0%, rgba(88, 28, 135, 0.45) 40%, rgba(59, 7, 100, 0.55) 100%)',
      }));
      // Wave SVG - 4 waves with varied opacity
      elements.push({
        type: 'svg',
        props: {
          viewBox: '0 0 1200 40',
          style: { position: 'absolute', top: '370px', left: 0, width: '100%', height: '40px' },
          children: [
            // Most subtle wave (furthest)
            { type: 'path', props: { d: 'M0 8 Q 60 3, 120 8 T 240 8 T 360 8 T 480 8 T 600 8 T 720 8 T 840 8 T 960 8 T 1080 8 T 1200 8', stroke: 'rgba(216, 180, 254, 0.25)', strokeWidth: '1.5', fill: 'none' } },
            // Wave 1
            { type: 'path', props: { d: 'M0 15 Q 75 7, 150 15 T 300 15 T 450 15 T 600 15 T 750 15 T 900 15 T 1050 15 T 1200 15', stroke: 'rgba(192, 132, 252, 0.55)', strokeWidth: '2.5', fill: 'none' } },
            // Wave 2
            { type: 'path', props: { d: 'M0 22 Q 90 14, 180 22 T 360 22 T 540 22 T 720 22 T 900 22 T 1080 22 T 1200 22', stroke: 'rgba(168, 85, 247, 0.45)', strokeWidth: '2', fill: 'none' } },
            // Wave 3 (closest)
            { type: 'path', props: { d: 'M0 30 Q 120 22, 240 30 T 480 30 T 720 30 T 960 30 T 1200 30', stroke: 'rgba(139, 92, 246, 0.35)', strokeWidth: '1.8', fill: 'none' } },
          ],
        },
      });
      // Bubbles - 12 bubbles in 4 source groups
      [
        // Source 1 (left)
        { x: '12%', y: '28%', size: 12 }, { x: '15%', y: '20%', size: 15 }, { x: '10%', y: '14%', size: 10 },
        // Source 2 (center-left)
        { x: '35%', y: '25%', size: 14 }, { x: '38%', y: '18%', size: 11 }, { x: '33%', y: '12%', size: 13 },
        // Source 3 (center-right)
        { x: '60%', y: '26%', size: 13 }, { x: '63%', y: '19%', size: 16 }, { x: '58%', y: '11%', size: 10 },
        // Source 4 (right)
        { x: '85%', y: '24%', size: 15 }, { x: '88%', y: '17%', size: 12 }, { x: '83%', y: '10%', size: 11 },
      ].forEach((bubble) => {
        elements.push(el('div', {
          position: 'absolute',
          left: bubble.x,
          bottom: bubble.y,
          width: `${bubble.size}px`,
          height: `${bubble.size}px`,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 30% 30%, rgba(216, 180, 254, 0.75), rgba(147, 51, 234, 0.35))',
        }));
      });
      // Purple glow at bottom - enhanced
      elements.push(el('div', {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '180px',
        background: 'radial-gradient(ellipse at 50% 100%, rgba(147, 51, 234, 0.4) 0%, rgba(88, 28, 135, 0.2) 50%, transparent 75%)',
      }));
      break;
  }

  return elements;
}

export async function generateOgImage(params: OgImageParams): Promise<Buffer> {
  const { scoreApp, scoreInfra, verdict, phraseIndex = 0, locale = 'fr' } = params;

  const config = VERDICT_CONFIG[verdict] || VERDICT_CONFIG.BALANCED;
  const i18n = OG_I18N[locale] || OG_I18N.fr;
  const label = i18n.labels[verdict] || config.label;
  const phrases = i18n.phrases[verdict] || VERDICT_PHRASES.BALANCED;
  const phrase = phrases[phraseIndex % phrases.length];
  const gap = scoreInfra - scoreApp;
  const gapText = `${i18n.gap} ${gap > 0 ? '+' : ''}${gap} ${i18n.pts}`;

  const font = await loadFont();

  // Load emoji SVGs
  const emojiSvg = await loadEmojiSvg(config.emoji);
  const lightningEmojiSvg = await loadEmojiSvg('⚡');

  // Generate effect elements for this verdict
  const effectElements = generateEffectElements(config.effect);

  // Build the template using helper function
  const template = el('div', {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
    fontFamily: 'Inter',
    position: 'relative',
    overflow: 'hidden',
  }, [
    // Effect layer (absolute positioned behind content)
    ...effectElements,

    // Content wrapper with padding
    el('div', {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: '100%',
      padding: '40px',
      position: 'relative',
    }, [
    // Header
    el('div', {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '20px',
    }, [
      el('div', {
        width: '32px',
        height: '32px',
        background: '#f97316',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: '12px',
      }, [
        img(lightningEmojiSvg, { width: '20px', height: '20px' }),
      ]),
      el('span', {
        color: 'rgba(255,255,255,0.8)',
        fontSize: '24px',
        fontWeight: 700,
      }, 'StackOverkill.io'),
    ]),

    // Main content
    el('div', {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }, [
      // Emoji
      el('div', { display: 'flex', marginBottom: '16px' }, [
        img(emojiSvg, { width: '72px', height: '72px' }),
      ]),

      // Verdict badge
      el('div', {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px 48px',
        background: config.bgColor,
        borderRadius: '16px',
        fontSize: '36px',
        fontWeight: 800,
        color: 'white',
        marginBottom: '20px',
      }, label),

      // Phrase
      el('div', {
        color: '#cbd5e1',
        fontSize: '22px',
        textAlign: 'center',
        maxWidth: '900px',
        marginBottom: '32px',
      }, phrase),

      // Scores row
      el('div', {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }, [
        // App score
        el('div', {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginRight: '50px',
        }, [
          el('div', { color: '#94a3b8', fontSize: '16px', marginBottom: '8px' }, 'APP'),
          el('div', { color: '#818cf8', fontSize: '56px', fontWeight: 700 }, String(scoreApp)),
        ]),

        // VS
        el('div', {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginRight: '50px',
        }, [
          el('div', { color: '#64748b', fontSize: '16px', marginBottom: '8px' }, 'VS'),
          el('div', { display: 'flex' }, [
            img(lightningEmojiSvg, { width: '28px', height: '28px' }),
          ]),
        ]),

        // Infra score
        el('div', {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }, [
          el('div', { color: '#94a3b8', fontSize: '16px', marginBottom: '8px' }, 'INFRA'),
          el('div', { color: '#f97316', fontSize: '56px', fontWeight: 700 }, String(scoreInfra)),
        ]),
      ]),

      // Gap
      el('div', {
        color: '#64748b',
        fontSize: '18px',
        marginTop: '16px',
      }, gapText),
    ]),

    // Footer
    el('div', {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      color: '#475569',
      fontSize: '18px',
    }, [
      el('span', {}, i18n.takeTest),
      el('span', { display: 'flex', marginLeft: '6px', marginRight: '6px' }, [
        img(lightningEmojiSvg, { width: '16px', height: '16px' }),
      ]),
      el('span', {}, 'stackoverkill.io'),
    ]),
    ]), // Close content wrapper
  ]);

  // Generate SVG with Satori
  const svg = await satori(template as React.ReactNode, {
    width: 1200,
    height: 630,
    fonts: font.byteLength > 0 ? [
      {
        name: 'Inter',
        data: font,
        weight: 400,
        style: 'normal' as const,
      },
      {
        name: 'Inter',
        data: font,
        weight: 700,
        style: 'normal' as const,
      },
    ] : [],
  });

  // Convert SVG to PNG using Sharp
  const pngBuffer = await sharp(Buffer.from(svg))
    .png()
    .toBuffer();

  return pngBuffer;
}

// Helper to encode params to URL-friendly string
export function encodeOgParams(params: OgImageParams): string {
  const verdictIndex = Object.keys(VERDICT_CONFIG).indexOf(params.verdict);
  return `${params.scoreApp}-${params.scoreInfra}-${verdictIndex}-${params.phraseIndex || 0}`;
}

// Helper to decode params from URL string
export function decodeOgParams(encoded: string): OgImageParams | null {
  const parts = encoded.split('-');
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

  const verdicts = Object.keys(VERDICT_CONFIG);
  if (verdictIndex < 0 || verdictIndex >= verdicts.length) return null;

  return {
    scoreApp,
    scoreInfra,
    verdict: verdicts[verdictIndex] as VerdictType,
    phraseIndex,
    locale,
  };
}

// Get phrase by verdict and index (for frontend)
export function getPhrase(verdict: VerdictType, index: number): string {
  const phrases = VERDICT_PHRASES[verdict] || VERDICT_PHRASES.BALANCED;
  return phrases[index % phrases.length];
}

// ============================================================
// PERSISTENT OG IMAGE STORAGE
// ============================================================

// Ensure the OG images directory exists
async function ensureOgImagesDir(): Promise<void> {
  try {
    await access(OG_IMAGES_DIR, constants.F_OK);
  } catch {
    await mkdir(OG_IMAGES_DIR, { recursive: true });
    console.log(`Created OG images directory: ${OG_IMAGES_DIR}`);
  }
}

// Get the file path for a given OG image ID
function getOgImagePath(id: string): string {
  // Sanitize ID to prevent path traversal
  const safeId = id.replace(/[^a-zA-Z0-9-]/g, '');
  return join(OG_IMAGES_DIR, `${safeId}.png`);
}

// Check if a stored OG image exists
export async function hasStoredOgImage(id: string): Promise<boolean> {
  try {
    const filePath = getOgImagePath(id);
    await access(filePath, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

// Get a stored OG image
export async function getStoredOgImage(id: string): Promise<Buffer | null> {
  try {
    const filePath = getOgImagePath(id);
    return await readFile(filePath);
  } catch {
    return null;
  }
}

// Store an OG image (uploaded from client)
export async function storeOgImage(id: string, imageBuffer: Buffer): Promise<boolean> {
  try {
    await ensureOgImagesDir();
    const filePath = getOgImagePath(id);

    // Only store if not already exists (first upload wins)
    const exists = await hasStoredOgImage(id);
    if (exists) {
      console.log(`OG image already exists for ID: ${id}`);
      return true;
    }

    await writeFile(filePath, imageBuffer);
    console.log(`Stored OG image for ID: ${id}`);
    return true;
  } catch (error) {
    console.error(`Failed to store OG image for ID ${id}:`, error);
    return false;
  }
}

