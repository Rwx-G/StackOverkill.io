import type { VerdictType } from '../types/score-result';

/**
 * Verdict text with normal and roast variants
 */
export interface VerdictText {
  normal: string;
  roast: string[];
}

/**
 * All verdict texts - normal and roast variants
 */
export const VERDICT_TEXTS: Record<VerdictType, VerdictText> = {
  OVERKILL_SEVERE: {
    normal: 'Ton infrastructure est démesurée par rapport à tes besoins',
    roast: [
      "T'as cramé le budget annuel d'une startup pour héberger 3 pages HTML",
      "Ton infra coûte plus cher que le salaire de ton équipe. Pour 47 visiteurs/mois.",
      "Ta facture cloud a plus de chiffres que ton nombre de visiteurs.",
    ],
  },
  OVERKILL: {
    normal: 'Tu as un peu surdimensionné ton infrastructure',
    roast: [
      "Ta facture cloud pourrait payer un dev senior. Tu héberges un blog.",
      "Tu fais du multi-région pour une app que même ta mère n'utilise pas.",
      "Ton Terraform est plus complexe que l'app qu'il déploie.",
    ],
  },
  SLIGHT_OVERKILL: {
    normal: 'Légèrement au-dessus des besoins',
    roast: [
      "T'as pris un tank pour aller chercher le pain. Mais au moins t'as le pain.",
      "Légèrement parano, mais genre... légèrement beaucoup.",
      "Tu scales pour le Black Friday. T'as 12 users. Tous dans ta boîte.",
    ],
  },
  BALANCED: {
    normal: 'Parfaitement équilibré, comme toute chose devrait l\'être',
    roast: [
      "Bravo, t'es mass médiocre. Ni trop, ni pas assez. Ennuyeux.",
      "Wow, quelqu'un de normal. Ça existe encore ?",
      "T'as lu la doc avant de choisir ta stack. T'es une licorne.",
    ],
  },
  SLIGHT_UNDERKILL: {
    normal: 'Un peu sous-dimensionné',
    roast: [
      "Ça tient. Pour l'instant. Croise les doigts.",
      "T'es à un pic de trafic de mass sueur froide.",
      "Ton infra fait du mieux qu'elle peut, la pauvre. Comme ton stagiaire.",
    ],
  },
  UNDERKILL: {
    normal: 'Infrastructure insuffisante pour les besoins',
    roast: [
      "Ton serveur fait des heures sup non payées. Syndique-le.",
      "Tu fais du load balancing avec F5 et de l'espoir.",
      "\"Ça marche sur ma machine\" - ta seule doc de prod.",
    ],
  },
  UNDERKILL_SEVERE: {
    normal: 'Infrastructure critique en danger',
    roast: [
      "Ton serveur tient avec du scotch, mass prières et du déni.",
      "Ta stack est mass vibes et zéro budget. Good luck.",
      "Ton PRA c'est mass ctrl+z et des larmes.",
    ],
  },
};

/**
 * Get verdict text based on mode
 */
export function getVerdictText(verdict: VerdictType, isRoast: boolean): string {
  const texts = VERDICT_TEXTS[verdict];
  if (!isRoast) return texts.normal;

  // Random selection from roast options
  const randomIndex = Math.floor(Math.random() * texts.roast.length);
  return texts.roast[randomIndex];
}
