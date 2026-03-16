export interface QuestionOption {
  value: number;
  emoji: string;
  label: string;
}

export interface Question {
  id: string;
  title: string;
  options: QuestionOption[];
}

export const APP_QUESTIONS: Question[] = [
  {
    id: 'criticality',
    title: 'Quelle est la criticité métier de ton application ?',
    options: [
      { value: 1, emoji: '🧪', label: 'Expérimentation (POC, side project, tests)' },
      { value: 2, emoji: '🔧', label: 'Support (outil interne secondaire)' },
      { value: 3, emoji: '📊', label: 'Opérationnelle (outil métier utilisé régulièrement)' },
      { value: 4, emoji: '⚡', label: 'Importante (impact direct sur l\'activité)' },
      { value: 5, emoji: '🎯', label: 'Critique (cœur de métier, indisponibilité = blocage)' },
    ],
  },
  {
    id: 'userCount',
    title: "Combien d'utilisateurs actifs utilisent ton application ?",
    options: [
      { value: 1, emoji: '👤', label: 'Très peu (1-10 utilisateurs)' },
      { value: 2, emoji: '👥', label: 'Petit groupe (11-50 utilisateurs)' },
      { value: 3, emoji: '🏠', label: 'Équipe (51-200 utilisateurs)' },
      { value: 4, emoji: '🏢', label: 'Organisation (201-1 000 utilisateurs)' },
      { value: 5, emoji: '🏙️', label: 'Grande échelle (1 001-10 000 utilisateurs)' },
      { value: 6, emoji: '🌍', label: 'Masse (10 000+ utilisateurs)' },
    ],
  },
  {
    id: 'financialImpact',
    title: "Quel est l'enjeu financier lié à cette application ?",
    options: [
      { value: 1, emoji: '🎈', label: 'Aucun (projet perso, apprentissage)' },
      { value: 2, emoji: '💡', label: 'Indirect (gain de temps, confort)' },
      { value: 3, emoji: '💵', label: 'Modéré (économies ou revenus < 1 000€/mois)' },
      { value: 4, emoji: '💰', label: 'Significatif (1 000 - 10 000€/mois)' },
      { value: 5, emoji: '💎', label: 'Important (10 000 - 100 000€/mois)' },
      { value: 6, emoji: '🏦', label: 'Stratégique (> 100 000€/mois)' },
    ],
  },
  {
    id: 'availability',
    title: 'Quel niveau de disponibilité est attendu ?',
    options: [
      { value: 1, emoji: '🤷', label: 'Best effort (pas d\'engagement)' },
      { value: 2, emoji: '🕐', label: 'Heures ouvrées (bureau uniquement)' },
      { value: 3, emoji: '📅', label: '95-99% (~4h à 36h de downtime/mois toléré)' },
      { value: 4, emoji: '📈', label: '99.5-99.9% (~45min à 4h/mois toléré)' },
      { value: 5, emoji: '🎯', label: '99.95-99.99% (~5 à 25min/mois toléré)' },
      { value: 6, emoji: '⚡', label: '99.99%+ (quasi zéro downtime)' },
    ],
  },
  {
    id: 'exposure',
    title: "Quel est le niveau d'exposition de ton application ?",
    options: [
      { value: 1, emoji: '🏠', label: 'Locale (même machine ou réseau local)' },
      { value: 2, emoji: '🔐', label: 'Interne sécurisé (VPN, réseau d\'entreprise)' },
      { value: 3, emoji: '☁️', label: 'Cloud privé / partenaires' },
      { value: 4, emoji: '🔑', label: 'Internet avec authentification' },
      { value: 5, emoji: '🌐', label: 'Internet public (ouvert à tous)' },
    ],
  },
  {
    id: 'complexity',
    title: 'Quelle est la complexité technique de l\'application ?',
    options: [
      { value: 1, emoji: '📝', label: 'Basique (pages statiques, CRUD simple)' },
      { value: 2, emoji: '📋', label: 'Standard (formulaires, API REST classique)' },
      { value: 3, emoji: '⚙️', label: 'Intermédiaire (workflows, intégrations tierces)' },
      { value: 4, emoji: '🔧', label: 'Avancée (temps réel, calculs complexes, queues)' },
      { value: 5, emoji: '🏗️', label: 'Complexe (microservices, event-driven, ML/IA)' },
    ],
  },
  {
    id: 'dataSensitivity',
    title: 'Quel est le niveau de sensibilité des données ?',
    options: [
      { value: 1, emoji: '📢', label: 'Publiques (open data, infos générales)' },
      { value: 2, emoji: '📁', label: 'Internes (données entreprise non sensibles)' },
      { value: 3, emoji: '🔏', label: 'Confidentielles (données personnelles, clients)' },
      { value: 4, emoji: '🛡️', label: 'Réglementées (RGPD strict, santé, finance, défense)' },
    ],
  },
];

