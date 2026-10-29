import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FeaturesSection } from './components/FeaturesSection';
import { ExchangeWidget } from './components/ExchangeWidget';
import { WalletsView } from './components/WalletsView';
import { RatesTable } from './components/RatesTable';
import { TransactionHistory } from './components/TransactionHistory';
import { UserProfile } from './components/UserProfile';
import { BackendCodeHub } from './components/BackendCodeHub';
import { AuthModal } from './components/AuthModal';
import { AddWalletModal } from './components/AddWalletModal';
import { DemoTopUpModal } from './components/DemoTopUpModal';
import { Footer } from './components/Footer';
import { Wallet, CurrencyCode } from './types';
import { ArrowLeft, Sparkles, ShieldCheck } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { activeTab, setActiveTab, user, isAuthenticated } = useApp();

  // Modals state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [newWalletModalOpen, setNewWalletModalOpen] = useState(false);
  const [topUpModalOpen, setTopUpModalOpen] = useState(false);
  const [selectedWalletForTopUp, setSelectedWalletForTopUp] = useState<Wallet | null>(null);

  // Exchange widget preset
  const [exchangePreset, setExchangePreset] = useState<{
    source: CurrencyCode;
    target: CurrencyCode;
  }>({ source: 'USD', target: 'KZT' });

  const handleOpenDemoTopUp = (wallet: Wallet) => {
    setSelectedWalletForTopUp(wallet);
    setTopUpModalOpen(true);
  };

  const handleOpenExchangeForWallet = (wallet: Wallet) => {
    // If USD, pair with KZT, if KZT pair with USD
    const target: CurrencyCode = wallet.currencyCode === 'KZT' ? 'USD' : 'KZT';
    setExchangePreset({ source: wallet.currencyCode, target });
    setActiveTab('exchange');
  };

  const handleSelectPairFromRates = (from: CurrencyCode, to: CurrencyCode) => {
    setExchangePreset({ source: from, target: to });
    setActiveTab('exchange');
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900">
      {/* Top Bar Navigation */}
      <Navbar
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenNewWallet={() => setNewWalletModalOpen(true)}
      />

      {/* Main Content Body */}
      <main className="flex-1">
        {/* TAB 1: HOME */}
        {activeTab === 'home' && (
          <div>
            <HeroSection onOpenAuth={() => setAuthModalOpen(true)} />
            
            {/* Live rates teaser on homepage */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <RatesTable onSelectPair={handleSelectPairFromRates} />
            </div>

            <FeaturesSection onNavigateToWallets={() => setActiveTab('wallets')} />
          </div>
        )}

        {/* TAB 2: EXCHANGE */}
        {activeTab === 'exchange' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
            <div className="max-w-2xl mx-auto mb-8 text-center">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight mb-2">
                Валюта айырбастау
              </h1>
              <p className="text-xs sm:text-sm text-neutral-600">
                Бастапқы әмияннан қаражат шегеріліп, мақсатты әмиянға нақты нарықтық бағаммен дереу түседі.
              </p>
            </div>

            <ExchangeWidget
              initialSourceCurrency={exchangePreset.source}
              initialTargetCurrency={exchangePreset.target}
            />
          </div>
        )}

        {/* TAB 3: WALLETS */}
        {activeTab === 'wallets' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
            <WalletsView
              onOpenNewWallet={() => setNewWalletModalOpen(true)}
              onOpenDemoTopUp={handleOpenDemoTopUp}
              onOpenExchangeForWallet={handleOpenExchangeForWallet}
            />
          </div>
        )}

        {/* TAB 4: RATES */}
        {activeTab === 'rates' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
            <div className="max-w-3xl mb-8">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight mb-2">
                Валюта бағамдарының мониторингі
              </h1>
              <p className="text-xs sm:text-sm text-neutral-600">
                Frankfurter API және халықаралық нарықтық көздерден алынатын ресми бағамдар. Кез келген валюта жұбын тікелей айырбастауға жібере аласыз.
              </p>
            </div>

            <RatesTable onSelectPair={handleSelectPairFromRates} />
          </div>
        )}

        {/* TAB 5: TRANSACTIONS */}
        {activeTab === 'transactions' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
            <TransactionHistory />
          </div>
        )}

        {/* TAB 6: PROFILE */}
        {activeTab === 'profile' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
            <UserProfile />
          </div>
        )}

        {/* TAB 7: BACKEND CODE & ARCHITECTURE HUB */}
        {activeTab === 'backend-docs' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
            <BackendCodeHub />
          </div>
        )}
      </main>

      {/* Global Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      <AddWalletModal
        isOpen={newWalletModalOpen}
        onClose={() => setNewWalletModalOpen(false)}
      />

      <DemoTopUpModal
        isOpen={topUpModalOpen}
        wallet={selectedWalletForTopUp}
        onClose={() => {
          setTopUpModalOpen(false);
          setSelectedWalletForTopUp(null);
        }}
      />

      {/* Footer */}
      <Footer onNavigate={(tab) => setActiveTab(tab)} />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
