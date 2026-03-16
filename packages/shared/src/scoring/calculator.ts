import type { ApplicationInput, InfrastructureInput, ScoreInput } from '../types/score-input';
import type { ScoreResult, VerdictType } from '../types/score-result';
import {
  APP_WEIGHTS,
  INFRA_WEIGHTS,
  APP_MAX_VALUES,
  INFRA_MAX_VALUES,
  VERDICT_THRESHOLDS,
} from './weights';
import { getVerdictMessage } from './messages';

/**
 * Normalize a value to 0-100 scale
 */
function normalize(value: number, maxValue: number): number {
  return ((value - 1) / (maxValue - 1)) * 100;
}

/**
 * Calculate the application score (0-100)
 */
export function calculateAppScore(app: ApplicationInput): {
  score: number;
  details: Record<string, number>;
} {
  const details: Record<string, number> = {};
  let weightedSum = 0;

  // Calculate weighted score for each criterion
  for (const [key, weight] of Object.entries(APP_WEIGHTS)) {
    const value = app[key as keyof ApplicationInput];
    const maxValue = APP_MAX_VALUES[key as keyof typeof APP_MAX_VALUES];
    const normalizedValue = normalize(value, maxValue);
    details[key] = normalizedValue;
    weightedSum += normalizedValue * weight;
  }

  return {
    score: Math.round(weightedSum),
    details,
  };
}

/**
 * Calculate the infrastructure score (0-100)
 */
export function calculateInfraScore(infra: InfrastructureInput): {
  score: number;
  details: Record<string, number>;
} {
  const details: Record<string, number> = {};
  let weightedSum = 0;

  // Calculate weighted score for each criterion
  for (const [key, weight] of Object.entries(INFRA_WEIGHTS)) {
    const value = infra[key as keyof InfrastructureInput];
    const maxValue = INFRA_MAX_VALUES[key as keyof typeof INFRA_MAX_VALUES];
    const normalizedValue = normalize(value, maxValue);
    details[key] = normalizedValue;
    weightedSum += normalizedValue * weight;
  }

  return {
    score: Math.round(weightedSum),
    details,
  };
}

/**
 * Determine the verdict based on the gap between scores
 */
export function determineVerdict(gap: number): VerdictType {
  if (gap >= VERDICT_THRESHOLDS.OVERKILL_SEVERE) {
    return 'OVERKILL_SEVERE';
  }
  if (gap >= VERDICT_THRESHOLDS.OVERKILL) {
    return 'OVERKILL';
  }
  if (gap >= VERDICT_THRESHOLDS.SLIGHT_OVERKILL) {
    return 'SLIGHT_OVERKILL';
  }
  if (gap > VERDICT_THRESHOLDS.BALANCED_LOWER) {
    return 'BALANCED';
  }
  if (gap > VERDICT_THRESHOLDS.UNDERKILL) {
    return 'SLIGHT_UNDERKILL';
  }
  if (gap > VERDICT_THRESHOLDS.UNDERKILL_SEVERE) {
    return 'UNDERKILL';
  }
  return 'UNDERKILL_SEVERE';
}

/**
 * Calculate the complete score result
 */
export function calculateScore(input: ScoreInput): ScoreResult {
  const appResult = calculateAppScore(input.app);
  const infraResult = calculateInfraScore(input.infra);

  const scoreApp = appResult.score;
  const scoreInfra = infraResult.score;
  const gap = scoreInfra - scoreApp;
  const verdict = determineVerdict(gap);
  const message = getVerdictMessage(verdict, gap);

  return {
    scoreApp,
    scoreInfra,
    gap,
    verdict,
    message,
    breakdown: {
      appDetails: appResult.details,
      infraDetails: infraResult.details,
    },
  };
}
