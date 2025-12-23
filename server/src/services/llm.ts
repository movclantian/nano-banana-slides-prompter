import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
  baseURL: process.env.OPENAI_API_BASE || 'https://api.openai.com/v1',
});

export async function generateWithLLM(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const model = process.env.OPENAI_MODEL || 'gpt-4o';
  const maxTokens = parseInt(process.env.OPENAI_MAX_TOKENS || '16384', 10);
  const temperature = parseFloat(process.env.OPENAI_TEMPERATURE || '0.7');

  const response = await client.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature,
    max_tokens: maxTokens,
  });

  return response.choices[0]?.message?.content || '';
}
