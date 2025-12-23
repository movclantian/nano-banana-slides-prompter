import * as cheerio from 'cheerio';

export interface ExtractedContent {
  title: string;
  content: string;
  description?: string;
}

export async function extractUrlContent(url: string): Promise<ExtractedContent> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; SlidePromptBot/1.0; +https://github.com/slide-prompt-generator)',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  // Remove noise elements
  $('script, style, nav, footer, header, aside, iframe, noscript, [role="navigation"], [role="banner"], .nav, .footer, .header, .sidebar, .advertisement, .ad').remove();

  // Extract title
  const title = $('title').text().trim() ||
    $('h1').first().text().trim() ||
    $('meta[property="og:title"]').attr('content') ||
    '';

  // Extract description
  const description = $('meta[name="description"]').attr('content') ||
    $('meta[property="og:description"]').attr('content') ||
    '';

  // Extract main content
  // Try specific content selectors first, then fall back to body
  const contentSelectors = [
    'article',
    'main',
    '[role="main"]',
    '.content',
    '.post-content',
    '.article-content',
    '.entry-content',
    '#content',
    '#main-content',
  ];

  let contentElement = null;
  for (const selector of contentSelectors) {
    const el = $(selector);
    if (el.length > 0 && el.text().trim().length > 100) {
      contentElement = el;
      break;
    }
  }

  // Fall back to body if no content container found
  if (!contentElement) {
    contentElement = $('body');
  }

  // Clean and extract text
  const content = contentElement
    .text()
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 10000); // Limit to 10,000 characters

  return { title, content, description };
}
