import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Transaction, CurrencyCode } from '../types';
import { CURRENCIES, CURRENCY_LIST } from '../data/currencies';
import { formatCurrencyAmount } from '../services/currencyService';
import {
  History,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ArrowRight,
  Download,
  Receipt,
  FileText,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';

export const TransactionHistory: React.FC = () => {
  const { transactions } = useApp();
  const [searchCode, setSearchCode] = useState('');
  const [currencyFilter, setCurrencyFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter logic
  const filtered = transactions.filter((tx) => {
    if (searchCode && !tx.referenceCode.toLowerCase().includes(searchCode.toLowerCase())) {
      return false;
    }
    if (
      currencyFilter !== 'ALL' &&
      tx.sourceCurrency !== currencyFilter &&
      tx.targetCurrency !== currencyFilter
    ) {
      return false;
    }
    if (typeFilter !== 'ALL' && tx.type !== typeFilter) {
      return false;
    }
    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const currentItems = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const exportAsTextReceipt = (tx: Transaction) => {
    const receiptText = `
========================================
             NOMADWISE RECEIPT
========================================
Транзакция ID: ${tx.referenceCode}
Уақыты: ${new Date(tx.createdAt).toLocaleString('kk-KZ')}
Статусы: ${tx.status === 'SUCCESS' ? 'СӘТТІ ОРЫНДАЛДЫ' : tx.status}
Түрі: ${tx.type === 'EXCHANGE' ? 'ВАЛЮТА АЙЫРБАСТАУ' : 'ТЕСТІЛІК ТОЛЫҚТЫРУ'}

Шығарылған сома: ${formatCurrencyAmount(tx.sourceAmount, tx.sourceCurrency)}
Есептелген сома: ${formatCurrencyAmount(tx.targetAmount, tx.targetCurrency)}
Қолданылған бағам: 1 ${tx.sourceCurrency} = ${tx.exchangeRate} ${tx.targetCurrency}
Комиссия (0.45%): ${formatCurrencyAmount(tx.feeAmount, tx.sourceCurrency)}

Қауіпсіздік: 256-Bit SSL / MySQL ACID Transaction
Расталды: NomadWise Core Banking Engine (Java 21)
========================================
    `;

    const blob = new Blob([receiptText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt_${tx.referenceCode}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-md p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-100">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight flex items-center gap-2">
            <History className="w-5 h-5 text-[#0e2a14]" />
            Транзакциялар тарихы
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Сіздің барлық виртуалды айырбастау және толықтыру операцияларыңыз
          </p>
        </div>

        {/* Global count */}
        <div className="text-xs text-neutral-500">
          Барлық жазбалар: <span className="font-mono font-bold text-neutral-800">{transactions.length}</span>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-5">
        {/* Search by reference code */}
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchCode}
            onChange={(e) => {
              setSearchCode(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Транзакция кодын іздеу..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:bg-white focus:border-[#0e2a14]"
          />
        </div>

        {/* Filter by currency */}
        <div>
          <select
            value={currencyFilter}
            onChange={(e) => {
              setCurrencyFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full py-2 px-3 text-xs bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:bg-white focus:border-[#0e2a14]"
          >
            <option value="ALL">Барлық валюталар</option>
            {CURRENCY_LIST.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.code} — {c.nameKz}
              </option>
            ))}
          </select>
        </div>

        {/* Filter by Type */}
        <div>
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full py-2 px-3 text-xs bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:bg-white focus:border-[#0e2a14]"
          >
            <option value="ALL">Барлық түрлері</option>
            <option value="EXCHANGE">Валюта айырбастау</option>
            <option value="DEMO_DEPOSIT">Demo толықтыру</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-neutral-200/80 text-xs font-semibold text-neutral-500">
              <th className="pb-3 pl-2">Код & Түрі</th>
              <th className="pb-3">Күні мен уақыты</th>
              <th className="pb-3">Шығарылды</th>
              <th className="pb-3">Есептелді</th>
              <th className="pb-3 text-right">Бағам & Комиссия</th>
              <th className="pb-3 text-right pr-2">Чек</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {currentItems.map((tx) => {
              const isExchange = tx.type === 'EXCHANGE';

              return (
                <tr
                  key={tx.id}
                  onClick={() => setSelectedTx(tx)}
                  className="hover:bg-neutral-50/80 cursor-pointer transition-colors group"
                >
                  {/* Code & Type */}
                  <td className="py-3.5 pl-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                          isExchange
                            ? 'bg-[#0e2a14]/10 text-[#0e2a14]'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {isExchange ? (
                          <ArrowRight className="w-3.5 h-3.5" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div>
                        <span className="font-mono font-semibold text-neutral-900 text-xs block">
                          {tx.referenceCode}
                        </span>
                        <span className="text-[11px] text-neutral-500">
                          {isExchange ? 'Айырбастау' : 'Demo толықтыру'}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="py-3.5 text-xs text-neutral-600">
                    {new Date(tx.createdAt).toLocaleDateString('kk-KZ', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                    <div className="text-[10px] text-neutral-400">
                      {new Date(tx.createdAt).toLocaleTimeString('kk-KZ', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </td>

                  {/* Source amount */}
                  <td className="py-3.5 font-mono text-xs font-semibold text-neutral-800 tabular-nums">
                    {isExchange ? (
                      <span className="text-neutral-700">
                        -{formatCurrencyAmount(tx.sourceAmount, tx.sourceCurrency)}
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>

                  {/* Target amount */}
                  <td className="py-3.5 font-mono text-xs font-bold text-emerald-800 tabular-nums">
                    +{formatCurrencyAmount(tx.targetAmount, tx.targetCurrency)}
                  </td>

                  {/* Rate & Fee */}
                  <td className="py-3.5 text-right font-mono text-xs text-neutral-600 tabular-nums">
                    {isExchange ? (
                      <>
                        <div className="font-medium text-neutral-900">
                          {tx.exchangeRate.toFixed(4)}
                        </div>
                        <div className="text-[10px] text-neutral-400">
                          Ком: {formatCurrencyAmount(tx.feeAmount, tx.sourceCurrency)}
                        </div>
                      </>
                    ) : (
                      <span className="text-[11px] text-neutral-400">0.00 ₸</span>
                    )}
                  </td>

                  {/* Receipt Action */}
                  <td className="py-3.5 text-right pr-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTx(tx);
                      }}
                      className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/60 rounded-lg transition-colors"
                      title="Чекті ашу"
                    >
                      <Receipt className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="text-center py-10 text-neutral-500 text-xs">
          Сүзгі шарттарына сәйкес келетін транзакциялар табылмады.
        </div>
      )}

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-6 border-t border-neutral-100 text-xs">
          <span className="text-neutral-500">
            Бет: <strong className="text-neutral-800">{currentPage}</strong> / {totalPages}
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-neutral-200 text-neutral-700 hover:bg-neutral-50 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg border border-neutral-200 text-neutral-700 hover:bg-neutral-50 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Selected Transaction Receipt Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-5">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-[#0e2a14]" />
                <h3 className="text-base font-bold text-neutral-900">
                  Транзакция туралы мәлімет
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTx(null)}
                className="text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs mb-6">
              <div className="bg-[#0e2a14]/5 p-4 rounded-2xl border border-[#0e2a14]/10">
                <div className="text-[11px] text-neutral-500 mb-1">Транзакция нөмірі</div>
                <div className="font-mono font-bold text-sm text-[#0e2a14]">
                  {selectedTx.referenceCode}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2.5">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Операция түрі:</span>
                  <span className="font-semibold text-neutral-800">
                    {selectedTx.type === 'EXCHANGE' ? 'Валюта айырбастау' : 'Demo толықтыру'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Статус:</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Сәтті орындалды
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Шығарылған сома:</span>
                  <span className="font-mono font-semibold text-neutral-900 tabular-nums">
                    {formatCurrencyAmount(selectedTx.sourceAmount, selectedTx.sourceCurrency)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Есептелген сома:</span>
                  <span className="font-mono font-bold text-emerald-700 tabular-nums">
                    {formatCurrencyAmount(selectedTx.targetAmount, selectedTx.targetCurrency)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Қолданылған бағам:</span>
                  <span className="font-mono tabular-nums">
                    1 {selectedTx.sourceCurrency} = {selectedTx.exchangeRate} {selectedTx.targetCurrency}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Комиссия мөлшері:</span>
                  <span className="font-mono tabular-nums">
                    {formatCurrencyAmount(selectedTx.feeAmount, selectedTx.sourceCurrency)} ({selectedTx.feePercentage}%)
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-neutral-200 text-neutral-500">
                  <span>Тіркелген уақыты:</span>
                  <span>{new Date(selectedTx.createdAt).toLocaleString('kk-KZ')}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => exportAsTextReceipt(selectedTx)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-neutral-300 text-neutral-700 text-xs font-semibold hover:bg-neutral-50 transition-colors flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Чекті жүктеп алу (.txt)
              </button>
              <button
                type="button"
                onClick={() => setSelectedTx(null)}
                className="py-2.5 px-5 rounded-xl bg-[#0e2a14] text-[#9fe870] text-xs font-bold hover:bg-[#183d1e]"
              >
                Жабу
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
