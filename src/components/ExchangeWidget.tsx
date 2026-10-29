import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CurrencyCode, Wallet, Transaction } from '../types';
import { CURRENCIES, CURRENCY_LIST } from '../data/currencies';
import { currencyService, formatCurrencyAmount, roundToDecimals } from '../services/currencyService';
import {
  ArrowUpDown,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  ChevronDown,
  Info,
  Sparkles,
  Receipt,
  FileCheck2,
} from 'lucide-react';

interface ExchangeWidgetProps {
  initialSourceCurrency?: CurrencyCode;
  initialTargetCurrency?: CurrencyCode;
  isStandalone?: boolean;
}

export const ExchangeWidget: React.FC<ExchangeWidgetProps> = ({
  initialSourceCurrency = 'USD',
  initialTargetCurrency = 'KZT',
  isStandalone = false,
}) => {
  const {
    user,
    isAuthenticated,
    wallets,
    executeExchange,
    ratesSnapshot,
    setActiveTab,
    createWallet,
  } = useApp();

  const [sourceCode, setSourceCode] = useState<CurrencyCode>(initialSourceCurrency);
  const [targetCode, setTargetCode] = useState<CurrencyCode>(initialTargetCurrency);
  const [amountStr, setAmountStr] = useState<string>('100');
  const [guaranteeSeconds, setGuaranteeSeconds] = useState<number>(30);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [lastSuccessTx, setLastSuccessTx] = useState<Transaction | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Guarantee countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setGuaranteeSeconds((prev) => (prev <= 1 ? 30 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const parsedAmount = Math.max(0, parseFloat(amountStr) || 0);

  // Look up user wallets for selected currencies
  const sourceWallet = wallets.find((w) => w.currencyCode === sourceCode);
  const targetWallet = wallets.find((w) => w.currencyCode === targetCode);

  // Calculate live conversion preview
  const preview = currencyService.calculateExchangePreview(
    sourceCode,
    targetCode,
    parsedAmount
  );

  const swapCurrencies = () => {
    const temp = sourceCode;
    setSourceCode(targetCode);
    setTargetCode(temp);
    setErrorMessage(null);
  };

  const setPresetPercentage = (pct: number) => {
    if (!sourceWallet) return;
    const calc = (sourceWallet.balance * pct) / 100;
    setAmountStr(String(roundToDecimals(calc, sourceCode === 'JPY' ? 0 : 2)));
    setErrorMessage(null);
  };

  const handleExchangeSubmit = () => {
    setErrorMessage(null);

    if (!isAuthenticated) {
      setErrorMessage('Айырбастау жасау үшін алдымен жүйеге кіріңіз немесе тіркеліңіз.');
      return;
    }

    if (parsedAmount <= 0) {
      setErrorMessage('Айырбастау сомасы нөлден үлкен болуы тиіс.');
      return;
    }

    if (sourceCode === targetCode) {
      setErrorMessage('Бастапқы және мақсатты валюталар әртүрлі болуы керек.');
      return;
    }

    if (!sourceWallet) {
      setErrorMessage(`Сізде әлі ${sourceCode} әмияны жоқ. Алдымен әмиян жасаңыз.`);
      return;
    }

    if (sourceWallet.balance < parsedAmount) {
      setErrorMessage(
        `Баланс жеткіліксіз. Қолжетімді: ${formatCurrencyAmount(sourceWallet.balance, sourceCode)}`
      );
      return;
    }

    if (sourceWallet.isFrozen) {
      setErrorMessage(`${sourceCode} әмияны бұғатталған. Операция тоқтатылды.`);
      return;
    }

    // If user has no target wallet, offer to auto-create it or warn
    if (!targetWallet) {
      // Auto create target wallet on the fly
      createWallet(targetCode, 'forest');
    }

    setIsConfirmModalOpen(true);
  };

  const confirmAndExecute = () => {
    if (!sourceWallet) return;
    // Refresh target wallet reference in case it was created
    const currentTarget = wallets.find((w) => w.currencyCode === targetCode);
    if (!currentTarget) {
      // Create if needed
      const newW = createWallet(targetCode, 'forest');
      const result = executeExchange(sourceWallet.id, newW.id, parsedAmount);
      if (result.success && result.transaction) {
        setLastSuccessTx(result.transaction);
        setIsConfirmModalOpen(false);
      } else {
        setErrorMessage(result.message);
        setIsConfirmModalOpen(false);
      }
      return;
    }

    const result = executeExchange(sourceWallet.id, currentTarget.id, parsedAmount);
    if (result.success && result.transaction) {
      setLastSuccessTx(result.transaction);
      setIsConfirmModalOpen(false);
    } else {
      setErrorMessage(result.message);
      setIsConfirmModalOpen(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-xl p-6 sm:p-8 max-w-xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-5 border-b border-neutral-100 mb-6">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
            Валюта айырбастау
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Нақты нарықтық бағам және ашық минималды комиссия
          </p>
        </div>

        {/* Live status badge */}
        <div className="flex items-center gap-1.5 text-xs text-neutral-600 bg-neutral-100/80 px-2.5 py-1 rounded-full">
          <Clock className="w-3.5 h-3.5 text-emerald-600" />
          <span className="font-mono tabular-nums">{guaranteeSeconds}s</span>
          <span className="text-[11px] text-neutral-400">кепілдендірілген</span>
        </div>
      </div>

      {/* Error message banner */}
      {errorMessage && (
        <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Step 1: You Send */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-neutral-600">
          <span>Сіз жібересіз</span>
          {sourceWallet && (
            <span className="text-neutral-500">
              Баланс:{' '}
              <span className="font-mono font-bold text-neutral-800 tabular-nums">
                {formatCurrencyAmount(sourceWallet.balance, sourceCode)}
              </span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 p-3 bg-neutral-50 hover:bg-neutral-100/80 transition-colors rounded-2xl border border-neutral-200 focus-within:border-[#0e2a14] focus-within:ring-2 focus-within:ring-[#0e2a14]/10">
          <input
            type="number"
            min="0"
            step="any"
            value={amountStr}
            onChange={(e) => {
              setAmountStr(e.target.value);
              setErrorMessage(null);
            }}
            placeholder="0.00"
            className="w-full bg-transparent text-2xl sm:text-3xl font-bold font-mono tracking-tight text-neutral-900 outline-none tabular-nums placeholder:text-neutral-300"
          />

          {/* Currency Dropdown Selector */}
          <div className="relative shrink-0">
            <select
              value={sourceCode}
              onChange={(e) => {
                setSourceCode(e.target.value as CurrencyCode);
                setErrorMessage(null);
              }}
              className="appearance-none flex items-center gap-2 bg-white border border-neutral-300 text-neutral-900 text-sm font-bold py-2 pl-3 pr-8 rounded-xl cursor-pointer hover:border-neutral-400 focus:outline-none shadow-sm"
            >
              {CURRENCY_LIST.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.code}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-neutral-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Quick balance percentage presets (if user has wallet) */}
        {sourceWallet && sourceWallet.balance > 0 && (
          <div className="flex items-center gap-2 pt-1">
            <span className="text-[11px] text-neutral-400">Тез таңдау:</span>
            {[25, 50, 100].map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => setPresetPercentage(pct)}
                className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors"
              >
                {pct === 100 ? 'Барлығы' : `${pct}%`}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Wise-Style Transparent Fee & Rate Breakdown */}
      <div className="relative py-4 pl-6 my-2 border-l-2 border-dashed border-neutral-200 ml-4 space-y-2 text-xs">
        {/* Swap button placed nicely on divider */}
        <button
          type="button"
          onClick={swapCurrencies}
          className="absolute -left-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#0e2a14] text-white flex items-center justify-center shadow-md hover:bg-[#183d1e] transition-transform active:scale-90"
          title="Валюталарды алмастыру"
        >
          <ArrowUpDown className="w-3.5 h-3.5" />
        </button>

        {/* Commission info */}
        <div className="flex items-center justify-between text-neutral-600">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            <span>Комиссия ({preview.feePercentage}%):</span>
          </div>
          <span className="font-mono font-medium text-neutral-800 tabular-nums">
            {formatCurrencyAmount(preview.feeAmount, sourceCode)}
          </span>
        </div>

        {/* Converted net amount */}
        <div className="flex items-center justify-between text-neutral-600">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
            <span>Айырбасталатын таза сома:</span>
          </div>
          <span className="font-mono font-medium text-neutral-800 tabular-nums">
            {formatCurrencyAmount(preview.netSourceAmount, sourceCode)}
          </span>
        </div>

        {/* Guaranteed Rate */}
        <div className="flex items-center justify-between text-neutral-900 font-semibold pt-1">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0e2a14]" />
            <span>Нарықтық бағам:</span>
          </div>
          <span className="font-mono tabular-nums text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
            1 {sourceCode} = {preview.marketRate} {targetCode}
          </span>
        </div>
      </div>

      {/* Step 2: You Receive */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-neutral-600">
          <span>Сіз аласыз (есептелген)</span>
          {targetWallet && (
            <span className="text-neutral-500">
              Баланс:{' '}
              <span className="font-mono font-bold text-neutral-800 tabular-nums">
                {formatCurrencyAmount(targetWallet.balance, targetCode)}
              </span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 p-3 bg-neutral-50 rounded-2xl border border-neutral-200">
          <div className="w-full text-2xl sm:text-3xl font-bold font-mono tracking-tight text-emerald-950 tabular-nums py-0.5">
            {formatCurrencyAmount(preview.targetAmount, targetCode, false)}
          </div>

          {/* Target Currency Selector */}
          <div className="relative shrink-0">
            <select
              value={targetCode}
              onChange={(e) => {
                setTargetCode(e.target.value as CurrencyCode);
                setErrorMessage(null);
              }}
              className="appearance-none flex items-center gap-2 bg-white border border-neutral-300 text-neutral-900 text-sm font-bold py-2 pl-3 pr-8 rounded-xl cursor-pointer hover:border-neutral-400 focus:outline-none shadow-sm"
            >
              {CURRENCY_LIST.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.code}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-neutral-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <div className="mt-6 pt-2">
        <button
          type="button"
          onClick={handleExchangeSubmit}
          className="w-full py-4 px-6 rounded-2xl bg-[#0e2a14] hover:bg-[#183d1e] text-[#9fe870] font-bold text-base shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.99] flex items-center justify-center gap-2"
        >
          <span>Валютаны қазір айырбастау</span>
        </button>

        <div className="flex items-center justify-center gap-4 mt-3 text-[11px] text-neutral-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            256-бит шифрланған
          </span>
          <span>·</span>
          <span>Дерекқор транзакциясымен қорғалған</span>
        </div>
      </div>

      {/* Confirmation Modal */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-5">
              <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-[#0e2a14]" />
                Операцияны растау
              </h3>
              <button
                type="button"
                onClick={() => setIsConfirmModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 text-lg leading-none"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-sm mb-6">
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-500">Шығарылатын сома:</span>
                  <span className="font-mono font-bold text-red-600 tabular-nums">
                    -{formatCurrencyAmount(parsedAmount, sourceCode)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-500">Комиссия (0.45%):</span>
                  <span className="font-mono text-neutral-700 tabular-nums">
                    {formatCurrencyAmount(preview.feeAmount, sourceCode)}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-neutral-200">
                  <span className="text-neutral-900 font-semibold">Есептелетін сома:</span>
                  <span className="font-mono font-extrabold text-emerald-700 text-base tabular-nums">
                    +{formatCurrencyAmount(preview.targetAmount, targetCode)}
                  </span>
                </div>
              </div>

              <div className="text-xs text-neutral-600 space-y-1 px-1">
                <p>
                  <strong>Қолданылған бағам:</strong> 1 {sourceCode} = {preview.marketRate} {targetCode}
                </p>
                <p className="text-neutral-500">
                  Операция толықтай қауіпсіз және екі әмиянның балансы дереу жаңартылады.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsConfirmModalOpen(false)}
                className="flex-1 py-3 px-4 rounded-xl border border-neutral-300 text-neutral-700 font-semibold hover:bg-neutral-50 transition-colors"
              >
                Бас тарту
              </button>
              <button
                type="button"
                onClick={confirmAndExecute}
                className="flex-1 py-3 px-4 rounded-xl bg-[#0e2a14] hover:bg-[#183d1e] text-[#9fe870] font-bold transition-all shadow-md active:scale-95"
              >
                Растау және аудару
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Receipt Slide-over / Modal */}
      {lastSuccessTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-neutral-200 text-center animate-in fade-in zoom-in-95">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-extrabold text-neutral-900 mb-1">
              Айырбастау сәтті аяқталды!
            </h3>
            <p className="text-xs text-neutral-500 mb-5">
              Транзакция ID: <span className="font-mono text-neutral-700">{lastSuccessTx.referenceCode}</span>
            </p>

            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-left text-xs space-y-2 mb-6">
              <div className="flex justify-between">
                <span className="text-neutral-500">Шығарылды:</span>
                <span className="font-mono font-bold text-neutral-900 tabular-nums">
                  {formatCurrencyAmount(lastSuccessTx.sourceAmount, lastSuccessTx.sourceCurrency)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Қолма-қол түсті:</span>
                <span className="font-mono font-bold text-emerald-700 tabular-nums">
                  {formatCurrencyAmount(lastSuccessTx.targetAmount, lastSuccessTx.targetCurrency)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Бағам:</span>
                <span className="font-mono tabular-nums">
                  1 {lastSuccessTx.sourceCurrency} = {lastSuccessTx.exchangeRate} {lastSuccessTx.targetCurrency}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Комиссия:</span>
                <span className="font-mono tabular-nums">
                  {formatCurrencyAmount(lastSuccessTx.feeAmount, lastSuccessTx.sourceCurrency)}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-neutral-200 text-[11px] text-neutral-500">
                <span>Уақыты:</span>
                <span>{new Date(lastSuccessTx.createdAt).toLocaleString('kk-KZ')}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setLastSuccessTx(null);
                  setActiveTab('transactions');
                }}
                className="flex-1 py-3 px-4 rounded-xl border border-neutral-300 text-neutral-700 text-xs font-semibold hover:bg-neutral-50 transition-colors"
              >
                Тарихты көру
              </button>
              <button
                type="button"
                onClick={() => {
                  setLastSuccessTx(null);
                  setActiveTab('wallets');
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-[#0e2a14] text-[#9fe870] text-xs font-bold hover:bg-[#183d1e] transition-colors"
              >
                Әмияндарға өту
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
