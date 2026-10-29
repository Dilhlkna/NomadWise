import React from 'react';
import {
  CreditCard,
  ShieldCheck,
  TrendingUp,
  Database,
  ArrowRight,
  Zap,
  Lock,
  RefreshCw,
} from 'lucide-react';

export const FeaturesSection: React.FC<{ onNavigateToWallets: () => void }> = ({
  onNavigateToWallets,
}) => {
  return (
    <section className="py-20 bg-neutral-50 border-t border-neutral-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
            Заманауи Финтех Инфрақұрылымы
          </p>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight text-balance">
            Дәстүрлі банктердің жасырын үстемесінен азат болыңыз
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
            NomadWise валюта айырбастау процесін әділ, ашық және сенімді етеді.
            Әрбір теңге мен центті нақты нарықтық бағаммен есептеңіз.
          </p>
        </div>

        {/* Feature Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          
          {/* Card 1: Virtual Card Ecosystem (7 cols) */}
          <div className="md:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-4">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">
                Көпвалюталық виртуалды карталар
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-6">
                Бір ғана аккаунтпен KZT, USD, EUR, GBP, RUB және басқа негізгі валюталарға жеке қауіпсіз виртуалды карталар ашыңыз.
                Әр картаның дербес балансы және нөмірі болады.
              </p>
            </div>

            <div className="rounded-2xl overflow-hidden border border-neutral-200 shadow-sm bg-neutral-100 relative aspect-[16/9] max-h-64">
              <img
                src="/src/assets/images/virtual_cards_stack_1793258245140.jpg"
                alt="Виртуалды валюталық карталар"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
          </div>

          {/* Card 2: Transparent Real-Time Rates (5 cols) */}
          <div className="md:col-span-5 bg-[#0e2a14] rounded-3xl p-6 sm:p-8 text-white border border-[#1b4322] shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#9fe870]/20 text-[#9fe870] flex items-center justify-center mb-4">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Нақты нарықтық бағам
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-6">
                Frankfurter және Еуропалық Орталық Банк (ECB) API арқылы тікелей алынатын нақты валюта бағамдары.
                Ешқандай жасанды спред немесе жасырын комиссия жоқ — тек 0.45% ашық қызмет ақысы.
              </p>
            </div>

            <div className="bg-white/10 p-4 rounded-2xl border border-white/10 space-y-2 font-mono text-xs">
              <div className="flex justify-between items-center text-neutral-300">
                <span>Frankfurter API Status:</span>
                <span className="text-[#9fe870] font-bold">LIVE ONLINE</span>
              </div>
              <div className="flex justify-between items-center text-neutral-300">
                <span>Кепілдендірілген уақыт:</span>
                <span className="text-white">30 секунд</span>
              </div>
              <div className="flex justify-between items-center text-neutral-300 pt-1 border-t border-white/10">
                <span>Деректер жаңартылуы:</span>
                <span className="text-white">Әрбір 60 секунд</span>
              </div>
            </div>
          </div>

          {/* Card 3: ACID Transactions & Security (6 cols) */}
          <div className="md:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center mb-4">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-2">
              Дерекқор деңгейіндегі ACID транзакциялары
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-4">
              Бастапқы әмияннан қаражатты алу, валютаны айырбастау және мақсатты әмиянға жазу бір атомдық транзакцияда (@Transactional) жүзеге асады.
              Егер қандай да бір қате шықса, барлық өзгерістер дереу кері қайтарылады (Rollback).
            </p>
            <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Decimal(18,4) дәлдігімен дөңгелектеу</span>
            </div>
          </div>

          {/* Card 4: Safe Demo Mode for Education (6 cols) */}
          <div className="md:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center mb-4">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-2">
              Оқу жобасы және Қауіпсіз Demo режим
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-4">
              Бұл жүйе оқу мақсатына арналған. Нақты банк шоты немесе CVV сұралмайды.
              Тестілік режимде виртуалды demo балансты кез келген уақытта бір батырмамен толықтырып, айырбастауды тәжірибеден өткізе аласыз.
            </p>
            <button
              type="button"
              onClick={onNavigateToWallets}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0e2a14] hover:underline"
            >
              <span>Әмияндарды көру</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};
