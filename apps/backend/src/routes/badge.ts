import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { VerdictType } from '@stackoverkill/shared';

export const badgeRouter = Router();

// Badge color mapping by verdict
const BADGE_COLORS: Record<string, { bg: string; text: string }> = {
  OVERKILL_SEVERE: { bg: '#dc2626', text: '#ffffff' },
  OVERKILL: { bg: '#f97316', text: '#ffffff' },
  SLIGHT_OVERKILL: { bg: '#eab308', text: '#000000' },
  BALANCED: { bg: '#22c55e', text: '#ffffff' },
  SLIGHT_UNDERKILL: { bg: '#06b6d4', text: '#ffffff' },
  UNDERKILL: { bg: '#3b82f6', text: '#ffffff' },
  UNDERKILL_SEVERE: { bg: '#8b5cf6', text: '#ffffff' },
};

// Badge emoji mapping
const BADGE_EMOJI: Record<string, string> = {
  OVERKILL_SEVERE: '💀',
  OVERKILL: '🔥',
  SLIGHT_OVERKILL: '⚡',
  BALANCED: '✅',
  SLIGHT_UNDERKILL: '🌧️',
  UNDERKILL: '❄️',
  UNDERKILL_SEVERE: '🌊',
};

// Short label mapping
const BADGE_LABELS: Record<string, string> = {
  OVERKILL_SEVERE: 'OVERKILL',
  OVERKILL: 'OVERKILL',
  SLIGHT_OVERKILL: 'OVERKILL',
  BALANCED: 'BALANCED',
  SLIGHT_UNDERKILL: 'UNDERKILL',
  UNDERKILL: 'UNDERKILL',
  UNDERKILL_SEVERE: 'UNDERKILL',
};

const BadgeQuerySchema = z.object({
  s: z.string().transform(Number).pipe(z.number().min(0).max(100)), // scoreApp
  i: z.string().transform(Number).pipe(z.number().min(0).max(100)), // scoreInfra
  v: VerdictType,
});

/**
 * GET /api/v1/badge
 * Generate a GitHub-style badge SVG
 * Query params:
 *   - s: scoreApp (0-100)
 *   - i: scoreInfra (0-100)
 *   - v: verdict
 */
badgeRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const params = BadgeQuerySchema.parse(req.query);
    const gap = params.i - params.s;
    const colors = BADGE_COLORS[params.v] || BADGE_COLORS.BALANCED;
    const emoji = BADGE_EMOJI[params.v] || '✅';
    const label = BADGE_LABELS[params.v] || 'BALANCED';
    const gapText = gap >= 0 ? `+${gap}` : `${gap}`;

    // Generate SVG badge
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="28" role="img" aria-label="StackOverkill: ${label} ${gapText}">
  <title>StackOverkill: ${label} ${gapText}</title>
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <clipPath id="r">
    <rect width="220" height="28" rx="4" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#r)">
    <rect width="95" height="28" fill="${colors.bg}"/>
    <rect x="95" width="45" height="28" fill="#1e293b"/>
    <rect x="140" width="80" height="28" fill="#0f172a"/>
    <rect width="220" height="28" fill="url(#s)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" font-size="11">
    <text x="48" y="19" fill="${colors.text}" font-weight="bold">${emoji} ${label}</text>
    <text x="117" y="19" fill="#fff" font-weight="bold">${gapText}</text>
    <text x="180" y="19" fill="#94a3b8" font-size="9">stackoverkill.io</text>
  </g>
</svg>`;

    // Set headers for SVG
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
    res.send(svg);
  } catch (error) {
    next(error);
  }
});
