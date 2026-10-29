import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Wallet } from '../types';
import { formatCurrencyAmount } from '../services/currencyService';
import { CURRENCIES } from '../data/currencies';
import { X, PlusCircle, Sparkles, CheckCircle2 } from 'lucide-react';

interface DemoTopUpModalProps {
  wallet: Wallet | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DemoTopUpModal: React.FC<DemoTopUpModalProps> = ({
  wallet,
  isOpen,
  onClose,
}) => {
  const { addDemoFunds } = useApp();
  const [customAmount, setCustomAmount] = useState<string>('50000');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !wallet) return null;

  const currency = CURRENCIES[wallet.currencyCode] || {
    symbol: wallet.currencyCode,
    nameKz: wallet.currencyCode,
  };

  // Preset amounts based on currency
  const presets =
    wallet.currencyCode === 'KZT'
      ? [20000, 50000, 100000, 250000]
      : wallet.currencyCode === 'RUB'
      ? [5000, 10000, 25000, 50000]
      : [50, 100, 250, 500];

  const handleTopUp = (amountToAdd: number) => {
    if (amountToAdd <= 0) return;
    addDemoFunds(wallet.id, amountToAdd);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-5">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-emerald-700" />
            <h3 className="text-base font-bold text-neutral-900">
              Виртуалды Demo балансты толықтыру
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-neutral-900">
              Баланс сәтті толықтырылды!
            </p>
          </div>
        ) : (
          <div className="space-y-4 text-xs">
            {/* Wallet summary */}
            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/80 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-neutral-400 block">Әмиян</span>
                <strong className="text-neutral-800 text-sm">
                  {currency.nameKz} ({wallet.currencyCode})
                </strong>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-neutral-400 block">Ағымдағы баланс</span>
                <strong className="font-mono text-emerald-800 text-sm tabular-nums">
                  {formatCurrencyAmount(wallet.balance, wallet.currencyCode)}
                </strong>
              </div>
            </div>

            {/* Educational Disclaimer */}
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-amber-900 text-[11px] leading-relaxed flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                <strong>Оқу мақсатындағы ескерту:</strong> Бұл нақты ақша емес, жүйенің валюта айырбастау және баланс есептеуін тексеруге арналған сынақ қаражаты.
              </span>
            </div>

            {/* Presets */}
            <div>
              <label className="block font-semibold text-neutral-700 mb-2">
                Дайын соманы таңдаңыз:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {presets.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => handleTopUp(amt)}
                    className="py-2.5 px-3 rounded-xl border border-neutral-200 hover:border-[#0e2a14] hover:bg-[#0e2a14]/5 text-neutral-800 font-mono font-bold text-xs transition-all active:scale-95"
                  >
                    +{formatCurrencyAmount(amt, wallet.currencyCode)}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amount */}
            <div className="pt-2">
              <label className="block font-semibold text-neutral-700 mb-1.5">
                Немесе өз сомаңызды жазыңыз:
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="Сомасы..."
                  className="flex-1 px-3 py-2 rounded-xl border border-neutral-200 font-mono font-bold text-neutral-900 outline-none focus:border-[#0e2a14]"
                />
                <button
                  type="button"
                  onClick={() => handleTopUp(parseFloat(customAmount) || 0)}
                  className="px-4 py-2 rounded-xl bg-[#0e2a14] text-[#9fe870] font-bold text-xs hover:bg-[#183d1e] transition-colors"
                >
                  Қосу
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
