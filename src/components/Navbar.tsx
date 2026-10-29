import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowLeftRight,
  CreditCard,
  LineChart,
  History,
  Code2,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  onOpenAuth: () => void;
  onOpenNewWallet: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth, onOpenNewWallet }) => {
  const { user, isAuthenticated, logout, activeTab, setActiveTab } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Басты бет' },
    { id: 'exchange', label: 'Айырбастау', icon: ArrowLeftRight },
    { id: 'wallets', label: 'Әмияндар', icon: CreditCard },
    { id: 'rates', label: 'Бағамдар', icon: LineChart },
    { id: 'transactions', label: 'Тарих', icon: History },
    { id: 'backend-docs', label: 'Java & Spring Boot', icon: Code2, isSpecial: true },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0e2a14]/95 backdrop-blur-md border-b border-[#1b4322] text-white">
      {/* Primary Top Bar Contract: 3 zones separated by gap-8 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single Brand Wordmark */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 text-left group shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9fe870] rounded-lg"
        >
          <div className="w-9 h-9 rounded-xl bg-[#9fe870] text-[#0e2a14] flex items-center justify-center font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">
            ₸
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-white whitespace-nowrap">
              Nomad<span className="text-[#9fe870]">Wise</span>
            </span>
          </div>
        </button>

        {/* Zone 2: Single-line Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-neutral-300">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                  isActive
                    ? 'text-[#9fe870] border-[#9fe870] font-semibold'
                    : 'text-neutral-300 hover:text-white border-transparent'
                } ${item.isSpecial ? 'text-[#9fe870]/90 font-mono text-xs' : ''}`}
              >
                {item.icon && <item.icon className="w-3.5 h-3.5" />}
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleNavClick('wallets')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#183d1e] hover:bg-[#204e28] text-xs text-white border border-[#2a5d33] transition-colors"
                title="Жеке кабинет"
              >
                <div className="w-6 h-6 rounded-full bg-[#9fe870] text-[#0e2a14] flex items-center justify-center font-bold text-xs">
                  {user.fullName.charAt(0)}
                </div>
                <span className="max-w-[120px] truncate">{user.fullName}</span>
              </button>

              <button
                onClick={logout}
                className="p-2 text-neutral-400 hover:text-white hover:bg-[#183d1e] rounded-lg transition-colors"
                title="Шығу"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-4 py-2 text-xs font-semibold text-[#0e2a14] bg-[#9fe870] hover:bg-[#b0f385] rounded-xl shadow-sm transition-all whitespace-nowrap shrink-0 active:scale-95"
            >
              Кіру / Тіркелу
            </button>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-neutral-300 hover:text-white hover:bg-[#183d1e]"
            aria-label="Мәзірді ашу"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#1b4322] bg-[#0c2411] px-4 pt-3 pb-6 space-y-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left ${
                  isActive
                    ? 'bg-[#183d1e] text-[#9fe870] font-semibold'
                    : 'text-neutral-300 hover:bg-[#15341a]'
                }`}
              >
                {item.icon && <item.icon className="w-4 h-4 text-neutral-400" />}
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-4 border-t border-[#1b4322] flex flex-col gap-2">
            {isAuthenticated && user ? (
              <>
                <div className="px-3 py-2 text-xs text-neutral-400 flex items-center justify-between">
                  <span>{user.fullName}</span>
                  <span className="text-[#9fe870]">{user.email}</span>
                </div>
                <button
                  onClick={() => {
                    handleNavClick('wallets');
                    onOpenNewWallet();
                  }}
                  className="w-full py-2 text-xs font-semibold bg-[#183d1e] text-white rounded-lg text-center"
                >
                  + Жаңа әмиян ашу
                </button>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 text-xs text-red-300 hover:text-red-200 text-center"
                >
                  Жүйеден шығу
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="w-full py-2.5 text-center text-xs font-bold text-[#0e2a14] bg-[#9fe870] rounded-lg"
              >
                Кіру немесе Тіркелу
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
