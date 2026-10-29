import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CurrencyCode, CardTheme } from '../types';
import { CURRENCY_LIST } from '../data/currencies';
import { X, CreditCard, Check, Sparkles } from 'lucide-react';

interface AddWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const THEME_OPTIONS: { id: CardTheme; name: string; bgClass: string }[] = [
  { id: 'forest', name: 'Орман Жасылы (Wise)', bgClass: 'bg-[#0c2411]' },
  { id: 'emerald', name: 'Жақұтты Изумруд', bgClass: 'bg-[#047857]' },
  { id: 'graphite', name: 'Қою Графит', bgClass: 'bg-[#1e293b]' },
  { id: 'navy', name: 'Түнгі Сапфир', bgClass: 'bg-[#1e3a8a]' },
  { id: 'burgundy', name: 'Патшалық Шие', bgClass: 'bg-[#701a75]' },
  { id: 'copper', name: 'Мыс Жез', bgClass: 'bg-[#7c2d12]' },
];

export const AddWalletModal: React.FC<AddWalletModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { wallets, createWallet, setActiveTab } = useApp();
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>('EUR');
  const [selectedTheme, setSelectedTheme] = useState<CardTheme>('forest');

  if (!isOpen) return null;

  // Currencies user doesn't already have or has
  const existingCodes = wallets.map((w) => w.currencyCode);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createWallet(selectedCurrency, selectedTheme);
    onClose();
    setActiveTab('wallets');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-5">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#0e2a14]" />
            <h3 className="text-base font-bold text-neutral-900">
              Жаңа виртуалды әмиян ашу
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

        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          {/* Currency selection */}
          <div>
            <label className="block font-semibold text-neutral-700 mb-2">
              Валютаны таңдаңыз:
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
              {CURRENCY_LIST.map((currency) => {
                const hasExisting = existingCodes.includes(currency.code);
                const isSelected = selectedCurrency === currency.code;

                return (
                  <button
                    key={currency.code}
                    type="button"
                    onClick={() => setSelectedCurrency(currency.code)}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                      isSelected
                        ? 'border-[#0e2a14] bg-[#0e2a14]/5 ring-1 ring-[#0e2a14]'
                        : 'border-neutral-200 hover:border-neutral-300 bg-neutral-50/50'
                    }`}
                  >
                    <span className="text-xl">{currency.flag}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-neutral-900 flex items-center justify-between">
                        <span>{currency.code}</span>
                        {hasExisting && (
                          <span className="text-[10px] text-amber-600 font-normal">
                            Бар
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-neutral-500 truncate">
                        {currency.nameKz}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Card Theme color selection */}
          <div>
            <label className="block font-semibold text-neutral-700 mb-2">
              Картаның дизайны мен түсі:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {THEME_OPTIONS.map((theme) => {
                const isSelected = selectedTheme === theme.id;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => setSelectedTheme(theme.id)}
                    className={`p-2 rounded-xl border text-center flex flex-col items-center gap-1.5 transition-all ${
                      isSelected
                        ? 'border-[#0e2a14] ring-2 ring-[#0e2a14]/20'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div
                      className={`w-full h-7 rounded-lg ${theme.bgClass} flex items-center justify-center text-white`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <span className="text-[10px] font-medium text-neutral-700 truncate w-full">
                      {theme.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-neutral-500 text-[11px] leading-relaxed">
            * Бұл виртуалды әмиян сайт ішіндегі айырбастау және қаражатты сақтау үшін тегін ашылады.
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl border border-neutral-300 text-neutral-700 font-semibold hover:bg-neutral-50"
            >
              Бас тарту
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#0e2a14] hover:bg-[#183d1e] text-[#9fe870] font-bold shadow-md active:scale-95"
            >
              Картаны ашу
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
