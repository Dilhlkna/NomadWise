import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  CurrencyCode,
  Wallet,
  Transaction,
  User,
  RateSnapshot,
  CardTheme,
  Language,
  Theme,
} from '../types';
import { currencyService, roundToDecimals } from '../services/currencyService';
import { TRANSLATIONS } from '../i18n/translations';

export interface CreateWalletOptions {
  currencyCode: CurrencyCode;
  cardTheme?: CardTheme;
  customNumber?: string;
  customHolder?: string;
  customExpiry?: string;
  customCvv?: string;
  isExternal?: boolean;
}

interface AppContextType {
  user: User | null;
  allUsers: User[];
  activeUserId: string | null;
  isAuthenticated: boolean;
  wallets: Wallet[];
  allWallets: Wallet[];
  transactions: Transaction[];
  ratesSnapshot: RateSnapshot;
  activeTab: string;
  isRatesLoading: boolean;
  language: Language;
  theme: Theme;
  t: typeof TRANSLATIONS['kk'];
  setLanguage: (lang: Language) => void;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setActiveTab: (tab: string) => void;
  switchUser: (userId: string) => void;
  login: (email: string, password?: string) => boolean;
  register: (
    fullName: string,
    email: string,
    password?: string,
    phone?: string,
    country?: string,
    preferredCurrency?: CurrencyCode
  ) => boolean;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  createWallet: (options: CreateWalletOptions | CurrencyCode, cardTheme?: CardTheme) => Wallet;
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

// Initial Demo Users
const INITIAL_DEMO_USERS: User[] = [
  {
    id: 'usr_arman_892',
    fullName: 'Арман Серікұлы',
    email: 'arman@nomadwise.kz',
    phone: '+7 (701) 450-88-21',
    country: 'Қазақстан',
    preferredCurrency: 'KZT',
    joinedDate: '2025-11-14T09:00:00.000Z',
    isDemoUser: true,
    isEmailVerified: true,
    isPhoneVerified: true,
  },
  {
    id: 'usr_aigerim_415',
    fullName: 'Айгерім Бақытқызы',
    email: 'aigerim@nomadwise.kz',
    phone: '+7 (777) 321-90-44',
    country: 'Қазақстан',
    preferredCurrency: 'USD',
    joinedDate: '2026-01-10T14:30:00.000Z',
    isDemoUser: true,
    isEmailVerified: true,
    isPhoneVerified: true,
  },
];

// Initial starter wallets
const INITIAL_WALLETS: Wallet[] = [
  // Arman's Wallets
  {
    id: 'wlt_kzt_101',
    userId: 'usr_arman_892',
    currencyCode: 'KZT',
    balance: 280000.0,
    cardholderName: 'ARMAN SERIKULY',
    virtualCardNumber: '5375 8892 4109 7721',
    expiryDate: '10/29',
    cvv: '849',
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
    cvv: '312',
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
    cvv: '704',
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
    cvv: '955',
    isFrozen: false,
    cardTheme: 'graphite',
    createdAt: '2025-12-05T16:00:00.000Z',
  },
  // Aigerim's Wallets
  {
    id: 'wlt_usd_201',
    userId: 'usr_aigerim_415',
    currencyCode: 'USD',
    balance: 1250.0,
    cardholderName: 'AIGERIM BAKYTKYZY',
    virtualCardNumber: '4242 8190 3341 6209',
    expiryDate: '04/30',
    cvv: '517',
    isFrozen: false,
    cardTheme: 'emerald',
    createdAt: '2026-01-10T14:35:00.000Z',
  },
  {
    id: 'wlt_eur_202',
    userId: 'usr_aigerim_415',
    currencyCode: 'EUR',
    balance: 600.0,
    cardholderName: 'AIGERIM BAKYTKYZY',
    virtualCardNumber: '5200 4810 9923 1184',
    expiryDate: '06/29',
    cvv: '402',
    isFrozen: false,
    cardTheme: 'navy',
    createdAt: '2026-01-11T10:00:00.000Z',
  },
  {
    id: 'wlt_kzt_203',
    userId: 'usr_aigerim_415',
    currencyCode: 'KZT',
    balance: 150000.0,
    cardholderName: 'AIGERIM BAKYTKYZY',
    virtualCardNumber: '5375 1109 4432 8761',
    expiryDate: '09/29',
    cvv: '298',
    isFrozen: false,
    cardTheme: 'forest',
    createdAt: '2026-01-12T15:20:00.000Z',
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
    userId: 'usr_aigerim_415',
    type: 'EXCHANGE',
    sourceWalletId: 'wlt_usd_201',
    targetWalletId: 'wlt_eur_202',
    sourceCurrency: 'USD',
    targetCurrency: 'EUR',
    sourceAmount: 200.0,
    targetAmount: 184.2,
    exchangeRate: 0.925,
    feeAmount: 0.9,
    feePercentage: 0.45,
    status: 'SUCCESS',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    description: '200 USD ➔ 184.20 EUR конвертация',
  },
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('nomadwise_lang');
      return saved === 'ru' || saved === 'en' ? saved : 'kk';
    } catch {
      return 'kk';
    }
  });

  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem('nomadwise_theme');
      return saved === 'dark' ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  // Multi-user repository
  const [allUsers, setAllUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem('nomadwise_all_users');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load users from localStorage', e);
    }
    return INITIAL_DEMO_USERS;
  });

  const [activeUserId, setActiveUserId] = useState<string | null>(() => {
    try {
      const saved = localStorage.getItem('nomadwise_active_user_id');
      if (saved === 'null') return null;
      if (saved) return saved;
    } catch (e) {
      console.error('Failed to load activeUserId', e);
    }
    return 'usr_arman_892';
  });

  const [allWallets, setAllWallets] = useState<Wallet[]>(() => {
    try {
      const saved = localStorage.getItem('nomadwise_all_wallets');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load wallets from localStorage', e);
    }
    return INITIAL_WALLETS;
  });

  const [allTransactions, setAllTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem('nomadwise_all_txs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Failed to load transactions from localStorage', e);
    }
    return INITIAL_TRANSACTIONS;
  });

  // Current active user derived from activeUserId
  const user = allUsers.find((u) => u.id === activeUserId) || null;
  const isAuthenticated = !!user;

  // Scoped wallets & transactions for active user
  const wallets = user ? allWallets.filter((w) => w.userId === user.id) : [];
  const transactions = user ? allTransactions.filter((tx) => tx.userId === user.id) : [];

  const [ratesSnapshot, setRatesSnapshot] = useState<RateSnapshot>(() =>
    currencyService.getCurrentRates()
  );
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isRatesLoading, setIsRatesLoading] = useState<boolean>(false);

  // Sync theme
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('nomadwise_theme', theme);
  }, [theme]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('nomadwise_all_users', JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    if (activeUserId) {
      localStorage.setItem('nomadwise_active_user_id', activeUserId);
    } else {
      localStorage.setItem('nomadwise_active_user_id', 'null');
    }
  }, [activeUserId]);

  useEffect(() => {
    localStorage.setItem('nomadwise_all_wallets', JSON.stringify(allWallets));
  }, [allWallets]);

  useEffect(() => {
    localStorage.setItem('nomadwise_all_txs', JSON.stringify(allTransactions));
  }, [allTransactions]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('nomadwise_lang', lang);
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Initial load of live rates
  useEffect(() => {
    refreshRates();
    const timer = setInterval(() => {
      refreshRates();
    }, 60000);
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

  // Multi-user: Switch to any existing registered account
  const switchUser = (targetUserId: string) => {
    const target = allUsers.find((u) => u.id === targetUserId);
    if (target) {
      setActiveUserId(target.id);
    }
  };

  // Login: finds registered account or creates new user on the fly
  const login = (email: string, _password?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const existing = allUsers.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      setActiveUserId(existing.id);
      return true;
    }

    // Auto-create user for new email if not found
    const newUserId = `usr_${Date.now()}`;
    const generatedName = cleanEmail.split('@')[0] || 'Қолданушы';
    const formattedName = generatedName.charAt(0).toUpperCase() + generatedName.slice(1);
    
    const newUser: User = {
      id: newUserId,
      fullName: formattedName,
      email: email.trim(),
      phone: '+7 (701) ' + Math.floor(100 + Math.random() * 900) + '-' + Math.floor(10 + Math.random() * 90) + '-' + Math.floor(10 + Math.random() * 90),
      country: 'Қазақстан',
      preferredCurrency: 'KZT',
      joinedDate: new Date().toISOString(),
      isDemoUser: false,
      isEmailVerified: true,
      isPhoneVerified: true,
    };

    const starterWallet: Wallet = {
      id: `wlt_kzt_${Date.now()}`,
      userId: newUserId,
      currencyCode: 'KZT',
      balance: 50000.0,
      cardholderName: newUser.fullName.toUpperCase(),
      virtualCardNumber: `5432 ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`,
      expiryDate: '10/29',
      cvv: String(Math.floor(100 + Math.random() * 900)),
      isFrozen: false,
      cardTheme: 'forest',
      createdAt: new Date().toISOString(),
    };

    const welcomeTx: Transaction = {
      id: `tx_${Date.now()}`,
      referenceCode: `NW-WELCOME-${Math.floor(100000 + Math.random() * 900000)}`,
      userId: newUserId,
      type: 'DEMO_DEPOSIT',
      targetWalletId: starterWallet.id,
      sourceCurrency: 'KZT',
      targetCurrency: 'KZT',
      sourceAmount: 50000.0,
      targetAmount: 50000.0,
      exchangeRate: 1.0,
      feeAmount: 0.0,
      feePercentage: 0.0,
      status: 'SUCCESS',
      createdAt: new Date().toISOString(),
      description: 'Жүйеге қош келдіңіз! Сынақ балансы (+50,000 ₸)',
    };

    setAllUsers((prev) => [newUser, ...prev]);
    setAllWallets((prev) => [starterWallet, ...prev]);
    setAllTransactions((prev) => [welcomeTx, ...prev]);
    setActiveUserId(newUserId);
    return true;
  };

  // Register a new independent user
  const register = (
    fullName: string,
    email: string,
    _password?: string,
    phone?: string,
    country: string = 'Қазақстан',
    preferredCurrency: CurrencyCode = 'KZT'
  ) => {
    const cleanEmail = email.trim().toLowerCase();
    const existing = allUsers.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      setActiveUserId(existing.id);
      return true;
    }

    const newUserId = `usr_${Date.now()}`;
    const newUser: User = {
      id: newUserId,
      fullName: fullName.trim() || 'Қолданушы',
      email: email.trim(),
      phone: phone?.trim() || '+7 (777) 123-45-67',
      country,
      preferredCurrency,
      joinedDate: new Date().toISOString(),
      isDemoUser: false,
      isEmailVerified: true,
      isPhoneVerified: true,
    };

    // Create starter wallet for this specific user
    const firstWallet: Wallet = {
      id: `wlt_${preferredCurrency.toLowerCase()}_${Date.now()}`,
      userId: newUserId,
      currencyCode: preferredCurrency,
      balance: 50000.0, // Educational starter balance
      cardholderName: newUser.fullName.toUpperCase(),
      virtualCardNumber: `5432 ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`,
      expiryDate: '10/29',
      cvv: String(Math.floor(100 + Math.random() * 900)),
      isFrozen: false,
      cardTheme: 'forest',
      createdAt: new Date().toISOString(),
    };

    const welcomeTx: Transaction = {
      id: `tx_${Date.now()}`,
      referenceCode: `NW-START-${Math.floor(100000 + Math.random() * 900000)}`,
      userId: newUserId,
      type: 'DEMO_DEPOSIT',
      targetWalletId: firstWallet.id,
      sourceCurrency: preferredCurrency,
      targetCurrency: preferredCurrency,
      sourceAmount: 50000.0,
      targetAmount: 50000.0,
      exchangeRate: 1.0,
      feeAmount: 0.0,
      feePercentage: 0.0,
      status: 'SUCCESS',
      createdAt: new Date().toISOString(),
      description: `Сәлемдесу бонустық балансы (+50,000 ${preferredCurrency})`,
    };

    setAllUsers((prev) => [newUser, ...prev]);
    setAllWallets((prev) => [firstWallet, ...prev]);
    setAllTransactions((prev) => [welcomeTx, ...prev]);
    setActiveUserId(newUserId);
    return true;
  };

  // Sign out cleanly into Guest Mode
  const logout = () => {
    setActiveUserId(null);
    setActiveTab('home');
  };

  const updateProfile = (data: Partial<User>) => {
    if (!user) return;
    setAllUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, ...data } : u))
    );
  };

  const createWallet = (
    optionsOrCode: CreateWalletOptions | CurrencyCode,
    cardThemeArg: CardTheme = 'forest'
  ): Wallet => {
    if (!user) throw new Error('Авторизация қажет');

    let currencyCode: CurrencyCode;
    let cardTheme: CardTheme = cardThemeArg;
    let customNumber: string | undefined;
    let customHolder: string | undefined;
    let customExpiry: string | undefined;
    let customCvv: string | undefined;
    let isExternal = false;

    if (typeof optionsOrCode === 'string') {
      currencyCode = optionsOrCode;
    } else {
      currencyCode = optionsOrCode.currencyCode;
      cardTheme = optionsOrCode.cardTheme || 'forest';
      customNumber = optionsOrCode.customNumber;
      customHolder = optionsOrCode.customHolder;
      customExpiry = optionsOrCode.customExpiry;
      customCvv = optionsOrCode.customCvv;
      isExternal = !!optionsOrCode.isExternal;
    }

    const randomDigits = () => Math.floor(1000 + Math.random() * 9000);
    const generatedNumber = `4716 ${randomDigits()} ${randomDigits()} ${randomDigits()}`;

    const newWallet: Wallet = {
      id: `wlt_${currencyCode.toLowerCase()}_${Date.now()}`,
      userId: user.id,
      currencyCode,
      balance: isExternal ? 50000.0 : 0.0,
      cardholderName: (customHolder || user.fullName).toUpperCase(),
      virtualCardNumber: customNumber?.trim() || generatedNumber,
      expiryDate: customExpiry?.trim() || '12/29',
      cvv: customCvv?.trim() || String(Math.floor(100 + Math.random() * 900)),
      isFrozen: false,
      cardTheme,
      createdAt: new Date().toISOString(),
      isExternal,
    };

    setAllWallets((prev) => [newWallet, ...prev]);
    return newWallet;
  };

  const toggleFreezeWallet = (walletId: string) => {
    setAllWallets((prev) =>
      prev.map((w) => (w.id === walletId ? { ...w, isFrozen: !w.isFrozen } : w))
    );
  };

  const addDemoFunds = (walletId: string, amount: number) => {
    if (!user) return;
    const targetWallet = allWallets.find((w) => w.id === walletId && w.userId === user.id);
    if (!targetWallet) return;

    const newBalance = roundToDecimals(
      targetWallet.balance + amount,
      targetWallet.currencyCode === 'JPY' ? 0 : 2
    );

    setAllWallets((prev) =>
      prev.map((w) => (w.id === walletId ? { ...w, balance: newBalance } : w))
    );

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

    setAllTransactions((prev) => [tx, ...prev]);
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

    const sourceWallet = allWallets.find((w) => w.id === sourceWalletId && w.userId === user.id);
    const targetWallet = allWallets.find((w) => w.id === targetWalletId && w.userId === user.id);

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

    const preview = currencyService.calculateExchangePreview(
      sourceWallet.currencyCode,
      targetWallet.currencyCode,
      sourceAmount
    );

    const newSourceBalance = roundToDecimals(
      sourceWallet.balance - sourceAmount,
      sourceWallet.currencyCode === 'JPY' ? 0 : 2
    );

    const newTargetBalance = roundToDecimals(
      targetWallet.balance + preview.targetAmount,
      targetWallet.currencyCode === 'JPY' ? 0 : 2
    );

    setAllWallets((prev) =>
      prev.map((w) => {
        if (w.id === sourceWalletId) return { ...w, balance: newSourceBalance };
        if (w.id === targetWalletId) return { ...w, balance: newTargetBalance };
        return w;
      })
    );

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

    setAllTransactions((prev) => [tx, ...prev]);

    return {
      success: true,
      message: 'Валюта сәтті айырбасталды!',
      transaction: tx,
    };
  };

  const t = TRANSLATIONS[language] || TRANSLATIONS.kk;

  return (
    <AppContext.Provider
      value={{
        user,
        allUsers,
        activeUserId,
        isAuthenticated,
        wallets,
        allWallets,
        transactions,
        ratesSnapshot,
        activeTab,
        isRatesLoading,
        language,
        theme,
        t,
        setLanguage,
        setTheme,
        toggleTheme,
        setActiveTab,
        switchUser,
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
