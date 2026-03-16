import { z } from 'zod';

/**
 * Verdict types from most overkill to most underkill
 */
export const VerdictType = z.enum([
  'OVERKILL_SEVERE',
  'OVERKILL',
  'SLIGHT_OVERKILL',
  'BALANCED',
  'SLIGHT_UNDERKILL',
  'UNDERKILL',
  'UNDERKILL_SEVERE',
]);

export type VerdictType = z.infer<typeof VerdictType>;

/**
 * Score calculation result
 */
export const ScoreResultSchema = z.object({
  /** Application score (0-100) */
  scoreApp: z.number().min(0).max(100),
  /** Infrastructure score (0-100) */
  scoreInfra: z.number().min(0).max(100),
  /** Gap between scores (infra - app), positive = overkill */
  gap: z.number(),
  /** Verdict based on gap */
  verdict: VerdictType,
  /** Human-readable message explaining the verdict */
  message: z.string(),
  /** Detailed breakdown (optional) */
  breakdown: z
    .object({
      appDetails: z.record(z.string(), z.number()),
      infraDetails: z.record(z.string(), z.number()),
    })
    .optional(),
});

export type ScoreResult = z.infer<typeof ScoreResultSchema>;

/**
 * Leaderboard entry for anonymous participation
 */
export const LeaderboardEntrySchema = z.object({
  id: z.string().uuid(),
  nickname: z.string().min(1).max(50),
  appName: z.string().min(1).max(50),
  scoreApp: z.number().min(0).max(100),
  scoreInfra: z.number().min(0).max(100),
  verdict: VerdictType,
  createdAt: z.string().datetime(),
});

export type LeaderboardEntry = z.infer<typeof LeaderboardEntrySchema>;
