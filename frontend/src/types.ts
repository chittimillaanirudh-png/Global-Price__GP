// src/types.ts

export interface CountryData {
  name: string;
  code: string;
  currency: string;
  symbol: string;
  flag: string;
  tax_electronics: number;
  tax_food: number;
  tax_medicine: number;
  tax_fuel: number;
  duty_electronics: number;
  duty_food: number;
  duty_medicine: number;
  duty_fuel: number;
  logistics_score: number;
  retail_margin: number;
  data_quality: number;
  ppp_fallback: number;
  gdp_ppp_billion: number;
}

export interface ProductCategory {
  id: string;
  name: string;
  duty_bracket: string;
  shipping_weight_factor: number;
  typical_margin_min: number;
  typical_margin_max: number;
  demand_sensitivity: number;
  examples: string[];
}

export interface ExchangeRates {
  [currency: string]: number;
}

export interface WorldBankEntry {
  countryiso3code: string;
  value: number | null;
  date: string;
}

export interface GPResult {
  GP: number;
  V_c: number;
  theta: number;
  P_clean: number;
  PPNP_adj: number;
  scale_factor: number;
  confidence: 'high' | 'medium' | 'low';
  countries_contributing: number;
}

export interface CountryPrediction {
  country: CountryData;
  predicted_price: number;
  theta: number;
  vs_user_percent: number;
  is_cheaper: boolean;
  is_priority: boolean;
}

export interface CalculatorInput {
  product_name: string;
  home_country: CountryData;
  local_price: number;
  priority_country?: CountryData;
  category: ProductCategory;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning';
  title: string;
  message: string;
  duration?: number;
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expires_in_hours: number;
}
