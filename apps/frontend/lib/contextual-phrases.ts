import type { ApplicationInput, InfrastructureInput } from '@stackoverkill/shared';

interface Pattern {
  id: string;
  // Conditions sur les réponses (toutes doivent être vraies)
  conditions: {
    app?: Partial<Record<keyof ApplicationInput, (value: number) => boolean>>;
    infra?: Partial<Record<keyof InfrastructureInput, (value: number) => boolean>>;
  };
  // Phrases associées à ce pattern
  phrases: string[];
  // Type de verdict pour lequel ce pattern s'applique
  verdictType: 'overkill' | 'underkill' | 'any';
}

// Helpers pour les conditions
const isLow = (v: number) => v <= 2;
const isHigh = (v: number) => v >= 4;
const isVeryHigh = (v: number) => v >= 5;
const isMax = (v: number) => v >= 5;

const PATTERNS: Pattern[] = [
  // ===== OVERKILL PATTERNS =====

  // Side project + Kubernetes
  {
    id: 'side-project-k8s',
    conditions: {
      app: { criticality: isLow },
      infra: { sophistication: isVeryHigh },
    },
    phrases: [
      "Kubernetes pour un side project ? Tu as déployé la Death Star pour chauffer ton café. ☕",
      "Un cluster K8s pour si peu... Tu fais du CV-Driven Development non ?",
    ],
    verdictType: 'overkill',
  },

  // Peu d'utilisateurs + CI/CD complet
  {
    id: 'few-users-full-cicd',
    conditions: {
      app: { userCount: isLow },
      infra: { automation: isVeryHigh },
    },
    phrases: [
      "GitOps complet pour 10 utilisateurs ? Tes pipelines ont plus de lignes que ton app.",
      "CI/CD enterprise-grade pour si peu d'users... Tu automatises l'automatisation là.",
    ],
    verdictType: 'overkill',
  },

  // Aucun revenu + coût infra élevé
  {
    id: 'no-revenue-high-cost',
    conditions: {
      app: { financialImpact: isLow },
      infra: { cost: isHigh },
    },
    phrases: [
      "Ton infra coûte plus cher qu'elle ne rapporte. Le ROI est... créatif.",
      "0€ de revenu, des centaines d'€ d'infra. Tu sponsorises AWS ?",
    ],
    verdictType: 'overkill',
  },

  // Solo dev + multi-cloud
  {
    id: 'solo-multicloud',
    conditions: {
      infra: { teamCapacity: (v) => v === 1, sophistication: (v) => v === 6 },
    },
    phrases: [
      "Multi-cloud en solo ? Tu es soit un génie, soit un masochiste. Ou les deux.",
      "Service mesh pour une équipe de 1... Tu parles à toi-même en microservices ?",
    ],
    verdictType: 'overkill',
  },

  // App simple + monitoring complet
  {
    id: 'simple-app-full-monitoring',
    conditions: {
      app: { complexity: isLow },
      infra: { operationalMaturity: isMax },
    },
    phrases: [
      "Observabilité complète pour un CRUD ? Tu traces chaque pixel.",
      "Logs, metrics, traces pour une app simple... Tu surveilles un hamster avec un satellite.",
    ],
    verdictType: 'overkill',
  },

  // Pas de SLA + multi-région
  {
    id: 'no-sla-multi-region',
    conditions: {
      app: { availability: isLow },
      infra: { resilience: (v) => v === 6 },
    },
    phrases: [
      "Multi-région actif-actif sans SLA ? Tu assures 99.999% pour personne.",
      "Failover mondial pour du best-effort... La résilience pour la résilience.",
    ],
    verdictType: 'overkill',
  },

  // Données publiques + sécurité maximale
  {
    id: 'public-data-max-security',
    conditions: {
      app: { dataSensitivity: (v) => v === 1 },
      infra: { security: isHigh },
    },
    phrases: [
      "Zero Trust pour des données publiques ? Tu protèges l'open data avec un bunker.",
      "SIEM et pentests pour de l'open data... Fort Knox pour un livre de recettes.",
    ],
    verdictType: 'overkill',
  },

  // ===== UNDERKILL PATTERNS =====

  // App critique + aucun backup
  {
    id: 'critical-no-backup',
    conditions: {
      app: { criticality: isHigh },
      infra: { resilience: isLow },
    },
    phrases: [
      "App critique sans backup ? Tu joues à la roulette russe avec ta prod.",
      "Cœur de métier + aucune redondance = stress level over 9000.",
    ],
    verdictType: 'underkill',
  },

  // Revenus élevés + infra gratuite
  {
    id: 'high-revenue-free-infra',
    conditions: {
      app: { financialImpact: isHigh },
      infra: { cost: (v) => v === 1 },
    },
    phrases: [
      "Des milliers d'€/mois de revenus sur du matos gratos ? Tu vis dangereusement.",
      "L'app rapporte gros mais tourne sur un Raspberry Pi ?",
    ],
    verdictType: 'underkill',
  },

  // Beaucoup d'utilisateurs + serveur unique
  {
    id: 'many-users-single-server',
    conditions: {
      app: { userCount: isHigh },
      infra: { sophistication: (v) => v === 1 },
    },
    phrases: [
      "Des milliers d'utilisateurs sur un serveur unique ? Ça va chauffer.",
      "Ton serveur porte le poids du monde sur ses épaules. Il mérite une médaille.",
    ],
    verdictType: 'underkill',
  },

  // Données critiques + sécurité basique
  {
    id: 'sensitive-data-basic-security',
    conditions: {
      app: { dataSensitivity: isHigh },
      infra: { security: isLow },
    },
    phrases: [
      "Données RGPD/santé avec juste un firewall ? La CNIL va adorer.",
      "Données critiques + sécurité minimale = incident en attente.",
    ],
    verdictType: 'underkill',
  },

  // SLA élevé + tout manuel
  {
    id: 'high-sla-manual',
    conditions: {
      app: { availability: isHigh },
      infra: { automation: isLow },
    },
    phrases: [
      "99.9% de SLA en déployant à la main ? Tu ne dors jamais ?",
      "Disponibilité critique + déploiement manuel = burnout programmé.",
    ],
    verdictType: 'underkill',
  },

  // App complexe + mode YOLO
  {
    id: 'complex-app-yolo',
    conditions: {
      app: { complexity: isHigh },
      infra: { operationalMaturity: (v) => v === 1 },
    },
    phrases: [
      "Microservices + ML sans documentation ? Bon courage au prochain dev.",
      "App ultra-complexe en mode YOLO... Tu aimes vivre dangereusement.",
    ],
    verdictType: 'underkill',
  },

  // Public + aucune redondance
  {
    id: 'public-no-redundancy',
    conditions: {
      app: { exposure: isHigh },
      infra: { resilience: (v) => v === 1 },
    },
    phrases: [
      "Exposé au monde entier sans aucune redondance ? Premier DDoS = game over.",
      "App publique sur un single point of failure. Courageux.",
    ],
    verdictType: 'underkill',
  },
];

