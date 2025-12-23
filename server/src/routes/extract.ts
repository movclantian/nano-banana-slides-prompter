import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { extractUrlContent } from '../services/scraper';
import type { ExtractUrlResponse } from '../prompts/types';

const extractSchema = z.object({
  url: z.string().url('Invalid URL format'),
});

export const extractRouter = new Hono();

extractRouter.post(
  '/extract-url',
  zValidator('json', extractSchema),
  async (c) => {
    const { url } = c.req.valid('json');

    try {
      const extracted = await extractUrlContent(url);

      return c.json<ExtractUrlResponse>({
        success: true,
        data: {
          title: extracted.title,
          content: extracted.content,
          description: extracted.description,
          url,
        },
      });
    } catch (error) {
      console.error('URL extraction error:', error);
      return c.json<ExtractUrlResponse>(
        {
          success: false,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to extract URL content',
        },
        500
      );
    }
  }
);
