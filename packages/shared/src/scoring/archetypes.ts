import type { VerdictType } from '../types/score-result';

/**
 * Archetype assigned based on score patterns
 */
export interface Archetype {
  id: string;
  name: string;
  emoji: string;
  description: string;
}

/**
 * All available archetypes
 */
export const ARCHETYPES: Record<string, Archetype> = {
  CTO_PARANOIAQUE: {
    id: 'CTO_PARANOIAQUE',
    name: 'Le CTO Paranoïaque',
    emoji: '🛡️',
    description: 'Tu as prévu 3 plans de reprise pour ton blog perso',
  },
  ARCHITECTE_ASTRONAUTE: {
    id: 'ARCHITECTE_ASTRONAUTE',
    name: "L'Architecte Astronaute",
    emoji: '🚀',
    description: "Kubernetes pour 10 users, c'est de l'art",
  },
  PRUDENT_OPTIMISTE: {
    id: 'PRUDENT_OPTIMISTE',
    name: 'Le Prudent Optimiste',
    emoji: '🤔',
    description: "Un peu trop, mais au moins t'es préparé",
  },
  ZEN_MASTER: {
    id: 'ZEN_MASTER',
    name: 'Le Zen Master',
    emoji: '🧘',
    description: 'L\'équilibre parfait, Thanos serait fier',
  },
  MINIMALISTE_ASSUME: {
    id: 'MINIMALISTE_ASSUME',
    name: 'Le Minimaliste Assumé',
    emoji: '🎯',
    description: "Moins c'est plus, jusqu'à un certain point",
  },
  YOLO_ENGINEER: {
    id: 'YOLO_ENGINEER',
    name: 'Le YOLO Engineer',
    emoji: '🎲',
    description: '"Ça marche sur ma machine" est ton mantra',
  },
  POMPIER_PERMANENT: {
    id: 'POMPIER_PERMANENT',
    name: 'Le Pompier Permanent',
    emoji: '🔥',
    description: 'Tu vis dangereusement avec une app critique',
  },
  STARTUP_HERO: {
    id: 'STARTUP_HERO',
    name: 'Le Startup Hero',
    emoji: '💪',
    description: 'MVP mindset, on scale après (peut-être)',
  },
};

/**
 * Determine the archetype based on scores and verdict
 */
export function getArchetype(
  scoreApp: number,
  scoreInfra: number,
  verdict: VerdictType
): Archetype {
  const gap = scoreInfra - scoreApp;

  switch (verdict) {
    case 'OVERKILL_SEVERE':
      // High infra score = paranoid CTO, otherwise astronaut architect
      return scoreInfra > 80
        ? ARCHETYPES.CTO_PARANOIAQUE
        : ARCHETYPES.ARCHITECTE_ASTRONAUTE;

    case 'OVERKILL':
      return ARCHETYPES.ARCHITECTE_ASTRONAUTE;

    case 'SLIGHT_OVERKILL':
      return ARCHETYPES.PRUDENT_OPTIMISTE;

    case 'BALANCED':
      return ARCHETYPES.ZEN_MASTER;

    case 'SLIGHT_UNDERKILL':
      return ARCHETYPES.MINIMALISTE_ASSUME;

    case 'UNDERKILL':
      return ARCHETYPES.YOLO_ENGINEER;

    case 'UNDERKILL_SEVERE':
      // High app score (critical app) = firefighter, low app score = startup hero
      return scoreApp > 70
        ? ARCHETYPES.POMPIER_PERMANENT
        : ARCHETYPES.STARTUP_HERO;

    default:
      return ARCHETYPES.ZEN_MASTER;
  }
}