/**
 * Trouve la phrase contextuelle la plus pertinente basée sur les réponses
 */
export function getContextualPhrase(
  appAnswers: ApplicationInput,
  infraAnswers: InfrastructureInput,
  verdict: string
): string | null {
  const isOverkill = verdict.includes('OVERKILL');
  const isUnderkill = verdict.includes('UNDERKILL');

  // Filtrer les patterns qui correspondent au type de verdict
  const relevantPatterns = PATTERNS.filter(pattern => {
    if (pattern.verdictType === 'any') return true;
    if (pattern.verdictType === 'overkill' && isOverkill) return true;
    if (pattern.verdictType === 'underkill' && isUnderkill) return true;
    return false;
  });

  // Trouver les patterns qui matchent toutes leurs conditions
  const matchingPatterns = relevantPatterns.filter(pattern => {
    // Vérifier conditions app
    if (pattern.conditions.app) {
      for (const [key, condition] of Object.entries(pattern.conditions.app)) {
        const value = appAnswers[key as keyof ApplicationInput];
        if (value === undefined || !condition(value)) {
          return false;
        }
      }
    }

    // Vérifier conditions infra
    if (pattern.conditions.infra) {
      for (const [key, condition] of Object.entries(pattern.conditions.infra)) {
        const value = infraAnswers[key as keyof InfrastructureInput];
        if (value === undefined || !condition(value)) {
          return false;
        }
      }
    }

    return true;
  });

  if (matchingPatterns.length === 0) {
    return null; // Pas de pattern trouvé, on utilisera une phrase générique
  }

  // Prendre un pattern au hasard parmi ceux qui matchent
  const randomPattern = matchingPatterns[Math.floor(Math.random() * matchingPatterns.length)];

  // Prendre une phrase au hasard de ce pattern
  const randomPhrase = randomPattern.phrases[Math.floor(Math.random() * randomPattern.phrases.length)];

  return randomPhrase;
}
