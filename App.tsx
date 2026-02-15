
import React, { useState, useCallback } from 'react';
import { Search, BookOpen, Info, Loader2, History, ChevronDown, Sparkles } from 'lucide-react';
import { TempoVerbal, ResultadoConjugacao } from './types';
import { consultarConjugacao } from './geminiService';

const App: React.FC = () => {
  const [verbo, setVerbo] = useState('');
  const [tempo, setTempo] = useState<TempoVerbal>(TempoVerbal.PresenteIndicativo);
  const [resultado, setResultado] = useState<ResultadoConjugacao | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [historico, setHistorico] = useState<string[]>([]);

  const handleConsultar = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!verbo.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const data = await consultarConjugacao(verbo.toLowerCase(), tempo);
      setResultado(data);
      if (!historico.includes(data.verbo)) {
        setHistorico(prev => [data.verbo, ...prev].slice(0, 5));
      }
    } catch (err: any) {
      setError(err.message || "Erro desconhecido ao consultar o verbo.");
    } finally {
      setLoading(false);
    }
  };

  const handleHistoricoClick = (v: string) => {
    setVerbo(v);
    // Dispara a consulta imediatamente
    setTimeout(() => handleConsultar(), 0);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 md:p-8">
      {/* Header */}
      <header className="w-full max-w-4xl mb-8 flex flex-col items-center text-center">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-10 h-10 text-emerald-600" />
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Conjuga<span className="text-emerald-600">PT</span>
          </h1>
        </div>
        <p className="text-slate-500 max-w-lg">
          Consulte a conjugação exata de qualquer verbo em português falado no Brasil.
        </p>
      </header>

      {/* Main Control Panel */}
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-6 md:p-8 mb-8 border border-slate-100">
        <form onSubmit={handleConsultar} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-5 space-y-2">
            <label className="block text-sm font-semibold text-slate-700 ml-1">Verbo</label>
            <div className="relative">
              <input
                type="text"
                value={verbo}
                onChange={(e) => setVerbo(e.target.value)}
                placeholder="Ex: Cantar, Partir, Ser..."
                className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-slate-800 font-medium"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            </div>
          </div>

          <div className="md:col-span-4 space-y-2">
            <label className="block text-sm font-semibold text-slate-700 ml-1">Tempo Verbal</label>
            <div className="relative">
              <select
                value={tempo}
                onChange={(e) => setTempo(e.target.value as TempoVerbal)}
                className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-slate-800 font-medium appearance-none cursor-pointer"
              >
                {Object.values(TempoVerbal).map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="md:col-span-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white font-bold py-3 px-6 rounded-2xl shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2 group active:scale-95"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  <span>Conjugar</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* History / Suggestions */}
        {historico.length > 0 && (
          <div className="mt-6 pt-6 border-t border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <History className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Buscas Recentes</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {historico.map((h) => (
                <button
                  key={h}
                  onClick={() => handleHistoricoClick(h)}
                  className="px-3 py-1 bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 rounded-full text-sm font-medium transition-colors"
                >
                  {h}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Result Area */}
      {error && (
        <div className="w-full max-w-4xl p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl mb-8 flex items-center gap-3">
          <Info className="w-5 h-5 flex-shrink-0" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      {resultado && !loading && (
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Main Conjugation Card */}
          <div className="lg:col-span-7 bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-slate-100">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-black text-slate-900 capitalize">{resultado.verbo}</h2>
                <p className="text-emerald-600 font-semibold">{resultado.tempo}</p>
              </div>
              <div className="text-right">
                <span className="inline-block px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-bold">PT-BR</span>
              </div>
            </div>

            <div className="space-y-4">
              {resultado.conjugacoes.map((item, idx) => (
                <div key={idx} className="flex items-center group">
                  <span className="w-24 md:w-32 text-slate-400 font-medium text-sm md:text-base">{item.pessoa}</span>
                  <div className="flex-1 h-px bg-slate-100 group-hover:bg-emerald-100 transition-colors mx-4"></div>
                  <span className="text-xl md:text-2xl font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">{item.forma}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Infinitivo</p>
                <p className="font-bold text-slate-700 text-sm md:text-base">{resultado.infinitivo}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Gerúndio</p>
                <p className="font-bold text-slate-700 text-sm md:text-base">{resultado.gerundio}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Particípio</p>
                <p className="font-bold text-slate-700 text-sm md:text-base">{resultado.participioPassado}</p>
              </div>
            </div>
          </div>

          {/* Sidebar info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl shadow-lg p-6 border border-slate-100">
              <h3 className="flex items-center gap-2 font-bold text-slate-800 mb-4">
                <BookOpen className="w-5 h-5 text-emerald-500" />
                Significado
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                {resultado.significado}
              </p>
            </div>

            {resultado.curiosidade && (
              <div className="bg-emerald-600 rounded-3xl shadow-lg p-6 text-white overflow-hidden relative group">
                <Sparkles className="absolute -top-4 -right-4 w-24 h-24 text-emerald-500/30 group-hover:rotate-12 transition-transform duration-700" />
                <h3 className="flex items-center gap-2 font-bold mb-3 relative z-10">
                  <Info className="w-5 h-5" />
                  Você sabia?
                </h3>
                <p className="text-emerald-50 leading-relaxed text-sm relative z-10">
                  {resultado.curiosidade}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Empty State / Intro */}
      {!resultado && !loading && !error && (
        <div className="flex flex-col items-center justify-center p-12 text-center text-slate-400 max-w-md animate-in fade-in zoom-in-95 duration-700">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
            <Search className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-700 mb-2">Pronto para conjugar?</h3>
          <p>Digite um verbo acima e escolha o tempo verbal para ver todas as suas formas e variações no português brasileiro.</p>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto py-8 text-center text-slate-400 text-xs font-medium">
        <p>© {new Date().getFullYear()} ConjugaPT — Powered by Gemini AI</p>
      </footer>
    </div>
  );
};

export default App;
