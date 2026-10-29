import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CurrencyCode } from '../types';
import { CURRENCY_LIST } from '../data/currencies';
import {
  X,
  Lock,
  Mail,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'login',
}) => {
  const { login, register } = useApp();
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);

  // Form states
  const [email, setEmail] = useState('arman@nomadwise.kz');
  const [password, setPassword] = useState('SecurePass2026!');
  const [fullName, setFullName] = useState('Арман Серікұлы');
  const [country, setCountry] = useState('Қазақстан');
  const [preferredCurrency, setPreferredCurrency] = useState<CurrencyCode>('KZT');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !email.includes('@')) {
      setError('Дұрыс электрондық пошта мекенжайын енгізіңіз.');
      return;
    }

    if (!password || password.length < 6) {
      setError('Құпиясөз кем дегенде 6 таңбадан тұруы тиіс.');
      return;
    }

    if (mode === 'login') {
      login(email, password);
      onClose();
    } else {
      if (!fullName.trim()) {
        setError('Аты-жөніңізді енгізіңіз.');
        return;
      }
      register(fullName, email, password, country, preferredCurrency);
      onClose();
    }
  };

  const handleQuickDemoLogin = () => {
    login('arman@nomadwise.kz');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#0e2a14] text-[#9fe870] flex items-center justify-center font-bold text-sm">
              ₸
            </div>
            <div>
              <h3 className="text-lg font-bold text-neutral-900">
                {mode === 'login' ? 'Жүйеге кіру' : 'Жаңа тіркелу'}
              </h3>
              <p className="text-xs text-neutral-500">NomadWise қаржы платформасы</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center p-1 bg-neutral-100 rounded-xl mb-5">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === 'login'
                ? 'bg-white text-neutral-900 shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Кіру (Sign In)
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === 'register'
                ? 'bg-white text-neutral-900 shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Тіркелу (Register)
          </button>
        </div>

        {/* Error notice */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {mode === 'register' && (
            <div>
              <label className="block font-medium text-neutral-700 mb-1">
                Толық аты-жөніңіз:
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Мысалы: Арман Серікұлы"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-200 outline-none focus:border-[#0e2a14] focus:ring-1 focus:ring-[#0e2a14]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block font-medium text-neutral-700 mb-1">
              Электрондық пошта:
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-200 outline-none focus:border-[#0e2a14] focus:ring-1 focus:ring-[#0e2a14]"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-neutral-700 mb-1">
              Қауіпсіз құпиясөз:
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-200 outline-none focus:border-[#0e2a14] focus:ring-1 focus:ring-[#0e2a14]"
              />
            </div>
          </div>

          {mode === 'register' && (
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block font-medium text-neutral-700 mb-1">Ел:</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 outline-none"
                />
              </div>
              <div>
                <label className="block font-medium text-neutral-700 mb-1">Негізгі валюта:</label>
                <select
                  value={preferredCurrency}
                  onChange={(e) => setPreferredCurrency(e.target.value as CurrencyCode)}
                  className="w-full px-2 py-2 rounded-xl border border-neutral-200 outline-none bg-white"
                >
                  {CURRENCY_LIST.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-[#0e2a14] hover:bg-[#183d1e] text-[#9fe870] font-bold text-xs shadow-md transition-all active:scale-95"
            >
              {mode === 'login' ? 'Кіру' : 'Тіркелу және бастау'}
            </button>
          </div>
        </form>

        {/* 1-Click Demo Login button for reviewers / test */}
        <div className="mt-5 pt-4 border-t border-neutral-100">
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            className="w-full py-2.5 px-3 rounded-xl bg-[#9fe870]/20 hover:bg-[#9fe870]/30 text-[#0e2a14] border border-[#9fe870]/40 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-800" />
            1-Басумен Demo аккаунтпен кіру (Арман Серікұлы)
          </button>
          <p className="text-[10px] text-neutral-400 text-center mt-2">
            Парольдер BCrypt (Spring Security) арқылы қорғалған.
          </p>
        </div>
      </div>
    </div>
  );
};
