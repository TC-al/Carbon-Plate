import type { FoodItem } from './anthropic';

// Demo mode: deterministic mapping from image size -> a canned meal.
// Keeps the demo reliable when ANTHROPIC_API_KEY is missing.
const MEALS: { label: string; items: FoodItem[] }[] = [
  {
    label: 'Steak dinner',
    items: [
      { name: 'steak', grams: 220, confidence: 0.86 },
      { name: 'potato', grams: 180, confidence: 0.78 },
      { name: 'salad', grams: 90, confidence: 0.7 },
    ],
  },
  {
    label: 'Garden salad',
    items: [
      { name: 'lettuce', grams: 120, confidence: 0.82 },
      { name: 'tomato', grams: 70, confidence: 0.78 },
      { name: 'avocado', grams: 60, confidence: 0.72 },
      { name: 'cheese', grams: 25, confidence: 0.6 },
    ],
  },
  {
    label: 'Pasta night',
    items: [
      { name: 'pasta', grams: 250, confidence: 0.88 },
      { name: 'tomato', grams: 110, confidence: 0.74 },
      { name: 'cheese', grams: 30, confidence: 0.66 },
    ],
  },
  {
    label: 'Burger & fries',
    items: [
      { name: 'burger', grams: 200, confidence: 0.84 },
      { name: 'fries', grams: 150, confidence: 0.81 },
      { name: 'lettuce', grams: 20, confidence: 0.55 },
    ],
  },
  {
    label: 'Sushi platter',
    items: [
      { name: 'sushi', grams: 240, confidence: 0.85 },
      { name: 'salmon', grams: 60, confidence: 0.7 },
      { name: 'rice', grams: 90, confidence: 0.78 },
    ],
  },
];

export function mockMealForBytes(byteLength: number): { label: string; items: FoodItem[] } {
  const idx = byteLength % MEALS.length;
  return MEALS[idx];
}

export const MOCK_SWAPS = [
  { from: 'steak', to: 'mushroom + lentil patty', why: 'Same umami punch, a fraction of the footprint.' },
  { from: 'cheese', to: 'cashew cream', why: 'Creamy, dreamy, dairy-light.' },
  { from: 'shrimp', to: 'tofu', why: 'Trades trawler emissions for a quiet block of beans.' },
];
