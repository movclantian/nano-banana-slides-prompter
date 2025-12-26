import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
  baseURL: process.env.OPENAI_API_BASE || 'https://api.openai.com/v1',
});

const model = process.env.OPENAI_MODEL || 'gpt-4o';

type MessageContent = string | Array<{ type: 'text'; text: string } | { type: 'image_url'; image_url: { url: string } }>;

export async function generateWithLLM(
  systemPrompt: string,
  userPrompt: string,
  pdfDataUrl?: string
): Promise<string> {
  // Build user message content - multimodal if PDF is provided
  let userContent: MessageContent;

  if (pdfDataUrl) {
    // Multimodal message with PDF as image (works with vision models)
    userContent = [
      { type: 'text', text: userPrompt },
      { type: 'image_url', image_url: { url: pdfDataUrl } }
    ];
  } else {
    userContent = userPrompt;
  }

  const response = await client.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userContent as any },
    ],
  });

  return response.choices[0]?.message?.content || '';
}

/**
 * Streaming version of generateWithLLM.
 * Yields text chunks as they arrive from the LLM.
 */
export async function* generateWithLLMStream(
  systemPrompt: string,
  userPrompt: string,
  pdfDataUrl?: string
): AsyncGenerator<string> {
  // Build user message content - multimodal if PDF is provided
  let userContent: MessageContent;

  if (pdfDataUrl) {
    userContent = [
      { type: 'text', text: userPrompt },
      { type: 'image_url', image_url: { url: pdfDataUrl } }
    ];
  } else {
    userContent = userPrompt;
  }

  const stream = await client.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userContent as any },
    ],
    stream: true,
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) {
      yield content;
    }
  }
}

