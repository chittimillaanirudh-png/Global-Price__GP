// src/engine/fetchWorldBank.ts
import { getCache, setCache, isCacheExpired } from "./cache";

export interface WorldBankData {
  [countryCode: string]: number;
}

export interface CommodityPrices {
  energy: number; // PNGASEUUSDM
  food: number;   // PWHEAMT
  steel: number;  // PIORECR
}

// Fallback values for commodities
const DEFAULT_COMMODITIES: CommodityPrices = {
  energy: 50.0,  // USD per MWh index
  food: 280.0,   // USD per metric ton
  steel: 110.0   // Iron Ore Price index
};

// Helper to parse World Bank JSON response
const parseWorldBankResponse = (json: any): WorldBankData => {
  const result: WorldBankData = {};
  if (!Array.isArray(json) || json.length < 2 || !Array.isArray(json[1])) {
    return result;
  }

  const entries = json[1];
  for (const entry of entries) {
    if (entry && entry.country && entry.country.id && entry.value !== null) {
      const code = entry.country.id.toUpperCase(); // e.g. "IN"
      result[code] = parseFloat(entry.value);
    }
  }
  return result;
};

export const fetchWorldBankPPP = async (): Promise<{ data: WorldBankData; cached: boolean; expired: boolean }> => {
  const key = "worldbank_ppp";
  const cached = getCache<WorldBankData>(key);
  const expired = isCacheExpired(key);

  if (cached && !expired) {
    return { data: cached, cached: true, expired: false };
  }

  try {
    const res = await fetch("https://api.worldbank.org/v2/country/all/indicator/PA.NUS.PPP?format=json&per_page=300&mrv=1");
    if (!res.ok) throw new Error("World Bank PPP request failed");
    const json = await res.json();
    const data = parseWorldBankResponse(json);

    if (Object.keys(data).length > 0) {
      setCache(key, data, 720); // 30 days
      return { data, cached: false, expired: false };
    }
    throw new Error("No valid records found in PPP response");
  } catch (err) {
    console.warn("Using cached/empty PPP data due to error:", err);
    return { data: cached || {}, cached: !!cached, expired: true };
  }
};

export const fetchWorldBankCPI = async (): Promise<{ data: WorldBankData; cached: boolean; expired: boolean }> => {
  const key = "worldbank_cpi";
  const cached = getCache<WorldBankData>(key);
  const expired = isCacheExpired(key);

  if (cached && !expired) {
    return { data: cached, cached: true, expired: false };
  }

  try {
    const res = await fetch("https://api.worldbank.org/v2/country/all/indicator/FP.CPI.TOTL?format=json&per_page=300&mrv=1");
    if (!res.ok) throw new Error("World Bank CPI request failed");
    const json = await res.json();
    const data = parseWorldBankResponse(json);

    if (Object.keys(data).length > 0) {
      setCache(key, data, 168); // 7 days
      return { data, cached: false, expired: false };
    }
    throw new Error("No valid records found in CPI response");
  } catch (err) {
    console.warn("Using cached/empty CPI data due to error:", err);
    return { data: cached || {}, cached: !!cached, expired: true };
  }
};

export const fetchWorldBankGDP = async (): Promise<{ data: WorldBankData; cached: boolean; expired: boolean }> => {
  const key = "worldbank_gdp";
  const cached = getCache<WorldBankData>(key);
  const expired = isCacheExpired(key);

  if (cached && !expired) {
    return { data: cached, cached: true, expired: false };
  }

  try {
    const res = await fetch("https://api.worldbank.org/v2/country/all/indicator/NY.GDP.MKTP.PP.CD?format=json&per_page=300&mrv=1");
    if (!res.ok) throw new Error("World Bank GDP request failed");
    const json = await res.json();
    const data = parseWorldBankResponse(json);

    if (Object.keys(data).length > 0) {
      // World Bank returns GDP in absolute currency, we want billion USD
      const billionGDP: WorldBankData = {};
      for (const code of Object.keys(data)) {
        billionGDP[code] = data[code] / 1e9;
      }
      setCache(key, billionGDP, 720); // 30 days
      return { data: billionGDP, cached: false, expired: false };
    }
    throw new Error("No valid records found in GDP response");
  } catch (err) {
    console.warn("Using cached/empty GDP data due to error:", err);
    return { data: cached || {}, cached: !!cached, expired: true };
  }
};

export const fetchCommodityPrices = async (): Promise<{ data: CommodityPrices; cached: boolean; expired: boolean }> => {
  const key = "commodity_prices";
  const cached = getCache<CommodityPrices>(key);
  const expired = isCacheExpired(key);

  if (cached && !expired) {
    return { data: cached, cached: true, expired: false };
  }

  try {
    const [energyRes, foodRes, steelRes] = await Promise.all([
      fetch("https://api.worldbank.org/v2/country/WLD/indicator/PNGASEUUSDM?format=json&mrv=1"),
      fetch("https://api.worldbank.org/v2/country/WLD/indicator/PWHEAMT?format=json&mrv=1"),
      fetch("https://api.worldbank.org/v2/country/WLD/indicator/PIORECR?format=json&mrv=1")
    ]);

    const [energyJson, foodJson, steelJson] = await Promise.all([
      energyRes.ok ? energyRes.json() : null,
      foodRes.ok ? foodRes.json() : null,
      steelRes.ok ? steelRes.json() : null
    ]);

    const getLatestValue = (json: any): number | null => {
      if (Array.isArray(json) && json.length >= 2 && Array.isArray(json[1])) {
        const val = json[1][0]?.value;
        return val ? parseFloat(val) : null;
      }
      return null;
    };

    const energy = getLatestValue(energyJson) ?? DEFAULT_COMMODITIES.energy;
    const food = getLatestValue(foodJson) ?? DEFAULT_COMMODITIES.food;
    const steel = getLatestValue(steelJson) ?? DEFAULT_COMMODITIES.steel;

    const data: CommodityPrices = { energy, food, steel };
    setCache(key, data, 168); // 7 days
    return { data, cached: false, expired: false };
  } catch (err) {
    console.warn("Using cached/default commodity prices due to error:", err);
    return { data: cached || DEFAULT_COMMODITIES, cached: !!cached, expired: true };
  }
};
