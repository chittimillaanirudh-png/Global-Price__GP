// src/engine/predictPrice.ts
import { CountryData, ProductCategory, ExchangeRates } from "../types";

export const predictPrice = (
  GP: number,
  targetCountry: CountryData,
  category: ProductCategory,
  rates: ExchangeRates,
  pppData: { [code: string]: number },
  cpiData: { [code: string]: number },
  scaleFactor: number = 1.0,
  commodityPrices?: { energy: number; food: number; steel: number }
): number => {
  // Compute basket cost in local currency for target country
  const BASE_ENERGY_USD = 50.0;
  const BASE_FOOD_USD = 0.30;
  const BASE_STEEL_USD = 0.80;
  const LABOR_USD = 2.00;

  const energyUSD = commodityPrices ? BASE_ENERGY_USD * (commodityPrices.energy / 50.0) : BASE_ENERGY_USD;
  const foodUSD = commodityPrices ? BASE_FOOD_USD * (commodityPrices.food / 280.0) : BASE_FOOD_USD;
  const steelUSD = commodityPrices ? BASE_STEEL_USD * (commodityPrices.steel / 110.0) : BASE_STEEL_USD;

  const basketUSD = energyUSD + foodUSD + steelUSD + LABOR_USD;
  const E_c = rates[targetCountry.currency] ?? targetCountry.ppp_fallback;
  const V_c = basketUSD * E_c;

  // Retrieve destination friction factors (theta) based on product category
  let duty = targetCountry.duty_electronics;
  let tax = targetCountry.tax_electronics;

  if (category.duty_bracket === "food") {
    duty = targetCountry.duty_food;
    tax = targetCountry.tax_food;
  } else if (category.duty_bracket === "medicine") {
    duty = targetCountry.duty_medicine;
    tax = targetCountry.tax_medicine;
  } else if (category.duty_bracket === "fuel") {
    duty = targetCountry.duty_fuel;
    tax = targetCountry.tax_fuel;
  }

  const theta = (1 + duty) * (1 + tax) * targetCountry.logistics_score * (1 + targetCountry.retail_margin);

  // PPP and CPI corrections for target country
  const ppp = pppData[targetCountry.code] ?? targetCountry.ppp_fallback;
  const cpi = cpiData[targetCountry.code] ?? 100.0;
  const cpi_ratio = cpi / 100.0;

  // Reverse formula:
  // P_base(c)      = GP * scaleFactor * V_c * (E_c / PPP_c) * (CPI_c / CPI_0)
  // P_predicted(c) = P_base(c) * theta
  // Ensure we don't divide by zero
  const ppp_divisor = ppp > 0 ? ppp : 1.0;
  const P_base = GP * scaleFactor * V_c * (E_c / ppp_divisor) * cpi_ratio;
  const P_predicted = P_base * theta;

  return isNaN(P_predicted) || P_predicted < 0 ? 0 : P_predicted;
};
