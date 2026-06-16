import React, { useState, useEffect } from 'react';
import { Team } from '../types';
import { TEAMS, getFlagEmoji, getColorClass } from '../data/teams';
import { Search, Trophy, Shield, HelpCircle, ArrowRightLeft } from 'lucide-react';

interface TeamSelectorProps {
  onPredict: (teamAId: string, teamBId: string, isNeutral: boolean, simCount: number, isKnockout: boolean) => void;
  initialTeamAId?: string;
  initialTeamBId?: string;
}

export default function TeamSelector({ onPredict, initialTeamAId = 'arg', initialTeamBId = 'fra' }: TeamSelectorProps) {
  const [teamAId, setTeamAId] = useState(initialTeamAId);
  const [teamBId, setTeamBId] = useState(initialTeamBId);
  
  const [searchA, setSearchA] = useState('');
  const [searchB, setSearchB] = useState('');
  
  const [filterType, setFilterType] = useState<'all' | 'national' | 'club'>('all');
  const [filterContinent, setFilterContinent] = useState<string>('all');
  
  const [isNeutral, setIsNeutral] = useState(false);
  const [simCount, setSimCount] = useState<number>(100000);
  const [isKnockout, setIsKnockout] = useState(false);
  
  const [activeDropdown, setActiveDropdown] = useState<'A' | 'B' | null>(null);

  const teamA = TEAMS.find(t => t.id === teamAId)!;
  const teamB = TEAMS.find(t => t.id === teamBId)!;

  // Filter lists of teams for searching
  const filteredTeams = TEAMS.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes((activeDropdown === 'A' ? searchA : searchB).toLowerCase()) ||
                          t.code.toLowerCase().includes((activeDropdown === 'A' ? searchA : searchB).toLowerCase());
    const matchesType = filterType === 'all' ? true : t.type === filterType;
    const matchesContinent = filterContinent === 'all' ? true : t.continent === filterContinent;
    return matchesSearch && matchesType && matchesContinent;
  });

  const handleSwap = () => {
    const temp = teamAId;
    setTeamAId(teamBId);
    setTeamBId(temp);
  };

  const handleCalculate = () => {
    onPredict(teamAId, teamBId, isNeutral, simCount, isKnockout);
  };

  // Close dropdowns on outside clicks
  React.useEffect(() => {
    const handleOutsideClick = () => {
      setActiveDropdown(null);
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  return (
    <div className="bg-[#141417] rounded-2xl border border-white/5 p-6 shadow-xl" id="team-selector-card">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mr-0 ml-0">
        
        {/* TEAM A SELECTOR */}
        <div className="w-full lg:w-[44%] relative" onClick={(e) => e.stopPropagation()}>
          <label className="text-xs font-mono text-slate-400 mb-1.5 block">EQUIPO A (LOCAL)</label>
          <div 
            onClick={() => { setActiveDropdown(activeDropdown === 'A' ? null : 'A'); }}
            className="flex items-center justify-between bg-[#0a0a0b]/80 hover:bg-[#0a0a0b] px-4 py-3.5 rounded-xl border border-white/10 hover:border-emerald-500/80 cursor-pointer transition-all duration-200 shadow-inner"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl filter drop-shadow-md select-none">{getFlagEmoji(teamA)}</span>
              <div>
                <div className="font-sans font-semibold text-white text-base flex items-center gap-2">
                  {teamA.name}
                  <span className="text-xs font-mono font-medium px-1.5 py-0.5 rounded bg-white/5 text-slate-400">
                    {teamA.code}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-0.5 flex gap-2">
                  <span>Elo: <strong className="text-emerald-400">{teamA.elo}</strong></span>
                  <span>•</span>
                  <span>SPI: <strong className="text-cyan-400">{teamA.spi}</strong></span>
                </div>
              </div>
            </div>
            <Search className="w-4 h-4 text-slate-500" />
          </div>

          {activeDropdown === 'A' && (
            <div className="absolute left-0 right-0 mt-2 bg-[#141417] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden max-h-80 flex flex-col animate-fade-in">
              <div className="p-3 border-b border-white/10 bg-[#0d0d0f]/55 scroll-m-0">
                <input
                  type="text"
                  placeholder="Buscar selección o club..."
                   value={searchA}
                  onChange={(e) => setSearchA(e.target.value)}
                  className="w-full text-sm py-2 px-3 bg-[#0a0a0b] text-white border border-white/10 rounded-lg placeholder-slate-500 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/85"
                  autoFocus
                />
                
                {/* Filters Row */}
                <div className="flex gap-1 mt-2.5 overflow-x-auto pb-1 text-[11px] font-mono scrollbar-none">
                  <button 
                    onClick={() => setFilterType('all')}
                    className={`px-2 py-0.5 rounded shrink-0 transition-colors ${filterType === 'all' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:bg-white/5'}`}
                  >
                    Todos
                  </button>
                  <button 
                    onClick={() => setFilterType('national')}
                    className={`px-2 py-0.5 rounded shrink-0 transition-colors ${filterType === 'national' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:bg-white/5'}`}
                  >
                    Selecciones
                  </button>
                  <button 
                    onClick={() => setFilterType('club')}
                    className={`px-2 py-0.5 rounded shrink-0 transition-colors ${filterType === 'club' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:bg-white/5'}`}
                  >
                    Clubes
                  </button>
                  <div className="h-4 w-px bg-white/10 mx-1 self-center" />
                  {['UEFA', 'CONMEBOL', 'CONCACAF', 'CAF', 'AFC'].map(c => (
                    <button
                      key={c}
                      onClick={() => setFilterContinent(filterContinent === c ? 'all' : c)}
                      className={`px-2 py-0.5 rounded shrink-0 transition-colors ${filterContinent === c ? 'bg-emerald-500/20 text-emerald-350' : 'text-slate-400 hover:bg-white/5'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <div className="overflow-y-auto divide-y divide-white/5">
                {filteredTeams.map(t => (
                  <div
                    key={t.id}
                    onClick={() => {
                      if (t.id !== teamBId) {
                        setTeamAId(t.id);
                        setActiveDropdown(null);
                        setSearchA('');
                      }
                    }}
                    className={`flex items-center justify-between px-4 py-2.5 hover:bg-white/5 transition-colors cursor-pointer ${t.id === teamBId ? 'opacity-30 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{getFlagEmoji(t)}</span>
                      <div>
                        <span className="text-sm font-semibold text-white block">{t.name}</span>
                        <span className="text-[10px] font-mono text-slate-400 uppercase">
                          {t.type === 'club' ? 'Club' : 'Selección'} • {t.continent}
                        </span>
                      </div>
                    </div>
                    <div className="text-right font-mono text-xs">
                      <span className="text-emerald-400 font-bold block">{t.elo} <span className="text-[9px] text-slate-500">Elo</span></span>
                      <span className="text-slate-450 text-[10px]">SPI: {t.spi}</span>
                    </div>
                  </div>
                ))}
                {filteredTeams.length === 0 && (
                  <div className="p-4 text-center text-xs font-mono text-slate-500">No se encontraron equipos</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* SWAP BUTTON */}
        <div className="flex shrink-0">
          <button 
            type="button" 
            onClick={handleSwap}
            className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-slate-300 hover:text-white transition-all cursor-pointer shadow-lg active:scale-95"
            title="Intercambiar localía"
            id="swap-teams-btn"
          >
            <ArrowRightLeft className="w-5 h-5" />
          </button>
        </div>

        {/* TEAM B SELECTOR */}
        <div className="w-full lg:w-[44%] relative" onClick={(e) => e.stopPropagation()}>
          <label className="text-xs font-mono text-slate-400 mb-1.5 block">EQUIPO B (VISITANTE)</label>
          <div 
            onClick={() => { setActiveDropdown(activeDropdown === 'B' ? null : 'B'); }}
            className="flex items-center justify-between bg-[#0a0a0b]/80 hover:bg-[#0a0a0b] px-4 py-3.5 rounded-xl border border-white/10 hover:border-emerald-500/85 cursor-pointer transition-all duration-200 shadow-inner"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl filter drop-shadow-md select-none">{getFlagEmoji(teamB)}</span>
              <div>
                <div className="font-sans font-semibold text-white text-base flex items-center gap-2">
                  {teamB.name}
                  <span className="text-xs font-mono font-medium px-1.5 py-0.5 rounded bg-white/5 text-slate-400">
                    {teamB.code}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-0.5 flex gap-2">
                  <span>Elo: <strong className="text-emerald-400">{teamB.elo}</strong></span>
                  <span>•</span>
                  <span>SPI: <strong className="text-cyan-400">{teamB.spi}</strong></span>
                </div>
              </div>
            </div>
            <Search className="w-4 h-4 text-slate-500" />
          </div>

          {activeDropdown === 'B' && (
            <div className="absolute left-0 right-0 mt-2 bg-[#141417] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden max-h-80 flex flex-col animate-fade-in">
              <div className="p-3 border-b border-white/10 bg-[#0d0d0f]/55 scroll-m-0">
                <input
                  type="text"
                  placeholder="Buscar selección o club..."
                  value={searchB}
                  onChange={(e) => setSearchB(e.target.value)}
                  className="w-full text-sm py-2 px-3 bg-[#0a0a0b] text-white border border-white/10 rounded-lg placeholder-slate-500 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/85"
                  autoFocus
                />
                
                {/* Filters Row */}
                <div className="flex gap-1 mt-2.5 overflow-x-auto pb-1 text-[11px] font-mono scrollbar-none">
                  <button 
                    onClick={() => setFilterType('all')}
                    className={`px-2 py-0.5 rounded shrink-0 transition-colors ${filterType === 'all' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:bg-white/5'}`}
                  >
                    Todos
                  </button>
                  <button 
                    onClick={() => setFilterType('national')}
                    className={`px-2 py-0.5 rounded shrink-0 transition-colors ${filterType === 'national' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:bg-white/5'}`}
                  >
                    Selecciones
                  </button>
                  <button 
                    onClick={() => setFilterType('club')}
                    className={`px-2 py-0.5 rounded shrink-0 transition-colors ${filterType === 'club' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:bg-white/5'}`}
                  >
                    Clubes
                  </button>
                  <div className="h-4 w-px bg-white/10 mx-1 self-center" />
                  {['UEFA', 'CONMEBOL', 'CONCACAF', 'CAF', 'AFC'].map(c => (
                    <button
                      key={c}
                      onClick={() => setFilterContinent(filterContinent === c ? 'all' : c)}
                      className={`px-2 py-0.5 rounded shrink-0 transition-colors ${filterContinent === c ? 'bg-emerald-500/20 text-emerald-350' : 'text-slate-400 hover:bg-white/5'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <div className="overflow-y-auto divide-y divide-white/5">
                {filteredTeams.map(t => (
                  <div
                    key={t.id}
                    onClick={() => {
                      if (t.id !== teamAId) {
                        setTeamBId(t.id);
                        setActiveDropdown(null);
                        setSearchB('');
                      }
                    }}
                    className={`flex items-center justify-between px-4 py-2.5 hover:bg-white/5 transition-colors cursor-pointer ${t.id === teamAId ? 'opacity-30 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{getFlagEmoji(t)}</span>
                      <div>
                        <span className="text-sm font-semibold text-white block">{t.name}</span>
                        <span className="text-[10px] font-mono text-slate-400 uppercase">
                          {t.type === 'club' ? 'Club' : 'Selección'} • {t.continent}
                        </span>
                      </div>
                    </div>
                    <div className="text-right font-mono text-xs">
                      <span className="text-emerald-400 font-bold block">{t.elo} <span className="text-[9px] text-slate-500">Elo</span></span>
                      <span className="text-slate-450 text-[10px]">SPI: {t.spi}</span>
                    </div>
                  </div>
                ))}
                {filteredTeams.length === 0 && (
                  <div className="p-4 text-center text-xs font-mono text-slate-500">No se encontraron equipos</div>
                )}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* PARAMETRIC RULES / TOGGLES ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6 pt-6 border-t border-white/5">
        
        {/* Knockout extension Toggle */}
        <div className="bg-[#0d0d0f]/80 p-3 rounded-xl border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="text-xs font-semibold text-slate-200 block">Eliminatoria Directa</span>
              <span className="text-[10px] text-slate-500 block">Prorroga y penales en empate</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsKnockout(!isKnockout)}
            className={`w-10 h-5.5 rounded-full p-0.5 border cursor-pointer transition-colors duration-200 ${isKnockout ? 'bg-emerald-500 border-emerald-600' : 'bg-slate-800 border-slate-700'}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${isKnockout ? 'translate-x-4.5' : 'translate-x-0'}`} />
          </button>
        </div>

        {/* Home Advantage override */}
        <div className="bg-[#0d0d0f]/80 p-3 rounded-xl border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Shield className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <span className="text-xs font-semibold text-slate-200 block">Sede Neutral</span>
              <span className="text-[10px] text-slate-500 block">Anula ventaja de local de {teamA.name}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsNeutral(!isNeutral)}
            className={`w-10 h-5.5 rounded-full p-0.5 border cursor-pointer transition-colors duration-200 ${isNeutral ? 'bg-emerald-500 border-emerald-600' : 'bg-slate-800 border-slate-700'}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${isNeutral ? 'translate-x-4.5' : 'translate-x-0'}`} />
          </button>
        </div>

        {/* Monte Carlo resolution quality */}
        <div className="bg-[#0d0d0f]/80 p-3 rounded-xl border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <HelpCircle className="w-4 h-4 text-emerald-450 shrink-0" />
            <div>
              <span className="text-xs font-semibold text-slate-200 block">Simulaciones Monte Carlo</span>
              <span className="text-[10px] text-emerald-400 font-mono font-medium block">
                {simCount === 1000000 ? '1.000.000 (Avanzado)' : '100.000 (Estándar)'}
              </span>
            </div>
          </div>
          <div className="flex border border-white/5 rounded-lg p-0.5 bg-[#0a0a0b]">
            <button
              onClick={() => setSimCount(100000)}
              className={`px-2 py-1 text-[10px] font-mono rounded font-semibold transition-all ${simCount === 100000 ? 'bg-white/10 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
            >
              100K
            </button>
            <button
              onClick={() => setSimCount(1000000)}
              className={`px-2 py-1 text-[10px] font-mono rounded font-semibold transition-all ${simCount === 1000000 ? 'bg-emerald-500 text-black font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              1M
            </button>
          </div>
        </div>

      </div>

      <div className="mt-6">
        <button
          onClick={handleCalculate}
          id="calculate-prediction-btn"
          className="w-full py-4 px-6 bg-[#10b981] hover:bg-emerald-400 text-black font-sans text-base font-black rounded-xl shadow-xl shadow-emerald-950/20 cursor-pointer transition-all duration-300 active:scale-[0.99] flex items-center justify-center gap-3.5 group"
        >
          <span>PROCESAR ALGORITMOS MULTICAPA</span>
          <span className="bg-black/10 px-2 py-0.5 rounded text-xs font-mono font-bold group-hover:bg-black/20 transition-all">
            RUN
          </span>
        </button>
      </div>
    </div>
  );
}
