import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CURRENCY_LIST } from '../data/currencies';
import { CurrencyCode } from '../types';
import {
  User,
  Mail,
  Phone,
  Globe,
  Coins,
  ShieldCheck,
  Key,
  CheckCircle2,
  Calendar,
  Lock,
} from 'lucide-react';

export const UserProfile: React.FC = () => {
  const { user, updateProfile, wallets, transactions } = useApp();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '+7 (701) 450-88-21');
  const [country, setCountry] = useState(user?.country || 'Қазақстан');
  const [preferredCurrency, setPreferredCurrency] = useState<CurrencyCode>(
    user?.preferredCurrency || 'KZT'
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!user) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      fullName,
      phone,
      country,
      preferredCurrency,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-sm flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-2xl bg-[#0e2a14] text-[#9fe870] font-bold text-3xl flex items-center justify-center shadow-md shrink-0">
          {user.fullName.charAt(0)}
        </div>

        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">
              {user.fullName}
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60 font-medium inline-block self-center sm:self-auto">
              Верификацияланған аккаунт
            </span>
          </div>
          <p className="text-xs text-neutral-500 font-mono">{user.email}</p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-3 text-xs text-neutral-500">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-neutral-400" />
              Тіркелген күні: {new Date(user.joinedDate).toLocaleDateString('kk-KZ')}
            </span>
            <span>·</span>
            <span>{wallets.length} әмиян</span>
            <span>·</span>
            <span>{transactions.length} транзакция</span>
          </div>
        </div>
      </div>

      {/* Profile Settings Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-6">
          <h3 className="text-lg font-bold text-neutral-900">
            Жеке деректерді басқару
          </h3>
          {savedSuccess && (
            <span className="text-xs text-emerald-700 flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-4 h-4" /> Өзгерістер сақталды!
            </span>
          )}
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1.5">
                Толық аты-жөніңіз:
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-200 outline-none focus:border-[#0e2a14]"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1.5">
                Телефон нөмірі:
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-200 outline-none focus:border-[#0e2a14]"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1.5">
                Тұратын еліңіз:
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-200 outline-none focus:border-[#0e2a14]"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1.5">
                Негізгі валюта:
              </label>
              <select
                value={preferredCurrency}
                onChange={(e) => setPreferredCurrency(e.target.value as CurrencyCode)}
                className="w-full py-2.5 px-3 rounded-xl border border-neutral-200 outline-none bg-white"
              >
                {CURRENCY_LIST.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.code} ({c.symbol}) — {c.nameKz}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-100 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#0e2a14] hover:bg-[#183d1e] text-[#9fe870] font-bold text-xs shadow-sm transition-all"
            >
              Өзгерістерді сақтау
            </button>
          </div>
        </form>
      </div>

      {/* Security Info Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-sm">
        <h3 className="text-lg font-bold text-neutral-900 mb-2 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-700" />
          Қауіпсіздік және деректерді қорғау
        </h3>
        <p className="text-xs text-neutral-600 leading-relaxed mb-4">
          Сіздің аккаунтыңыз Spring Security және BCrypt 12-round хештеу технологиясы арқылы қорғалған.
          Барлық қаржылық транзакциялар дерекқор деңгейінде оқшауланған.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
            <div className="font-semibold text-neutral-800">Парольді қорғау:</div>
            <div className="text-neutral-500 font-mono text-[11px] mt-0.5">
              BCrypt $2a$12$ / Салталған хеш
            </div>
          </div>
          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
            <div className="font-semibold text-neutral-800">Сессияны басқару:</div>
            <div className="text-neutral-500 font-mono text-[11px] mt-0.5">
              Stateless JWT (HMAC-SHA256)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
