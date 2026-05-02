// kg CO2-eq per 100g of food, mostly cradle-to-fork.
// Sources: Poore & Nemecek (2018), Our World in Data, ADEME Agribalyse.
// These are honest approximations. Don't take them to a courtroom.
export const FOOD_COEFFICIENTS: Record<string, number> = {
  // proteins
  beef: 6.0,
  steak: 6.0,
  lamb: 3.95,
  pork: 1.21,
  bacon: 1.5,
  chicken: 0.99,
  turkey: 1.05,
  egg: 0.45,
  fish: 0.51,
  salmon: 1.18,
  tuna: 0.61,
  shrimp: 1.85,
  tofu: 0.32,
  beans: 0.2,
  lentils: 0.18,
  // dairy
  cheese: 2.4,
  milk: 0.32,
  yogurt: 0.22,
  butter: 1.21,
  // grains/starch
  rice: 0.4,
  bread: 0.14,
  pasta: 0.12,
  noodles: 0.12,
  potato: 0.05,
  fries: 0.21,
  // veg & fruit
  tomato: 0.21,
  lettuce: 0.05,
  salad: 0.08,
  onion: 0.03,
  avocado: 0.21,
  apple: 0.04,
  banana: 0.07,
  // misc
  chocolate: 1.9,
  coffee: 1.65,
  wine: 0.14,
  beer: 0.07,
  oil: 0.6,
  sushi: 0.4,
  burger: 2.0,
  pizza: 0.9,
};

const ALIASES: Record<string, string> = {
  ribeye: 'steak',
  sirloin: 'steak',
  hamburger: 'burger',
  cheeseburger: 'burger',
  spaghetti: 'pasta',
  ramen: 'noodles',
  greens: 'salad',
  lettucewrap: 'lettuce',
  fry: 'fries',
  chip: 'fries',
  prawn: 'shrimp',
  prawns: 'shrimp',
};

export function lookupCoefficient(rawName: string): { key: string; kgCO2per100g: number } {
  const name = rawName.toLowerCase().trim();
  // direct
  if (FOOD_COEFFICIENTS[name] != null) return { key: name, kgCO2per100g: FOOD_COEFFICIENTS[name] };
  if (ALIASES[name] && FOOD_COEFFICIENTS[ALIASES[name]] != null) {
    return { key: ALIASES[name], kgCO2per100g: FOOD_COEFFICIENTS[ALIASES[name]] };
  }
  // word-contains
  for (const key of Object.keys(FOOD_COEFFICIENTS)) {
    if (name.includes(key) || key.includes(name)) {
      return { key, kgCO2per100g: FOOD_COEFFICIENTS[key] };
    }
  }
  for (const [alias, target] of Object.entries(ALIASES)) {
    if (name.includes(alias)) return { key: target, kgCO2per100g: FOOD_COEFFICIENTS[target] };
  }
  // unknown — assume veggie-ish baseline
  return { key: 'unknown', kgCO2per100g: 0.25 };
}

export function carbonForItem(name: string, grams: number): number {
  const { kgCO2per100g } = lookupCoefficient(name);
  return (kgCO2per100g * grams) / 100;
}

// Ocean equivalents — phytoplankton fixes ~50 g C / m² / year ~= ~183 g CO2 / m² / year.
// So 1 kg CO2 needs ~5.46 m² of phytoplankton for a year.
export function phytoplanktonM2(kgCO2: number): number {
  return kgCO2 * 5.46;
}

// Average passenger car: ~0.17 kg CO2 / km. So 1 kg CO2 ≈ 5.88 km of driving.
export function kmDriven(kgCO2: number): number {
  return kgCO2 / 0.17;
}
