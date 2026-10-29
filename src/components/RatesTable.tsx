import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CurrencyCode } from '../types';
import { CURRENCIES, CURRENCY_LIST } from '../data/currencies';
import { currencyService, roundToDecimals } from '../services/currencyService';
import {
  Search,
  RefreshCw,
  ArrowUpDown,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Clock,
  Sparkles,
} from 'lucide-react';

interface RatesTableProps {
  onSelectPair?: (from: CurrencyCode, to: CurrencyCode) => void;
}

export const RatesTable: React.FC<RatesTableProps> = ({ onSelectPair }) => {
  const { ratesSnapshot, refreshRates, isRatesLoading, setActiveTab } = useApp();
  const [baseCurrency, setBaseCurrency] = useState<CurrencyCode>('USD');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredCurrencies = CURRENCY_LIST.filter(
    (c) =>
      c.code !== baseCurrency &&
      (c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.nameKz.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.country.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleExchangeClick = (targetCode: CurrencyCode) => {
    if (onSelectPair) {
      onSelectPair(baseCurrency, targetCode);
    } else {
      setActiveTab('exchange');
    }
  };

  const formattedDate = new Date(ratesSnapshot.timestamp).toLocaleTimeString('kk-KZ', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-md p-6 sm:p-8">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-100">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight flex items-center gap-2">
            Нақты нарықтық валюта бағамдары
          </h2>
          <div className="flex items-center gap-2 text-xs text-neutral-500 mt-1">
            <Clock className="w-3.5 h-3.5 text-neutral-400" />
            <span>Соңғы жаңартылған: {formattedDate}</span>
            <span>·</span>
            <span className="text-emerald-700 font-medium">{ratesSnapshot.provider}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={refreshRates}
            disabled={isRatesLoading}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-neutral-200 text-neutral-700 hover:bg-neutral-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRatesLoading ? 'animate-spin' : ''}`} />
            <span>Жаңарту</span>
          </button>
        </div>
      </div>

      {/* Filter and Base currency selector */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 py-5">
        {/* Base Currency Segments */}
        <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-xl overflow-x-auto">
          <span className="text-xs text-neutral-500 px-2.5 font-medium whitespace-nowrap">
            Негізгі:
          </span>
          {(['USD', 'KZT', 'EUR', 'GBP'] as CurrencyCode[]).map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => setBaseCurrency(code)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                baseCurrency === code
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {CURRENCIES[code].flag} {code}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Валюта немесе ел атауы..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:bg-white focus:border-[#0e2a14] focus:ring-1 focus:ring-[#0e2a14]"
          />
        </div>
      </div>

      {/* Rates Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-neutral-200/80 text-xs font-semibold text-neutral-500">
              <th className="pb-3 pl-2">Валюта</th>
              <th className="pb-3 text-right">
                1 {baseCurrency} бағамы
              </th>
              <th className="pb-3 text-right hidden sm:table-cell">Кері бағам</th>
              <th className="pb-3 text-right pr-2">Әрекет</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {filteredCurrencies.map((currency) => {
              const forwardRate = currencyService.getCrossRate(baseCurrency, currency.code);
              const inverseRate = currencyService.getCrossRate(currency.code, baseCurrency);

              return (
                <tr
                  key={currency.code}
                  className="hover:bg-neutral-50/80 transition-colors group"
                >
                  {/* Currency info */}
                  <td className="py-3.5 pl-2">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl" role="img" aria-label={currency.nameKz}>
                        {currency.flag}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-neutral-900">
                            {currency.code}
                          </span>
                          <span className="text-xs text-neutral-400">
                            ({currency.symbol})
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500">
                          {currency.nameKz} · {currency.country}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Forward rate */}
                  <td className="py-3.5 text-right font-mono font-bold text-neutral-900 tabular-nums">
                    {forwardRate.toLocaleString('kk-KZ', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 4,
                    })}{' '}
                    <span className="text-xs font-normal text-neutral-500">
                      {currency.symbol}
                    </span>
                  </td>

                  {/* Inverse rate */}
                  <td className="py-3.5 text-right font-mono text-xs text-neutral-500 tabular-nums hidden sm:table-cell">
                    1 {currency.code} ={' '}
                    {inverseRate.toLocaleString('kk-KZ', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 6,
                    })}{' '}
                    {CURRENCIES[baseCurrency].symbol}
                  </td>

                  {/* Action */}
                  <td className="py-3.5 text-right pr-2">
                    <button
                      type="button"
                      onClick={() => handleExchangeClick(currency.code)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#0e2a14] bg-[#9fe870]/25 hover:bg-[#9fe870]/50 transition-colors"
                    >
                      <span>Айырбастау</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredCurrencies.length === 0 && (
        <div className="text-center py-8 text-neutral-500 text-xs">
          Іздеуге сәйкес келетін валюта табылмады.
        </div>
      )}
    </div>
  );
};
