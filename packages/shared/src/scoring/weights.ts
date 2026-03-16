/**
 * Scoring weights and normalization factors
 * Based on docs/scoring-methodology.md
 */

/**
 * Application criteria weights (must sum to 1.0)
 */
export const APP_WEIGHTS = {
  criticality: 0.25,      // 25% - Most important factor
  userCount: 0.15,        // 15%
  financialImpact: 0.20,  // 20%
  availability: 0.15,     // 15%
  exposure: 0.10,         // 10%
  complexity: 0.10,       // 10%
  dataSensitivity: 0.05,  // 5%
} as const;

/**
 * Infrastructure criteria weights (must sum to 1.0)
 */
export const INFRA_WEIGHTS = {
  sophistication: 0.20,       // 20%
  resilience: 0.20,           // 20%
  cost: 0.15,                 // 15%
  teamCapacity: 0.15,         // 15%
  operationalMaturity: 0.15,  // 15%
  automation: 0.10,           // 10%
  security: 0.05,             // 5%
} as const;

/**
 * Maximum values for each criterion (for normalization)
 */
export const APP_MAX_VALUES = {
  criticality: 5,
  userCount: 6,
  financialImpact: 6,
  availability: 6,
  exposure: 5,
  complexity: 5,
  dataSensitivity: 4,
} as const;

export const INFRA_MAX_VALUES = {
  sophistication: 6,
  resilience: 6,
  cost: 6,
  teamCapacity: 5,
  operationalMaturity: 5,
  automation: 5,
  security: 4,
} as const;

/**
 * Verdict thresholds based on gap (infra - app)
 */
export const VERDICT_THRESHOLDS = {
  OVERKILL_SEVERE: 40,     // gap >= 40
  OVERKILL: 25,            // gap >= 25
  SLIGHT_OVERKILL: 10,     // gap >= 10
  BALANCED_UPPER: 10,      // -10 < gap < 10
  BALANCED_LOWER: -10,
  SLIGHT_UNDERKILL: -10,   // gap <= -10
  UNDERKILL: -25,          // gap <= -25
  UNDERKILL_SEVERE: -40,   // gap <= -40
} as const;
