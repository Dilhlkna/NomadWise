import React, { useState } from 'react';
import { BACKEND_CODE_FILES, BackendFile } from '../data/backendCode';
import {
  Code2,
  FileCode,
  Copy,
  Check,
  Download,
  Database,
  Layers,
  Terminal,
  Server,
  Smartphone,
  ExternalLink,
  BookOpen,
} from 'lucide-react';

export const BackendCodeHub: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<BackendFile>(BACKEND_CODE_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Барлық файлдар' },
    { id: 'config', label: 'Maven & Config' },
    { id: 'database', label: 'MySQL Schema' },
    { id: 'entity', label: 'JPA Entities' },
    { id: 'service', label: 'Services' },
    { id: 'controller', label: 'REST Controllers' },
    { id: 'security', label: 'Spring Security' },
    { id: 'docs', label: 'Нұсқаулықтар' },
  ];

  const filteredFiles = BACKEND_CODE_FILES.filter((file) => {
    if (activeCategory === 'all') return true;
    return file.category === activeCategory;
  });

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const blob = new Blob([selectedFile.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile.filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Overview Banner */}
      <div className="bg-[#0e2a14] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-[#1b4322]">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#9fe870]/20 text-[#9fe870] text-xs font-semibold mb-3">
            <Server className="w-3.5 h-3.5" />
            <span>Java 21 · Spring Boot 3.3 · Spring Security · MySQL · REST API</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Backend Архитектурасы және Бастапқы Код Орталығы
          </h2>

          <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed mb-6">
            Тапсырыс берушінің №12, 13 және 14 талаптарына толық сәйкес әзірленген өндірістік деңгейдегі Java 21 кодтары.
            Әрбір қабат (Controller, Service, Repository, Entity, Security, DDL) толыққанды дайын және осы браузер ішінде көшіріп алуға немесе жүктеп алуға қолжетімді.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
              <span className="text-neutral-400 block text-[11px]">Дерекқор</span>
              <strong className="text-white font-mono">MySQL 8.0+ ACID</strong>
            </div>
            <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
              <span className="text-neutral-400 block text-[11px]">Дәлдік есептеу</span>
              <strong className="text-[#9fe870] font-mono">BigDecimal (18,4)</strong>
            </div>
            <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
              <span className="text-neutral-400 block text-[11px]">Қорғаныс</span>
              <strong className="text-white font-mono">BCrypt + JWT</strong>
            </div>
            <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
              <span className="text-neutral-400 block text-[11px]">API үйлесімділік</span>
              <strong className="text-[#9fe870] font-mono">Android / Web</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Architecture Highlights Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-sm flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-neutral-900 mb-1">
              Таза Қабатты Архитектура (N-Tier)
            </h4>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Controller ➔ Service ➔ Repository ➔ Entity қатаң бөлінісі, DTO арқылы валидация және GlobalExceptionHandler арқылы бірыңғай қате өңдеу.
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-sm flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center shrink-0">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-neutral-900 mb-1">
              Транзакциялық қауіпсіздік (ACID)
            </h4>
            <p className="text-xs text-neutral-500 leading-relaxed">
              @Transactional(isolation = REPEATABLE_READ) арқылы екі әмиянның балансын өзгерту мен транзакцияны сақтау бір атомдық қадамда орындалады.
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-sm flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-neutral-900 mb-1">
              Android-қа Дайын REST API
            </h4>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Bearer JWT авторизациясымен қорғалған, мобильдік Retrofit 2 клиентімен бірігуге дайын таза JSON endpoint-тері.
            </p>
          </div>
        </div>
      </div>

      {/* Code Browser & File Explorer */}
      <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-lg overflow-hidden">
        {/* Category Filter Pills */}
        <div className="p-4 bg-neutral-50/80 border-b border-neutral-200/80 flex items-center gap-1.5 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeCategory === cat.id
                  ? 'bg-[#0e2a14] text-[#9fe870]'
                  : 'text-neutral-600 hover:bg-neutral-200/60'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[560px]">
          {/* File Tree Left Sidebar (4 cols) */}
          <div className="lg:col-span-4 border-r border-neutral-200/80 p-3 bg-neutral-50/40 space-y-1">
            <div className="text-[11px] font-semibold text-neutral-400 px-3 py-1.5 uppercase tracking-wider">
              Жоба файлдары ({filteredFiles.length})
            </div>

            {filteredFiles.map((file) => {
              const isSelected = selectedFile.id === file.id;
              return (
                <button
                  key={file.id}
                  type="button"
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-2.5 ${
                    isSelected
                      ? 'bg-white text-neutral-900 shadow-sm border border-neutral-200/80'
                      : 'text-neutral-600 hover:bg-neutral-100/80'
                  }`}
                >
                  <FileCode
                    className={`w-4 h-4 shrink-0 mt-0.5 ${
                      isSelected ? 'text-[#0e2a14]' : 'text-neutral-400'
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-mono text-xs font-bold truncate">
                      {file.filename}
                    </div>
                    <div className="text-[10px] text-neutral-500 font-mono truncate">
                      {file.path}
                    </div>
                    <div className="text-[10px] text-neutral-400 truncate mt-0.5">
                      {file.descriptionKz}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Code Viewer Panel (8 cols) */}
          <div className="lg:col-span-8 flex flex-col bg-[#0b1320] text-neutral-100">
            {/* Viewer Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-800 bg-[#080d17]">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold text-[#9fe870]">
                  {selectedFile.filename}
                </span>
                <span className="text-[11px] text-neutral-400 font-mono">
                  ({selectedFile.path})
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-neutral-200 transition-colors"
                  title="Кодты көшіріп алу"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Көшірілді!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Көшіру</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleDownloadFile}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#9fe870] hover:bg-[#b0f385] text-xs font-bold text-[#0e2a14] transition-colors"
                  title="Файлды жүктеп алу"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Жүктеу</span>
                </button>
              </div>
            </div>

            {/* File description banner */}
            <div className="px-5 py-2 bg-white/5 border-b border-neutral-800 text-xs text-neutral-300">
              {selectedFile.descriptionKz}
            </div>

            {/* Code Pre container with line numbers */}
            <div className="flex-1 p-5 overflow-auto max-h-[580px] font-mono text-xs leading-relaxed">
              <pre className="text-neutral-200 font-mono whitespace-pre selection:bg-[#9fe870]/30 selection:text-white">
                {selectedFile.code}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