export const INFRA_QUESTIONS: Question[] = [
  {
    id: 'sophistication',
    title: 'Quel est le niveau de sophistication de ton infrastructure ?',
    options: [
      { value: 1, emoji: '🖥️', label: 'Basique (serveur unique, hébergement simple)' },
      { value: 2, emoji: '📦', label: 'Conteneurisé (Docker simple, VM dédiée)' },
      { value: 3, emoji: '🐳', label: 'Orchestré simple (Docker Compose, Podman)' },
      { value: 4, emoji: '⚓', label: 'Orchestré avancé (Swarm, Nomad, ECS)' },
      { value: 5, emoji: '☸️', label: 'Kubernetes (cluster managé ou on-premise)' },
      { value: 6, emoji: '🌌', label: 'Distribué (multi-cluster, multi-cloud, service mesh)' },
    ],
  },
  {
    id: 'resilience',
    title: 'Quel est ton niveau de résilience et de reprise ?',
    options: [
      { value: 1, emoji: '🎲', label: 'Aucune (pas de backup, pas de plan B)' },
      { value: 2, emoji: '💾', label: 'Backup ponctuel (manuel ou occasionnel)' },
      { value: 3, emoji: '🔄', label: 'Backup automatisé (quotidien, testé)' },
      { value: 4, emoji: '🔁', label: 'Haute dispo simple (replica, failover manuel)' },
      { value: 5, emoji: '⚡', label: 'Haute dispo auto (failover automatique, load balancing)' },
      { value: 6, emoji: '🌍', label: 'Géo-résilience (multi-région, DR testé)' },
    ],
  },
  {
    id: 'cost',
    title: 'Quel est ton budget infrastructure mensuel ?',
    options: [
      { value: 1, emoji: '🏠', label: 'Zéro (matériel perso, infra existante amortie)' },
      { value: 2, emoji: '🪙', label: 'Minimal (1 - 50€/mois)' },
      { value: 3, emoji: '💵', label: 'Modéré (51 - 300€/mois)' },
      { value: 4, emoji: '💰', label: 'Conséquent (301 - 2 000€/mois)' },
      { value: 5, emoji: '💎', label: 'Important (2 001 - 10 000€/mois)' },
      { value: 6, emoji: '🏦', label: 'Enterprise (> 10 000€/mois)' },
    ],
  },
  {
    id: 'teamCapacity',
    title: "Quelle est la capacité de l'équipe pour gérer l'infra ?",
    options: [
      { value: 1, emoji: '🧑', label: 'Solo (je gère tout seul, temps partiel)' },
      { value: 2, emoji: '👥', label: 'Petite équipe (2-3 personnes, multi-casquettes)' },
      { value: 3, emoji: '🏢', label: 'Équipe dédiée (4-10 personnes, spécialisation partielle)' },
      { value: 4, emoji: '🏙️', label: 'Organisation (équipes spécialisées, DevOps/SRE)' },
      { value: 5, emoji: '🌐', label: 'Enterprise (support 24/7, NOC, astreintes)' },
    ],
  },
  {
    id: 'operationalMaturity',
    title: 'Quel est ton niveau de maturité opérationnelle ?',
    options: [
      { value: 1, emoji: '🎲', label: 'Ad-hoc (pas de doc, on improvise)' },
      { value: 2, emoji: '📝', label: 'Documenté (procédures écrites, runbooks basiques)' },
      { value: 3, emoji: '📊', label: 'Monitoré (alertes, dashboards, logs centralisés)' },
      { value: 4, emoji: '📈', label: 'Mesuré (SLIs/SLOs définis, post-mortems)' },
      { value: 5, emoji: '🎯', label: 'Optimisé (observabilité complète, amélioration continue)' },
    ],
  },
  {
    id: 'automation',
    title: "Quel est ton niveau d'automatisation ?",
    options: [
      { value: 1, emoji: '🖱️', label: 'Manuel (SSH, clics, copier-coller)' },
      { value: 2, emoji: '📜', label: 'Scripté (scripts bash/python, semi-auto)' },
      { value: 3, emoji: '🔧', label: 'CI/CD partiel (build auto, déploiement semi-manuel)' },
      { value: 4, emoji: '⚙️', label: 'CI/CD complet (tests, build, deploy automatisés)' },
      { value: 5, emoji: '🤖', label: 'GitOps / IaC (infra versionnée, auto-remédiation)' },
    ],
  },
  {
    id: 'security',
    title: 'Quel est ton niveau de sécurité infrastructure ?',
    options: [
      { value: 1, emoji: '🚪', label: 'Minimal (firewall basique, passwords)' },
      { value: 2, emoji: '🔒', label: 'Standard (HTTPS, auth forte, mises à jour régulières)' },
      { value: 3, emoji: '🛡️', label: 'Renforcé (WAF, scans de vulnérabilités, segmentation)' },
      { value: 4, emoji: '🏰', label: 'Avancé (Zero Trust, SIEM, audits, pentests réguliers)' },
    ],
  },
];
