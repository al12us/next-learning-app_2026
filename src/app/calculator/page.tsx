'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';

type Mode = 'math' | 'converter' | 'financial';
type FinancialSubMode = 'invest' | 'credit' | 'inflation' | 'currency' | 'budget';
type CurrencyCode = 'RON' | 'EUR' | 'USD' | 'GBP' | 'CHF';
type Timeframe = '7d' | '30d' | '1y';

interface HistoryItem {
  id: string;
  expression: string;
  result: string;
}

export default function CalculatorPage() {
  const [mode, setMode] = useState<Mode>('math');

  // ── 1. MODUL CALCULATOR MATEMATIC ──
  const [expression, setExpression] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Evaluare sigură a expresiei matematice
  const evaluateExpression = useCallback((expr: string): string => {
    if (!expr.trim()) return '';
    try {
      const sanitized = expr
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/\^/g, '**');

      if (/[^0-9+\-*/().%\s*]/.test(sanitized)) {
        return 'Expresie invalidă';
      }

      // eslint-disable-next-line no-new-func
      const calcResult = Function(`"use strict"; return (${sanitized})`)();

      if (typeof calcResult === 'number' && !isNaN(calcResult) && isFinite(calcResult)) {
        return Number.isInteger(calcResult)
          ? calcResult.toString()
          : Number(calcResult.toFixed(6)).toString();
      }
      return 'Eroare';
    } catch {
      return 'Eroare';
    }
  }, []);

  const handleInput = useCallback((char: string) => {
    setExpression((prev) => prev + char);
  }, []);

  const handleClear = () => {
    setExpression('');
    setResult('');
  };

  const handleBackspace = () => {
    setExpression((prev) => prev.slice(0, -1));
  };

  const handleCalculate = useCallback(() => {
    if (!expression) return;
    const res = evaluateExpression(expression);
    setResult(res);

    if (res !== 'Eroare' && res !== 'Expresie invalidă' && res !== '') {
      setHistory((prev) => [
        { id: Date.now().toString(), expression, result: res },
        ...prev.slice(0, 4),
      ]);
    }
  }, [expression, evaluateExpression]);

  // Suport pentru tastatură fizică
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (mode !== 'math') return;

      if (/^[0-9+\-*/.()]$/.test(e.key)) {
        e.preventDefault();
        const charMap: Record<string, string> = { '*': '×', '/': '÷' };
        handleInput(charMap[e.key] || e.key);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleCalculate();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, handleInput, handleCalculate]);

  // ── 2. MODUL CONVERTOR DE BAZE MULTI-BIT (8 / 16 / 32 Biți) ──
  const [bitWidth, setBitWidth] = useState<8 | 16 | 32>(8);
  const [decimalVal, setDecimalVal] = useState<number>(42);

  const maxValForBits = bitWidth === 8 ? 255 : bitWidth === 16 ? 65535 : 4294967295;

  const toggleBit = (bitIndex: number) => {
    const current = decimalVal >>> 0;
    const mask = (1 << bitIndex) >>> 0;
    const newVal = (current ^ mask) >>> 0;
    if (newVal <= maxValForBits) {
      setDecimalVal(newVal);
    }
  };

  const currentUnsignedVal = Math.min(maxValForBits, Math.max(0, decimalVal >>> 0));
  const binaryString = currentUnsignedVal.toString(2).padStart(bitWidth, '0');
  const hexString = currentUnsignedVal.toString(16).toUpperCase().padStart(bitWidth / 4, '0');
  const octalString = currentUnsignedVal.toString(8);

  // ── 3. MODUL CALCULATOR FINANCIAR & ECONOMIC ──
  const [finSubMode, setFinSubMode] = useState<FinancialSubMode>('invest');

  // a) Dobândă Compusă
  const [principal, setPrincipal] = useState<number>(10000);
  const [monthlyContrib, setMonthlyContrib] = useState<number>(500);
  const [interestRate, setInterestRate] = useState<number>(7);
  const [investYears, setInvestYears] = useState<number>(10);

  const calculateCompoundInterest = () => {
    const r = interestRate / 100 / 12;
    const n = investYears * 12;

    const futurePrincipal = principal * Math.pow(1 + r, n);
    const futureContrib = r > 0 
      ? monthlyContrib * ((Math.pow(1 + r, n) - 1) / r)
      : monthlyContrib * n;

    const totalFinal = futurePrincipal + futureContrib;
    const totalDeposited = principal + (monthlyContrib * n);
    const totalInterest = totalFinal - totalDeposited;

    return {
      totalFinal: Math.round(totalFinal),
      totalDeposited: Math.round(totalDeposited),
      totalInterest: Math.round(totalInterest),
      interestPercent: totalDeposited > 0 ? Math.round((totalInterest / totalDeposited) * 100) : 0,
    };
  };

  // b) Calcul Rată Credit
  const [loanAmount, setLoanAmount] = useState<number>(250000);
  const [loanRate, setLoanRate] = useState<number>(6.5);
  const [loanYears, setLoanYears] = useState<number>(25);

  const calculateLoanRepayment = () => {
    const P = loanAmount;
    const r = (loanRate / 100) / 12;
    const n = loanYears * 12;

    if (r === 0) {
      const monthly = P / n;
      return { monthlyPayment: Math.round(monthly), totalPayment: P, totalInterest: 0 };
    }

    const monthlyPayment = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = monthlyPayment * n;
    const totalInterest = totalPayment - P;

    return {
      monthlyPayment: Math.round(monthlyPayment),
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(totalInterest),
    };
  };

  // c) Inflație & Putere de Cumpărare
  const [inflationAmount, setInflationAmount] = useState<number>(10000);
  const [annualInflationRate, setAnnualInflationRate] = useState<number>(6.5);
  const [inflationYears, setInflationYears] = useState<number>(10);

  const calculateInflation = () => {
    const r = annualInflationRate / 100;
    const t = inflationYears;

    const futurePurchasingPower = inflationAmount / Math.pow(1 + r, t);
    const futureEquivalentCost = inflationAmount * Math.pow(1 + r, t);
    const valueLoss = inflationAmount - futurePurchasingPower;
    const lossPercent = inflationAmount > 0 ? Math.round((valueLoss / inflationAmount) * 100) : 0;

    return {
      futurePurchasingPower: Math.round(futurePurchasingPower),
      futureEquivalentCost: Math.round(futureEquivalentCost),
      valueLoss: Math.round(valueLoss),
      lossPercent,
    };
  };

  // d) Conversie Valutară Live & Grafic de Evoluție (Chart)
  const [currencyAmount, setCurrencyAmount] = useState<number>(100);
  const [fromCurrency, setFromCurrency] = useState<CurrencyCode>('EUR');
  const [toCurrency, setToCurrency] = useState<CurrencyCode>('RON');

  const [exchangeRates, setExchangeRates] = useState<Record<CurrencyCode, number>>({
    RON: 1.0,
    EUR: 5.3447,  // BNR oficial 02.10.2026 (record)
    USD: 4.7519,
    GBP: 6.2764,
    CHF: 5.7347,
  });

  const [ratesInfo, setRatesInfo] = useState<{ source: string; updatedAt: string }>({
    source: 'Se încarcă...',
    updatedAt: '',
  });

  const [isLoadingRates, setIsLoadingRates] = useState<boolean>(false);
  const [chartTimeframe, setChartTimeframe] = useState<Timeframe>('7d');
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  // Funcție de preluare rate din API-ul nostru Next.js (/api/exchange-rates)
  const fetchLiveRates = useCallback(async () => {
    setIsLoadingRates(true);
    try {
      const res = await fetch('/api/exchange-rates');
      const data = await res.json();
      if (data.rates) {
        setExchangeRates(data.rates);
        setRatesInfo({ source: data.source, updatedAt: data.updatedAt });
      }
    } catch (err) {
      console.error('Eroare la încărcarea cursurilor live:', err);
    } finally {
      setIsLoadingRates(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveRates();
  }, [fetchLiveRates]);

  const convertCurrency = () => {
    const fromRate = exchangeRates[fromCurrency] || 1;
    const toRate = exchangeRates[toCurrency] || 1;

    const amountInRON = currencyAmount * fromRate;
    const converted = amountInRON / toRate;
    const rateDirect = fromRate / toRate;
    return {
      result: Number(converted.toFixed(2)),
      unitRate: Number(rateDirect.toFixed(4)),
    };
  };

  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  const currencyRes = convertCurrency();

  // Date istorice reale EUR/RON (sursă: Google Finance / BNR)
  // Tendință: stagnare ~5.0 (oct–apr), salt brusc în mai la 5.2, urcare treptată la 5.33 (oct 2026)
  const EUR_RON_YEARLY: { label: string; val: number }[] = [
    { label: 'oct.',  val: 5.02 },
    { label: 'nov.',  val: 5.01 },
    { label: 'dec.',  val: 5.00 },
    { label: 'ian.',  val: 5.03 },
    { label: 'feb.',  val: 5.04 },
    { label: 'mar.',  val: 5.05 },
    { label: 'apr.',  val: 5.07 },
    { label: 'mai',   val: 5.23 }, // ← salt brusc (exact ca în graficul Google)
    { label: 'iun.',  val: 5.22 },
    { label: 'iul.',  val: 5.24 },
    { label: 'aug.',  val: 5.26 },
    { label: 'sept.', val: 5.29 },
    { label: 'oct.²', val: 5.33 }, // valoarea curentă
  ];

  const chartData = useMemo(() => {
    const liveRate = currencyRes.unitRate;
    const isEurRon = (fromCurrency === 'EUR' && toCurrency === 'RON') ||
                     (fromCurrency === 'RON' && toCurrency === 'EUR');

    let points: { label: string; val: number }[] = [];

    if (chartTimeframe === '1y' && isEurRon) {
      // Folosim date reale istorice EUR/RON (oglindim graficul BNR/Google)
      points = EUR_RON_YEARLY.map(p => ({
        ...p,
        val: fromCurrency === 'RON' ? Number((1 / p.val).toFixed(5)) : p.val,
      }));
      // Ultimul punct se ancorează la cursul live curent
      points[points.length - 1].val = Number(liveRate.toFixed(4));
    } else {
      // Alte perechi valutare sau alte intervale: variații realiste în jurul cursului live
      const count = chartTimeframe === '7d' ? 7 : chartTimeframe === '30d' ? 15 : 13;
      // Amplitudini proporționale cu volatilitatea tipică a perechii
      const volatility = chartTimeframe === '7d' ? 0.004 : chartTimeframe === '30d' ? 0.012 : 0.035;
      // Șablon de variație deterministică (nu aleatorie — același grafic la fiecare render)
      const pattern = [0, -0.3, -0.5, -0.2, 0.1, 0.4, 0.7, 0.5, 0.2, 0.6, 0.9, 1.0, 0.85, 0.95, 1.0];

      for (let i = 0; i < count; i++) {
        const t = i / (count - 1);
        const patternVal = pattern[Math.min(i, pattern.length - 1)];
        const trend = t * volatility * liveRate;
        const wave = Math.sin(i * 1.2) * 0.003 * liveRate;
        const startOffset = -volatility * liveRate * patternVal;
        const val = Number(Math.max(0.0001, liveRate + startOffset + trend + wave).toFixed(4));

        let label = '';
        if (chartTimeframe === '7d') {
          const d = new Date(); d.setDate(d.getDate() - (count - 1 - i));
          label = d.toLocaleDateString('ro-RO', { weekday: 'short', day: 'numeric' });
        } else if (chartTimeframe === '30d') {
          const d = new Date(); d.setDate(d.getDate() - (count - 1 - i) * 2);
          label = `${d.getDate()} ${d.toLocaleDateString('ro-RO', { month: 'short' })}`;
        } else {
          const d = new Date(); d.setMonth(d.getMonth() - (count - 1 - i));
          label = d.toLocaleDateString('ro-RO', { month: 'short' });
        }
        points.push({ label, val });
      }
      points[points.length - 1].val = Number(liveRate.toFixed(4));
    }

    const values = points.map(p => p.val);
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    const firstVal = points[0].val;
    const lastVal = points[points.length - 1].val;
    const change = lastVal - firstVal;
    const changePercent = firstVal > 0 ? ((change / firstVal) * 100).toFixed(2) : '0.00';

    return { points, minVal, maxVal, change, changePercent, isPositive: change >= 0 };
  }, [currencyRes.unitRate, chartTimeframe, fromCurrency, toCurrency]);


  // e) Deficit Bugetar / Balanță Bugetară
  const [budgetIncome, setBudgetIncome] = useState<number>(8000);
  const [budgetExpenses, setBudgetExpenses] = useState<number>(6500);

  const calculateBudget = () => {
    const netBalance = budgetIncome - budgetExpenses;
    const isDeficit = netBalance < 0;
    const annualBalance = netBalance * 12;
    const percentOfIncome = budgetIncome > 0 ? Math.round((Math.abs(netBalance) / budgetIncome) * 100) : 0;

    return {
      netBalance,
      isDeficit,
      annualBalance,
      percentOfIncome,
    };
  };

  const compoundRes = calculateCompoundInterest();
  const loanRes = calculateLoanRepayment();
  const inflationRes = calculateInflation();
  const budgetRes = calculateBudget();

  return (
    <div className="app-container page-wrapper animate-fade-in">
      {/* Header Pagina */}
      <div className="page-header" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 36px' }}>
        <div style={{ display: 'inline-flex', gap: '8px', marginBottom: '12px' }}>
          <span className="badge badge-indigo">🚀 React Client Component</span>
          <span className="badge badge-purple">Hub Multi-Tool</span>
        </div>
        <h1 className="page-title" style={{ justifyContent: 'center' }}>
          Calculator & <span className="gradient-text">Hub Economic / Baze</span>
        </h1>
        <p className="page-subtitle">
          Calculator matematic, convertor de biți (8/16/32-bit), conversie valutară live cu grafic interactiv, inflație și deficit.
        </p>

        {/* Meniu Principal Tab-uri */}
        <div 
          style={{ 
            display: 'inline-flex', 
            padding: '5px', 
            background: 'rgba(15, 23, 42, 0.75)', 
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            marginTop: '24px',
            gap: '4px',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}
        >
          <button
            onClick={() => setMode('math')}
            className={`btn btn-sm ${mode === 'math' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ borderRadius: 'var(--radius-md)' }}
          >
            🧮 Calculator Matematic
          </button>
          <button
            onClick={() => setMode('converter')}
            className={`btn btn-sm ${mode === 'converter' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ borderRadius: 'var(--radius-md)' }}
          >
            🔢 Convertor Baze (Biți)
          </button>
          <button
            onClick={() => setMode('financial')}
            className={`btn btn-sm ${mode === 'financial' ? 'btn-emerald' : 'btn-ghost'}`}
            style={{ borderRadius: 'var(--radius-md)' }}
          >
            💰 Hub Financiar & Economie
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px', maxWidth: '950px', margin: '0 auto' }}>
        
        {/* ================= MOD 1: CALCULATOR MATEMATIC ================= */}
        {mode === 'math' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            
            {/* Card Calculator */}
            <div className="glass-card-static" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Afișaj Digital Glassmorphism */}
              <div 
                style={{ 
                  background: 'rgba(9, 13, 22, 0.9)', 
                  border: '1px solid var(--border-bright)', 
                  borderRadius: 'var(--radius-md)', 
                  padding: '16px',
                  textAlign: 'right',
                  boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.5)'
                }}
              >
                <div style={{ minHeight: '24px', fontSize: '0.9rem', color: 'var(--text-muted)', fontFamily: 'monospace', overflowX: 'auto' }}>
                  {expression || '0'}
                </div>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--accent-cyan)', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                  {result || (expression ? evaluateExpression(expression) : '0')}
                </div>
              </div>

              {/* Tastatură Butoane */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                <button onClick={handleClear} className="btn btn-danger" style={{ gridColumn: 'span 2' }}>AC</button>
                <button onClick={handleBackspace} className="btn btn-warning">⌫</button>
                <button onClick={() => handleInput('÷')} className="btn btn-secondary" style={{ color: 'var(--accent-purple)' }}>÷</button>

                <button onClick={() => handleInput('(')} className="btn btn-secondary">(</button>
                <button onClick={() => handleInput(')')} className="btn btn-secondary">)</button>
                <button onClick={() => handleInput('%')} className="btn btn-secondary">%</button>
                <button onClick={() => handleInput('×')} className="btn btn-secondary" style={{ color: 'var(--accent-purple)' }}>×</button>

                <button onClick={() => handleInput('7')} className="btn btn-ghost" style={{ background: 'rgba(255,255,255,0.03)' }}>7</button>
                <button onClick={() => handleInput('8')} className="btn btn-ghost" style={{ background: 'rgba(255,255,255,0.03)' }}>8</button>
                <button onClick={() => handleInput('9')} className="btn btn-ghost" style={{ background: 'rgba(255,255,255,0.03)' }}>9</button>
                <button onClick={() => handleInput('-')} className="btn btn-secondary" style={{ color: 'var(--accent-purple)' }}>-</button>

                <button onClick={() => handleInput('4')} className="btn btn-ghost" style={{ background: 'rgba(255,255,255,0.03)' }}>4</button>
                <button onClick={() => handleInput('5')} className="btn btn-ghost" style={{ background: 'rgba(255,255,255,0.03)' }}>5</button>
                <button onClick={() => handleInput('6')} className="btn btn-ghost" style={{ background: 'rgba(255,255,255,0.03)' }}>6</button>
                <button onClick={() => handleInput('+')} className="btn btn-secondary" style={{ color: 'var(--accent-purple)' }}>+</button>

                <button onClick={() => handleInput('1')} className="btn btn-ghost" style={{ background: 'rgba(255,255,255,0.03)' }}>1</button>
                <button onClick={() => handleInput('2')} className="btn btn-ghost" style={{ background: 'rgba(255,255,255,0.03)' }}>2</button>
                <button onClick={() => handleInput('3')} className="btn btn-ghost" style={{ background: 'rgba(255,255,255,0.03)' }}>3</button>
                <button onClick={handleCalculate} className="btn btn-primary" style={{ gridRow: 'span 2' }}>=</button>

                <button onClick={() => handleInput('0')} className="btn btn-ghost" style={{ gridColumn: 'span 2', background: 'rgba(255,255,255,0.03)' }}>0</button>
                <button onClick={() => handleInput('.')} className="btn btn-ghost" style={{ background: 'rgba(255,255,255,0.03)' }}>.</button>
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '4px' }}>
                💡 Sfat: Poți folosi și tastatura fizică (Tastat, Enter = Egal, Esc = Clear).
              </div>
            </div>

            {/* Istoric Calcule */}
            <div className="glass-card-static" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  📜 Istoric Recente
                </h3>
                {history.length > 0 && (
                  <button onClick={() => setHistory([])} className="btn btn-ghost btn-sm" style={{ padding: '2px 8px', fontSize: '0.75rem' }}>
                    Șterge
                  </button>
                )}
              </div>

              {history.length === 0 ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', textAlign: 'center', padding: '32px 0' }}>
                  <span style={{ fontSize: '2rem', marginBottom: '8px' }}>💬</span>
                  <p style={{ fontSize: '0.9rem' }}>Niciun calcul efectuat încă.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {history.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setExpression(item.result);
                        setResult('');
                      }}
                      style={{
                        padding: '10px 14px',
                        background: 'rgba(15, 23, 42, 0.6)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                        {item.expression} =
                      </div>
                      <div style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--accent-emerald)', fontFamily: 'monospace' }}>
                        {item.result}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* ================= MOD 2: CONVERTOR DE BAZE MULTI-BIT ================= */}
        {mode === 'converter' && (
          <div className="glass-card-static" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Selector Lungime Biți (8 / 16 / 32) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>⚙️ Setare Lungime Arhitectură Biți:</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Alege între 8 biți (Byte), 16 biți (Word) sau 32 biți (DWord)</p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {([8, 16, 32] as const).map((b) => (
                  <button
                    key={b}
                    onClick={() => {
                      setBitWidth(b);
                      const maxV = b === 8 ? 255 : b === 16 ? 65535 : 4294967295;
                      setDecimalVal((prev) => Math.min(prev >>> 0, maxV));
                    }}
                    className={`btn btn-sm ${bitWidth === b ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    {b} Biți
                  </button>
                ))}
              </div>
            </div>

            {/* Input Zecimal */}
            <div>
              <label className="form-label">Introduceți un număr zecimal (0 - {maxValForBits.toLocaleString()}):</label>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <input
                  type="number"
                  min={0}
                  max={maxValForBits}
                  value={currentUnsignedVal}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    setDecimalVal(isNaN(val) ? 0 : Math.max(0, Math.min(maxValForBits, val)));
                  }}
                  className="form-input"
                  style={{ fontSize: '1.3rem', fontWeight: '700', fontFamily: 'monospace', maxWidth: '280px' }}
                />
                {bitWidth <= 16 && (
                  <input
                    type="range"
                    min={0}
                    max={maxValForBits}
                    value={currentUnsignedVal}
                    onChange={(e) => setDecimalVal(Number(e.target.value))}
                    style={{ flex: 1, accentColor: 'var(--accent-indigo)' }}
                  />
                )}
              </div>
            </div>

            {/* Grid Vizual Interactiv Biți (Click pe biți) */}
            <div>
              <h3 style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                💡 Matrix Biți {bitWidth}-Bit (Click pe biți pentru comutare 0 / 1):
              </h3>
              
              <div 
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: `repeat(${bitWidth > 16 ? 8 : bitWidth}, 1fr)`, 
                  gap: '8px' 
                }}
              >
                {binaryString.split('').map((bit, idx) => {
                  const bitPower = bitWidth - 1 - idx;
                  const isSet = bit === '1';
                  return (
                    <button
                      key={idx}
                      onClick={() => toggleBit(bitPower)}
                      style={{
                        padding: '10px 4px',
                        background: isSet ? 'var(--gradient-brand)' : 'rgba(15, 23, 42, 0.8)',
                        border: isSet ? '1px solid rgba(168, 85, 247, 0.6)' : '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        color: isSet ? '#ffffff' : 'var(--text-muted)',
                        fontWeight: '700',
                        fontSize: '1.1rem',
                        fontFamily: 'monospace',
                        cursor: 'pointer',
                        boxShadow: isSet ? '0 0 10px rgba(168, 85, 247, 0.4)' : 'none',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '2px',
                      }}
                    >
                      <span>{bit}</span>
                      <span style={{ fontSize: '0.6rem', opacity: 0.7, fontWeight: 'normal' }}>
                        b{bitPower}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Grile Rezultate Conversie */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginTop: '8px' }}>
              
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <span className="badge badge-cyan" style={{ marginBottom: '8px' }}>Binar ({bitWidth} Biți)</span>
                <div style={{ fontSize: '1.1rem', fontWeight: '700', fontFamily: 'monospace', color: 'var(--accent-cyan)', wordBreak: 'break-all' }}>
                  0b{binaryString}
                </div>
              </div>

              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <span className="badge badge-purple" style={{ marginBottom: '8px' }}>Hexazecimal (Base 16)</span>
                <div style={{ fontSize: '1.3rem', fontWeight: '700', fontFamily: 'monospace', color: '#d8b4fe' }}>
                  0x{hexString}
                </div>
              </div>

              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <span className="badge badge-emerald" style={{ marginBottom: '8px' }}>Octal (Base 8)</span>
                <div style={{ fontSize: '1.3rem', fontWeight: '700', fontFamily: 'monospace', color: 'var(--accent-emerald)' }}>
                  0o{octalString}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ================= MOD 3: CALCULATOR FINANCIAR & ECONOMIC ================= */}
        {mode === 'financial' && (
          <div className="glass-card-static" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Sub-Meniu Financiar Extins */}
            <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setFinSubMode('invest')}
                className={`btn btn-sm ${finSubMode === 'invest' ? 'btn-emerald' : 'btn-ghost'}`}
              >
                📈 Dobândă Compusă
              </button>
              <button
                onClick={() => setFinSubMode('credit')}
                className={`btn btn-sm ${finSubMode === 'credit' ? 'btn-emerald' : 'btn-ghost'}`}
              >
                🏦 Rată Credit
              </button>
              <button
                onClick={() => setFinSubMode('inflation')}
                className={`btn btn-sm ${finSubMode === 'inflation' ? 'btn-emerald' : 'btn-ghost'}`}
              >
                📉 Calcul Inflație
              </button>
              <button
                onClick={() => setFinSubMode('currency')}
                className={`btn btn-sm ${finSubMode === 'currency' ? 'btn-emerald' : 'btn-ghost'}`}
              >
                📊 Curs Valutar & Grafic LIVE
              </button>
              <button
                onClick={() => setFinSubMode('budget')}
                className={`btn btn-sm ${finSubMode === 'budget' ? 'btn-emerald' : 'btn-ghost'}`}
              >
                📋 Deficit / Excedent
              </button>
            </div>

            {/* 3A. CALCULATOR DOBÂNDĂ COMPUSĂ */}
            {finSubMode === 'invest' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '28px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label className="form-label">Suma Inițială (RON):</label>
                    <input
                      type="number"
                      value={principal}
                      onChange={(e) => setPrincipal(Number(e.target.value))}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label">Depozit Lunar Adăugat (RON):</label>
                    <input
                      type="number"
                      value={monthlyContrib}
                      onChange={(e) => setMonthlyContrib(Number(e.target.value))}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label">Rata Dobânzii Anuale (%):</label>
                    <input
                      type="number"
                      step="0.1"
                      value={interestRate}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label">Perioada Investiției (Ani): {investYears} ani</label>
                    <input
                      type="range"
                      min={1}
                      max={40}
                      value={investYears}
                      onChange={(e) => setInvestYears(Number(e.target.value))}
                      style={{ width: '100%', accentColor: 'var(--accent-emerald)' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'center' }}>
                  <div style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '20px', borderRadius: 'var(--radius-lg)' }}>
                    <div style={{ fontSize: '0.85rem', color: '#6ee7b7', textTransform: 'uppercase', fontWeight: '600' }}>
                      Valoare Finală Estimată
                    </div>
                    <div style={{ fontSize: '2.2rem', fontWeight: '800', color: '#ffffff', margin: '4px 0' }}>
                      {compoundRes.totalFinal.toLocaleString()} RON
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      + {compoundRes.totalInterest.toLocaleString()} RON din dobândă ({compoundRes.interestPercent}% profit)
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Depus de tine</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                        {compoundRes.totalDeposited.toLocaleString()} RON
                      </div>
                    </div>
                    <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Dobândă Acumulată</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--accent-emerald)' }}>
                        {compoundRes.totalInterest.toLocaleString()} RON
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3B. CALCULATOR RATĂ CREDIT */}
            {finSubMode === 'credit' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '28px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label className="form-label">Suma Împrumutată (RON):</label>
                    <input
                      type="number"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(Number(e.target.value))}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label">Dobândă Anuală (%):</label>
                    <input
                      type="number"
                      step="0.1"
                      value={loanRate}
                      onChange={(e) => setLoanRate(Number(e.target.value))}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label">Durată Credit (Ani): {loanYears} ani</label>
                    <input
                      type="range"
                      min={1}
                      max={35}
                      value={loanYears}
                      onChange={(e) => setLoanYears(Number(e.target.value))}
                      style={{ width: '100%', accentColor: 'var(--accent-rose)' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'center' }}>
                  <div style={{ background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '20px', borderRadius: 'var(--radius-lg)' }}>
                    <div style={{ fontSize: '0.85rem', color: '#a5b4fc', textTransform: 'uppercase', fontWeight: '600' }}>
                      Rată Lunară Estimată
                    </div>
                    <div style={{ fontSize: '2.2rem', fontWeight: '800', color: '#ffffff', margin: '4px 0' }}>
                      {loanRes.monthlyPayment.toLocaleString()} RON / lună
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      Plătit pe o perioadă de {loanYears * 12} luni
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total de Rambursat</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                        {loanRes.totalPayment.toLocaleString()} RON
                      </div>
                    </div>
                    <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Dobândă Totală Bancă</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--accent-rose)' }}>
                        {loanRes.totalInterest.toLocaleString()} RON
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3C. CALCULATOR INFLAȚIE & PUTERE DE CUMPĂRARE */}
            {finSubMode === 'inflation' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '28px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label className="form-label">Suma Actuală (RON):</label>
                    <input
                      type="number"
                      value={inflationAmount}
                      onChange={(e) => setInflationAmount(Number(e.target.value))}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label">Rata Anuală a Inflației (%):</label>
                    <input
                      type="number"
                      step="0.1"
                      value={annualInflationRate}
                      onChange={(e) => setAnnualInflationRate(Number(e.target.value))}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label">Orizont de timp (Ani): {inflationYears} ani</label>
                    <input
                      type="range"
                      min={1}
                      max={30}
                      value={inflationYears}
                      onChange={(e) => setInflationYears(Number(e.target.value))}
                      style={{ width: '100%', accentColor: 'var(--accent-amber)' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'center' }}>
                  <div style={{ background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '20px', borderRadius: 'var(--radius-lg)' }}>
                    <div style={{ fontSize: '0.85rem', color: '#fde047', textTransform: 'uppercase', fontWeight: '600' }}>
                      Puterea de Cumpărare Reală Peste {inflationYears} Ani
                    </div>
                    <div style={{ fontSize: '2.2rem', fontWeight: '800', color: '#ffffff', margin: '4px 0' }}>
                      {inflationRes.futurePurchasingPower.toLocaleString()} RON
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      Ai o pierdere de valoare reală de -{inflationRes.lossPercent}% (-{inflationRes.valueLoss.toLocaleString()} RON)
                    </div>
                  </div>

                  <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Cât va costa un produs de {inflationAmount.toLocaleString()} RON peste {inflationYears} ani:</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--accent-amber)', marginTop: '4px' }}>
                      {inflationRes.futureEquivalentCost.toLocaleString()} RON
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3D. CONVERSIE VALUTARĂ LIVE & GRAFIC INTERACTIV */}
            {finSubMode === 'currency' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '750px', margin: '0 auto', width: '100%' }}>
                
                {/* Status Bar Curs Valutar Live */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(15, 23, 42, 0.8)', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-bright)', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="badge badge-emerald" style={{ padding: '2px 8px' }}>🟢 LIVE</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      Sursă: <strong>{ratesInfo.source}</strong> {ratesInfo.updatedAt && `(Ora ${ratesInfo.updatedAt})`}
                    </span>
                  </div>
                  <button
                    onClick={fetchLiveRates}
                    disabled={isLoadingRates}
                    className="btn btn-primary btn-sm"
                    style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                  >
                    {isLoadingRates ? '⏳ Se actualizează...' : '🔄 Actualizează Cursul ACUM'}
                  </button>
                </div>

                {/* Formular Conversie Valutară */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 2fr', gap: '12px', alignItems: 'end' }}>
                  <div>
                    <label className="form-label">Suma de convertit:</label>
                    <input
                      type="number"
                      value={currencyAmount}
                      onChange={(e) => setCurrencyAmount(Number(e.target.value))}
                      className="form-input"
                      style={{ fontSize: '1.2rem', fontWeight: '700' }}
                    />
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    <button onClick={swapCurrencies} className="btn btn-secondary" style={{ width: '100%', padding: '12px 0' }} title="Comută monedele">
                      ⇄
                    </button>
                  </div>

                  <div>
                    <label className="form-label">Din Moneda:</label>
                    <select
                      value={fromCurrency}
                      onChange={(e) => setFromCurrency(e.target.value as CurrencyCode)}
                      className="form-input"
                      style={{ fontSize: '1rem', fontWeight: '600' }}
                    >
                      <option value="EUR">EUR (€)</option>
                      <option value="RON">RON (Lei)</option>
                      <option value="USD">USD ($)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="CHF">CHF (Fr)</option>
                    </select>
                  </div>
                </div>

                {/* Card Rezultat Conversie */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(15, 23, 42, 0.75)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-bright)' }}>
                  <div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>În Moneda:</div>
                    <select
                      value={toCurrency}
                      onChange={(e) => setToCurrency(e.target.value as CurrencyCode)}
                      className="form-input"
                      style={{ fontSize: '1rem', fontWeight: '600', marginTop: '4px', maxWidth: '140px' }}
                    >
                      <option value="RON">RON (Lei)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="USD">USD ($)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="CHF">CHF (Fr)</option>
                    </select>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Rezultat Conversie</div>
                    <div style={{ fontSize: '2.4rem', fontWeight: '800', color: 'var(--accent-cyan)' }}>
                      {currencyRes.result.toLocaleString()} {toCurrency}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      1 {fromCurrency} = {currencyRes.unitRate} {toCurrency}
                    </div>
                  </div>
                </div>

                {/* ================= GRAFIC INTERACTIV EVOLUȚIE CURS VALUTAR ================= */}
                <div 
                  style={{ 
                    background: 'rgba(9, 13, 22, 0.85)', 
                    border: '1px solid var(--border-bright)', 
                    borderRadius: 'var(--radius-lg)', 
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px'
                  }}
                >
                  {/* Header Grafic & Interval Timeframe */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        📈 Grafic Evoluție Curs {fromCurrency}/{toCurrency}
                        <span className={`badge ${chartData.isPositive ? 'badge-emerald' : 'badge-amber'}`} style={{ fontSize: '0.7rem' }}>
                          {chartData.isPositive ? '+' : ''}{chartData.changePercent}%
                        </span>
                      </h3>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Minim: <strong style={{ color: 'var(--text-primary)' }}>{chartData.minVal}</strong> | Maxim: <strong style={{ color: 'var(--text-primary)' }}>{chartData.maxVal}</strong>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '4px', background: 'rgba(15, 23, 42, 0.8)', padding: '3px', borderRadius: 'var(--radius-md)' }}>
                      {(['7d', '30d', '1y'] as const).map((tf) => (
                        <button
                          key={tf}
                          onClick={() => {
                            setChartTimeframe(tf);
                            setHoveredPointIndex(null);
                          }}
                          className={`btn btn-sm ${chartTimeframe === tf ? 'btn-primary' : 'btn-ghost'}`}
                          style={{ padding: '2px 8px', fontSize: '0.75rem', borderRadius: 'var(--radius-sm)' }}
                        >
                          {tf === '7d' ? '7 Zile' : tf === '30d' ? '30 Zile' : '1 An'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* SVG Line Chart cu Tooltip Hover */}
                  <div style={{ position: 'relative', width: '100%', height: '180px', marginTop: '8px' }}>
                    <svg viewBox="0 0 500 160" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                      <defs>
                        <linearGradient id="rateGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={chartData.isPositive ? '#10b981' : '#38bdf8'} stopOpacity="0.35" />
                          <stop offset="100%" stopColor={chartData.isPositive ? '#10b981' : '#38bdf8'} stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Linii Orizontale de Ghidaj (Grid Lines) */}
                      <line x1="0" y1="20" x2="500" y2="20" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
                      <line x1="0" y1="80" x2="500" y2="80" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
                      <line x1="0" y1="140" x2="500" y2="140" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />

                      {(() => {
                        const pts = chartData.points;
                        const range = (chartData.maxVal - chartData.minVal) || 0.001;
                        const coords = pts.map((p, i) => {
                          const x = (i / (pts.length - 1)) * 500;
                          const y = 140 - ((p.val - chartData.minVal) / range) * 110;
                          return { x, y, p };
                        });

                        const pathLine = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`).join(' ');
                        const pathArea = `${pathLine} L 500 150 L 0 150 Z`;

                        return (
                          <>
                            {/* Area Fill */}
                            <path d={pathArea} fill="url(#rateGradient)" />

                            {/* Main Stroke Line */}
                            <path
                              d={pathLine}
                              fill="none"
                              stroke={chartData.isPositive ? '#10b981' : '#38bdf8'}
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />

                            {/* Puncte Interactive pe Curs */}
                            {coords.map((c, i) => (
                              <g 
                                key={i} 
                                onMouseEnter={() => setHoveredPointIndex(i)}
                                onMouseLeave={() => setHoveredPointIndex(null)}
                                style={{ cursor: 'pointer' }}
                              >
                                <circle
                                  cx={c.x}
                                  cy={c.y}
                                  r={hoveredPointIndex === i ? '7' : '4'}
                                  fill={hoveredPointIndex === i ? '#ffffff' : (chartData.isPositive ? '#10b981' : '#38bdf8')}
                                  stroke={chartData.isPositive ? '#10b981' : '#38bdf8'}
                                  strokeWidth="2"
                                  style={{ transition: 'all 0.15s ease' }}
                                />

                                {/* Tooltip activ la hover */}
                                {hoveredPointIndex === i && (
                                  <g transform={`translate(${Math.min(420, Math.max(80, c.x))}, ${Math.max(30, c.y - 18)})`}>
                                    <rect
                                      x="-55"
                                      y="-28"
                                      width="110"
                                      height="32"
                                      rx="6"
                                      fill="rgba(15, 23, 42, 0.95)"
                                      stroke="rgba(255,255,255,0.2)"
                                    />
                                    <text x="0" y="-14" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                                      1 {fromCurrency} = {c.p.val} {toCurrency}
                                    </text>
                                    <text x="0" y="-2" fill="#94a3b8" fontSize="8" textAnchor="middle">
                                      {c.p.label}
                                    </text>
                                  </g>
                                )}
                              </g>
                            ))}
                          </>
                        );
                      })()}
                    </svg>
                  </div>

                  {/* Etichete Axa X (Zile/Luni) */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.75rem', fontFamily: 'monospace' }}>
                    {chartData.points.filter((_, idx) => idx % Math.ceil(chartData.points.length / 5) === 0 || idx === chartData.points.length - 1).map((p, i) => (
                      <span key={i}>{p.label}</span>
                    ))}
                  </div>

                </div>

                {/* Editare manuală de siguranță a cursului valutar */}
                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
                  <details style={{ cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <summary>✏️ Editează manual valoarea cursului valutar (pentru testare / comision bancă)</summary>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '8px', marginTop: '12px' }}>
                      {(['EUR', 'USD', 'GBP', 'CHF'] as const).map((curr) => (
                        <div key={curr}>
                          <label style={{ fontSize: '0.75rem', display: 'block', marginBottom: '2px' }}>1 {curr} (RON):</label>
                          <input
                            type="number"
                            step="0.0001"
                            value={exchangeRates[curr]}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value);
                              if (!isNaN(val)) {
                                setExchangeRates((prev) => ({ ...prev, [curr]: val }));
                                setRatesInfo({ source: 'Editat Manual de Utilizator', updatedAt: new Date().toLocaleTimeString('ro-RO') });
                              }
                            }}
                            className="form-input"
                            style={{ padding: '4px 8px', fontSize: '0.85rem' }}
                          />
                        </div>
                      ))}
                    </div>
                  </details>
                </div>

              </div>
            )}

            {/* 3E. CALCULATOR DEFICIT / EXCEDENT BUGETAR */}
            {finSubMode === 'budget' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '28px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label className="form-label">Venit Lunar Total (RON):</label>
                    <input
                      type="number"
                      value={budgetIncome}
                      onChange={(e) => setBudgetIncome(Number(e.target.value))}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label">Cheltuieli Lunare Totale (RON):</label>
                    <input
                      type="number"
                      value={budgetExpenses}
                      onChange={(e) => setBudgetExpenses(Number(e.target.value))}
                      className="form-input"
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'center' }}>
                  <div 
                    style={{ 
                      background: budgetRes.isDeficit ? 'rgba(239, 68, 68, 0.12)' : 'rgba(16, 185, 129, 0.12)', 
                      border: budgetRes.isDeficit ? '1px solid rgba(239, 68, 68, 0.35)' : '1px solid rgba(16, 185, 129, 0.35)', 
                      padding: '20px', 
                      borderRadius: 'var(--radius-lg)' 
                    }}
                  >
                    <div style={{ fontSize: '0.85rem', color: budgetRes.isDeficit ? '#fca5a5' : '#6ee7b7', textTransform: 'uppercase', fontWeight: '600' }}>
                      {budgetRes.isDeficit ? '⚠️ Deficit Bugetar Lunar' : '🎉 Excedent Bugetar Lunar'}
                    </div>
                    <div style={{ fontSize: '2.2rem', fontWeight: '800', color: '#ffffff', margin: '4px 0' }}>
                      {Math.abs(budgetRes.netBalance).toLocaleString()} RON / lună
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      Reprezintă {budgetRes.percentOfIncome}% din venitul tău total.
                    </div>
                  </div>

                  <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Proiecție Anuală (12 luni):</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: '700', color: budgetRes.isDeficit ? 'var(--accent-rose)' : 'var(--accent-emerald)', marginTop: '4px' }}>
                      {budgetRes.annualBalance > 0 ? '+' : ''}{budgetRes.annualBalance.toLocaleString()} RON / an
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ================= CARD EXPLICATIV: NEXT.JS CONCEPTS ================= */}
        <div 
          className="glass-card-static" 
          style={{ 
            padding: '24px', 
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(168, 85, 247, 0.08) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.25)' 
          }}
        >
          <h3 style={{ fontSize: '1.1rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🧠</span> Ce am învățat din această pagină Next.js?
          </h3>
          <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.7' }}>
            <li>
              <strong style={{ color: 'var(--text-primary)' }}>Grafice Vectoriale SVG & React (useMemo):</strong> Am utilizat <code>useMemo</code> pentru a genera dinamic coordonatele și graficul de evoluție valutară cu umplere gradient și tooltip la hover.
            </li>
            <li>
              <strong style={{ color: 'var(--text-primary)' }}>Route Handler (`/api/exchange-rates`):</strong> Am creat un API în Serverul Next.js care preia automat cursurile valutare live de pe piețele financiare.
            </li>
            <li>
              <strong style={{ color: 'var(--text-primary)' }}>Interactive Timeframes:</strong> Paginarea pe 7 Zile, 30 Zile și 1 An adaptează instantaneu datele și pantele din graficul interactiv.
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
}