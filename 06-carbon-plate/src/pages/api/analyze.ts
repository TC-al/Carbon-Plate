import type { APIRoute } from 'astro';
import { analyzeMealImage, hasApiKey } from '../../lib/anthropic';
import { mockMealForBytes } from '../../lib/mock';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { imageBase64, mediaType } = body as { imageBase64?: string; mediaType?: string };
    if (!imageBase64) {
      return json({ error: 'No image provided' }, 400);
    }

    // Estimate raw byte length for mock fallback / variety.
    const rawByteLen = Math.floor((imageBase64.length * 3) / 4);

    if (!hasApiKey()) {
      const mock = mockMealForBytes(rawByteLen);
      return json({ items: mock.items, mock: true, label: mock.label });
    }

    try {
      const items = await analyzeMealImage(imageBase64, mediaType || 'image/jpeg');
      if (!items.length) {
        const mock = mockMealForBytes(rawByteLen);
        return json({ items: mock.items, mock: true, label: mock.label });
      }
      return json({ items, mock: false });
    } catch (err) {
      console.error('Vision call failed; falling back to mock:', err);
      const mock = mockMealForBytes(rawByteLen);
      return json({ items: mock.items, mock: true, label: mock.label, fallback: true });
    }
  } catch (e) {
    return json({ error: 'bad request' }, 400);
  }
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}
