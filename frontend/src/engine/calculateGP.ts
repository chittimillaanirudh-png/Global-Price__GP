// src/engine/calculateGP.ts
import { CountryData, ProductCategory, ExchangeRates, GPResult } from "../types";
import { getPreviousGP, saveGP } from "./cache";

export const calculateGP = (
  localPrice: number,
  country: CountryData,
  category: ProductCategory,
  rates: ExchangeRates,
  pppData: { [code: string]: number },
  cpiData: { [code: string]: number },
  commodityPrices?: { energy: number; food: number; steel: number }
): GPResult => {
  // STEP 1 — Physical Anchor Basket (GFRB)
  // Base commodity anchor prices:
  const BASE_ENERGY_USD = 50.0;
  const BASE_FOOD_USD = 0.30;
  const BASE_STEEL_USD = 0.80;
  const LABOR_USD = 2.00;

  // Scale commodity prices dynamically if live World Bank indices are available
  const energyUSD = commodityPrices ? BASE_ENERGY_USD * (commodityPrices.energy / 50.0) : BASE_ENERGY_USD;
  // If food commodities are index-based (wheat per metric ton is ~280 USD), we can normalize it:
  const foodUSD = commodityPrices ? BASE_FOOD_USD * (commodityPrices.food / 280.0) : BASE_FOOD_USD;
  const steelUSD = commodityPrices ? BASE_STEEL_USD * (commodityPrices.steel / 110.0) : BASE_STEEL_USD;

  const basketUSD = energyUSD + foodUSD + steelUSD + LABOR_USD;
  const E_c = rates[country.currency] ?? country.ppp_fallback;
  const V_c = basketUSD * E_c;

  // STEP 2 — Regional Adjustment Factor θ (Theta)
  let duty = country.duty_electronics;
  let tax = country.tax_electronics;

  if (category.duty_bracket === "food") {
    duty = country.duty_food;
    tax = country.tax_food;
  } else if (category.duty_bracket === "medicine") {
    duty = country.duty_medicine;
    tax = country.tax_medicine;
  } else if (category.duty_bracket === "fuel") {
    duty = country.duty_fuel;
    tax = country.tax_fuel;
  }

  // Calculate theta: (1 + duty) * (1 + tax) * logistics_score * (1 + retail_margin)
  const theta = (1 + duty) * (1 + tax) * country.logistics_score * (1 + country.retail_margin);

  // STEP 3 — Strip frictions
  const P_clean = localPrice / theta;

  // STEP 4 — Normalize against basket cost
  const PPNP = P_clean / V_c;

  // STEP 5 — PPP and CPI corrections
  const ppp = pppData[country.code] ?? country.ppp_fallback;
  const cpi = cpiData[country.code] ?? 100.0;
  const cpi_ratio = 100.0 / cpi;

  // PPNP_adjusted = PPNP * (PPP_c / E_c) * (CPI_0 / CPI_c)
  const PPNP_adj = PPNP * (ppp / E_c) * cpi_ratio;

  // STEP 6 — EWMA Smoothing
  const previousGP = getPreviousGP(category.id);
  const finalGP = previousGP !== null 
    ? (0.15 * PPNP_adj + 0.85 * previousGP) 
    : PPNP_adj;

  saveGP(category.id, finalGP);

  // Determine confidence based on data quality score
  let confidence: 'high' | 'medium' | 'low' = 'medium';
  if (country.data_quality > 0.85) {
    confidence = 'high';
  } else if (country.data_quality < 0.55) {
    confidence = 'low';
  }

  return {
    GP: finalGP,
    V_c,
    theta,
    P_clean,
    PPNP_adj,
    scale_factor: 1.0, // Base scale is normalized to 1.0 relative to US standard reference
    confidence,
    countries_contributing: 195
  };
};
