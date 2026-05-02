import type { APIRoute } from 'astro';
import { hasApiKey, suggestSwaps } from '../../lib/anthropic';
import { MOCK_SWAPS } from '../../lib/mock';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const items = Array.isArray(body?.items) ? body.items : [];
    if (!items.length) return json({ swaps: MOCK_SWAPS });

    if (!hasApiKey()) return json({ swaps: MOCK_SWAPS, mock: true });

    try {
      const swaps = await suggestSwaps(items);
      return json({ swaps: swaps.length ? swaps : MOCK_SWAPS });
    } catch (e) {
      console.error('Swap call failed:', e);
      return json({ swaps: MOCK_SWAPS, fallback: true });
    }
  } catch {
    return json({ swaps: MOCK_SWAPS });
  }
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}
