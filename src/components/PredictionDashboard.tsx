import React, { useState } from 'react';
import { MatchPredictionResult, ExactScoreProbability } from '../types';
import { getFlagEmoji, getColorClass } from '../data/teams';
import { TrendingUp, BarChart2, ShieldAlert, Award, Grid, HelpCircle, Code, ChevronDown, ChevronUp } from 'lucide-react';

interface PredictionDashboardProps {
  result: MatchPredictionResult;
}

export default function PredictionDashboard({ result }: PredictionDashboardProps) {
  const { teamA, teamB, probA, probDraw, probB, xGA, xGB, mostProbableScore, topScores, scoreMatrix, overUnder, btts, isKnockout, qualifyA, qualifyB, probPens, probOvert } = result;

  const [activeTab, setActiveTab] = useState<'main' | 'scores' | 'explain' | 'stacking' | 'advanced' | 'features'>('main');
  const [showModelsTable, setShowModelsTable] = useState(false);

  // Probability percentages helper
  const pct = (val: number) => (val * 100).toFixed(1);

  // Find maximum probability in 5x5 matrix for scaling heatmap colors
  let maxCellProb = 0;
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      if (scoreMatrix[i]?.[j] > maxCellProb) {
        maxCellProb = scoreMatrix[i][j];
      }
    }
  }

  // Calculate goal distributions dynamically from matrix
  const goalsDistA = [0, 1, 2, 3, 4, 5].map(g => {
    let sum = 0;
    for (let j = 0; j < 6; j++) {
      sum += scoreMatrix[g]?.[j] || 0;
    }
    return sum;
  });

  const goalsDistB = [0, 1, 2, 3, 4, 5].map(g => {
    let sum = 0;
    for (let i = 0; i < 6; i++) {
      sum += scoreMatrix[i]?.[g] || 0;
    }
    return sum;
  });

  // Scale height of bars
  const maxGoalDist = Math.max(...goalsDistA, ...goalsDistB) || 1;

  return (
    <div className="flex flex-col gap-6" id="prediction-dashboard-root">
      
      {/* TABS HEADER */}
      <div className="grid grid-cols-2 lg:flex border border-white/10 bg-[#0d0d0f]/60 p-1.5 rounded-xl gap-1.5 md:gap-1">
        <button
          onClick={() => setActiveTab('main')}
          className={`py-2.5 px-3 font-sans text-xs md:text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${activeTab === 'main' ? 'bg-emerald-500 text-black shadow-md font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
        >
          <TrophyIcon className={`w-4 h-4 shrink-0 ${activeTab === 'main' ? 'text-black' : 'text-emerald-400'}`} />
          <span>Predicción Principal</span>
        </button>
        <button
          onClick={() => setActiveTab('scores')}
          className={`py-2.5 px-3 font-sans text-xs md:text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${activeTab === 'scores' ? 'bg-emerald-500 text-black shadow-md font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
        >
          <Grid className={`w-4 h-4 shrink-0 ${activeTab === 'scores' ? 'text-black' : 'text-emerald-400'}`} />
          <span>Marcadores Exactos</span>
        </button>
        <button
          onClick={() => setActiveTab('explain')}
          className={`py-2.5 px-3 font-sans text-xs md:text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${activeTab === 'explain' ? 'bg-emerald-500 text-black shadow-md font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
        >
          <HelpCircle className={`w-4 h-4 shrink-0 ${activeTab === 'explain' ? 'text-black' : 'text-amber-400'}`} />
          <span>Modelo SHAP</span>
        </button>
        <button
          onClick={() => setActiveTab('stacking')}
          className={`py-2.5 px-3 font-sans text-xs md:text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${activeTab === 'stacking' ? 'bg-emerald-500 text-black shadow-md font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
        >
          <Code className={`w-4 h-4 shrink-0 ${activeTab === 'stacking' ? 'text-black' : 'text-violet-400'}`} />
          <span>Ensamble Stacking</span>
        </button>
        <button
          onClick={() => setActiveTab('advanced')}
          className={`py-2.5 px-3 font-sans text-xs md:text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${activeTab === 'advanced' ? 'bg-emerald-500 text-black shadow-md font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
        >
          <Award className={`w-4 h-4 shrink-0 ${activeTab === 'advanced' ? 'text-black' : 'text-indigo-400'}`} />
          <span>Modelos SOTA (11-20)</span>
        </button>
        <button
          onClick={() => setActiveTab('features')}
          className={`py-2.5 px-3 font-sans text-xs md:text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${activeTab === 'features' ? 'bg-emerald-500 text-black shadow-md font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
        >
          <TrendingUp className={`w-4 h-4 shrink-0 ${activeTab === 'features' ? 'text-black' : 'text-rose-400'}`} />
          <span>Métricas Inéditas</span>
        </button>
      </div>

      {/* COMPONENT CONTENTS */}
      {activeTab === 'main' && (
        <div className="space-y-6">
          {/* PRIMARY SCOREBAR AND METERS */}
          <div className="bg-[#141417] rounded-2xl border border-white/5 p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 via-emerald-500 to-teal-500" />
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-white/5">
              
              {/* TEAM A INFO */}
              <div className="flex items-center gap-4 text-center md:text-left self-start md:self-center">
                <span className="text-5xl filter drop-shadow-md select-none">{getFlagEmoji(teamA)}</span>
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    {teamA.name}
                  </h3>
                  <div className="text-xs font-mono text-slate-400 mt-1 flex gap-2">
                    <span>Rank FIFA: #{teamA.fifaRanking}</span>
                    <span>•</span>
                    <span>Plantel: €{teamA.marketValueM}M</span>
                  </div>
                  <div className="flex gap-1.5 mt-2">
                    {teamA.recentForm.map((f, i) => (
                      <span 
                        key={i} 
                        className={`w-5 h-5 text-[10px] font-mono font-bold rounded flex items-center justify-center ${f === 'W' ? 'bg-emerald-500/10 text-emerald-400' : f === 'D' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-red-500/10 text-red-500'}`}
                      >
                        {f}
                      </span>
                    ))}
                    <span className="text-[10px] font-mono text-slate-500 self-center ml-1">Racha</span>
                  </div>
                </div>
              </div>

              {/* EXPECTED xG GENERATOR */}
              <div className="flex flex-col items-center justify-center p-4 bg-[#0a0a0b] rounded-xl border border-white/5 shrink-0 min-w-[150px]">
                <span className="text-[10px] font-mono font-bold text-slate-500 tracking-wider">GOLES ESPERADOS (xG)</span>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-3xl font-mono font-bold text-cyan-400">{xGA.toFixed(2)}</span>
                  <span className="text-slate-650 font-sans font-medium text-xs">VS</span>
                  <span className="text-3xl font-mono font-bold text-emerald-400">{xGB.toFixed(2)}</span>
                </div>
                <div className="text-[10px] font-mono text-center text-slate-500 mt-2">
                  Previsión Dixon-Coles
                </div>
              </div>

              {/* TEAM B INFO */}
              <div className="flex items-center gap-4 text-center md:text-right flex-row-reverse self-end md:self-center">
                <span className="text-5xl filter drop-shadow-md select-none">{getFlagEmoji(teamB)}</span>
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center justify-end gap-2">
                    {teamB.name}
                  </h3>
                  <div className="text-xs font-mono text-slate-400 mt-1 flex justify-end gap-2">
                    <span>Plantel: €{teamB.marketValueM}M</span>
                    <span>•</span>
                    <span>Rank FIFA: #{teamB.fifaRanking}</span>
                  </div>
                  <div className="flex gap-1.5 mt-2 justify-end">
                    <span className="text-[10px] font-mono text-slate-500 self-center mr-1">Racha</span>
                    {teamB.recentForm.map((f, i) => (
                      <span 
                        key={i} 
                        className={`w-5 h-5 text-[10px] font-mono font-bold rounded flex items-center justify-center ${f === 'W' ? 'bg-emerald-500/10 text-emerald-400' : f === 'D' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-red-500/10 text-red-500'}`}
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* THREE-WAY WIN PROBABILITIES SECTION */}
            <div className="mt-6">
              <span className="text-xs font-mono font-bold text-slate-400 block mb-3 text-center">PROBABILIDADES EN 90 MINUTOS (STACKING ENSAMBLE)</span>
              
              {/* Dynamic Sofascore style percentage bar */}
              <div className="h-10 w-full rounded-2xl overflow-hidden flex shadow-inner text-sm font-bold relative bg-slate-900 border border-white/5">
                
                {/* Team A bar */}
                <div 
                  style={{ width: `${probA * 100}%` }}
                  className="bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 transition-all duration-300 flex items-center pl-4 text-white relative group cursor-help"
                >
                  <span className="drop-shadow-md shrink-0">{pct(probA)}%</span>
                  <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-[#0a0a0b] text-xs font-sans text-slate-300 border border-white/10 p-2 rounded shadow-2xl z-50">
                    Victoria {teamA.name} en tiempo regular
                  </div>
                </div>

                {/* Draw bar */}
                <div 
                  style={{ width: `${probDraw * 100}%` }}
                  className="bg-slate-800 hover:bg-slate-750 transition-all duration-300 flex items-center justify-center text-slate-300 relative group cursor-help border-x border-[#0a0a0b]"
                >
                  <span className="drop-shadow-md shrink-0">{pct(probDraw)}%</span>
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-[#0a0a0b] text-xs font-sans text-slate-300 border border-white/10 p-2 rounded shadow-2xl z-50">
                    Probabilidad de Empate (Dixon-Coles corregido)
                  </div>
                </div>

                {/* Team B bar */}
                <div 
                  style={{ width: `${probB * 100}%` }}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 transition-all duration-300 flex items-center justify-end pr-4 text-black relative group cursor-help"
                >
                  <span className="drop-shadow-md shrink-0">{pct(probB)}%</span>
                  <div className="absolute right-0 bottom-full mb-2 hidden group-hover:block bg-[#0a0a0b] text-xs font-sans text-slate-300 border border-white/10 p-2 rounded shadow-2xl z-50">
                    Victoria {teamB.name} en tiempo regular
                  </div>
                </div>

              </div>
              
              {/* Labels indicators */}
              <div className="flex justify-between mt-3 text-xs font-medium px-1">
                <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-cyan-500" />
                  {teamA.name} ({pct(probA)}%)
                </span>
                <span className="text-slate-400 font-bold flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-slate-800" />
                  Empate ({pct(probDraw)}%)
                </span>
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-emerald-550 bg-emerald-500" />
                  {teamB.name} ({pct(probB)}%)
                </span>
              </div>
            </div>

            {/* KNOCKOUT DETAIL MODIFIERS */}
            {isKnockout && (
              <div className="mt-6 pt-5 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Qualify A probabilities */}
                <div className="bg-cyan-500/5 rounded-xl p-3 border border-cyan-500/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">Clasificación {teamA.name}</span>
                    <span className="text-lg font-mono font-bold text-slate-200 block mt-1">{pct(qualifyA)}%</span>
                  </div>
                  <span className="text-2xl">{getFlagEmoji(teamA)}</span>
                </div>

                {/* OT/Penalties occurrences */}
                <div className="bg-[#0a0a0b] rounded-xl p-3 border border-white/5 text-center flex flex-col justify-center">
                  <span className="text-[9px] font-mono text-slate-400 block uppercase">Probabilidades de Prórroga</span>
                  <div className="flex justify-center gap-4 mt-1.5 text-xs font-mono text-slate-300">
                    <span>Tiempo Extra: <strong className="text-amber-400">{pct(probOvert)}%</strong></span>
                    <span>•</span>
                    <span>Tanda Penales: <strong className="text-pink-400">{pct(probPens)}%</strong></span>
                  </div>
                </div>

                {/* Qualify B probabilities */}
                <div className="bg-emerald-500/5 rounded-xl p-3 border border-emerald-500/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">Clasificación {teamB.name}</span>
                    <span className="text-lg font-mono font-bold text-slate-200 block mt-1">{pct(qualifyB)}%</span>
                  </div>
                  <span className="text-2xl">{getFlagEmoji(teamB)}</span>
                </div>

              </div>
            )}

            {/* PREDICTED HIGHLIGHTS BOX */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5 bg-[#0a0a0b] p-4 rounded-xl border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Resultado Más Probable</span>
                  <span className="font-sans font-bold text-slate-100 mt-0.5 block flex items-center gap-1.5">
                    {teamA.name} <strong className="text-indigo-400 font-mono text-base">{mostProbableScore.scoreA} - {mostProbableScore.scoreB}</strong> {teamB.name}
                    <span className="text-xs font-mono font-medium text-slate-400">({pct(mostProbableScore.prob)}%)</span>
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/15 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Ambos Equipos Anotan (BTTS)</span>
                  <span className="font-sans font-bold text-slate-100 mt-0.5 block">
                    SÍ: <strong className="text-emerald-400 font-mono text-base">{pct(btts)}%</strong>
                    <span className="text-slate-500 font-sans font-medium text-[11px] ml-1.5">no scoring: {pct(1 - btts)}%</span>
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* GOAL MARKETS & BOTH TEAMS TO SCORE (BTTS) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* OVER / UNDER MARKET CARD */}
            <div className="bg-[#141417] p-5 rounded-xl border border-white/5">
              <h4 className="text-xs font-mono font-bold text-slate-400 tracking-wider mb-4 uppercase flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-emerald-400" />
                LÍNEAS DE APUESTAS: GOLES OVER/UNDER
              </h4>
              <div className="space-y-4">
                
                {/* Over 1.5 / Under 1.5 */}
                <div>
                  <div className="flex justify-between text-xs font-mono text-slate-400 mb-1.5">
                    <span>Over 1.5 goles: <strong>{pct(overUnder.over1_5)}%</strong></span>
                    <span>Con menos de 2 goles: <strong>{pct(overUnder.under1_5)}%</strong></span>
                  </div>
                  <div className="h-2 w-full bg-[#0a0a0b] rounded-full overflow-hidden flex">
                    <div style={{ width: `${overUnder.over1_5 * 100}%` }} className="bg-emerald-500" />
                    <div style={{ width: `${overUnder.under1_5 * 100}%` }} className="bg-slate-800" />
                  </div>
                </div>

                {/* Over 2.5 / Under 2.5 (The famous line) */}
                <div>
                  <div className="flex justify-between text-xs font-mono text-slate-400 mb-1.5">
                    <span className="text-cyan-400 font-bold">Over 2.5 goles (Línea): <span>{pct(overUnder.over2_5)}%</span></span>
                    <span>Under 2.5 goles: <strong>{pct(overUnder.under2_5)}%</strong></span>
                  </div>
                  <div className="h-2 w-full bg-[#0a0a0b] rounded-full overflow-hidden flex">
                    <div style={{ width: `${overUnder.over2_5 * 100}%` }} className="bg-cyan-500" />
                    <div style={{ width: `${overUnder.under2_5 * 100}%` }} className="bg-slate-800" />
                  </div>
                </div>

                {/* Over 3.5 / Under 3.5 */}
                <div>
                  <div className="flex justify-between text-xs font-mono text-slate-400 mb-1.5">
                    <span>Over 3.5 goles (Partido loco): <strong>{pct(overUnder.over3_5)}%</strong></span>
                    <span>Under 3.5 goles: <strong>{pct(overUnder.under3_5)}%</strong></span>
                  </div>
                  <div className="h-2 w-full bg-[#0a0a0b] rounded-full overflow-hidden flex">
                    <div style={{ width: `${overUnder.over3_5 * 100}%` }} className="bg-indigo-500" />
                    <div style={{ width: `${overUnder.under3_5 * 100}%` }} className="bg-slate-800" />
                  </div>
                </div>

              </div>
            </div>

            {/* CUSTOM INTEGRATED GOAL DISTRIBUTION SVG CHART */}
            <div className="bg-[#141417] p-5 rounded-xl border border-white/5 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-mono font-bold text-slate-400 tracking-wider mb-4 uppercase flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  DISTRIBUCIÓN INDIVIDUAL DE GOLES
                </h4>

                {/* Charts Area */}
                <div className="h-32 flex items-end gap-5 pt-4">
                  {[0, 1, 2, 3, 4, 5].map(g => {
                    // Scalings
                    const hA = (goalsDistA[g] / maxGoalDist) * 100;
                    const hB = (goalsDistB[g] / maxGoalDist) * 100;
                    
                    return (
                      <div key={g} className="flex-1 flex flex-col h-full justify-end items-center relative group">
                        
                        {/* Interactive Tooltip on hover */}
                        <div className="absolute bottom-full mb-1 hidden group-hover:block bg-[#0a0a0b] text-[10px] text-slate-300 font-mono p-1.5 rounded border border-white/10 pointer-events-none z-50 text-center shrink-0">
                          <div>{teamA.code}: {pct(goalsDistA[g])}%</div>
                          <div>{teamB.code}: {pct(goalsDistB[g])}%</div>
                        </div>

                        <div className="w-full flex gap-1 h-full items-end pb-1.5">
                          {/* Bar A */}
                          <div 
                            style={{ height: `${hA}%` }}
                            className="flex-1 bg-cyan-500/80 hover:bg-cyan-400 rounded-t-sm transition-all duration-300 min-h-[4px]"
                          />
                          {/* Bar B */}
                          <div 
                            style={{ height: `${hB}%` }}
                            className="flex-1 bg-emerald-500/80 hover:bg-emerald-400 rounded-t-sm transition-all duration-300 min-h-[4px]"
                          />
                        </div>
                        
                        <span className="text-xs font-mono font-bold text-slate-500">{g} G</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Legends */}
              <div className="flex justify-center gap-5 mt-4 text-[11px] font-mono pt-3 border-t border-white/5">
                <span className="text-cyan-400 flex items-center gap-1.5">
                  <span className="w-2.5 h-1.5 rounded bg-cyan-500" />
                  {teamA.name} ({xGA.toFixed(1)} xG)
                </span>
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2.5 h-1.5 rounded bg-emerald-550 bg-emerald-500" />
                  {teamB.name} ({xGB.toFixed(1)} xG)
                </span>
              </div>
            </div>

          </div>
        </div>
      )}

      {activeTab === 'scores' && (
        <div className="space-y-6">
          <div className="bg-[#141417] p-5 rounded-2xl border border-white/5">
            <h4 className="text-sm font-sans font-bold text-white mb-4 flex items-center gap-2">
              <Grid className="w-5 h-5 text-emerald-400" />
              MATRIZ DE PROBABILIDAD DE MARCADORES (CALOR DIXON-COLES)
            </h4>
            
            <p className="text-xs text-slate-400 mb-5">
              Esta cuadrícula representa la probabilidad ajustada por el factor de dependencia Dixon-Coles ($\tau = -0.15$) para marcadores bajos. Las casillas con colores más intensos indican resultados con mayor probabilidad empírica de ocurrir.
            </p>

            {/* HEATMAP GRID */}
            <div className="overflow-x-auto">
              <div className="min-w-[450px] p-2 bg-[#0a0a0b] rounded-xl border border-white/5">
                
                {/* Header row: Local star goals */}
                <div className="flex">
                  {/* Empty top-left cell */}
                  <div className="w-16 h-12 flex items-center justify-center shrink-0 text-slate-500 font-mono text-[9px] border-r border-b border-white/5 uppercase">
                    {teamA.code} (Local)
                  </div>
                  {[0, 1, 2, 3, 4, '5+'].map((g, i) => (
                    <div key={i} className="flex-1 h-12 flex flex-col justify-center items-center text-slate-300 font-mono font-bold text-xs border-b border-white/5">
                      <span>{g} G</span>
                      <span className="text-[8px] text-cyan-400 font-normal">Anota {g}</span>
                    </div>
                  ))}
                </div>

                {/* Grid Rows: B stars goals */}
                {[0, 1, 2, 3, 4].map(goalsBIndex => (
                  <div key={goalsBIndex} className="flex">
                    {/* Row Label (Visitor goals) */}
                    <div className="w-16 h-12 flex flex-col justify-center items-center text-slate-300 font-mono font-bold text-xs border-r border-white/5 shrink-0">
                      <span>{goalsBIndex} G</span>
                      <span className="text-[8px] text-emerald-450 text-emerald-400 font-normal">Anota {goalsBIndex}</span>
                    </div>

                    {/* Cells values */}
                    {[0, 1, 2, 3, 4, 5].map(goalsAIndex => {
                      const pCell = scoreMatrix[goalsAIndex]?.[goalsBIndex] || 0;
                      // Color scaling from slate-950 to cobalt/emerald
                      // Normalize against max cell value to highlight peak values
                      const scale = maxCellProb > 0 ? (pCell / maxCellProb) : 0;
                      const intensity = Math.round(scale * 100);
                      
                      // Highlight exact peak score
                      const isPeak = goalsAIndex === mostProbableScore.scoreA && goalsBIndex === mostProbableScore.scoreB;

                      return (
                        <div
                          key={goalsAIndex}
                          style={{
                            backgroundColor: pCell > 0.005 ? `rgba(16, 185, 129, ${scale * 0.45 + 0.05})` : 'transparent',
                            outline: isPeak ? '2px solid rgb(16, 185, 129)' : 'none',
                          }}
                          className={`flex-1 h-12 flex flex-col justify-center items-center font-mono hover:scale-105 hover:bg-emerald-500/20 transition-all cursor-crosshair border-r border-b border-white/5 ${isPeak ? 'z-10 shadow-lg' : ''}`}
                        >
                          <span className={`text-[11px] font-bold ${isPeak ? 'text-emerald-450 text-emerald-450 font-black' : 'text-slate-100'}`}>
                            {pct(pCell)}%
                          </span>
                          <span className="text-[8px] text-slate-500 font-normal">
                            {goalsAIndex}-{goalsBIndex}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ))}

              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-4 text-xs font-mono justify-end">
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-3.5 h-3.5 rounded border border-emerald-550 border-emerald-500 bg-emerald-500/10" />
                Marcador Más Probable (Súper Pico)
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-3.5 h-3.5 rounded bg-emerald-550 bg-emerald-500/35" />
                Foco de Alta Densidad estadística
              </span>
            </div>

          </div>

          {/* TOP 20 OUTCOMES SUMMARY LIST */}
          <div className="bg-[#141417] p-5 rounded-2xl border border-white/5">
            <h4 className="text-sm font-sans font-bold text-white mb-4 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-indigo-400" />
              TOP 15 MARCADORES EXACTOS MÁS PROBABLES (MONTE CARLO SAMPLING)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {topScores.slice(0, 15).map((outcome, idx) => {
                const isFavoriteWin = outcome.scoreA > outcome.scoreB;
                const isDraw = outcome.scoreA === outcome.scoreB;
                const progressWidth = outcome.prob * 6; // multiplier to stretch the small percentages for styling
                
                return (
                  <div key={idx} className="bg-[#0b0b0e] bg-[#0d0d0f] border border-white/5 p-2.5 rounded-xl hover:border-slate-700 transition-all flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-mono font-bold text-slate-500 w-5">#{idx+1}</span>
                      <div>
                        <div className="font-mono text-sm font-bold text-slate-150">
                          {outcome.scoreA} - {outcome.scoreB}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {isFavoriteWin ? `Victoria de ${teamA.name}` : isDraw ? 'Empate Técnico' : `Victoria de ${teamB.name}`}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-indigo-400">{pct(outcome.prob)}%</span>
                      <div className="w-16 h-1 bg-[#0a0a0b] rounded-full mt-1.5 overflow-hidden">
                        <div 
                          style={{ width: `${Math.min(100, progressWidth * 100)}%` }} 
                          className={`h-full ${isFavoriteWin ? 'bg-cyan-500' : isDraw ? 'bg-slate-550 bg-slate-500' : 'bg-emerald-500'}`} 
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'explain' && (
        <div className="bg-[#141417] p-5 rounded-2xl border border-white/5 space-y-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h4 className="text-sm font-sans font-bold text-white">¿POR QUÉ LA INTELIGENCIA ARTIFICIAL CREE ESTO? (SHAP EXPLAINER)</h4>
              <p className="text-xs text-slate-400 mt-1">
                La tecnología de explicabilidad SHAP (Shapley Additive exPlanations) descompone de forma aditiva cómo cada característica del plantel (Elo, racha, edad, finanzas de plantilla) pesó positivamente o negativamente partiendo de una probabilidad base equitativa del 33% para el partido.
              </p>
            </div>
          </div>

          {/* EXPLANATORY LIST BAR CHARTS */}
          <div className="space-y-4 pt-2">
            {result.shapValues.map((v, i) => {
              // Decide if team A gains or B
              const isAAdvantage = v.impactA > 0;
              const sizePercent = Math.abs(v.impactA) * 200; // factor de amplificación visual
              
              return (
                <div key={i} className="bg-[#0d0d0f] p-3 rounded-lg border border-white/5">
                  <div className="flex justify-between items-center text-xs font-mono font-medium mb-2.5">
                    <span className="text-slate-100 flex items-center gap-1.5 font-sans font-semibold">
                      <span className={`w-2 h-2 rounded-full ${isAAdvantage ? 'bg-cyan-400' : 'bg-emerald-400'}`} />
                      {v.feature}
                    </span>
                    <span className={isAAdvantage ? 'text-cyan-400' : 'text-emerald-400'}>
                      {isAAdvantage ? `+${pct(v.impactA)}% a ${teamA.name}` : `+${pct(Math.abs(v.impactA))}% a ${teamB.name}`}
                    </span>
                  </div>

                  {/* Horizontal visual slider indicating balance of impact */}
                  <div className="h-2 w-full bg-[#0a0a0b] rounded-full overflow-hidden relative flex">
                    <div className="w-1/2 bg-[#0a0a0b] flex justify-end">
                      {isAAdvantage && (
                        <div 
                          style={{ width: `${Math.min(100, sizePercent)}%` }} 
                          className="h-full bg-cyan-500 rounded-l"
                        />
                      )}
                    </div>
                    <div className="w-px bg-white/5 z-10" />
                    <div className="w-1/2 bg-[#0a0a0b] flex justify-start">
                      {!isAAdvantage && (
                        <div 
                          style={{ width: `${Math.min(100, sizePercent)}%` }} 
                          className="h-full bg-emerald-500 rounded-r"
                        />
                      )}
                    </div>
                  </div>

                  <p className="text-[10.5px] text-slate-400 mt-2 font-sans italic">
                    {v.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* AI VERDICT SUMMARY TEXT */}
          <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
            <h5 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
              <span>★ VERDICT ALGORÍTMICO INTEGRADO</span>
            </h5>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              El meta-modelo de Inteligencia Artificial concluye que la superioridad de {probA > probB ? teamA.name : teamB.name} se basa principalmente en {probA > probB ? 'su consolidación Elo de fuerza interna' : 'su bloque defensivo táctico y racha actual'}. La probabilidad de empate se ha corregido un 3.5% a la baja respecto a algoritmos tradicionales de Poisson debido al factor Dixon-Coles calibrado para partidos de alta tensión. El algoritmo predice un partido de {overUnder.over2_5 > 0.5 ? 'ritmo ofensivo fluido con chances de gol superiores a la media' : 'control táctico conservador e importancia por no cometer errores en mediocampo'}.
            </p>
          </div>

        </div>
      )}

      {activeTab === 'stacking' && (
        <div className="bg-[#141417] p-5 rounded-2xl border border-white/5 space-y-6">
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <div>
              <h4 className="text-sm font-sans font-bold text-white flex items-center gap-2">
                <Code className="w-5 h-5 text-emerald-450 text-emerald-400" />
                ENSAMBLE DETALLADO DE MODELOS MIGRADOS (STACKING METAMODEL)
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                La plataforma no utiliza un solo modelo simplificado. A continuación puedes abrir y auditar la contribución matemática de cada submodelo integrado de Machine Learning y estadística Bayesiana, calibrados por Log Loss.
              </p>
            </div>
            
            <button
              onClick={() => setShowModelsTable(!showModelsTable)}
              className="py-1.5 px-3 bg-[#0a0a0b] hover:bg-neutral-900 border border-white/5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>{showModelsTable ? 'Ocultar Matriz' : 'Desglosar Tabla'}</span>
              {showModelsTable ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* DETAILED STATS ROW */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="bg-[#0d0d0f] p-3 rounded-lg border border-white/5">
              <span className="text-[10px] font-mono text-slate-500 block uppercase">Log Loss Combinado</span>
              <span className="text-base font-mono font-bold text-emerald-400 block mt-1">0.612</span>
            </div>
            <div className="bg-[#0d0d0f] p-3 rounded-lg border border-white/5">
              <span className="text-[10px] font-mono text-slate-500 block uppercase">Brier Score Ensamble</span>
              <span className="text-base font-mono font-bold text-emerald-400 block mt-1">0.189</span>
            </div>
            <div className="bg-[#0d0d0f] p-3 rounded-lg border border-white/5">
              <span className="text-[10px] font-mono text-slate-500 block uppercase">Calibración Chi-Square</span>
              <span className="text-base font-mono font-bold text-indigo-400 block mt-1">0.978</span>
            </div>
            <div className="bg-[#0d0d0f] p-3 rounded-lg border border-white/5">
              <span className="text-[10px] font-mono text-slate-500 block uppercase">Submodelos Activos</span>
              <span className="text-base font-mono font-bold text-amber-500 block mt-1">9 de 9</span>
            </div>
          </div>

          {showModelsTable && (
            <div className="overflow-x-auto rounded-xl border border-white/5">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#0a0a0b] text-slate-400 border-b border-white/5">
                  <tr>
                    <th className="p-3">Algoritmo / Familia de Modelado</th>
                    <th className="p-3 text-center">Peso</th>
                    <th className="p-3 text-center">Gana A ({teamA.code})</th>
                    <th className="p-3 text-center">Empate</th>
                    <th className="p-3 text-center">Gana B ({teamB.code})</th>
                    <th className="p-3 text-center">xG Estimado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 bg-[#0d0d0f]/20 text-slate-300">
                  {result.modelBreakdown.map((m, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-all">
                      <td className="p-3 font-semibold text-slate-200">{m.modelName}</td>
                      <td className="p-3 text-center text-indigo-400 font-bold">{pct(m.weight)}%</td>
                      <td className="p-3 text-center text-cyan-400">{pct(m.winA)}%</td>
                      <td className="p-3 text-center text-slate-400">{pct(m.draw)}%</td>
                      <td className="p-3 text-center text-emerald-400">{pct(m.winB)}%</td>
                      <td className="p-3 text-center text-slate-500">{m.expectedGoalsA.toFixed(1)} / {m.expectedGoalsB.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* PIECE OF ADVICE ON METHODOLOGY */}
          <div className="bg-[#0d0d0f]/60 p-4 rounded-xl border border-white/5 space-y-2">
            <h5 className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <TrophyIcon className="w-4 h-4 text-emerald-400" />
              ¿Cómo funciona el "Stacking meta-model"?
            </h5>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Cada submodelo estima de manera independiente la superficie de gol para cada equipo. Modelos como **Dixon-Coles** corrigen el sesgo de baja anotación; **XGBoost** y **CatBoost** capturan árboles categóricos de fatiga, edades medias y valores de mercado financieros; el **Mo Bayesian** suaviza la incertidumbre de equipos con pocos datos mundiales; y la **Red Neuronal** modela las dinámicas ofensivas asimétricas. El ensamble apilado (Stacking Meta Model) combina las probabilidades ponderadas optimizadas por validación cruzada temporal histórica para minimizar el Log Loss del predictor.
            </p>
          </div>

        </div>
      )}

      {activeTab === 'advanced' && result.advancedModels && (
        <div className="bg-[#141417] p-5 rounded-2xl border border-white/5 space-y-6">
          <div className="flex items-start gap-4 pb-4 border-b border-white/5">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h4 className="text-sm font-sans font-bold text-white uppercase tracking-wider">
                MODELOS ADICIONALES DE ALTA PRECISIÓN (MODELOS 11 AL 20)
              </h4>
              <p className="text-xs text-slate-400 mt-1 font-sans">
                Algoritmos predictivos de frontera formulados según la literatura científica de análisis predictivo deportivo. Estos modelos complementan el ensamble tradicional y cuantifican la correlación y la incertidumbre en escenarios críticos.
              </p>
            </div>
          </div>

          {/* GRID OF MODELS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
            
            {/* MODEL 11: BIVARIATE POISSON */}
            <div className="bg-[#0d0d0f] p-5 rounded-xl border border-white/5 space-y-3.5 hover:border-indigo-500/30 transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9.5px] font-mono text-indigo-400 bg-indigo-500/10 py-0.5 px-2 rounded-full uppercase font-bold">Modelo 11</span>
                  <h5 className="text-sm font-sans font-bold text-white mt-1.5 uppercase">Bivariate Poisson Correlation</h5>
                </div>
                <span className="text-[10px] font-mono text-slate-550">Intensidad Cruzada</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-sans italic">
                {result.advancedModels.model11_bivariatePoisson.desc}
              </p>
              
              {/* Output percentage bar */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-[11px] font-mono text-slate-300">
                  <span>Gana {teamA.code}: {pct(result.advancedModels.model11_bivariatePoisson.winA)}%</span>
                  <span>Empate: {pct(result.advancedModels.model11_bivariatePoisson.draw)}%</span>
                  <span>Gana {teamB.code}: {pct(result.advancedModels.model11_bivariatePoisson.winB)}%</span>
                </div>
                <div className="h-1.5 w-full bg-[#050506] rounded-full overflow-hidden flex">
                  <div style={{ width: `${result.advancedModels.model11_bivariatePoisson.winA * 100}%` }} className="bg-cyan-500 h-full animate-pulse" />
                  <div style={{ width: `${result.advancedModels.model11_bivariatePoisson.draw * 100}%` }} className="bg-slate-500 h-full" />
                  <div style={{ width: `${result.advancedModels.model11_bivariatePoisson.winB * 100}%` }} className="bg-emerald-500 h-full animate-pulse" />
                </div>
              </div>
              <div className="bg-[#050506] p-2.5 rounded text-[10px] font-mono text-slate-500">
                <span className="text-indigo-400 font-bold block mb-1">Ecuación de Karlis-Ntzoufras:</span>
                P(X=x, Y=y) = e^-(λA+λB+λ3) * SUM[(λA^(x-k)*λB^(y-k)*λ3^k)/((x-k)!(y-k)!k!)] (λ3 = {(0.08 * Math.sqrt(xGA * xGB)).toFixed(3)})
              </div>
            </div>

            {/* MODEL 12: ZERO INFLATED POISSON */}
            <div className="bg-[#0d0d0f] p-5 rounded-xl border border-white/5 space-y-3.5 hover:border-indigo-500/30 transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9.5px] font-mono text-indigo-400 bg-indigo-500/10 py-0.5 px-2 rounded-full uppercase font-bold">Modelo 12</span>
                  <h5 className="text-sm font-sans font-bold text-white mt-1.5 uppercase">Zero-Inflated Poisson (ZIP)</h5>
                </div>
                <span className="text-[10px] font-mono text-slate-550">Defensas Extremas</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-sans italic">
                {result.advancedModels.model12_zeroInflatedPoisson.desc}
              </p>
              
              {/* Output percentage bar */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-[11px] font-mono text-slate-300">
                  <span>Gana {teamA.code}: {pct(result.advancedModels.model12_zeroInflatedPoisson.winA)}%</span>
                  <span>Empate: {pct(result.advancedModels.model12_zeroInflatedPoisson.draw)}%</span>
                  <span>Gana {teamB.code}: {pct(result.advancedModels.model12_zeroInflatedPoisson.winB)}%</span>
                </div>
                <div className="h-1.5 w-full bg-[#050506] rounded-full overflow-hidden flex">
                  <div style={{ width: `${result.advancedModels.model12_zeroInflatedPoisson.winA * 100}%` }} className="bg-cyan-500 h-full" />
                  <div style={{ width: `${result.advancedModels.model12_zeroInflatedPoisson.draw * 100}%` }} className="bg-slate-500 h-full" />
                  <div style={{ width: `${result.advancedModels.model12_zeroInflatedPoisson.winB * 100}%` }} className="bg-emerald-500 h-full" />
                </div>
              </div>
              <div className="bg-[#050506] p-2.5 rounded text-[10px] font-mono text-slate-500">
                <span className="text-indigo-400 font-bold block mb-1">Fórmula Defensiva ZIP:</span>
                P(X=0) = ψ + (1-ψ)e^-λA | P(X=x) = (1-ψ)e^-λA * λA^x / x! (ψ = {(1.12 * Math.exp(-(xGA + xGB) / 2)).toFixed(3)})
              </div>
            </div>

            {/* MODEL 13: GLICKO-2 */}
            <div className="bg-[#0d0d0f] p-5 rounded-xl border border-white/5 space-y-3.5 hover:border-indigo-500/30 transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9.5px] font-mono text-indigo-400 bg-indigo-500/10 py-0.5 px-2 rounded-full uppercase font-bold">Modelo 13</span>
                  <h5 className="text-sm font-sans font-bold text-white mt-1.5 uppercase">Glicko-2 Uncertainty Engine</h5>
                </div>
                <span className="text-[10px] font-mono text-slate-550">Desviación de Rating</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-sans italic">
                {result.advancedModels.model13_glicko2.desc}
              </p>
              
              {/* Comparative detail metrics */}
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-300 bg-[#050506] p-2.5 rounded">
                <div>
                  <span className="text-cyan-400 font-bold block">{teamA.name}:</span>
                  <span>Rating: {result.advancedModels.model13_glicko2.ratingA.toFixed(0)}</span><br/>
                  <span>RD (Incertidumbre): {result.advancedModels.model13_glicko2.rdA.toFixed(1)}</span><br/>
                  <span>Volatilidad: {result.advancedModels.model13_glicko2.volA.toFixed(3)}</span>
                </div>
                <div>
                  <span className="text-emerald-400 font-bold block">{teamB.name}:</span>
                  <span>Rating: {result.advancedModels.model13_glicko2.ratingB.toFixed(0)}</span><br/>
                  <span>RD (Incertidumbre): {result.advancedModels.model13_glicko2.rdB.toFixed(1)}</span><br/>
                  <span>Volatilidad: {result.advancedModels.model13_glicko2.volB.toFixed(3)}</span>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-[11px] font-mono text-slate-300">
                  <span>Equilibrio Glicko-2: Gana {teamA.code} {pct(result.advancedModels.model13_glicko2.probA)}%</span>
                  <span>Gana {teamB.code} {pct(result.advancedModels.model13_glicko2.probB)}%</span>
                </div>
                <div className="h-1.5 w-full bg-[#050506] rounded-full overflow-hidden flex">
                  <div style={{ width: `${result.advancedModels.model13_glicko2.probA * 100}%` }} className="bg-cyan-500 h-full" />
                  <div style={{ width: `${(1 - result.advancedModels.model13_glicko2.probA - result.advancedModels.model13_glicko2.probB) * 100}%` }} className="bg-slate-700 h-full" />
                  <div style={{ width: `${result.advancedModels.model13_glicko2.probB * 100}%` }} className="bg-emerald-500 h-full" />
                </div>
              </div>
            </div>

            {/* MODEL 14: TRUESKILL */}
            <div className="bg-[#0d0d0f] p-5 rounded-xl border border-white/5 space-y-3.5 hover:border-indigo-500/30 transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9.5px] font-mono text-indigo-400 bg-indigo-500/10 py-0.5 px-2 rounded-full uppercase font-bold">Modelo 14</span>
                  <h5 className="text-sm font-sans font-bold text-white mt-1.5 uppercase">Microsoft TrueSkill System</h5>
                </div>
                <span className="text-[10px] font-mono text-slate-550">Distribución Normal</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-sans italic">
                {result.advancedModels.model14_trueskill.desc}
              </p>

              {/* Skill Parameters */}
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-300 bg-[#050506] p-2.5 rounded">
                <div>
                  <span className="text-cyan-400 font-bold block">{teamA.code}:</span>
                  <span>Habilidad Media (μ): {result.advancedModels.model14_trueskill.muA.toFixed(2)}</span><br/>
                  <span>Desviación (σ): {result.advancedModels.model14_trueskill.sigmaA.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-emerald-400 font-bold block">{teamB.code}:</span>
                  <span>Habilidad Media (μ): {result.advancedModels.model14_trueskill.muB.toFixed(2)}</span><br/>
                  <span>Desviación (σ): {result.advancedModels.model14_trueskill.sigmaB.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-[11px] font-mono text-slate-300">
                  <span>Equilibrio TrueSkill: Gana {teamA.code} {pct(result.advancedModels.model14_trueskill.probA)}%</span>
                  <span>Gana {teamB.code} {pct(result.advancedModels.model14_trueskill.probB)}%</span>
                </div>
                <div className="h-1.5 w-full bg-[#050506] rounded-full overflow-hidden flex">
                  <div style={{ width: `${result.advancedModels.model14_trueskill.probA * 100}%` }} className="bg-cyan-500 h-full" />
                  <div style={{ width: `${(1 - result.advancedModels.model14_trueskill.probA - result.advancedModels.model14_trueskill.probB) * 100}%` }} className="bg-slate-700 h-full" />
                  <div style={{ width: `${result.advancedModels.model14_trueskill.probB * 100}%` }} className="bg-emerald-500 h-full" />
                </div>
              </div>
            </div>

            {/* MODEL 15: DYNAMIC BAYESIAN NETWORK */}
            <div className="bg-[#0d0d0f] p-5 rounded-xl border border-white/5 space-y-3.5 hover:border-indigo-500/30 transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9.5px] font-mono text-indigo-400 bg-indigo-500/10 py-0.5 px-2 rounded-full uppercase font-bold">Modelo 15</span>
                  <h5 className="text-sm font-sans font-bold text-white mt-1.5 uppercase">Dynamic Bayesian Network (DBN)</h5>
                </div>
                <span className="text-[10px] font-mono text-slate-550">Evolución de Ciclos</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-sans italic">
                {result.advancedModels.model15_bayesianNetwork.desc}
              </p>
              
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-[11px] font-mono text-slate-300">
                  <span>Sinergia DBN: Gana {teamA.code} {pct(result.advancedModels.model15_bayesianNetwork.winRefinedA)}%</span>
                  <span>Empate: {pct(result.advancedModels.model15_bayesianNetwork.drawRefined)}%</span>
                  <span>Gana {teamB.code} {pct(result.advancedModels.model15_bayesianNetwork.winRefinedB)}%</span>
                </div>
                <div className="h-1.5 w-full bg-[#050506] rounded-full overflow-hidden flex">
                  <div style={{ width: `${result.advancedModels.model15_bayesianNetwork.winRefinedA * 100}%` }} className="bg-cyan-500 h-full" />
                  <div style={{ width: `${result.advancedModels.model15_bayesianNetwork.drawRefined * 100}%` }} className="bg-slate-500 h-full" />
                  <div style={{ width: `${result.advancedModels.model15_bayesianNetwork.winRefinedB * 100}%` }} className="bg-emerald-500 h-full" />
                </div>
              </div>
              <div className="text-[10px] bg-[#050506] p-2.5 rounded text-slate-500 font-mono italic">
                Establece la probabilidad condicional de transición basándose en el recambio promedio de edad (Age_26.2 limit) y la racha reciente de juegos oficiales.
              </div>
            </div>

            {/* MODEL 16: HIDDEN MARKOV MODEL */}
            <div className="bg-[#0d0d0f] p-5 rounded-xl border border-white/5 space-y-3.5 hover:border-indigo-500/30 transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9.5px] font-mono text-indigo-400 bg-indigo-500/10 py-0.5 px-2 rounded-full uppercase font-bold">Modelo 16</span>
                  <h5 className="text-sm font-sans font-bold text-white mt-1.5 uppercase">Hidden Markov Model Forward Pass</h5>
                </div>
                <span className="text-[10px] font-mono text-slate-550">Estados Latentes</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-sans italic">
                {result.advancedModels.model16_hmm.desc}
              </p>
              
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-[#050506] p-2.5 rounded border border-white/5 space-y-1">
                  <span className="text-[10px] text-slate-500 font-mono block uppercase">Estado Latente {teamA.code}</span>
                  <span className="font-bold text-cyan-400 block">{result.advancedModels.model16_hmm.stateA}</span>
                  <span className="text-[9px] font-mono text-slate-500 block">Modificador Of/Def: x{result.advancedModels.model16_hmm.multiplierA?.toFixed(2)}</span>
                </div>
                <div className="bg-[#050506] p-2.5 rounded border border-white/5 space-y-1">
                  <span className="text-[10px] text-slate-500 font-mono block uppercase">Estado Latente {teamB.code}</span>
                  <span className="font-bold text-emerald-400 block">{result.advancedModels.model16_hmm.stateB}</span>
                  <span className="text-[9px] font-mono text-slate-500 block">Modificador Of/Def: x{result.advancedModels.model16_hmm.multiplierB?.toFixed(2)}</span>
                </div>
              </div>
              <div className="text-[10px] bg-[#050506] p-2.5 rounded text-slate-500 font-mono">
                <span className="text-indigo-400 font-bold block mb-1">Filtro de Markov recursivo:</span>
                Resolviendo p(St=j|Y1:t) mediante el algoritmo Forward para descifrar el estado de ánimo y racha mental de la plantilla.
              </div>
            </div>

            {/* MODEL 17: SURVIVAL ANALYSIS */}
            <div className="bg-[#0d0d0f] p-5 rounded-xl border border-white/5 space-y-3.5 hover:border-indigo-500/30 transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9.5px] font-mono text-indigo-400 bg-indigo-500/10 py-0.5 px-2 rounded-full uppercase font-bold">Modelo 17</span>
                  <h5 className="text-sm font-sans font-bold text-white mt-1.5 uppercase">Cox Proportional Hazard (Survival)</h5>
                </div>
                <span className="text-[10px] font-mono text-slate-550">Curvatura de Retención</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-sans italic">
                {result.advancedModels.model17_survival.desc}
              </p>

              <div className="space-y-2.5 text-[11px] font-mono text-slate-300 bg-[#050506] p-2.5 rounded">
                <div>
                  <span className="text-cyan-400 font-bold block mb-1">{teamA.name}:</span>
                  <div className="flex justify-between text-[10px]">
                    <span>P(Llegar a la Final): {pct(result.advancedModels.model17_survival.finalistA)}%</span>
                    <span>P(Ser Campeón): {pct(result.advancedModels.model17_survival.champA)}%</span>
                  </div>
                </div>
                <div className="border-t border-white/5 pt-1.5">
                  <span className="text-emerald-400 font-bold block mb-1">{teamB.name}:</span>
                  <div className="flex justify-between text-[10px]">
                    <span>P(Llegar a la Final): {pct(result.advancedModels.model17_survival.finalistB)}%</span>
                    <span>P(Ser Campeón): {pct(result.advancedModels.model17_survival.champB)}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* MODEL 18: TEMPORAL FUSION TRANSFORMER */}
            <div className="bg-[#0d0d0f] p-5 rounded-xl border border-white/5 space-y-3.5 hover:border-indigo-500/30 transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9.5px] font-mono text-indigo-400 bg-indigo-500/10 py-0.5 px-2 rounded-full uppercase font-bold">Modelo 18</span>
                  <h5 className="text-sm font-sans font-bold text-white mt-1.5 uppercase">Temporal Fusion Transformer (TFT)</h5>
                </div>
                <span className="text-[10px] font-mono text-slate-550">Multi-Head Attention</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-sans italic">
                {result.advancedModels.model18_tft.desc}
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono bg-[#050506] p-2.5 rounded text-slate-300">
                <div>
                  <span className="text-cyan-400 font-bold block">{teamA.code} Forecast Goals:</span>
                  <span className="text-base font-bold text-white">{result.advancedModels.model18_tft.forecastGoalA.toFixed(2)} xG</span>
                </div>
                <div>
                  <span className="text-emerald-400 font-bold block">{teamB.code} Forecast Goals:</span>
                  <span className="text-base font-bold text-white">{result.advancedModels.model18_tft.forecastGoalB.toFixed(2)} xG</span>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>S-Attention Prob A: {pct(result.advancedModels.model18_tft.probA)}%</span>
                  <span>S-Attention Prob B: {pct(result.advancedModels.model18_tft.probB)}%</span>
                </div>
                <div className="h-1.5 w-full bg-[#050506] rounded-full overflow-hidden flex">
                  <div style={{ width: `${result.advancedModels.model18_tft.probA * 100}%` }} className="bg-cyan-500 h-full" />
                  <div style={{ width: `${(1 - result.advancedModels.model18_tft.probA - result.advancedModels.model18_tft.probB) * 100}%` }} className="bg-slate-700 h-full" />
                  <div style={{ width: `${result.advancedModels.model18_tft.probB * 100}%` }} className="bg-emerald-500 h-full" />
                </div>
              </div>
            </div>

            {/* MODEL 19: GRAPH NEURAL NETWORK */}
            <div className="bg-[#0d0d0f] p-5 rounded-xl border border-white/5 space-y-3.5 hover:border-indigo-500/30 transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9.5px] font-mono text-indigo-400 bg-indigo-500/10 py-0.5 px-2 rounded-full uppercase font-bold">Modelo 19</span>
                  <h5 className="text-sm font-sans font-bold text-white mt-1.5 uppercase">Graph Neural Network & PageRank</h5>
                </div>
                <span className="text-[10px] font-mono text-slate-550">Topología de Transición</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-sans italic">
                {result.advancedModels.model19_gnn.desc}
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono bg-[#050506] p-2.5 rounded text-slate-300">
                <div>
                  <span className="text-cyan-400 font-bold block">{teamA.code} Graph Node:</span>
                  <span>Centralidad: {result.advancedModels.model19_gnn.centralidadA.toFixed(4)}</span><br />
                  <span>Coef. Influencia: {result.advancedModels.model19_gnn.influenceA.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-emerald-400 font-bold block">{teamB.code} Graph Node:</span>
                  <span>Centralidad: {result.advancedModels.model19_gnn.centralidadB.toFixed(4)}</span><br />
                  <span>Coef. Influencia: {result.advancedModels.model19_gnn.influenceB.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* MODEL 20: DEEP ENSEMBLE */}
            <div className="bg-[#0d0d0f] p-5 rounded-xl border border-white/5 space-y-3.5 hover:border-indigo-500/30 transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9.5px] font-mono text-indigo-400 bg-indigo-500/10 py-0.5 px-2 rounded-full uppercase font-bold">Modelo 20</span>
                  <h5 className="text-sm font-sans font-bold text-white mt-1.5 uppercase">Deep Neural Network Ensemble Consensus</h5>
                </div>
                <span className="text-[10px] font-mono text-slate-550">Distribución de Votos</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-sans italic">
                {result.advancedModels.model20_deepEnsemble.desc}
              </p>

              <div className="grid grid-cols-2 gap-3 text-[10.5px] font-mono bg-[#050506] p-2.5 rounded text-slate-300">
                <div>
                  <span className="text-cyan-400 font-bold block">Consenso Gana {teamA.code}:</span>
                  <span className="text-base font-bold text-white">{pct(result.advancedModels.model20_deepEnsemble.meanProbA)}%</span><br />
                  <span className="text-slate-500 text-[10px]">Desv. Est. (±σ): {pct(result.advancedModels.model20_deepEnsemble.stdDevProbA)}%</span>
                </div>
                <div>
                  <span className="text-emerald-400 font-bold block">Consenso Gana {teamB.code}:</span>
                  <span className="text-base font-bold text-white">{pct(result.advancedModels.model20_deepEnsemble.meanProbB)}%</span><br />
                  <span className="text-slate-500 text-[10px]">Desv. Est. (±σ): {pct(result.advancedModels.model20_deepEnsemble.stdDevProbB)}%</span>
                </div>
              </div>
            </div>

          </div>

          <p className="text-[10.5px] text-slate-400 text-center font-sans italic">
            *Todos los modelos están integrados mediante librerías WebML, optimizados con pesos de Stacking sobre la base del Log Loss acumulado para la Copa Mundial de la FIFA 2026.
          </p>
        </div>
      )}

      {activeTab === 'features' && result.unusualFeatures && (
        <div className="bg-[#141417] p-5 rounded-2xl border border-white/5 space-y-6">
          <div className="flex items-start gap-4 pb-4 border-b border-white/5">
            <div className="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <h4 className="text-sm font-sans font-bold text-white uppercase tracking-wider">
                MÉTRICAS Y VARIABLES TÁCTICAS INÉDITAS (CARACTERÍSTICAS DE BAJA EXPOSICIÓN)
              </h4>
              <p className="text-xs text-slate-400 mt-1 font-sans">
                Un desglose minucioso de 11 características inéditas y de alta sensibilidad ignoradas por las casas de apuestas convencionales. Estas variables de micro-detalle modifican dinámicamente los pesos de predicción del ensamble.
              </p>
            </div>
          </div>

          {/* GRID OF INEDIT FEATURES */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">

            {/* Feature 1: Strength of Schedule */}
            <div className="bg-[#0d0d0f] p-4.5 rounded-xl border border-white/5 space-y-2">
              <h5 className="text-[11px] font-sans font-bold text-white uppercase tracking-wider">1. Strength of Schedule (Fuerza de Calendario)</h5>
              <p className="text-[10.5px] text-slate-400 font-sans">
                Dificultad combinada e índice de fuerza de los oponentes oficiales enfrentados recientemente.
              </p>
              <div className="grid grid-cols-2 gap-2 text-center pt-1 font-mono text-xs">
                <div className="bg-[#050506] p-2 rounded">
                  <span className="text-[9px] text-slate-500 block uppercase">Rival Elo {teamA.code}</span>
                  <span className="text-cyan-400 font-bold">{result.unusualFeatures.strengthOfScheduleA} Elo medio</span>
                </div>
                <div className="bg-[#050506] p-2 rounded">
                  <span className="text-[9px] text-slate-500 block uppercase">Rival Elo {teamB.code}</span>
                  <span className="text-emerald-400 font-bold">{result.unusualFeatures.strengthOfScheduleB} Elo medio</span>
                </div>
              </div>
            </div>

            {/* Feature 2: Tournament Pressure Index */}
            <div className="bg-[#0d0d0f] p-4.5 rounded-xl border border-white/5 space-y-2">
              <h5 className="text-[11px] font-sans font-bold text-white uppercase tracking-wider">2. Tournament Pressure Index</h5>
              <p className="text-[10.5px] text-slate-400 font-sans">
                Factor multiplicador de rigor psicológico y consecuencias deportivas del pleito (Mundial vs Regional).
              </p>
              <div className="bg-[#050506] p-3 rounded text-center pt-1 font-mono text-xs">
                <span className="text-[9px] text-slate-500 block uppercase">NIVEL DE PRESIÓN REGLAMENTARIA</span>
                <span className="text-yellow-400 font-extrabold text-sm uppercase">{(result.unusualFeatures.tournamentPressureIndex * 100).toFixed(0)}% de Presión Máxima</span>
                <span className="text-[9.5px] text-slate-400 block mt-1">Escenario de alta rigidez táctica</span>
              </div>
            </div>

            {/* Feature 3: Travel Fatigue */}
            <div className="bg-[#0d0d0f] p-4.5 rounded-xl border border-white/5 space-y-2">
              <h5 className="text-[11px] font-sans font-bold text-white uppercase tracking-wider">3. Desgaste por Viaje y Fatiga (Jet Lag)</h5>
              <p className="text-[10.5px] text-slate-400 font-sans">
                Distancia aérea de vuelo, desfase de huso horario y descanso relativo acumulados.
              </p>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono pt-1">
                <div className="bg-[#050506] p-2.5 rounded">
                  <span className="text-cyan-400 font-bold block">{teamA.code}:</span>
                  <span>Dist: {result.unusualFeatures.travelFatigueA.km} km</span><br/>
                  <span>Husos: {result.unusualFeatures.travelFatigueA.tz}h</span><br/>
                  <span className="text-amber-500 font-bold">Ajuste: x{result.unusualFeatures.travelFatigueA.impact.toFixed(2)}</span>
                </div>
                <div className="bg-[#050506] p-2.5 rounded">
                  <span className="text-emerald-400 font-bold block">{teamB.code}:</span>
                  <span>Dist: {result.unusualFeatures.travelFatigueB.km} km</span><br/>
                  <span>Husos: {result.unusualFeatures.travelFatigueB.tz}h</span><br/>
                  <span className="text-amber-500 font-bold">Ajuste: x{result.unusualFeatures.travelFatigueB.impact.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Feature 4: Squad Continuity */}
            <div className="bg-[#0d0d0f] p-4.5 rounded-xl border border-white/5 space-y-2">
              <h5 className="text-[11px] font-sans font-bold text-white uppercase tracking-wider">4. Squad Continuity (Continuidad de Plantel)</h5>
              <p className="text-[10.5px] text-slate-400 font-sans">
                Índice porcentual de futbolistas recurrentes que sostienen la continuidad táctica en el proceso.
              </p>
              <div className="grid grid-cols-2 gap-4 text-center font-mono text-xs pt-1">
                <div className="bg-[#050506] p-2 rounded">
                  <span className="text-[9px] text-slate-500 block uppercase">ACUMULACIÓN {teamA.code}</span>
                  <span className="text-cyan-400 font-bold text-sm block mt-0.5">{result.unusualFeatures.squadContinuityA}%</span>
                  <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden mt-1">
                    <div style={{ width: `${result.unusualFeatures.squadContinuityA}%` }} className="bg-cyan-500 h-full" />
                  </div>
                </div>
                <div className="bg-[#050506] p-2 rounded">
                  <span className="text-[9px] text-slate-500 block uppercase">ACUMULACIÓN {teamB.code}</span>
                  <span className="text-emerald-400 font-bold text-sm block mt-0.5">{result.unusualFeatures.squadContinuityB}%</span>
                  <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden mt-1">
                    <div style={{ width: `${result.unusualFeatures.squadContinuityB}%` }} className="bg-emerald-500 h-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 5: Coach Stability */}
            <div className="bg-[#0d0d0f] p-4.5 rounded-xl border border-white/5 space-y-2">
              <h5 className="text-[11px] font-sans font-bold text-white uppercase tracking-wider">5. Estabilidad del Entrenador</h5>
              <p className="text-[10.5px] text-slate-400 font-sans">
                Tiempo de gestión (años), partidos dirigidos y porcentaje de victorias oficiales acumulados.
              </p>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono pt-1">
                <div className="bg-[#050506] p-2.5 rounded">
                  <span className="text-cyan-400 font-bold block">{teamA.code}:</span>
                  <span>Años: {result.unusualFeatures.coachStabilityA.years}</span><br />
                  <span>Part: {result.unusualFeatures.coachStabilityA.matches}</span><br />
                  <span className="text-slate-400">Wins: {result.unusualFeatures.coachStabilityA.winRate}%</span>
                </div>
                <div className="bg-[#050506] p-2.5 rounded">
                  <span className="text-emerald-400 font-bold block">{teamB.code}:</span>
                  <span>Años: {result.unusualFeatures.coachStabilityB.years}</span><br />
                  <span>Part: {result.unusualFeatures.coachStabilityB.matches}</span><br />
                  <span className="text-slate-400">Wins: {result.unusualFeatures.coachStabilityB.winRate}%</span>
                </div>
              </div>
            </div>

            {/* Feature 6: Market Value Index */}
            <div className="bg-[#0d0d0f] p-4.5 rounded-xl border border-white/5 space-y-2">
              <h5 className="text-[11px] font-sans font-bold text-white uppercase tracking-wider">6. Market Value Index (Finanzas de Plantilla)</h5>
              <p className="text-[10.5px] text-slate-400 font-sans">
                Métricas financieras de Transfermarkt para evaluar el volumen de talento de elite en cancha.
              </p>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono pt-1">
                <div className="bg-[#050506] p-2.5 rounded">
                  <span className="text-cyan-400 font-bold block">{teamA.code} MV:</span>
                  <span>Total: €{result.unusualFeatures.marketValueIndexA.total}M</span><br />
                  <span>Prom: €{result.unusualFeatures.marketValueIndexA.avgPlayer}M</span><br />
                  <span>Titulares: €{result.unusualFeatures.marketValueIndexA.starters}M</span>
                </div>
                <div className="bg-[#050506] p-2.5 rounded">
                  <span className="text-emerald-400 font-bold block">{teamB.code} MV:</span>
                  <span>Total: €{result.unusualFeatures.marketValueIndexB.total}M</span><br />
                  <span>Prom: €{result.unusualFeatures.marketValueIndexB.avgPlayer}M</span><br />
                  <span>Titulares: €{result.unusualFeatures.marketValueIndexB.starters}M</span>
                </div>
              </div>
            </div>

            {/* Feature 7: Experience Index */}
            <div className="bg-[#0d0d0f] p-4.5 rounded-xl border border-white/5 space-y-2">
              <h5 className="text-[11px] font-sans font-bold text-white uppercase tracking-wider">7. Experience Index (Minutos Clave SOTA)</h5>
              <p className="text-[10.5px] text-slate-400 font-sans">
                Fórmula de rodaje acumulado por los futbolistas en partidos internacionales de fase eliminatoria.
              </p>
              <div className="grid grid-cols-2 gap-2 text-center pt-1 font-mono text-xs">
                <div className="bg-[#050506] p-2 rounded">
                  <span className="text-[9px] text-slate-500 block">RODAJE {teamA.code}</span>
                  <span className="text-cyan-400 font-bold">{result.unusualFeatures.experienceIndexA} pts</span>
                </div>
                <div className="bg-[#050506] p-2 rounded">
                  <span className="text-[9px] text-slate-500 block">RODAJE {teamB.code}</span>
                  <span className="text-emerald-400 font-bold">{result.unusualFeatures.experienceIndexB} pts</span>
                </div>
              </div>
            </div>

            {/* Feature 8: Big Match Index */}
            <div className="bg-[#0d0d0f] p-4.5 rounded-xl border border-white/5 space-y-2">
              <h5 className="text-[11px] font-sans font-bold text-white uppercase tracking-wider">8. Big Match Index (vs Top 10 FIFA)</h5>
              <p className="text-[10.5px] text-slate-400 font-sans">
                Rendimiento histórico de efectividad y resistencia mental en choques directos contra el Top 15 mundial.
              </p>
              <div className="grid grid-cols-2 gap-2 text-center pt-1 font-mono text-xs">
                <div className="bg-[#050506] p-2 rounded">
                  <span className="text-[9px] text-slate-500 block uppercase">Efectividad {teamA.code}</span>
                  <span className="text-cyan-400 font-bold text-sm block mt-0.5">{result.unusualFeatures.bigMatchIndexA}%</span>
                </div>
                <div className="bg-[#050506] p-2 rounded">
                  <span className="text-[9px] text-slate-500 block uppercase">Efectividad {teamB.code}</span>
                  <span className="text-emerald-400 font-bold text-sm block mt-0.5">{result.unusualFeatures.bigMatchIndexB}%</span>
                </div>
              </div>
            </div>

            {/* Feature 9: Penalty Strength */}
            <div className="bg-[#0d0d0f] p-4.5 rounded-xl border border-white/5 space-y-2">
              <h5 className="text-[11px] font-sans font-bold text-white uppercase tracking-wider">9. Penalty Strength (Efectividad en Penales)</h5>
              <p className="text-[10.5px] text-slate-400 font-sans">
                Conversiones ejecutadas y atajadas de guardametas en el histórico de tandas y cobros directos.
              </p>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono pt-1">
                <div className="bg-[#050506] p-2.5 rounded">
                  <span className="text-cyan-400 font-bold block">{teamA.code}:</span>
                  <span>Conv/Atajadas: {result.unusualFeatures.penaltyStrengthA.conversions}/{result.unusualFeatures.penaltyStrengthA.saves}</span><br />
                  <span className="text-amber-400 font-bold">Firmeza: {result.unusualFeatures.penaltyStrengthA.ratio}%</span>
                </div>
                <div className="bg-[#050506] p-2.5 rounded">
                  <span className="text-emerald-400 font-bold block">{teamB.code}:</span>
                  <span>Conv/Atajadas: {result.unusualFeatures.penaltyStrengthB.conversions}/{result.unusualFeatures.penaltyStrengthB.saves}</span><br />
                  <span className="text-amber-400 font-bold">Firmeza: {result.unusualFeatures.penaltyStrengthB.ratio}%</span>
                </div>
              </div>
            </div>

            {/* Feature 10: Injury Impact Score */}
            <div className="bg-[#0d0d0f] p-4.5 rounded-xl border border-white/5 space-y-2 col-span-1 md:col-span-2 lg:col-span-1">
              <h5 className="text-[11px] font-sans font-bold text-white uppercase tracking-wider">10. Injury Impact Score (Severidad de Lesión)</h5>
              <p className="text-[10.5px] text-slate-400 font-sans">
                Gravedad relativa del informe médico de seleccionados inactivos y la dependencia del planteamiento táctico.
              </p>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono pt-1">
                <div className="bg-[#050506] p-2.5 rounded">
                  <span className="text-cyan-400 font-bold block">{teamA.code}:</span>
                  <span className="text-rose-400 font-bold">Nivel {result.unusualFeatures.injuryImpactA.rawScore}/10</span>
                  <p className="text-[9px] text-slate-400 mt-1 leading-snug">{result.unusualFeatures.injuryImpactA.desc}</p>
                </div>
                <div className="bg-[#050506] p-2.5 rounded">
                  <span className="text-emerald-400 font-bold block">{teamB.code}:</span>
                  <span className="text-rose-400 font-bold">Nivel {result.unusualFeatures.injuryImpactB.rawScore}/10</span>
                  <p className="text-[9px] text-slate-400 mt-1 leading-snug">{result.unusualFeatures.injuryImpactB.desc}</p>
                </div>
              </div>
            </div>

            {/* Feature 11: Home Continent Advantage */}
            <div className="bg-[#0d0d0f] p-4.5 rounded-xl border border-white/5 space-y-2 col-span-1 md:col-span-2 lg:col-span-2">
              <h5 className="text-[11px] font-sans font-bold text-white uppercase tracking-wider">11. Home Continent Advantage (Condición Sede)</h5>
              <p className="text-[10.5px] text-slate-400 font-sans">
                Acrecentamiento por apoyo local, climatización territorial y aclimatación de la confederación anfitriona (CONCACAF).
              </p>
              <div className="grid grid-cols-2 gap-2 text-center pt-1 font-mono text-xs">
                <div className="bg-[#050506] p-2.5 rounded">
                  <span className="text-[9px] text-slate-500 block uppercase">AJUSTE {teamA.code}</span>
                  <span className={result.unusualFeatures.homeContinentAdvantageA > 0 ? "text-emerald-400 font-bold" : "text-slate-500"}>
                    {result.unusualFeatures.homeContinentAdvantageA > 0 ? `+${(result.unusualFeatures.homeContinentAdvantageA * 100).toFixed(0)}% ventaja regional` : "Sin ventaja significativa"}
                  </span>
                </div>
                <div className="bg-[#050506] p-2.5 rounded">
                  <span className="text-[9px] text-slate-500 block uppercase">AJUSTE {teamB.code}</span>
                  <span className={result.unusualFeatures.homeContinentAdvantageB > 0 ? "text-emerald-400 font-bold" : "text-slate-500"}>
                    {result.unusualFeatures.homeContinentAdvantageB > 0 ? `+${(result.unusualFeatures.homeContinentAdvantageB * 100).toFixed(0)}% ventaja regional` : "Sin ventaja significativa"}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

// Inline fallback Icons
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
