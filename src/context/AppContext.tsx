import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  CurrencyCode,
  Wallet,
  Transaction,
  User,
  RateSnapshot,
  CardTheme,
} from '../types';
import { currencyService, roundToDecimals } from '../services/currencyService';

interface AppContextType {
  user: User | null;
  isAuthenticated: boolean;
  wallets: Wallet[];
  transactions: Transaction[];
  ratesSnapshot: RateSnapshot;
  activeTab: string;
  isRatesLoading: boolean;
  setActiveTab: (tab: string) => void;
  login: (email: string, password?: string) => boolean;
  register: (fullName: string, email: string, password?: string, country?: string, preferredCurrency?: CurrencyCode) => boolean;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  createWallet: (currencyCode: CurrencyCode, cardTheme?: CardTheme) => Wallet;
  toggleFreezeWallet: (walletId: string) => void;
  addDemoFunds: (walletId: string, amount: number) => void;
  executeExchange: (
    sourceWalletId: string,
    targetWalletId: string,
    sourceAmount: number
  ) => { success: boolean; message: string; transaction?: Transaction };
  refreshRates: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Default initial demo user
const INITIAL_DEMO_USER: User = {
  id: 'usr_arman_892',
  fullName: 'Арман Серікұлы',
  email: 'arman@nomadwise.kz',
  phone: '+7 (701) 450-88-21',
  country: 'Қазақстан',
  preferredCurrency: 'KZT',
  joinedDate: '2025-11-14T09:00:00.000Z',
  isDemoUser: true,
};

// Default starter wallets for demo user
const INITIAL_WALLETS: Wallet[] = [
  {
    id: 'wlt_kzt_101',
    userId: 'usr_arman_892',
    currencyCode: 'KZT',
    balance: 280000.0,
    cardholderName: 'ARMAN SERIKULY',
    virtualCardNumber: '5375 8892 4109 7721',
    expiryDate: '10/29',
    isFrozen: false,
    cardTheme: 'forest',
    createdAt: '2025-11-14T09:10:00.000Z',
  },
  {
    id: 'wlt_usd_102',
    userId: 'usr_arman_892',
    currencyCode: 'USD',
    balance: 850.0,
    cardholderName: 'ARMAN SERIKULY',
    virtualCardNumber: '4012 3918 6420 9942',
    expiryDate: '11/30',
    isFrozen: false,
    cardTheme: 'emerald',
    createdAt: '2025-11-15T11:20:00.000Z',
  },
  {
    id: 'wlt_eur_103',
    userId: 'usr_arman_892',
    currencyCode: 'EUR',
    balance: 320.0,
    cardholderName: 'ARMAN SERIKULY',
    virtualCardNumber: '4929 1104 7731 5508',
    expiryDate: '08/29',
    isFrozen: false,
    cardTheme: 'navy',
    createdAt: '2025-11-20T14:40:00.000Z',
  },
  {
    id: 'wlt_gbp_104',
    userId: 'usr_arman_892',
    currencyCode: 'GBP',
    balance: 140.0,
    cardholderName: 'ARMAN SERIKULY',
    virtualCardNumber: '5199 7430 8820 1934',
    expiryDate: '12/28',
    isFrozen: false,
    cardTheme: 'graphite',
    createdAt: '2025-12-05T16:00:00.000Z',
  },
];

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx_9841',
    referenceCode: 'NW-2026-8941',
    userId: 'usr_arman_892',
    type: 'EXCHANGE',
    sourceWalletId: 'wlt_usd_102',
    targetWalletId: 'wlt_kzt_101',
    sourceCurrency: 'USD',
    targetCurrency: 'KZT',
    sourceAmount: 100.0,
    targetAmount: 49610.5,
    exchangeRate: 498.6,
    feeAmount: 0.45,
    feePercentage: 0.45,
    status: 'SUCCESS',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    description: '100 USD ➔ 49,610.50 KZT айырбастау',
  },
  {
    id: 'tx_9840',
    referenceCode: 'NW-2026-8940',
    userId: 'usr_arman_892',
    type: 'DEMO_DEPOSIT',
    targetWalletId: 'wlt_kzt_101',
    sourceCurrency: 'KZT',
    targetCurrency: 'KZT',
    sourceAmount: 150000.0,
    targetAmount: 150000.0,
    exchangeRate: 1.0,
    feeAmount: 0.0,
    feePercentage: 0.0,
    status: 'SUCCESS',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    description: 'Оқу режиміндегі виртуалды тестілік толықтыру (+150,000 ₸)',
  },
  {
    id: 'tx_9839',
    referenceCode: 'NW-2026-8939',
    userId: 'usr_arman_892',
    type: 'EXCHANGE',
    sourceWalletId: 'wlt_eur_103',
    targetWalletId: 'wlt_gbp_104',
    sourceCurrency: 'EUR',
    targetCurrency: 'GBP',
    sourceAmount: 60.0,
    targetAmount: 50.84,
    exchangeRate: 0.851,
    feeAmount: 0.27,
    feePercentage: 0.45,
    status: 'SUCCESS',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    description: '60 EUR ➔ 50.84 GBP айырбастау',
  },
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('nomadwise_user');
      return saved ? JSON.parse(saved) : INITIAL_DEMO_USER;
    } catch {
      return INITIAL_DEMO_USER;
    }
  });

  const [wallets, setWallets] = useState<Wallet[]>(() => {
    try {
      const saved = localStorage.getItem('nomadwise_wallets');
      return saved ? JSON.parse(saved) : INITIAL_WALLETS;
    } catch {
      return INITIAL_WALLETS;
    }
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem('nomadwise_txs');
      return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  const [ratesSnapshot, setRatesSnapshot] = useState<RateSnapshot>(() =>
    currencyService.getCurrentRates()
  );
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isRatesLoading, setIsRatesLoading] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('nomadwise_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('nomadwise_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('nomadwise_wallets', JSON.stringify(wallets));
  }, [wallets]);

  useEffect(() => {
    localStorage.setItem('nomadwise_txs', JSON.stringify(transactions));
  }, [transactions]);

  // Initial load of live rates
  useEffect(() => {
    refreshRates();
    const timer = setInterval(() => {
      refreshRates();
    }, 60000); // 60s live update
    return () => clearInterval(timer);
  }, []);

  const refreshRates = async () => {
    setIsRatesLoading(true);
    try {
      const snap = await currencyService.fetchLiveRates();
      setRatesSnapshot(snap);
    } finally {
      setIsRatesLoading(false);
    }
  };

  const login = (email: string) => {
    const newUser: User = {
      ...INITIAL_DEMO_USER,
      email: email || INITIAL_DEMO_USER.email,
    };
    setUser(newUser);
    return true;
  };

  const register = (
    fullName: string,
    email: string,
    _password?: string,
    country: string = 'Қазақстан',
    preferredCurrency: CurrencyCode = 'KZT'
  ) => {
    const newUserId = `usr_${Date.now()}`;
    const newUser: User = {
      id: newUserId,
      fullName: fullName.trim() || 'Қолданушы',
      email: email.trim(),
      country,
      preferredCurrency,
      joinedDate: new Date().toISOString(),
      isDemoUser: false,
    };
    setUser(newUser);

    // Create primary wallet for newly registered user
    const firstWallet: Wallet = {
      id: `wlt_${preferredCurrency.toLowerCase()}_${Date.now()}`,
      userId: newUserId,
      currencyCode: preferredCurrency,
      balance: 10000.0, // Educational starter balance
      cardholderName: newUser.fullName.toUpperCase(),
      virtualCardNumber: `5432 ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`,
      expiryDate: '10/29',
      isFrozen: false,
      cardTheme: 'forest',
      createdAt: new Date().toISOString(),
    };

    setWallets([firstWallet]);
    return true;
  };

  const logout = () => {
    setUser(null);
    setActiveTab('home');
  };

  const updateProfile = (data: Partial<User>) => {
    if (!user) return;
    setUser({ ...user, ...data });
  };

  const createWallet = (currencyCode: CurrencyCode, cardTheme: CardTheme = 'forest'): Wallet => {
    if (!user) throw new Error('Авторизация қажет');

    const randomDigits = () => Math.floor(1000 + Math.random() * 9000);
    const newWallet: Wallet = {
      id: `wlt_${currencyCode.toLowerCase()}_${Date.now()}`,
      userId: user.id,
      currencyCode,
      balance: 0.0,
      cardholderName: user.fullName.toUpperCase(),
      virtualCardNumber: `4716 ${randomDigits()} ${randomDigits()} ${randomDigits()}`,
      expiryDate: '12/29',
      isFrozen: false,
      cardTheme,
      createdAt: new Date().toISOString(),
    };

    setWallets((prev) => [newWallet, ...prev]);
    return newWallet;
  };

  const toggleFreezeWallet = (walletId: string) => {
    setWallets((prev) =>
      prev.map((w) => (w.id === walletId ? { ...w, isFrozen: !w.isFrozen } : w))
    );
  };

  const addDemoFunds = (walletId: string, amount: number) => {
    if (!user) return;
    const targetWallet = wallets.find((w) => w.id === walletId);
    if (!targetWallet) return;

    const newBalance = roundToDecimals(
      targetWallet.balance + amount,
      targetWallet.currencyCode === 'JPY' ? 0 : 2
    );

    setWallets((prev) =>
      prev.map((w) => (w.id === walletId ? { ...w, balance: newBalance } : w))
    );

    // Record transaction
    const tx: Transaction = {
      id: `tx_${Date.now()}`,
      referenceCode: `NW-DEP-${Math.floor(100000 + Math.random() * 900000)}`,
      userId: user.id,
      type: 'DEMO_DEPOSIT',
      targetWalletId: walletId,
      sourceCurrency: targetWallet.currencyCode,
      targetCurrency: targetWallet.currencyCode,
      sourceAmount: amount,
      targetAmount: amount,
      exchangeRate: 1.0,
      feeAmount: 0.0,
      feePercentage: 0.0,
      status: 'SUCCESS',
      createdAt: new Date().toISOString(),
      description: `Виртуалды тестілік толықтыру: +${amount} ${targetWallet.currencyCode}`,
    };

    setTransactions((prev) => [tx, ...prev]);
  };

  const executeExchange = (
    sourceWalletId: string,
    targetWalletId: string,
    sourceAmount: number
  ): { success: boolean; message: string; transaction?: Transaction } => {
    if (!user) {
      return { success: false, message: 'Операция үшін жүйеге кіріңіз' };
    }

    if (sourceWalletId === targetWalletId) {
      return { success: false, message: 'Бастапқы және мақсатты әмиян бірдей болмауы керек' };
    }

    if (sourceAmount <= 0) {
      return { success: false, message: 'Айырбастау сомасы оң сан болуы тиіс' };
    }

    const sourceWallet = wallets.find((w) => w.id === sourceWalletId);
    const targetWallet = wallets.find((w) => w.id === targetWalletId);

    if (!sourceWallet || !targetWallet) {
      return { success: false, message: 'Таңдалған әмиян табылмады' };
    }

    if (sourceWallet.isFrozen || targetWallet.isFrozen) {
      return { success: false, message: 'Бұғатталған әмиянмен операция орындау мүмкін емес' };
    }

    if (sourceWallet.balance < sourceAmount) {
      return {
        success: false,
        message: `Баланс жеткіліксіз. Қолжетімді: ${sourceWallet.balance} ${sourceWallet.currencyCode}`,
      };
    }

    // High precision preview
    const preview = currencyService.calculateExchangePreview(
      sourceWallet.currencyCode,
      targetWallet.currencyCode,
      sourceAmount
    );

    // Atomic execution
    const newSourceBalance = roundToDecimals(
      sourceWallet.balance - sourceAmount,
      sourceWallet.currencyCode === 'JPY' ? 0 : 2
    );

    const newTargetBalance = roundToDecimals(
      targetWallet.balance + preview.targetAmount,
      targetWallet.currencyCode === 'JPY' ? 0 : 2
    );

    // Update both wallets in single immutable dispatch
    setWallets((prev) =>
      prev.map((w) => {
        if (w.id === sourceWalletId) return { ...w, balance: newSourceBalance };
        if (w.id === targetWalletId) return { ...w, balance: newTargetBalance };
        return w;
      })
    );

    // Create transaction log
    const tx: Transaction = {
      id: `tx_${Date.now()}`,
      referenceCode: `NW-EX-${Math.floor(100000 + Math.random() * 900000)}`,
      userId: user.id,
      type: 'EXCHANGE',
      sourceWalletId,
      targetWalletId,
      sourceCurrency: sourceWallet.currencyCode,
      targetCurrency: targetWallet.currencyCode,
      sourceAmount,
      targetAmount: preview.targetAmount,
      exchangeRate: preview.marketRate,
      feeAmount: preview.feeAmount,
      feePercentage: preview.feePercentage,
      status: 'SUCCESS',
      createdAt: new Date().toISOString(),
      description: `${sourceAmount} ${sourceWallet.currencyCode} ➔ ${preview.targetAmount} ${targetWallet.currencyCode} айырбасталды`,
    };

    setTransactions((prev) => [tx, ...prev]);

    return {
      success: true,
      message: 'Валюта сәтті айырбасталды!',
      transaction: tx,
    };
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        wallets,
        transactions,
        ratesSnapshot,
        activeTab,
        isRatesLoading,
        setActiveTab,
        login,
        register,
        logout,
        updateProfile,
        createWallet,
        toggleFreezeWallet,
        addDemoFunds,
        executeExchange,
        refreshRates,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
