import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC<{ onNavigate: (tab: string) => void }> = ({
  onNavigate,
}) => {
  return (
    <footer className="bg-[#0b1f10] text-neutral-400 border-t border-[#16381e] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#9fe870] text-[#0e2a14] flex items-center justify-center font-bold text-sm">
                ₸
              </div>
              <span className="text-base font-extrabold text-white tracking-tight">
                Nomad<span className="text-[#9fe870]">Wise</span>
              </span>
            </div>
            <p className="text-neutral-400 text-xs leading-relaxed">
              Wise стиліндегі көпвалюталық виртуалды әмияндар және нақты нарықтық бағаммен айырбастау веб-қосымшасы.
            </p>
          </div>

          {/* Nav links 1 */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">
              Қызметтер
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('exchange')}
                  className="hover:text-white transition-colors"
                >
                  Валюта айырбастау
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('rates')}
                  className="hover:text-white transition-colors"
                >
                  Нақты бағамдар кестесі
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('wallets')}
                  className="hover:text-white transition-colors"
                >
                  Виртуалды карталар
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('transactions')}
                  className="hover:text-white transition-colors"
                >
                  Транзакциялар тарихы
                </button>
              </li>
            </ul>
          </div>

          {/* Academic & Backend */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">
              Технологиялық Стек
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('backend-docs')}
                  className="hover:text-[#9fe870] text-[#9fe870]/90 font-mono transition-colors"
                >
                  Java 21 & Spring Boot 3
                </button>
              </li>
              <li>
                <span className="text-neutral-400">Spring Security + BCrypt</span>
              </li>
              <li>
                <span className="text-neutral-400">MySQL 8.0 ACID Transactions</span>
              </li>
              <li>
                <span className="text-neutral-400">Frankfurter / ECB API</span>
              </li>
            </ul>
          </div>

          {/* Academic disclaimer */}
          <div className="space-y-2">
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">
              Оқу Жобасы
            </h4>
            <p className="text-neutral-400 text-xs leading-relaxed">
              Бұл қосымша виртуалды әмияндар мен оқу мақсатындағы demo қаражатты пайдаланады. Нақты банк картасы емес.
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-neutral-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Қауіпсіз тестілік орта</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright & attribution */}
        <div className="pt-8 border-t border-[#16381e] flex flex-col sm:flex-row items-center justify-between gap-4 text-neutral-500 text-[11px]">
          <div>
            © 2026 NomadWise. Барлық құқықтар қорғалған.
          </div>
          <div className="flex items-center gap-4">
            <span>Қазақстан, Алматы</span>
            <span>·</span>
            <span>Narxoz University оқу бағдарламасына арналған</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
