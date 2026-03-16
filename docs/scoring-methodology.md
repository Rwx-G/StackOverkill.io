# StackOverkill.io — Scoring Methodology

## Document Info

| Attribut | Valeur |
|----------|--------|
| **Version** | 1.0 |
| **Date** | 2026-01-19 |
| **Auteur** | Mary (Business Analyst) |
| **Statut** | Draft - À valider |

---

## Executive Summary

Ce document définit la méthodologie de scoring de StackOverkill.io, basée sur les best practices de l'industrie (NIST, Gartner, CNCF, AWS Well-Architected, ISO 22317) et adaptée au contexte déclaratif et ludique de l'outil.

**Principe fondamental :** Mesurer l'écart entre ce dont une application A BESOIN (score APP) et ce que l'infrastructure FOURNIT (score INFRA) pour identifier les situations d'overkill ou d'underkill.

---

## Table des matières

1. [Philosophie du scoring](#philosophie-du-scoring)
2. [Score APPLICATION (0-100)](#score-application-0-100)
3. [Score INFRASTRUCTURE (0-100)](#score-infrastructure-0-100)
4. [Algorithme de comparaison](#algorithme-de-comparaison)
5. [Verdicts et interprétation](#verdicts-et-interprétation)
6. [Exemples et cas d'usage](#exemples-et-cas-dusage)
7. [Calibration et ajustements](#calibration-et-ajustements)
8. [Sources et références](#sources-et-références)

---

## Philosophie du scoring

### Objectif

Le scoring de StackOverkill ne vise pas une évaluation absolue de la "qualité" d'une application ou d'une infrastructure, mais une **évaluation relative de l'adéquation** entre les deux.

- Une application critique avec une infrastructure sophistiquée = **ÉQUILIBRÉ** (approprié)
- Une application simple avec une infrastructure sophistiquée = **OVERKILL** (sur-ingénierie)
- Une application critique avec une infrastructure basique = **UNDERKILL** (sous-dimensionné)

### Principes directeurs

| Principe | Description |
|----------|-------------|
| **Déclaratif** | L'utilisateur déclare sa perception, pas des métriques techniques |
| **Subjectif assumé** | Les écarts de perception entre collègues sont une feature |
| **Accessible** | Pas de jargon technique obscur, questions compréhensibles |
| **Rapide** | Max 10 questions par section, < 5 min total |
| **Fun** | Formulations engageantes, pas corporate |

### Fondements théoriques

Le scoring s'inspire de plusieurs frameworks reconnus :

- **NIST IR 8179** : Criticality Analysis Process Model
- **ISO 22317** : Business Impact Analysis (BIA)
- **Gartner TIME Model** : Tolerate-Invest-Migrate-Eliminate
- **AWS Well-Architected** : Piliers de fiabilité et d'efficacité
- **CNCF Cloud Native Maturity Model** : Niveaux de maturité

---

## Score APPLICATION (0-100)

Le score APPLICATION mesure le **niveau d'exigence** que l'application impose à l'infrastructure. Plus le score est élevé, plus l'application nécessite une infrastructure robuste.

### Vue d'ensemble des critères

| # | Critère | Pondération | Justification |
|---|---------|-------------|---------------|
| A1 | Criticité métier | 25% | Impact business en cas de panne |
| A2 | Base utilisateurs | 15% | Charge et responsabilité |
| A3 | Impact financier | 20% | ROI et pertes potentielles |
| A4 | Disponibilité requise | 15% | SLA et tolérance aux pannes |
| A5 | Exposition et conformité | 10% | Public vs interne, réglementation |
| A6 | Complexité applicative | 10% | Intégrations, dépendances |
| A7 | Sensibilité des données | 5% | Confidentialité, RGPD |
| **TOTAL** | | **100%** | |

---

### A1. Criticité métier (25%)

**Question UX :** "Que se passe-t-il si cette application est indisponible pendant 24h ?"

| Niveau | Label UX | Description | Points |
|--------|----------|-------------|--------|
| 1 | "Personne ne remarque" | Outil de confort, alternatives existent | 0 |
| 2 | "C'est gênant" | Productivité réduite, workarounds possibles | 6 |
| 3 | "Ça pose problème" | Processus métier impactés, clients mécontents | 12 |
| 4 | "C'est critique" | Activité fortement dégradée, pertes directes | 19 |
| 5 | "C'est la catastrophe" | Arrêt total de l'activité, impact majeur | 25 |

**Référence :** NIST IR 8179 (Criticality Levels), ISO 22317 (Maximum Acceptable Downtime)

---

### A2. Base utilisateurs (15%)

**Question UX :** "Combien de personnes utilisent cette application régulièrement ?"

| Niveau | Plage | Description | Points |
|--------|-------|-------------|--------|
| 1 | 1-5 | Usage personnel ou micro-équipe | 0 |
| 2 | 6-20 | Petite équipe | 3 |
| 3 | 21-100 | Département ou PME | 6 |
| 4 | 101-500 | Entreprise moyenne, multi-équipes | 10 |
| 5 | 501-2000 | Grande entreprise | 12 |
| 6 | 2000+ | Très grande échelle ou public | 15 |

**Référence :** LeanIX Application Portfolio Management

---

### A3. Impact financier (20%)

**Question UX :** "Quel est l'impact financier mensuel de cette application ?"

*Note : Inclut les revenus générés ET les pertes potentielles en cas d'indisponibilité*

| Niveau | Plage | Description | Points |
|--------|-------|-------------|--------|
| 1 | 0€ | Aucun impact financier direct | 0 |
| 2 | 1-500€/mois | Impact marginal | 4 |
| 3 | 501-5 000€/mois | Impact notable | 8 |
| 4 | 5 001-50 000€/mois | Impact significatif | 13 |
| 5 | 50 001-500 000€/mois | Impact majeur | 17 |
| 6 | 500 000€+/mois | Impact critique | 20 |

**Référence :** Gartner TCO/Business Value Matrix, BIA Financial Impact

---

### A4. Disponibilité requise (15%)

**Question UX :** "Quel niveau de disponibilité est attendu pour cette application ?"

| Niveau | SLA équivalent | Description | Points |
|--------|----------------|-------------|--------|
| 1 | < 95% | Best effort, pannes tolérées | 0 |
| 2 | 95-99% | Heures ouvrées, maintenance planifiable | 4 |
| 3 | 99-99.5% | Disponibilité standard business | 7 |
| 4 | 99.5-99.9% | Haute disponibilité | 11 |
| 5 | 99.9-99.99% | Mission critical | 13 |
| 6 | 99.99%+ | Ultra-critique (finance, santé) | 15 |

**Référence :** AWS Well-Architected Reliability Pillar, Azure SLA Guidelines

---

### A5. Exposition et conformité (10%)

**Question UX :** "Qui peut accéder à cette application et quelles réglementations s'appliquent ?"

| Niveau | Type | Description | Points |
|--------|------|-------------|--------|
| 1 | Interne non-sensible | Outil interne, données non-sensibles | 0 |
| 2 | Interne sensible | Interne avec données confidentielles | 3 |
| 3 | Partenaires/B2B | Accès partenaires, contrats SLA | 5 |
| 4 | Public non-réglementé | Site public, e-commerce standard | 7 |
| 5 | Réglementé | RGPD renforcé, PCI-DSS, HDS, etc. | 10 |

**Référence :** NIST Cybersecurity Framework, RGPD, ISO 27001

---

### A6. Complexité applicative (10%)

**Question UX :** "Quelle est la complexité technique de cette application ?"

| Niveau | Description | Exemples | Points |
|--------|-------------|----------|--------|
| 1 | Très simple | Site vitrine statique, landing page | 0 |
| 2 | Simple | Blog, CMS basique, app mono-fonction | 2 |
| 3 | Modérée | App CRUD standard, quelques intégrations | 4 |
| 4 | Complexe | Microservices, multiples intégrations, API | 7 |
| 5 | Très complexe | Architecture distribuée, temps réel, ML | 10 |

**Référence :** IPMA Complexity Factors, Application Portfolio Assessment

---

### A7. Sensibilité des données (5%)

**Question UX :** "Quel type de données sont traitées par cette application ?"

| Niveau | Type | Exemples | Points |
|--------|------|----------|--------|
| 1 | Publiques | Contenu marketing, docs publiques | 0 |
| 2 | Internes | Docs internes, processus métier | 1 |
| 3 | Confidentielles | Données clients, financières | 3 |
| 4 | Hautement sensibles | Santé, paiement, identité | 5 |

**Référence :** Classification des données ISO 27001, RGPD (données personnelles)

---

### Formule de calcul - Score APPLICATION

```
Score_APP = (A1 × 1.0) + (A2 × 1.0) + (A3 × 1.0) + (A4 × 1.0) + (A5 × 1.0) + (A6 × 1.0) + (A7 × 1.0)

Maximum théorique : 25 + 15 + 20 + 15 + 10 + 10 + 5 = 100
Minimum théorique : 0
```

---

## Score INFRASTRUCTURE (0-100)

Le score INFRASTRUCTURE mesure le **niveau de sophistication et de capacité** de l'infrastructure en place. Plus le score est élevé, plus l'infrastructure est robuste et coûteuse à maintenir.

### Vue d'ensemble des critères

| # | Critère | Pondération | Justification |
|---|---------|-------------|---------------|
| I1 | Sophistication technique | 20% | Modernité et complexité de la stack |
| I2 | Niveau de résilience | 20% | HA, backup, DR |
| I3 | Coût opérationnel | 15% | Budget infrastructure |
| I4 | Capacité de l'équipe | 15% | Taille et expertise |
| I5 | Maturité opérationnelle | 15% | Docs, monitoring, processus |
| I6 | Automatisation | 10% | CI/CD, IaC, auto-scaling |
| I7 | Sécurité infrastructure | 5% | Posture de sécurité |
| **TOTAL** | | **100%** | |

---

### I1. Sophistication technique (20%)

**Question UX :** "Quelle est la stack technique de votre infrastructure ?"

*Note : Sélection multiple possible, le score est basé sur l'élément le plus sophistiqué*

| Niveau | Stack | Description | Points |
|--------|-------|-------------|--------|
| 1 | Hébergement mutualisé | Shared hosting, PaaS simple | 0 |
| 2 | VPS / Serveur dédié simple | 1 serveur, config manuelle | 4 |
| 3 | VMs / Hyperviseur | VMware, Proxmox, plusieurs VMs | 8 |
| 4 | Conteneurs (Docker simple) | Docker Compose, Swarm basique | 11 |
| 5 | Orchestration (K8S/Nomad) | Kubernetes, orchestration avancée | 15 |
| 6 | Multi-cloud / Hybrid + K8S | Architecture distribuée complexe | 20 |

**Référence :** CNCF Cloud Native Maturity Model, Infrastructure Automation Maturity Model

---

### I2. Niveau de résilience (20%)

**Question UX :** "Quel est le niveau de résilience de votre infrastructure ?"

| Niveau | Configuration | Description | Points |
|--------|---------------|-------------|--------|
| 1 | Aucune | Single point of failure, pas de backup | 0 |
| 2 | Backup basique | Backups manuels ou hebdomadaires | 4 |
| 3 | Backup automatisé | Backups quotidiens automatisés | 8 |
| 4 | HA partielle | Redondance sur certains composants | 12 |
| 5 | HA complète | Redondance totale, failover automatique | 16 |
| 6 | DR multi-site | Disaster Recovery géo-distribué | 20 |

**Référence :** AWS Reliability Pillar, Azure Resiliency Checklist

---

### I3. Coût opérationnel mensuel (15%)

**Question UX :** "Quel est le budget mensuel de votre infrastructure ?"

| Niveau | Plage | Description | Points |
|--------|-------|-------------|--------|
| 1 | 0€ (gratuit/amorti) | Free tier, serveur amorti | 0 |
| 2 | 1-50€/mois | Hébergement basique | 2 |
| 3 | 51-200€/mois | VPS ou petit cloud | 5 |
| 4 | 201-1 000€/mois | Infrastructure moyenne | 8 |
| 5 | 1 001-5 000€/mois | Infrastructure conséquente | 11 |
| 6 | 5 000€+/mois | Infrastructure enterprise | 15 |

**Référence :** AWS Cost Optimization, FinOps Framework

---

### I4. Capacité de l'équipe technique (15%)

**Question UX :** "Quelle est la taille et l'expertise de l'équipe qui gère l'infrastructure ?"

| Niveau | Configuration | Description | Points |
|--------|---------------|-------------|--------|
| 1 | Aucune dédiée | Pas d'équipe dédiée, best effort | 0 |
| 2 | 1 personne (temps partiel) | Dev qui fait aussi l'ops | 3 |
| 3 | 1 personne (temps plein) | 1 ops/sysadmin dédié | 6 |
| 4 | Petite équipe (2-3) | Équipe ops constituée | 9 |
| 5 | Équipe moyenne (4-10) | Équipe structurée avec spécialités | 12 |
| 6 | Grande équipe (10+) | Organisation mature, SRE, DevOps | 15 |

**Référence :** DevOps Maturity Model, Team Topologies

---

### I5. Maturité opérationnelle (15%)

**Question UX :** "Comment gérez-vous l'exploitation au quotidien ?"

| Niveau | Pratiques | Description | Points |
|--------|-----------|-------------|--------|
| 1 | Ad-hoc | Pas de documentation, réaction aux incidents | 0 |
| 2 | Documenté partiellement | Quelques docs, processus informels | 3 |
| 3 | Documenté | Documentation à jour, CMDB basique | 6 |
| 4 | Processé | ITSM en place, processus définis | 10 |
| 5 | Optimisé | Monitoring avancé, alerting, post-mortems | 13 |
| 6 | Excellence | SRE practices, chaos engineering, SLO/SLI | 15 |

**Référence :** ITIL, SRE Practices (Google), Gartner I&O Maturity

---

### I6. Niveau d'automatisation (10%)

**Question UX :** "Quel est le niveau d'automatisation de votre infrastructure ?"

| Niveau | Pratiques | Description | Points |
|--------|-----------|-------------|--------|
| 1 | Manuel | Tout est fait à la main | 0 |
| 2 | Scripts basiques | Quelques scripts d'automatisation | 2 |
| 3 | CI/CD partiel | Pipeline de déploiement automatisé | 4 |
| 4 | IaC (Infrastructure as Code) | Terraform, Ansible, etc. | 6 |
| 5 | GitOps complet | IaC + CI/CD + auto-scaling | 8 |
| 6 | Auto-remédiation | Self-healing, auto-scaling avancé | 10 |

**Référence :** Infrastructure Automation Maturity Model, GitOps Principles

---

### I7. Posture de sécurité infrastructure (5%)

**Question UX :** "Quel est le niveau de sécurité de votre infrastructure ?"

| Niveau | Pratiques | Description | Points |
|--------|-----------|-------------|--------|
| 1 | Minimal | Firewall basique, pas d'audit | 0 |
| 2 | Standard | Firewall, mises à jour régulières | 1 |
| 3 | Renforcé | Segmentation réseau, WAF, logs | 2 |
| 4 | Avancé | SIEM, scans de vulnérabilités, hardening | 4 |
| 5 | Zero Trust | Zero trust, EDR, SOC, pen-tests réguliers | 5 |

**Référence :** OWASP, CIS Controls, NIST Cybersecurity Framework

---

### Formule de calcul - Score INFRASTRUCTURE

```
Score_INFRA = (I1 × 1.0) + (I2 × 1.0) + (I3 × 1.0) + (I4 × 1.0) + (I5 × 1.0) + (I6 × 1.0) + (I7 × 1.0)

Maximum théorique : 20 + 20 + 15 + 15 + 15 + 10 + 5 = 100
Minimum théorique : 0
```

---

## Algorithme de comparaison

### Calcul de l'écart

```
ÉCART = Score_INFRA - Score_APP
```

- **ÉCART positif** : L'infrastructure fournit plus que ce dont l'application a besoin
- **ÉCART négatif** : L'application a besoin de plus que ce que l'infrastructure fournit
- **ÉCART proche de 0** : Bon alignement

### Seuils de verdict

| Plage d'écart | Verdict | Code couleur | Interprétation |
|---------------|---------|--------------|----------------|
| ÉCART > +30 | **OVERKILL SÉVÈRE** | 🔴 Rouge | Sur-ingénierie majeure, gaspillage probable |
| +20 < ÉCART ≤ +30 | **OVERKILL** | 🟠 Orange | Infrastructure surdimensionnée |
| +10 < ÉCART ≤ +20 | **LÉGER OVERKILL** | 🟡 Jaune | Marge confortable, surveiller |
| -10 ≤ ÉCART ≤ +10 | **ÉQUILIBRÉ** | 🟢 Vert | Bon alignement |
| -20 ≤ ÉCART < -10 | **LÉGER UNDERKILL** | 🟡 Jaune | Infrastructure un peu juste |
| -30 ≤ ÉCART < -20 | **UNDERKILL** | 🟠 Orange | Infrastructure sous-dimensionnée |
| ÉCART < -30 | **UNDERKILL SÉVÈRE** | 🔴 Rouge | Risque majeur, infrastructure inadaptée |

### Visualisation de l'écart

```
UNDERKILL                    ÉQUILIBRÉ                    OVERKILL
    |                            |                            |
 -100        -50        -20    0    +20        +50        +100
    🔴         🟠         🟡    🟢    🟡         🟠         🔴
    |          |          |     |     |          |          |
 Critique   Risqué    Tendu   OK   Confort  Excès    Gaspillage
```

---

## Verdicts et interprétation

### Messages par verdict

#### OVERKILL SÉVÈRE (Écart > +30)

**Titre :** "Houston, on a un problème de budget !"

**Message :**
> Votre infrastructure est significativement surdimensionnée par rapport aux besoins de votre application. Vous avez peut-être une Ferrari pour aller chercher le pain. C'est beau, mais est-ce vraiment nécessaire ?

**Conseils :**
- Envisagez de réduire la complexité de votre stack
- Évaluez si tous les composants sont réellement utilisés
- Calculez le ROI de votre infrastructure actuelle

**CTA contextuel :** "Un expert peut vous aider à optimiser" → Freelance

---

#### OVERKILL (Écart +20 à +30)

**Titre :** "Vous êtes bien équipé... peut-être trop ?"

**Message :**
> Votre infrastructure offre plus de capacité que ce que votre application semble nécessiter actuellement. C'est confortable, mais vérifiez que ce n'est pas du gaspillage.

**Conseils :**
- Documentez les raisons de cette marge (croissance prévue ?)
- Surveillez l'utilisation réelle des ressources
- Optimisez si la croissance ne suit pas

---

#### LÉGER OVERKILL (Écart +10 à +20)

**Titre :** "Confortable, avec une marge de sécurité"

**Message :**
> Vous avez une infrastructure légèrement plus robuste que le strict nécessaire. C'est souvent une bonne chose si vous prévoyez de la croissance.

**Conseils :**
- Position acceptable si croissance prévue
- Surveillez l'évolution pour éviter le gaspillage

---

#### ÉQUILIBRÉ (Écart -10 à +10)

**Titre :** "Bien joué ! L'équilibre parfait"

**Message :**
> Votre infrastructure semble bien dimensionnée par rapport aux besoins de votre application. Continuez comme ça !

**Conseils :**
- Réévaluez régulièrement si les besoins évoluent
- Documentez votre setup pour le maintenir

---

#### LÉGER UNDERKILL (Écart -10 à -20)

**Titre :** "Ça passe... mais c'est un peu juste"

**Message :**
> Votre infrastructure est légèrement en dessous des besoins optimaux de votre application. Ça fonctionne, mais surveillez les signes de tension.

**Conseils :**
- Surveillez les performances et la disponibilité
- Planifiez des améliorations à court terme
- Documentez les risques acceptés

---

#### UNDERKILL (Écart -20 à -30)

**Titre :** "Attention, terrain glissant !"

**Message :**
> Votre infrastructure semble sous-dimensionnée pour les besoins de votre application. Vous prenez des risques qui pourraient coûter cher.

**Conseils :**
- Évaluez les risques de panne et leur impact
- Priorisez les améliorations critiques (backup, redondance)
- Considérez un accompagnement expert

**CTA contextuel :** "Un expert peut vous aider à sécuriser" → Freelance

---

#### UNDERKILL SÉVÈRE (Écart < -30)

**Titre :** "Alerte rouge ! Risque majeur détecté"

**Message :**
> Votre application a des besoins critiques qui ne sont pas couverts par votre infrastructure actuelle. C'est une situation à risque qui nécessite une attention immédiate.

**Conseils :**
- Action urgente recommandée
- Identifiez les single points of failure
- Mettez en place des backups immédiatement
- Considérez sérieusement un accompagnement

**CTA contextuel :** "Besoin d'aide urgente ?" → Freelance + KaliaOps

---

## Exemples et cas d'usage

### Exemple 1 : Site vitrine sur cluster K8S

**Application :**
- Criticité : "Personne ne remarque" (0)
- Utilisateurs : 6-20 (3)
- Impact financier : 1-500€ (4)
- Disponibilité : < 95% (0)
- Exposition : Public non-réglementé (7)
- Complexité : Très simple (0)
- Données : Publiques (0)

**Score APP = 14**

**Infrastructure :**
- Stack : K8S (15)
- Résilience : HA complète (16)
- Coût : 1 001-5 000€ (11)
- Équipe : 2-3 personnes (9)
- Maturité : Documenté (6)
- Automatisation : GitOps (8)
- Sécurité : Renforcé (2)

**Score INFRA = 67**

**ÉCART = +53 → OVERKILL SÉVÈRE 🔴**

*Interprétation : Un cluster Kubernetes avec HA complète pour un site vitrine est clairement surdimensionné.*

---

### Exemple 2 : Application e-commerce critique sur VPS

**Application :**
- Criticité : "C'est critique" (19)
- Utilisateurs : 501-2000 (12)
- Impact financier : 50 001-500 000€ (17)
- Disponibilité : 99.5-99.9% (11)
- Exposition : Réglementé PCI-DSS (10)
- Complexité : Complexe (7)
- Données : Hautement sensibles (5)

**Score APP = 81**

**Infrastructure :**
- Stack : VPS simple (4)
- Résilience : Backup basique (4)
- Coût : 51-200€ (5)
- Équipe : 1 personne temps partiel (3)
- Maturité : Ad-hoc (0)
- Automatisation : Manuel (0)
- Sécurité : Standard (1)

**Score INFRA = 17**

**ÉCART = -64 → UNDERKILL SÉVÈRE 🔴**

*Interprétation : Une application e-commerce critique avec données PCI-DSS sur un simple VPS sans redondance est une situation à risque majeur.*

---

### Exemple 3 : Application métier interne bien dimensionnée

**Application :**
- Criticité : "Ça pose problème" (12)
- Utilisateurs : 21-100 (6)
- Impact financier : 5 001-50 000€ (13)
- Disponibilité : 99-99.5% (7)
- Exposition : Interne sensible (3)
- Complexité : Modérée (4)
- Données : Confidentielles (3)

**Score APP = 48**

**Infrastructure :**
- Stack : VMs / Hyperviseur (8)
- Résilience : HA partielle (12)
- Coût : 201-1 000€ (8)
- Équipe : 1 personne temps plein (6)
- Maturité : Processé ITSM (10)
- Automatisation : CI/CD partiel (4)
- Sécurité : Renforcé (2)

**Score INFRA = 50**

**ÉCART = +2 → ÉQUILIBRÉ 🟢**

*Interprétation : Infrastructure correctement dimensionnée pour une application métier de criticité moyenne.*

---

## Calibration et ajustements

### Paramètres ajustables

| Paramètre | Valeur par défaut | Plage recommandée |
|-----------|-------------------|-------------------|
| Seuil OVERKILL | +20 | +15 à +25 |
| Seuil UNDERKILL | -20 | -15 à -25 |
| Seuil SÉVÈRE | ±30 | ±25 à ±35 |

### Facteurs de correction (optionnels - Phase 2)

Pour affiner le scoring, des facteurs correctifs pourraient être ajoutés :

- **Secteur d'activité** : Finance (+10% criticité), Startup (-10% résilience attendue)
- **Phase de projet** : MVP (-20% infrastructure), Production (+10%)
- **Croissance** : Forte croissance attendue (+15% infrastructure acceptable)

### Processus de calibration

1. **Collecter des cas réels** : Demander à des utilisateurs de valider si le verdict correspond à leur perception
2. **Identifier les outliers** : Cas où le verdict semble incorrect
3. **Ajuster les seuils ou pondérations** : Itérer sur les paramètres
4. **Valider statistiquement** : Sur un échantillon représentatif

---

## Sources et références

### Standards et frameworks

| Source | Utilisation |
|--------|-------------|
| [NIST IR 8179](https://csrc.nist.gov/News/2018/NISTIR-8179-Criticality-Analysis-Process-Model) | Criticality Analysis Process Model |
| [ISO 22317](https://www.iso.org/standard/79000.html) | Business Impact Analysis Guidelines |
| [AWS Well-Architected](https://aws.amazon.com/architecture/well-architected/) | Reliability & Cost Optimization Pillars |
| [CNCF Maturity Model](https://maturitymodel.cncf.io/) | Cloud Native Maturity |
| [Gartner TIME Model](https://www.gartner.com/en/publications/it-score-for-infrastructure-operations) | Application Portfolio Rationalization |

### Articles et guides

| Source | Contenu |
|--------|---------|
| [LeanIX - Application Criticality](https://www.leanix.net/en/wiki/apm/application-criticality-assessment-and-matrix) | Framework d'évaluation de criticité |
| [CIO.gov - App Rationalization Playbook](https://www.cio.gov/assets/files/Application-Rationalization-Playbook.pdf) | Guide fédéral US |
| [DevOps.com - Infrastructure Automation Maturity](https://devops.com/understanding-the-infrastructure-automation-maturity-model/) | Niveaux de maturité automation |
| [Ready.gov - Business Impact Analysis](https://www.ready.gov/business/planning/impact-analysis) | Guide BIA |

---

## Annexe : Questions UX finales (proposition)

### Section APPLICATION (7 questions)

1. **Criticité** : "Que se passe-t-il si cette application est indisponible pendant 24h ?"
   - Personne ne remarque / C'est gênant / Ça pose problème / C'est critique / C'est la catastrophe

2. **Utilisateurs** : "Combien de personnes utilisent cette application régulièrement ?"
   - 1-5 / 6-20 / 21-100 / 101-500 / 501-2000 / 2000+

3. **Impact financier** : "Quel est l'impact financier mensuel de cette application ?"
   - 0€ / 1-500€ / 501-5K€ / 5K-50K€ / 50K-500K€ / 500K€+

4. **Disponibilité** : "Quel niveau de disponibilité est attendu ?"
   - Best effort / Heures ouvrées / Standard (99%) / Haute dispo (99.9%) / Mission critical (99.99%+)

5. **Exposition** : "Qui accède à cette application ?"
   - Équipe interne / Interne + données sensibles / Partenaires B2B / Public / Public réglementé

6. **Complexité** : "Quelle est la complexité de l'application ?"
   - Site statique / App simple / App standard / Microservices / Architecture distribuée

7. **Données** : "Quel type de données sont traitées ?"
   - Publiques / Internes / Confidentielles / Hautement sensibles (santé, paiement)

### Section INFRASTRUCTURE (7 questions)

1. **Stack technique** : "Quelle est votre stack d'hébergement ?"
   - Hébergement mutualisé / VPS-Serveur dédié / VMs-Hyperviseur / Docker / Kubernetes / Multi-cloud

2. **Résilience** : "Quel est votre niveau de résilience ?"
   - Aucun backup / Backup manuel / Backup auto / HA partielle / HA complète / DR multi-site

3. **Budget** : "Quel est votre budget infrastructure mensuel ?"
   - 0€ (gratuit) / 1-50€ / 51-200€ / 201-1K€ / 1K-5K€ / 5K€+

4. **Équipe** : "Qui gère l'infrastructure ?"
   - Personne dédié / 1 personne (partiel) / 1 personne (plein) / Équipe 2-3 / Équipe 4-10 / Équipe 10+

5. **Maturité** : "Comment gérez-vous l'exploitation ?"
   - À la volée / Docs partielles / Documenté / ITSM en place / Monitoring avancé / SRE practices

6. **Automatisation** : "Quel est votre niveau d'automatisation ?"
   - Tout manuel / Scripts basiques / CI/CD / Infrastructure as Code / GitOps / Auto-remédiation

7. **Sécurité** : "Quelle est votre posture de sécurité ?"
   - Firewall basique / Standard / Renforcé (WAF, logs) / Avancé (SIEM, scans) / Zero Trust

---

*Document généré le 2026-01-19 — BMAD-METHOD*
*À valider et calibrer avec des cas réels*
