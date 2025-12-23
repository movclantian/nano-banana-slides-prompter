import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { generateWithLLM } from '../services/llm';
import {
  NANO_BANANA_PRO_SYSTEM_PROMPT,
  buildUserPrompt,
} from '../prompts/system';
import type { GeneratePromptResponse } from '../prompts/types';
import { parseSlides } from '../prompts/types';

const generateSchema = z.object({
  content: z.object({
    type: z.enum(['text', 'topic', 'file', 'url']),
    text: z.string().optional(),
    topic: z.string().optional(),
    fileContent: z.string().optional(),
    fileName: z.string().optional(),
    url: z.string().optional(),
    urlContent: z.string().optional(),
  }),
  style: z.enum([
    'professional',
    'technical',
    'creative',
    'infographic',
    'educational',
    'pixel-art',
    'minimalist',
    'dark-neon',
    'hand-drawn',
    'glassmorphism',
    'vintage',
    '3d-isometric',
    'watercolor',
    'newspaper',
    'flat-design',
    'gradient-mesh',
  ]),
  settings: z.object({
    aspectRatio: z.enum(['16:9', '4:3', '1:1', '9:16']),
    slideCount: z.number().min(1).max(20),
    colorPalette: z.enum([
      'auto',
      'corporate-blue',
      'modern-purple',
      'nature-green',
      'warm-orange',
      'elegant-monochrome',
      'vibrant-gradient',
      'ocean-teal',
      'sunset-pink',
      'forest-earth',
      'royal-gold',
      'arctic-frost',
      'neon-night',
    ]),
    layoutStructure: z.enum(['visual-heavy', 'text-heavy', 'balanced']),
  }),
});

export const promptRouter = new Hono();

promptRouter.post(
  '/generate-prompt',
  zValidator('json', generateSchema),
  async (c) => {
    const body = c.req.valid('json');

    // Extract content based on type
    let contentText = '';
    switch (body.content.type) {
      case 'text':
        contentText = body.content.text || '';
        break;
      case 'topic':
        contentText = `Topic: ${body.content.topic || 'General presentation'}`;
        break;
      case 'file':
        contentText = body.content.fileContent
          ? `Content from file "${body.content.fileName || 'uploaded file'}":\n${body.content.fileContent}`
          : '';
        break;
      case 'url':
        contentText = body.content.urlContent
          ? `Content from URL "${body.content.url}":\n${body.content.urlContent}`
          : body.content.url
            ? `Create a presentation about the content from: ${body.content.url}`
            : '';
        break;
    }

    if (!contentText.trim()) {
      return c.json<GeneratePromptResponse>(
        {
          success: false,
          error: 'No content provided',
        },
        400
      );
    }

    const userPrompt = buildUserPrompt({
      content: contentText,
      style: body.style,
      colorPalette: body.settings.colorPalette,
      layoutStructure: body.settings.layoutStructure,
      aspectRatio: body.settings.aspectRatio,
      slideCount: body.settings.slideCount,
    });

    try {
      const generatedPrompts = await generateWithLLM(
        NANO_BANANA_PRO_SYSTEM_PROMPT,
        userPrompt
      );

      // Parse the output into individual slides
      const slides = parseSlides(generatedPrompts);

      return c.json<GeneratePromptResponse>({
        success: true,
        prompts: generatedPrompts,
        slides,
        metadata: {
          style: body.style,
          slideCount: body.settings.slideCount,
          aspectRatio: body.settings.aspectRatio,
        },
      });
    } catch (error) {
      console.error('LLM generation error:', error);
      return c.json<GeneratePromptResponse>(
        {
          success: false,
          error:
            error instanceof Error ? error.message : 'Failed to generate prompts',
        },
        500
      );
    }
  }
);
