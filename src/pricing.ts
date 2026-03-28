export const REGION_PRICE_MULTIPLIERS = {
  Norte: 1.08,
  Nordeste: 1.03,
  "Centro-Oeste": 1.0,
  Sudeste: 1.02,
  Sul: 0.98,
} as const;

export type Region = keyof typeof REGION_PRICE_MULTIPLIERS;
