// src/engine/fetchRates.ts
import { ExchangeRates } from "../types";
import { getCache, setCache, isCacheExpired } from "./cache";
import { COUNTRIES } from "../data/countries";

const STATIC_RATES_FALLBACK: ExchangeRates = {
  USD: 1.0,
  EUR: 0.92,
  INR: 84.0,
  JPY: 155.0,
  GBP: 0.78,
  CAD: 1.36,
  AUD: 1.50,
  CNY: 7.24,
  KRW: 1350.0,
  BRL: 5.25,
  MXN: 18.0,
  ZAR: 18.5,
  RUB: 91.0,
  TRY: 32.5,
  SAR: 3.75,
  AED: 3.67,
  SGD: 1.35,
  CHF: 0.90,
  SEK: 10.5,
  NOK: 10.8,
  DKK: 6.9,
  PLN: 4.0,
  ARS: 880.0,
  COP: 3900.0,
  CLP: 930.0,
  PEN: 3.7,
  NGN: 1400.0,
  EGP: 47.0,
  NZD: 1.65
};

export const fetchExchangeRates = async (): Promise<{ rates: ExchangeRates; cached: boolean; expired: boolean }> => {
  const cacheKey = "exchange_rates";
  const cachedRates = getCache<ExchangeRates>(cacheKey);
  const expired = isCacheExpired(cacheKey);

  if (cachedRates && !expired) {
    return { rates: cachedRates, cached: true, expired: false };
  }

  try {
    const res = await fetch("https://api.frankfurter.app/latest?base=USD");
    if (!res.ok) throw new Error("Frankfurter API response not ok");
    
    const data = await res.json();
    if (!data || !data.rates) throw new Error("Invalid Frankfurter data");

    const fullRates: ExchangeRates = { USD: 1.0, ...data.rates };
    
    // Fill in any country currency not present in the API using their ppp fallback or static fallback ratio
    for (const country of COUNTRIES) {
      if (!fullRates[country.currency]) {
        fullRates[country.currency] = STATIC_RATES_FALLBACK[country.currency] ?? country.ppp_fallback;
      }
    }

    setCache(cacheKey, fullRates, 24); // cache for 24 hours
    return { rates: fullRates, cached: false, expired: false };
  } catch (err) {
    console.warn("Using cached/fallback exchange rates due to error:", err);
    if (cachedRates) {
      return { rates: cachedRates, cached: true, expired: true };
    }

    // Prepare complete fallbacks for all currencies in country database
    const finalRates: ExchangeRates = { ...STATIC_RATES_FALLBACK };
    for (const country of COUNTRIES) {
      if (!finalRates[country.currency]) {
        finalRates[country.currency] = country.ppp_fallback;
      }
    }
    return { rates: finalRates, cached: false, expired: true };
  }
};
