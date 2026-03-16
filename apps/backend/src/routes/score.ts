import { Router, Request, Response, NextFunction } from 'express';
import { ScoreInputSchema, calculateScore } from '@stackoverkill/shared';

export const scoreRouter = Router();

/**
 * POST /api/v1/score/calculate
 * Calculate the score based on user inputs
 */
scoreRouter.post(
  '/calculate',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate input
      const input = ScoreInputSchema.parse(req.body);

      // Calculate score
      const result = calculateScore(input);

      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);
