import { NextResponse } from 'next/server';

// Cursuri BNR de rezervă (actualizate 2 Oct 2026) - folosite DOAR dacă ambele API-uri externe eșuează
// Cursuri BNR oficiale 2 octombrie 2026 (EUR record +0.067)
const FALLBACK_RATES: Record<string, number> = {
  RON: 1.0,
  EUR: 5.3447,
  USD: 4.7519,
  GBP: 6.2764,
  CHF: 5.7347,
};

type RateSource = {
  rates: Record<string, number>;
  source: string;
};

// Sursa 1: Frankfurter.app (date de la Banca Centrală Europeană - ECB, actualizate zilnic)
async function fetchFromFrankfurter(): Promise<RateSource> {
  const res = await fetch('https://api.frankfurter.app/latest?base=EUR&symbols=RON,USD,GBP,CHF', {
    // Nu folosim cache Next.js - vrem răspuns proaspăt de la ECB
    cache: 'no-store',
    headers: { 'Accept': 'application/json' },
    signal: AbortSignal.timeout(5000), // 5 secunde timeout
  });

  if (!res.ok) throw new Error(`Frankfurter: ${res.status}`);

  const data = await res.json();
  const r = data.rates as Record<string, number>;
  const ronPerEur = r['RON'] || FALLBACK_RATES.EUR; // ECB date

  return {
    source: 'ECB / Frankfurter.app (Live)',
    rates: {
      RON: 1.0,
      EUR: Number(ronPerEur.toFixed(4)),
      USD: Number((ronPerEur / r['USD']).toFixed(4)),
      GBP: Number((ronPerEur / r['GBP']).toFixed(4)),
      CHF: Number((ronPerEur / r['CHF']).toFixed(4)),
    },
  };
}

// Sursa 2: Open Exchange Rates (actualizat la fiecare 24h pe planul gratuit)
async function fetchFromOpenER(): Promise<RateSource> {
  const res = await fetch('https://open.er-api.com/v6/latest/EUR', {
    cache: 'no-store',
    headers: { 'Accept': 'application/json' },
    signal: AbortSignal.timeout(5000),
  });

  if (!res.ok) throw new Error(`OpenER: ${res.status}`);

  const data = await res.json();
  const r = data.rates as Record<string, number>;
  const ronPerEur = r['RON'] || FALLBACK_RATES.EUR;

  return {
    source: 'Open Exchange Rates (Live)',
    rates: {
      RON: 1.0,
      EUR: Number(ronPerEur.toFixed(4)),
      USD: Number((ronPerEur / r['USD']).toFixed(4)),
      GBP: Number((ronPerEur / r['GBP']).toFixed(4)),
      CHF: Number((ronPerEur / r['CHF']).toFixed(4)),
    },
  };
}

export async function GET() {
  const now = new Date().toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' });
  const date = new Date().toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit', year: 'numeric' });

  // Încercăm mai întâi Frankfurter (ECB)
  try {
    const result = await fetchFromFrankfurter();
    return NextResponse.json({
      success: true,
      source: result.source,
      updatedAt: `${date}, ora ${now}`,
      rates: result.rates,
    });
  } catch (err1) {
    console.warn('[exchange-rates] Frankfurter failed, trying OpenER...', err1);

    // Fallback către Open Exchange Rates
    try {
      const result = await fetchFromOpenER();
      return NextResponse.json({
        success: true,
        source: result.source,
        updatedAt: `${date}, ora ${now}`,
        rates: result.rates,
      });
    } catch (err2) {
      console.error('[exchange-rates] Both APIs failed, using BNR static fallback', err2);

      // Ultimul resort: cursuri BNR statice
      return NextResponse.json({
        success: false,
        source: 'BNR Referință Statică (Offline)',
        updatedAt: `Actualizat manual 02.10.2026`,
        rates: FALLBACK_RATES,
      });
    }
  }
}
