import type {
  ContentInput,
  SlideStyle,
  PresentationSettings,
  ParsedSlide,
} from '@/types/slidePrompt';

const API_BASE = import.meta.env.VITE_API_BASE || '';

export interface GeneratePromptRequest {
  content: ContentInput;
  style: SlideStyle;
  settings: PresentationSettings;
}

export interface GeneratePromptResponse {
  success: boolean;
  prompts?: string;
  slides?: ParsedSlide[];
  error?: string;
  metadata?: {
    style: SlideStyle;
    slideCount: number;
    aspectRatio: string;
  };
}

export interface ExtractUrlResponse {
  success: boolean;
  data?: {
    title: string;
    content: string;
    description?: string;
    url: string;
  };
  error?: string;
}

export async function generatePrompt(
  request: GeneratePromptRequest
): Promise<GeneratePromptResponse> {
  const response = await fetch(`${API_BASE}/api/generate-prompt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `HTTP error: ${response.status}`);
  }

  return response.json();
}

export async function extractUrl(url: string): Promise<ExtractUrlResponse> {
  const response = await fetch(`${API_BASE}/api/extract-url`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `HTTP error: ${response.status}`);
  }

  return response.json();
}
