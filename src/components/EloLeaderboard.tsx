import React, { useState } from 'react';
import { TEAMS, getFlagEmoji } from '../data/teams';
import { Team } from '../types';
import { Search, TrendingUp, Sparkles, Filter, ArrowUpDown } from 'lucide-react';

interface EloLeaderboardProps {
  onSelectTeam: (teamId: string, slot: 'A' | 'B') => void;
  teams: Team[];
}

type SortField = 'elo' | 'spi' | 'marketValueM' | 'fifaRanking' | 'offPower' | 'defPower';

export default function EloLeaderboard({ onSelectTeam, teams }: EloLeaderboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'national' | 'club'>('all');
  const [continentFilter, setContinentFilter] = useState<string>('all');
  
  const [sortField, setSortField] = useState<SortField>('elo');
  const [sortAsc, setSortAsc] = useState(false);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false); // default desc for ratings
    }
  };

  // Process leaderboard list
  const filteredSortedList = teams.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' ? true : t.type === typeFilter;
    const matchesContinent = continentFilter === 'all' ? true : t.continent === continentFilter;
    return matchesSearch && matchesType && matchesContinent;
  }).sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];
    
    // For FIFA rank, lower (1, 2) is better, so handle sorting inverse or typical
    if (sortField === 'fifaRanking') {
      return sortAsc ? valA - valB : valB - valA;
    }
    
    // For Defense, lower is better (goals conceded ratio vs average)
    if (sortField === 'defPower') {
      return sortAsc ? valB - valA : valA - valB;
    }

    return sortAsc ? valA - valB : valB - valA;
  });

  return (
    <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 p-6 shadow-xl space-y-6" id="elo-leaderboard">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-sans font-bold text-white flex items-center gap-2">
            <TrophyIcon className="w-5 h-5 text-amber-400" />
            EXPLORADOR GLOBAL DE RATINGS (ELO / SPI)
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Audita las valoraciones de ofensiva, defensiva y fuerza global de todos los equipos del sistema, actualizados al día de hoy.
          </p>
        </div>
        
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-850 self-start shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Equipos Cargados: {teams.length}</span>
        </div>
      </div>

      {/* FILTER CONTROLS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por selección o club..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs py-3 pl-9 pr-3 bg-slate-950 text-white border border-slate-850 rounded-xl placeholder-slate-500 focus:outline-none focus:border-sky-500/80 transition-all font-sans"
          />
          <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
        </div>

        {/* Type selector (all / national / club) */}
        <div className="flex bg-slate-950 p-1 border border-slate-850 rounded-xl">
          <button
            onClick={() => setTypeFilter('all')}
            className={`flex-1 py-1 px-1.5 text-xs font-mono rounded-lg transition-all cursor-pointer ${typeFilter === 'all' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Todos
          </button>
          <button
            onClick={() => setTypeFilter('national')}
            className={`flex-1 py-1 px-1.5 text-xs font-mono rounded-lg transition-all cursor-pointer ${typeFilter === 'national' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Selecciones
          </button>
          <button
            onClick={() => setTypeFilter('club')}
            className={`flex-1 py-1 px-1.5 text-xs font-mono rounded-lg transition-all cursor-pointer ${typeFilter === 'club' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Clubes
          </button>
        </div>

        {/* Continent Filter */}
        <div className="relative">
          <select
            value={continentFilter}
            onChange={(e) => setContinentFilter(e.target.value)}
            className="w-full text-xs px-3 py-3 bg-slate-950 text-slate-300 border border-slate-850 rounded-xl focus:outline-none focus:border-sky-500/80 transition-all font-sans cursor-pointer appearance-none"
          >
            <option value="all">Filtro por Continente (Todos)</option>
            <option value="UEFA">UEFA (Europa)</option>
            <option value="CONMEBOL">CONMEBOL (Sudamérica)</option>
            <option value="CONCACAF">CONCACAF (Norte/Centroamérica)</option>
            <option value="CAF">CAF (África)</option>
            <option value="AFC">AFC (Asia)</option>
          </select>
          <Filter className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
        </div>
      </div>

      {/* LEADERBOARD TABLE */}
      <div className="overflow-x-auto rounded-xl border border-slate-850">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-950 text-slate-400 border-b border-slate-850 select-none">
            <tr>
              <th className="p-3.5 text-slate-500 w-12 text-center">Rank</th>
              <th className="p-3.5">Equipo</th>
              
              {/* Elo column header */}
              <th 
                onClick={() => toggleSort('elo')}
                className="p-3.5 text-right cursor-pointer hover:bg-slate-900 hover:text-white transition-colors"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Elo Rating</span>
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </div>
              </th>

              {/* SPI column header */}
              <th 
                onClick={() => toggleSort('spi')}
                className="p-3.5 text-right cursor-pointer hover:bg-slate-900 hover:text-white transition-colors"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>SPI Power</span>
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </div>
              </th>

              {/* OffPower column header */}
              <th 
                onClick={() => toggleSort('offPower')}
                className="p-3.5 text-right cursor-pointer hover:bg-slate-900 hover:text-white transition-colors"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Ofensiva</span>
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </div>
              </th>

              {/* DefPower column header */}
              <th 
                onClick={() => toggleSort('defPower')}
                className="p-3.5 text-right cursor-pointer hover:bg-slate-900 hover:text-white transition-colors"
                title="Menos goles esperados concedidos es mejor"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Defensiva (Bloque)</span>
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </div>
              </th>

              {/* MarketValue column header */}
              <th 
                onClick={() => toggleSort('marketValueM')}
                className="p-3.5 text-right cursor-pointer hover:bg-slate-900 hover:text-white transition-colors hidden md:table-cell"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Plantel Val.</span>
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </div>
              </th>

              <th className="p-3.5 text-center">Seleccionar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-900 bg-slate-950/20 text-slate-300">
            {filteredSortedList.map((team, index) => {
              const overallRank = [...teams].sort((a, b) => b.elo - a.elo).findIndex(t => t.id === team.id) + 1;
              
              return (
                <tr key={team.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="p-3 text-center text-slate-500 font-bold">{overallRank}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl filter drop-shadow-sm">{getFlagEmoji(team)}</span>
                      <div>
                        <span className="font-sans font-bold text-white text-sm block">
                          {team.name}
                        </span>
                        <span className="text-[9.5px] text-slate-500 font-mono uppercase block mt-0.5">
                          {team.type === 'club' ? 'Club' : 'Selección'} • {team.continent}
                        </span>
                      </div>
                    </div>
                  </td>
                  
                  {/* Rating value metrics */}
                  <td className="p-3 text-right text-sky-400 font-bold font-mono text-sm">
                    {team.elo}
                  </td>
                  <td className="p-3 text-right text-teal-400 font-mono">
                    {team.spi.toFixed(1)}%
                  </td>
                  <td className="p-3 text-right text-emerald-400 font-mono">
                    {team.offPower.toFixed(2)}x
                  </td>
                  <td className="p-3 text-right text-rose-400 font-mono">
                    {team.defPower.toFixed(2)}x
                  </td>
                  <td className="p-3 text-right font-mono text-slate-400 hidden md:table-cell">
                    €{team.marketValueM}M
                  </td>

                  {/* Actions buttons */}
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onSelectTeam(team.id, 'A')}
                        className="py-1 px-2.5 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 hover:text-sky-300 text-[10px] font-bold font-mono rounded transition-colors cursor-pointer"
                        title="Fijar como Local"
                      >
                        Local
                      </button>
                      <button
                        onClick={() => onSelectTeam(team.id, 'B')}
                        className="py-1 px-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 text-[10px] font-bold font-mono rounded transition-colors cursor-pointer"
                        title="Fijar como Visitante"
                      >
                        Vis
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filteredSortedList.length === 0 && (
              <tr>
                <td colSpan={8} className="p-8 text-center text-slate-500 italic">
                  No se encontraron resultados para los filtros ingresados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}

// Inline fallback trophy icon
function TrophyIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34" />
      <path d="M12 2a6 6 0 0 1 6 6v5a6 6 0 0 1-6 6 6 6 0 0 1-6-6V8a6 6 0 0 1 6-6z" />
    </svg>
  );
}
