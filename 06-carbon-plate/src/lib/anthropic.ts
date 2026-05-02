import Anthropic from '@anthropic-ai/sdk';

export type FoodItem = { name: string; grams: number; confidence: number };

const MODEL = 'claude-opus-4-5'; // vision-capable

export function hasApiKey(): boolean {
  return !!(process.env.ANTHROPIC_API_KEY || import.meta.env.ANTHROPIC_API_KEY);
}

function client(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY || (import.meta.env.ANTHROPIC_API_KEY as string);
  return new Anthropic({ apiKey });
}

const ANALYZE_PROMPT = `You are a careful food-vision assistant for a carbon-footprint app.
Look at the meal image and list the *visible* food components.

Return STRICT JSON only, no prose, no markdown fences. Schema:
{ "items": [ { "name": string, "grams": number, "confidence": number } ] }

Rules:
- "name" should be a single common food word lowercase (e.g. "steak", "rice", "salad", "salmon", "pasta", "bread").
- "grams" is your best estimate of edible portion mass.
- "confidence" is 0..1.
- Aim for 2-6 items. Prefer fewer accurate items over many speculative ones.`;

export async function analyzeMealImage(base64: string, mediaType: string): Promise<FoodItem[]> {
  const c = client();
  const resp = await c.messages.create({
    model: MODEL,
    max_tokens: 600,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: mediaType as 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif',
              data: base64,
            },
          },
          { type: 'text', text: ANALYZE_PROMPT },
        ],
      },
    ],
  });

  const text = resp.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('\n')
    .trim();

  const json = extractJSON(text);
  if (!json || !Array.isArray(json.items)) throw new Error('Bad response from model');
  return json.items
    .filter((i: any) => i && typeof i.name === 'string')
    .map((i: any) => ({
      name: String(i.name).toLowerCase(),
      grams: Math.max(1, Math.round(Number(i.grams) || 100)),
      confidence: Math.max(0, Math.min(1, Number(i.confidence) || 0.5)),
    }));
}

const SWAP_PROMPT = (items: { name: string; grams: number }[]) => `You're a friendly cook helping reduce a meal's carbon footprint.
The meal contains: ${items.map((i) => `${i.grams}g ${i.name}`).join(', ')}.

Suggest exactly 3 ingredient swaps that meaningfully lower CO2 while keeping the meal recognizable and tasty.
Return STRICT JSON only:
{ "swaps": [ { "from": string, "to": string, "why": string } ] }
"why" must be one short sentence, warm tone, no preachiness.`;

export async function suggestSwaps(items: { name: string; grams: number }[]) {
  const c = client();
  const resp = await c.messages.create({
    model: MODEL,
    max_tokens: 400,
    messages: [{ role: 'user', content: SWAP_PROMPT(items) }],
  });
  const text = resp.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('\n');
  const json = extractJSON(text);
  if (!json || !Array.isArray(json.swaps)) return [];
  return json.swaps.slice(0, 3);
}

function extractJSON(text: string): any | null {
  // strip code fences if any
  const cleaned = text.replace(/```json|```/g, '').trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start === -1 || end === -1) return null;
  try {
    return JSON.parse(cleaned.slice(start, end + 1));
  } catch {
    return null;
  }
}
