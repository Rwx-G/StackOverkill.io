import type { VerdictType } from '../types/score-result';

/**
 * Verdict messages - multiple variations for each verdict
 * Tone: Fun, informal, tech-savvy
 */
const VERDICT_MESSAGES: Record<VerdictType, string[]> = {
  OVERKILL_SEVERE: [
    "Houston, on a un problème de budget... Ta stack pourrait faire tourner Netflix, mais t'as 3 utilisateurs. 🚨",
    "T'as construit un datacenter pour héberger un blog ? Respire, on va en parler. 💸",
    "Kubernetes pour un site vitrine ? C'est comme prendre un A380 pour aller chercher le pain. ✈️",
  ],
  OVERKILL: [
    "Tu as une Ferrari pour aller chercher le pain. Classe, mais peut-être un peu much ? 🏎️",
    "Ta stack est impressionnante ! Peut-être un peu trop pour tes besoins actuels. 💪",
    "On dirait que t'as prévu la scalabilité pour les 10 prochaines vies. Zen. 🧘",
  ],
  SLIGHT_OVERKILL: [
    "Un petit surplus de puissance, rien de dramatique. Tu aimes avoir de la marge ! 🤔",
    "Légèrement overengineered, mais au moins t'es tranquille pour la croissance. 📈",
    "C'est comme avoir une 4x4 en ville : pas indispensable, mais ça rassure. 🚙",
  ],
  BALANCED: [
    "Parfait équilibre ! Ta stack est pile poil adaptée à tes besoins. Bravo ! ✨",
    "The sweet spot! Ni trop, ni trop peu. Tu gères. 🎯",
    "Goldilocks approved: c'est juuuuste comme il faut. 🐻",
  ],
  SLIGHT_UNDERKILL: [
    "Ça passe... pour l'instant. Mais garde un œil sur la croissance ! 😅",
    "Tu tires un peu sur la corde, mais rien d'alarmant. Yet. ⚠️",
    "Mode survie activé. Ça tient, mais c'est sport. 🏃",
  ],
  UNDERKILL: [
    "On joue avec le feu là... Ton infra transpire un peu face à la charge. 😰",
    "C'est tendu ! Ton app mérite mieux que ça. Time to upgrade ? 🔥",
    "Warning: ton infra fait du best effort, mais elle fatigue. 💦",
  ],
  UNDERKILL_SEVERE: [
    "Miracle que ça tienne encore ! Sérieusement, c'est l'heure d'investir. 💀",
    "ALERTE ROUGE: ton infra est en PLS. Intervention urgente recommandée. 🚑",
    "Comment ça marche encore ?! Respect, mais là faut agir. 🆘",
  ],
};

/**
 * Get a random message for the given verdict
 */
export function getVerdictMessage(verdict: VerdictType, _gap?: number): string {
  const messages = VERDICT_MESSAGES[verdict];
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
}

/**
 * Get all messages for a verdict (useful for testing)
 */
export function getAllVerdictMessages(verdict: VerdictType): string[] {
  return VERDICT_MESSAGES[verdict];
}

/**
 * Get the emoji associated with a verdict
 */
export function getVerdictEmoji(verdict: VerdictType): string {
  const emojis: Record<VerdictType, string> = {
    OVERKILL_SEVERE: '🚨',
    OVERKILL: '🏎️',
    SLIGHT_OVERKILL: '🤔',
    BALANCED: '✨',
    SLIGHT_UNDERKILL: '😅',
    UNDERKILL: '😰',
    UNDERKILL_SEVERE: '💀',
  };
  return emojis[verdict];
}

/**
 * Get the color associated with a verdict (hex)
 */
export function getVerdictColor(verdict: VerdictType): string {
  const colors: Record<VerdictType, string> = {
    OVERKILL_SEVERE: '#EF4444', // Red
    OVERKILL: '#F97316',        // Orange
    SLIGHT_OVERKILL: '#EAB308', // Yellow
    BALANCED: '#22C55E',        // Green
    SLIGHT_UNDERKILL: '#EAB308', // Yellow
    UNDERKILL: '#F97316',       // Orange
    UNDERKILL_SEVERE: '#EF4444', // Red
  };
  return colors[verdict];
}

/**
 * Get a human-readable label for a verdict
 */
export function getVerdictLabel(verdict: VerdictType): string {
  const labels: Record<VerdictType, string> = {
    OVERKILL_SEVERE: 'OVERKILL SÉVÈRE',
    OVERKILL: 'OVERKILL',
    SLIGHT_OVERKILL: 'LÉGER OVERKILL',
    BALANCED: 'ÉQUILIBRÉ',
    SLIGHT_UNDERKILL: 'LÉGER UNDERKILL',
    UNDERKILL: 'UNDERKILL',
    UNDERKILL_SEVERE: 'UNDERKILL SÉVÈRE',
  };
  return labels[verdict];
}
