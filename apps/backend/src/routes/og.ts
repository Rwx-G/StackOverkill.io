import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { VerdictType } from '@stackoverkill/shared';
import { generateOgImage, decodeOgParams, getStoredOgImage, storeOgImage, hasStoredOgImage } from '../services/ogImage.js';

export const ogRouter = Router();

const ImageQuerySchema = z.object({
  app: z.string().transform((v) => parseInt(v, 10)).pipe(z.number().min(0).max(100)),
  infra: z.string().transform((v) => parseInt(v, 10)).pipe(z.number().min(0).max(100)),
  verdict: VerdictType,
  phrase: z.string().transform((v) => parseInt(v, 10)).pipe(z.number().min(0).max(10)).optional(),
});

/**
 * GET /api/v1/og/image
 * Generate an OG image badge for sharing (PNG)
 *
 * Query params:
 * - app: number (0-100) - Application complexity score
 * - infra: number (0-100) - Infrastructure complexity score
 * - verdict: string - Verdict type
 * - phrase: number (optional) - Phrase index
 */
ogRouter.get('/image', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const params = ImageQuerySchema.parse(req.query);

    const pngBuffer = await generateOgImage({
      scoreApp: params.app,
      scoreInfra: params.infra,
      verdict: params.verdict,
      phraseIndex: params.phrase,
    });

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable'); // Cache for 1 year (immutable content)
    res.send(pngBuffer);
  } catch (error) {
    console.error('Error generating OG image:', error);
    next(error);
  }
});

/**
 * GET /api/v1/og/image/:id
 * Serve OG image from storage (uploaded by client), with fallback to Satori generation
 *
 * ID format: {scoreApp}-{scoreInfra}-{verdictIndex}-{phraseIndex}
 * Example: 42-85-1-2
 */
ogRouter.get('/image/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Try to serve stored image first (pixel-perfect from client)
    const storedImage = await getStoredOgImage(id);
    if (storedImage) {
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      res.send(storedImage);
      return;
    }

    // Fallback: generate with Satori if not stored
    const params = decodeOgParams(id);

    if (!params) {
      res.status(400).json({ error: 'Invalid ID format' });
      return;
    }

    const pngBuffer = await generateOgImage(params);

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.send(pngBuffer);
  } catch (error) {
    console.error('Error generating OG image:', error);
    next(error);
  }
});

/**
 * POST /api/v1/og/upload
 * Upload OG image from client (pixel-perfect HTML-to-image capture)
 *
 * Body: { id: string, image: string (base64 PNG) }
 */
const UploadSchema = z.object({
  id: z.string().regex(/^\d+-\d+-\d+-\d+(-[a-z]{2})?$/, 'Invalid ID format'),
  image: z.string().min(100), // Base64 PNG data
});

ogRouter.post('/upload', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, image } = UploadSchema.parse(req.body);

    // Check if already exists
    const exists = await hasStoredOgImage(id);
    if (exists) {
      res.json({ success: true, message: 'Image already exists', stored: false });
      return;
    }

    // Decode base64 image (remove data URL prefix if present)
    const base64Data = image.replace(/^data:image\/png;base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');

    // Validate it's a valid PNG (check magic bytes)
    if (imageBuffer.length < 8 || imageBuffer[0] !== 0x89 || imageBuffer[1] !== 0x50) {
      res.status(400).json({ error: 'Invalid PNG data' });
      return;
    }

    // Store the image
    const stored = await storeOgImage(id, imageBuffer);

    if (stored) {
      res.json({ success: true, message: 'Image stored', stored: true });
    } else {
      res.status(500).json({ error: 'Failed to store image' });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid request', details: error.errors });
      return;
    }
    console.error('Error uploading OG image:', error);
    next(error);
  }
});

/**
 * GET /api/v1/og/exists/:id
 * Check if OG image exists in storage
 */
ogRouter.get('/exists/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const exists = await hasStoredOgImage(id);
    res.json({ exists });
  } catch (error) {
    console.error('Error checking OG image:', error);
    next(error);
  }
});
