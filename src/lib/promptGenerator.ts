import type { SlidePromptConfig, GeneratedPrompt, SlideStyle, ColorPalette, LayoutStructure, AspectRatio } from '@/types/slidePrompt';

const styleDescriptions: Record<SlideStyle, string> = {
  professional: 'Clean, corporate design with professional typography, subtle gradients, and business-appropriate imagery. Use structured layouts with clear hierarchy.',
  technical: 'Blueprint-style with technical diagrams, grid layouts, and monospace fonts. Include data visualizations and schematic elements.',
  creative: 'Bold, artistic design with creative typography, vibrant colors, and expressive imagery. Use asymmetric layouts and visual storytelling.',
  infographic: 'Data-driven design with charts, icons, and visual statistics. Use clear visual hierarchy to present information at a glance.',
  educational: 'Clear, accessible design with step-by-step layouts, numbered sections, and supportive illustrations. Focus on learning outcomes.',
  'pixel-art': 'Retro pixel art aesthetic with 8-bit style graphics, pixel fonts, and nostalgic color palettes. Fun and memorable visuals.',
  minimalist: 'Ultra-clean design with abundant whitespace, simple typography, and minimal elements. Focus on essential content only.',
  'dark-neon': 'Dark backgrounds with vibrant neon accent colors, glowing effects, and high contrast. Cyberpunk-inspired aesthetic.',
  'hand-drawn': 'Organic, illustrated feel with sketchy lines, rough edges, and handwritten fonts. Warm and approachable style.',
  glassmorphism: 'Frosted glass effects with translucent layers, soft shadows, and blurred backgrounds. Modern and sophisticated.',
  vintage: '70s/80s inspired design with warm tones, retro typography, and nostalgic textures. Groovy and memorable.',
  '3d-isometric': 'Dimensional graphics with isometric illustrations, depth effects, and 3D elements. Technical yet engaging.',
  watercolor: 'Soft, artistic style with painted textures, flowing colors, and organic shapes. Elegant and creative.',
  newspaper: 'Editorial design with bold headlines, column layouts, serif fonts, and print-inspired aesthetics. Classic and authoritative.',
  'flat-design': 'Bold solid colors, simple geometric shapes, no gradients or shadows. Clean and modern.',
  'gradient-mesh': 'Modern style with flowing color transitions, mesh gradients, and abstract color blends. Contemporary and eye-catching.'
};

const colorPaletteDescriptions: Record<ColorPalette, string> = {
  'auto': 'Let the AI choose the best color palette based on the content and style',
  'corporate-blue': 'Navy blue (#1E3A5F), light blue (#4A90D9), white, and silver accents',
  'modern-purple': 'Deep purple (#6B21A8), violet (#8B5CF6), soft lavender, and white',
  'nature-green': 'Forest green (#166534), sage (#86EFAC), cream, and earthy browns',
  'warm-orange': 'Burnt orange (#EA580C), coral (#FB923C), cream, and deep brown',
  'elegant-monochrome': 'Black, white, and various shades of gray with subtle texture',
  'vibrant-gradient': 'Bold gradients from cyan to magenta, with electric accents',
  'ocean-teal': 'Deep teal (#0D9488), aquamarine (#5EEAD4), seafoam, and sandy beige',
  'sunset-pink': 'Hot pink (#EC4899), peach (#FBBF24), soft coral, and warm cream',
  'forest-earth': 'Deep brown (#78350F), terracotta (#D97706), olive green, and cream',
  'royal-gold': 'Royal blue (#1E40AF), gold (#F59E0B), ivory, and deep navy',
  'arctic-frost': 'Ice blue (#38BDF8), silver (#94A3B8), white, and pale lavender',
  'neon-night': 'Electric purple (#A855F7), neon green (#22C55E), hot pink, on dark background'
};

const layoutDescriptions: Record<LayoutStructure, string> = {
  'visual-heavy': '70% visuals, 30% text. Large hero images, minimal text, icon-based content.',
  'text-heavy': '30% visuals, 70% text. Detailed explanations with supporting graphics.',
  'balanced': '50% visuals, 50% text. Equal emphasis on imagery and written content.'
};

const aspectRatioDescriptions: Record<AspectRatio, string> = {
  '16:9': 'Standard widescreen presentation format (1920x1080)',
  '4:3': 'Traditional presentation format (1024x768)',
  '1:1': 'Square format ideal for social media (1080x1080)',
  '9:16': 'Vertical/portrait format for mobile or stories (1080x1920)'
};

function getContentSummary(config: SlidePromptConfig): string {
  const { content } = config;
  
  if (content.type === 'text' && content.text) {
    return content.text;
  }
  if (content.type === 'topic' && content.topic) {
    return `Topic: ${content.topic}`;
  }
  if (content.type === 'file' && content.fileContent) {
    return `Content from file "${content.fileName}":\n${content.fileContent}`;
  }
  if (content.type === 'url' && content.urlContent) {
    return `Content from URL "${content.url}":\n${content.urlContent}`;
  }
  
  return 'General presentation content';
}

export function generatePrompt(config: SlidePromptConfig): GeneratedPrompt {
  const { style, settings } = config;
  const contentSummary = getContentSummary(config);
  
  const systemPrompt = `You are an expert presentation designer and visual artist. Generate professional slide content with detailed visual descriptions that can be used to create stunning presentations. Follow the specified style guidelines precisely.`;
  
  const userPrompt = `Create a ${settings.slideCount}-slide presentation with the following specifications:

## Content
${contentSummary}

## Visual Style
**Style:** ${style.charAt(0).toUpperCase() + style.slice(1).replace('-', ' ')}
${styleDescriptions[style]}

## Color Palette
${colorPaletteDescriptions[settings.colorPalette]}

## Layout Structure
${layoutDescriptions[settings.layoutStructure]}

## Format
**Aspect Ratio:** ${settings.aspectRatio} - ${aspectRatioDescriptions[settings.aspectRatio]}

## Instructions
For each slide, provide:
1. **Slide Title** - Clear, engaging headline
2. **Visual Description** - Detailed description of the main visual/image to generate
3. **Key Points** - 2-4 bullet points or text elements
4. **Design Notes** - Specific layout and styling instructions

Ensure visual consistency across all slides. Each visual description should be detailed enough for an AI image generator to create the exact image needed.

Generate all ${settings.slideCount} slides now.`;

  const plainText = `${systemPrompt}

---

${userPrompt}`;

  const jsonFormat = {
    model: 'google/gemini-2.5-flash',
    messages: [
      { role: 'system' as const, content: systemPrompt },
      { role: 'user' as const, content: userPrompt }
    ]
  };

  return { plainText, jsonFormat };
}
