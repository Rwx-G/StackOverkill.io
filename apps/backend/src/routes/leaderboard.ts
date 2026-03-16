import { Router, Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { VerdictType, LeaderboardEntrySchema } from '@stackoverkill/shared';
import { LeaderboardService } from '../services/leaderboard.js';

export const leaderboardRouter = Router();
const leaderboardService = new LeaderboardService();

const CreateEntrySchema = z.object({
  scoreApp: z.number().min(0).max(100),
  scoreInfra: z.number().min(0).max(100),
  verdict: VerdictType,
});

type SortType = 'overkill' | 'balanced' | 'underkill';
const VALID_SORTS: SortType[] = ['overkill', 'balanced', 'underkill'];

/**
 * GET /api/v1/leaderboard
 * Get entries from the leaderboard with pagination and sorting
 * Query params:
 *   - page (default 1)
 *   - sort: 'overkill' | 'balanced' | 'underkill' (default 'overkill')
 *   - highlight: nickname to find (returns highlightPage if found)
 */
/**
 * GET /api/v1/leaderboard/percentile
 * Get percentile for a given gap without submitting to leaderboard
 * Query params:
 *   - gap: number (scoreInfra - scoreApp)
 */
leaderboardRouter.get('/percentile', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const gap = parseInt(req.query.gap as string, 10);
    if (isNaN(gap)) {
      res.status(400).json({ error: 'Invalid gap parameter' });
      return;
    }

    const { percentile, total } = await leaderboardService.getPercentile(gap);
    res.json({ percentile, total });
  } catch (error) {
    next(error);
  }
});

leaderboardRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const PAGE_SIZE = 100;
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const sort = VALID_SORTS.includes(req.query.sort as SortType)
      ? (req.query.sort as SortType)
      : 'overkill';
    const highlightNickname = req.query.highlight as string | undefined;

    const result = await leaderboardService.getPaginatedSorted(PAGE_SIZE, page, sort, highlightNickname);

    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/leaderboard
 * Add a new entry to the leaderboard (opt-in only)
 */
leaderboardRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = CreateEntrySchema.parse(req.body);

    // Generate anonymous nickname and app name
    const nickname = generateNickname();
    const appName = generateAppName();

    const entry = LeaderboardEntrySchema.parse({
      id: uuidv4(),
      nickname,
      appName,
      scoreApp: input.scoreApp,
      scoreInfra: input.scoreInfra,
      verdict: input.verdict,
      createdAt: new Date().toISOString(),
    });

    await leaderboardService.add(entry);

    // Calculate percentile based on gap
    const gap = input.scoreInfra - input.scoreApp;
    const { percentile, total } = await leaderboardService.getPercentile(gap);

    res.status(201).json({
      entry: {
        nickname: entry.nickname,
        appName: entry.appName,
      },
      percentile,
      totalEntries: total,
    });
  } catch (error) {
    next(error);
  }
});

// Fun nickname generator (20 x 20 x 100 = 40,000 combinations)
const ADJECTIVES = [
  'Swift', 'Clever', 'Mighty', 'Cosmic', 'Turbo', 'Ninja', 'Epic', 'Stellar',
  'Quantum', 'Cyber', 'Blazing', 'Silent', 'Golden', 'Electric', 'Atomic',
  'Shadow', 'Neon', 'Pixel', 'Crypto', 'Stealth',
];

const ANIMALS = [
  'Panda', 'Phoenix', 'Dragon', 'Wolf', 'Tiger', 'Eagle', 'Falcon', 'Shark',
  'Raven', 'Octopus', 'Fox', 'Bear', 'Hawk', 'Panther', 'Cobra',
  'Lynx', 'Orca', 'Viper', 'Jaguar', 'Mantis',
];

function generateNickname(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  const num = Math.floor(Math.random() * 100);
  return `${adj}${animal}${num}`;
}

// App name generator (20 x 20 = 400 combinations)
const APP_PREFIXES = [
  'Super', 'Mega', 'Ultra', 'Hyper', 'Turbo', 'Pro', 'Max', 'Neo',
  'Cloud', 'Data', 'Smart', 'Fast', 'Quick', 'Easy', 'Open',
  'Meta', 'Cyber', 'Tech', 'Web', 'Dev',
];
const APP_SUFFIXES = [
  'App', 'Hub', 'Flow', 'Wave', 'Sync', 'Core', 'Base', 'Lab',
  'Box', 'Spot', 'Zone', 'Link', 'Net', 'Stack', 'Cloud',
  'Forge', 'Pulse', 'Mind', 'Dash', 'Ops',
];

function generateAppName(): string {
  const prefix = APP_PREFIXES[Math.floor(Math.random() * APP_PREFIXES.length)];
  const suffix = APP_SUFFIXES[Math.floor(Math.random() * APP_SUFFIXES.length)];
  return `${prefix}${suffix}`;
}
