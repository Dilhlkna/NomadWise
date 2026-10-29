import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { VirtualCard } from './VirtualCard';
import { Wallet } from '../types';
import { formatCurrencyAmount, currencyService, roundToDecimals } from '../services/currencyService';
import { CURRENCIES } from '../data/currencies';
import {
  CreditCard,
  Plus,
  ArrowLeftRight,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  Wallet as WalletIcon,
} from 'lucide-react';

interface WalletsViewProps {
  onOpenNewWallet: () => void;
  onOpenDemoTopUp: (wallet: Wallet) => void;
  onOpenExchangeForWallet: (wallet: Wallet) => void;
}

export const WalletsView: React.FC<WalletsViewProps> = ({
  onOpenNewWallet,
  onOpenDemoTopUp,
  onOpenExchangeForWallet,
}) => {
  const { user, wallets, toggleFreezeWallet, setActiveTab } = useApp();

  // Calculate total net worth converted to user's preferred currency (e.g. KZT)
  const preferredCode = user?.preferredCurrency || 'KZT';
  const totalNetWorth = wallets.reduce((acc, w) => {
    const rateToPreferred = currencyService.getCrossRate(w.currencyCode, preferredCode);
    return acc + w.balance * rateToPreferred;
  }, 0);

  return (
    <div className="space-y-8">
      {/* Top Banner: Total Portfolio Balance */}
      <div className="bg-[#0e2a14] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-[#1b4322]">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-neutral-300 mb-1">
              <WalletIcon className="w-4 h-4 text-[#9fe870]" />
              <span>Барлық әмияндардың жалпы сомасы ({preferredCode})</span>
            </div>

            <div className="text-3xl sm:text-5xl font-extrabold font-mono tracking-tight text-white tabular-nums">
              {formatCurrencyAmount(
                roundToDecimals(totalNetWorth, preferredCode === 'JPY' ? 0 : 2),
                preferredCode
              )}
            </div>

            <p className="text-xs text-neutral-300 mt-2">
              Ағымдағы нақты бағаммен есептелген {wallets.length} белсенді виртуалды әмиян
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onOpenNewWallet}
              className="px-5 py-3 rounded-2xl bg-[#9fe870] hover:bg-[#b0f385] text-[#0e2a14] font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>+ Жаңа әмиян қосу</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('exchange')}
              className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs border border-white/15 transition-all flex items-center gap-2"
            >
              <ArrowLeftRight className="w-4 h-4 text-[#9fe870]" />
              <span>Валюта айырбастау</span>
            </button>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-neutral-900 tracking-tight flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#0e2a14]" />
              Сіздің виртуалды карталарыңыз
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Әр валютаға жеке виртуалды идентификатор және баланс бекітілген
            </p>
          </div>

          <span className="text-xs text-neutral-500 font-medium">
            {wallets.length} әмиян
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wallets.map((wallet) => (
            <VirtualCard
              key={wallet.id}
              wallet={wallet}
              onExchangeClick={(w) => onOpenExchangeForWallet(w)}
              onTopUpDemo={(w) => onOpenDemoTopUp(w)}
              onToggleFreeze={(id) => toggleFreezeWallet(id)}
            />
          ))}

          {/* Add Wallet Placeholder card */}
          <button
            type="button"
            onClick={onOpenNewWallet}
            className="aspect-[1.586/1] w-full rounded-2xl border-2 border-dashed border-neutral-300 hover:border-[#0e2a14] bg-neutral-50/50 hover:bg-neutral-100/60 transition-all flex flex-col items-center justify-center p-6 text-center group"
          >
            <div className="w-12 h-12 rounded-2xl bg-neutral-100 group-hover:bg-[#0e2a14] text-neutral-500 group-hover:text-[#9fe870] flex items-center justify-center transition-colors mb-3">
              <Plus className="w-6 h-6" />
            </div>
            <strong className="text-sm font-bold text-neutral-800 group-hover:text-neutral-900">
              Жаңа валюталық әмиян ашу
            </strong>
            <p className="text-xs text-neutral-500 mt-1 max-w-[200px]">
              KZT, USD, EUR, GBP, CNY, RUB және басқа валюталарды қосыңыз
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};
