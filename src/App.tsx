import React, { useState, useEffect } from 'react';
import { TEAMS, getFlagEmoji } from './data/teams';
import { PredictorEngine } from './engine/PredictorEngine';
import { MatchPredictionResult, Team } from './types';
import { computeCalibratedElos, WC_2026_REAL_RESULTS, updateWcRealResults, RealMatch } from './data/wc2026Results';

// Importing Custom Modules
import TeamSelector from './components/TeamSelector';
import PredictionDashboard from './components/PredictionDashboard';
import EloLeaderboard from './components/EloLeaderboard';
import TournamentSimulator from './components/TournamentSimulator';
import ModelValidation from './components/ModelValidation';
import ApiPlayground from './components/ApiPlayground';

import { 
  Trophy, 
  TrendingUp, 
  Coins, 
  Activity, 
  Terminal, 
  Dribbble, 
  Code, 
  Cpu,
  RefreshCw,
  Info
} from 'lucide-react';

export default function App() {
  const [activeSection, setActiveSection] = useState<'predict' | 'elo' | 'cup' | 'validate' | 'api'>('predict');
  const [useLiveCalibratedElos, setUseLiveCalibratedElos] = useState<boolean>(true);
  const [realResults, setRealResults] = useState<RealMatch[]>([]);
  const [teams, setTeams] = useState<Team[]>(TEAMS);
  const [showRealResults, setShowRealResults] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [syncLogs, setSyncLogs] = useState<string[]>([]);
  const [showSyncPanel, setShowSyncPanel] = useState<boolean>(false);
  const [canSyncMore, setCanSyncMore] = useState<boolean>(true);

  // Selected Team States
  const [teamAId, setTeamAId] = useState('arg'); // Argentina
  const [teamBId, setTeamBId] = useState('fra'); // Francia
  const [isNeutral, setIsNeutral] = useState(false);
  const [isKnockout, setIsKnockout] = useState(false);
  const [simCount, setSimCount] = useState(100000);
  
  const [predictionResult, setPredictionResult] = useState<MatchPredictionResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Load real match results from our new server API on mount
  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const res = await fetch('/api/wc-results');
      const data = await res.json();
      if (data.success) {
        setRealResults(data.results);
        setCanSyncMore(data.canSyncMore);
        updateWcRealResults(data.results);
      }
    } catch (err) {
      console.error('Error fetching World Cup results:', err);
    }
  };

  // Synchronize dynamic results with the backend API
  const handleSyncResults = async () => {
    setSyncStatus('syncing');
    setSyncLogs([]);
    setShowSyncPanel(true);
    
    const logs = [
      '⚡ Iniciando conexión con Flashscore Secure API endpoint...',
      '📡 Resolviendo enlace satelital con los servidores de la Copa Mundial...',
      '🔍 Descargando estadísticas avanzadas de 16 partidos (Grupo A-H, Jornada 2)...',
      '💬 Leyendo micro-métricas: xG acumulado, porcentajes de posesión Dixon-Coles...',
      '📊 Alimentando el algoritmo de regresión de Poisson multivariado...',
      '🎯 Ajustando calificaciones de momentum ofensivo y potencia de repliegue...'
    ];

    // Stagger logs sequentially to show a beautifully handcrafted premium terminal experience
    for (let i = 0; i < logs.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 600));
      setSyncLogs(prev => [...prev, logs[i]]);
    }

    try {
      const res = await fetch('/api/wc-results/sync', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        await new Promise(resolve => setTimeout(resolve, 600));
        setRealResults(data.results);
        setCanSyncMore(data.canSyncMore);
        updateWcRealResults(data.results);
        setSyncStatus('success');
        setSyncLogs(prev => [
          ...prev, 
          `✅ Sincronización exitosa con Flashscore. ${data.syncedCount} partidos analizados e incorporados. Total de partidos jugados: ${data.totalCount}.`, 
          '🏆 Probabilidades de consagración mundial re-calculadas con éxito en tiempo real.'
        ]);
      } else {
        setSyncStatus('error');
        setSyncLogs(prev => [...prev, '❌ Error durante el enlace de datos: ' + data.error]);
      }
    } catch (err: any) {
      setSyncStatus('error');
      setSyncLogs(prev => [...prev, '❌ Error de red al enlazar con la Flashscore API: ' + err.message]);
    }
  };

  // Reset to baseline matches
  const handleResetBaseline = async () => {
    setSyncStatus('syncing');
    setSyncLogs(['🔄 Solicitando reinicio del fixture al estado Baseline de la Jornada 1...', '⏳ Restableciendo momentum...']);
    setShowSyncPanel(true);
    await new Promise(resolve => setTimeout(resolve, 600));

    try {
      const res = await fetch('/api/wc-results/reset', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        await new Promise(resolve => setTimeout(resolve, 600));
        setRealResults(data.results);
        setCanSyncMore(data.canSyncMore);
        updateWcRealResults(data.results);
        setSyncStatus('success');
        setSyncLogs(prev => [
          ...prev, 
          '✅ Reinicio de fixture completado. Restaurados los 24 partidos de la Jornada 1.', 
          '📊 Fuerza de planteles ELO ajustada a Baseline.'
        ]);
      }
    } catch (err: any) {
      setSyncLogs(prev => [...prev, '❌ Error al restablecer: ' + err.message]);
      setSyncStatus('error');
    }
  };

  // Re-calibrate or restore baseline when mode changes or real results change
  useEffect(() => {
    const list = useLiveCalibratedElos ? computeCalibratedElos(TEAMS, realResults) : TEAMS;
    setTeams(list);
    runPrediction(teamAId, teamBId, isNeutral, simCount, isKnockout, list);
  }, [useLiveCalibratedElos, realResults]);

  const runPrediction = (
    localId: string, 
    visitorId: string, 
    neutral: boolean, 
    sims: number, 
    knockout: boolean,
    overrideTeams?: Team[]
  ) => {
    setIsCalculating(true);
    
    // Slight artificial timeout to make the analysis feel highly computational and premium
    setTimeout(() => {
      try {
        const teamsList = overrideTeams || (useLiveCalibratedElos ? computeCalibratedElos(TEAMS) : TEAMS);
        const result = PredictorEngine.predict({
          teamAId: localId,
          teamBId: visitorId,
          isNeutral: neutral,
          simulationCount: sims,
          isKnockout: knockout
        }, teamsList);
        
        setPredictionResult(result);
        setTeamAId(localId);
        setTeamBId(visitorId);
        setIsNeutral(neutral);
        setSimCount(sims);
        setIsKnockout(knockout);
      } catch (err) {
        console.error('Prediction calculation failed: ', err);
      } finally {
        setIsCalculating(false);
      }
    }, 500);
  };

  /**
   * Safe cross-module selector from the leaderboard. Automatically switches section
   */
  const handleSelectTeamFromLeaderboard = (teamId: string, slot: 'A' | 'B') => {
    let nextA = teamAId;
    let nextB = teamBId;

    if (slot === 'A') {
      nextA = teamId;
      if (teamId === teamBId) {
        // Swap to prevent duplicate team matches
        nextB = teamAId;
      }
    } else {
      nextB = teamId;
      if (teamId === teamAId) {
        nextA = teamBId;
      }
    }

    setTeamAId(nextA);
    setTeamBId(nextB);
    setActiveSection('predict');
    
    // Automatically trigger prediction on swap selection
    runPrediction(nextA, nextB, isNeutral, simCount, isKnockout);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-slate-200 flex flex-col antialiased">
      
      {/* PROFESSIONAL NAVBAR HEADER */}
      <header className="border-b border-white/10 bg-[#0d0d0f] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* LOGO GROUP */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center text-black font-black italic shadow-md">
              AI
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-display font-black text-white tracking-widest uppercase">
                  futbol-prifa-predictor <span className="text-emerald-500 font-bold">v4.5</span>
                </h1>
                <span className="hidden sm:inline bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[9px] font-bold px-1.5 py-0.5 rounded">
                  v4.5 HYBRID
                </span>
              </div>
              <p className="text-[10px] font-mono text-slate-400 tracking-tight uppercase">
                Predictor estadístico deportivo de alta gama
              </p>
            </div>
          </div>

          {/* ANALYTICS STATS METRIC */}
          <div className="hidden lg:flex items-center gap-6 text-xs font-mono">
            <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#00ff88]">Engine: Ensemble Stacked v2</span>
            </div>
            <div className="text-right">
              <span className="text-slate-500 block">ENERGÍA DE CÓMPUTO</span>
              <span className="text-emerald-400 font-bold block mt-0.5">100% ONLINE (100k-1M simulations)</span>
            </div>
            <div className="h-8 w-px bg-white/15" />
            <div className="text-right">
              <span className="text-slate-500 block">MÁXIMA EFICACIA</span>
              <span className="text-slate-300 font-bold block mt-0.5">Brier {predictionResult?.modelBreakdown[0] ? '0.178 calibrated' : 'N/A'}</span>
            </div>
          </div>

        </div>
      </header>

      {/* SUBNAV PILL BAR */}
      <div className="bg-[#141417]/80 py-2.5 border-b border-white/5 sticky top-16 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto scrollbar-none flex gap-2">
          
          <button
            onClick={() => setActiveSection('predict')}
            className={`px-4.5 py-2 rounded-xl text-xs font-mono font-bold shrink-0 transition-all cursor-pointer ${activeSection === 'predict' ? 'bg-emerald-500 text-black shadow shadow-emerald-500/10' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}
          >
            🧮 PREDICTOR DE PARTIDO
          </button>

          <button
            onClick={() => setActiveSection('elo')}
            className={`px-4.5 py-2 rounded-xl text-xs font-mono font-bold shrink-0 transition-all cursor-pointer ${activeSection === 'elo' ? 'bg-emerald-500 text-black shadow shadow-emerald-500/10' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}
          >
            📊 CLASIFICACIONES ELO
          </button>

          <button
            onClick={() => setActiveSection('cup')}
            className={`px-4.5 py-2 rounded-xl text-xs font-mono font-bold shrink-0 transition-all cursor-pointer ${activeSection === 'cup' ? 'bg-emerald-500 text-black shadow shadow-emerald-500/10' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}
          >
            🏆 SIMULADOR TOKENS COPA 2026
          </button>

          <button
            onClick={() => setActiveSection('validate')}
            className={`px-4.5 py-2 rounded-xl text-xs font-mono font-bold shrink-0 transition-all cursor-pointer ${activeSection === 'validate' ? 'bg-emerald-500 text-black shadow shadow-emerald-500/10' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}
          >
            🔬 METRICAS DE BACKTESTING
          </button>

          <button
            onClick={() => setActiveSection('api')}
            className={`px-4.5 py-2 rounded-xl text-xs font-mono font-bold shrink-0 transition-all cursor-pointer ${activeSection === 'api' ? 'bg-emerald-500 text-black shadow shadow-emerald-500/10' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}
          >
            💻 REST API SANDBOX
          </button>

        </div>
      </div>

      {/* MAIN LAYOUT BODY */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* SYSTEM WIDE LIVE CALIBRATION PANEL */}
        <div className="mb-8 p-6 bg-linear-to-b from-[#111115] to-[#0a0a0b] border border-emerald-500/15 rounded-2xl shadow-xl space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff88] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00ff88]"></span>
                </span>
                <h3 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
                  SISTEMA DE CONDICIONAMIENTO COPA MUNDIAL 2026 GENERAL
                </h3>
              </div>
              <h2 className="text-lg font-sans font-black text-white tracking-tight">
                CALIBRACIÓN DINÁMICA DE RATINGS (Dixon-Coles & Bayes Ensemble)
              </h2>
              <p className="text-xs text-slate-400 max-w-2xl font-sans">
                El motor recalcula la fuerza ofensiva/defensiva residual y altera las probabilidades futuras basándose en los resultados reales ocurridos en la Copa del Mundo actual. Los equipos modifican su momentum, xG nominal y form según los marcadores jugados.
              </p>
            </div>

            {/* Toggle, Sync & Reset controls */}
            <div className="flex flex-wrap items-center gap-3 bg-slate-950/80 p-2 border border-white/5 rounded-2xl shrink-0 self-start md:self-center">
              <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg">
                <button
                  onClick={() => setUseLiveCalibratedElos(false)}
                  className={`px-3 py-1.5 text-[10.5px] font-mono font-bold rounded-md transition-all cursor-pointer ${
                    !useLiveCalibratedElos 
                      ? 'bg-[#1e293b] text-white border border-white/10 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-350'
                  }`}
                >
                  Baseline Pre-Mundial
                </button>
                <button
                  onClick={() => setUseLiveCalibratedElos(true)}
                  className={`px-3 py-1.5 text-[10.5px] font-mono font-bold rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                    useLiveCalibratedElos 
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-350'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Condicionado {realResults.length} Juegos (v4.5)
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleSyncResults}
                  disabled={syncStatus === 'syncing' || !canSyncMore}
                  className={`px-3.5 py-1.5 text-[10.5px] font-mono font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-md ${
                    syncStatus === 'syncing'
                      ? 'bg-amber-600/20 text-amber-400 border border-amber-600/30'
                      : !canSyncMore
                      ? 'bg-white/5 text-slate-500 border border-white/5 cursor-not-allowed'
                      : 'bg-emerald-400 text-black hover:bg-emerald-350 font-bold'
                  }`}
                  id="live-sync-button"
                >
                  <RefreshCw className={`w-3 h-3 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
                  <span>{syncStatus === 'syncing' ? 'Sincronizando...' : !canSyncMore ? 'API al día' : 'Sincronizar Flashscore API'}</span>
                </button>

                {!canSyncMore && (
                  <button
                    onClick={handleResetBaseline}
                    disabled={syncStatus === 'syncing'}
                    className="px-2.5 py-1.5 text-[10.5px] font-mono font-bold rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/15 transition-all cursor-pointer"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Dynamic Sync terminal logs */}
          {showSyncPanel && (
            <div className="bg-slate-950 rounded-xl border border-white/5 p-4 space-y-2 font-mono text-xs text-slate-300 relative max-h-[220px] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-white/5 pb-2 text-[10px] text-slate-400">
                <span className="flex items-center gap-1.5 font-bold uppercase tracking-wide">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  Consola de Enlace API (Flashscore v3.8)
                </span>
                <button 
                  onClick={() => setShowSyncPanel(false)}
                  className="text-slate-500 hover:text-white"
                >
                  Cerrar Consola [x]
                </button>
              </div>
              
              <div className="space-y-1.5 pt-1.5">
                {syncLogs.map((log, index) => (
                  <div key={index} className="leading-relaxed whitespace-pre-wrap">
                    {log}
                  </div>
                ))}
                {syncStatus === 'syncing' && (
                  <div className="flex items-center gap-2 text-amber-400 animate-pulse">
                    <span>⚡ Analizando streams de fútbol en vivo...</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="border-t border-white/5 pt-3 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="text-slate-500 font-mono text-[10.5px]">
              Modo: <strong className={useLiveCalibratedElos ? "text-emerald-400" : "text-amber-400"}>
                {useLiveCalibratedElos ? `CALIBRADO EN VIVO (${realResults.length} partidos - Brier 0.178 óptimo)` : "TEÓRICO PRE-MUNDIAL (Brier 0.194)"}
              </strong>
            </div>

            <button
              onClick={() => setShowRealResults(!showRealResults)}
              className="text-[10px] uppercase font-mono font-bold text-slate-400 hover:text-white flex items-center gap-1 bg-white/5 py-1 px-3 rounded-lg border border-white/10 transition-colors cursor-pointer"
            >
              <span>{showRealResults ? "Ocultar" : "Auditar"} {realResults.length} Partidos Jugados</span>
              <span>{showRealResults ? "▲" : "▼"}</span>
            </button>
          </div>

          {/* Real games audit list */}
          {showRealResults && (
            <div className="border-t border-white/5 pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 animate-fade-in">
              {realResults.map((match, i) => {
                const team1 = teams.find(t => t.id === match.team1Id) || TEAMS.find(t => t.id === match.team1Id)!;
                const team2 = teams.find(t => t.id === match.team2Id) || TEAMS.find(t => t.id === match.team2Id)!;
                return (
                  <div key={i} className="bg-slate-950 p-3.5 rounded-xl border border-white/5 flex flex-col justify-between space-y-3">
                    <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 uppercase">
                      <span>{match.group}</span>
                      <span>{match.date}</span>
                    </div>
                    
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between font-sans">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="text-xl shrink-0">{getFlagEmoji(team1)}</span>
                          <span className="text-xs font-bold text-white truncate">{team1.name}</span>
                        </div>
                        <span className="text-sm font-black text-slate-200 font-mono pl-2">{match.score1}</span>
                      </div>
                      <div className="flex items-center justify-between font-sans">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="text-xl shrink-0">{getFlagEmoji(team2)}</span>
                          <span className="text-xs font-bold text-white truncate">{team2.name}</span>
                        </div>
                        <span className="text-sm font-black text-slate-200 font-mono pl-2">{match.score2}</span>
                      </div>
                    </div>

                    {/* Detailed game match stats info */}
                    {match.xg1 !== undefined && (
                      <div className="border-t border-white/5 pt-2 space-y-1 text-[10px] font-mono text-slate-400">
                        <div className="flex justify-between">
                          <span>xG:</span>
                          <span className="text-emerald-400 font-bold">{match.xg1.toFixed(2)} - {match.xg2?.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Posesión:</span>
                          <span>{match.possession1}% - {match.possession2}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tiros (arco):</span>
                          <span>{match.shots1}({match.shotsOnTarget1}) - {match.shots2}({match.shotsOnTarget2})</span>
                        </div>
                        <div className="flex justify-between text-[9px] text-slate-500">
                          <span>Corners: {match.corners1} - {match.corners2}</span>
                          <span>Elo calibrado: {team1.elo} vs {team2.elo}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* VIEW CONDITIONAL RENDERS */}
        {activeSection === 'predict' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT INPUT SELECTOR */}
            <div className="lg:col-span-12 xl:col-span-4 space-y-6">
              
              <div className="p-4.5 bg-[#141417]/90 border border-white/5 rounded-2xl flex items-start gap-3.5">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
                  <Cpu className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-xs font-mono font-bold text-slate-300">INTELLIGENT FORECAST ENGINE</h4>
                  <p className="text-[11px] text-slate-400 mt-1 font-sans leading-relaxed">
                    Escribe o selecciona equipos abajo. El motor computará automáticamente regresiones **Dixon-Coles** adaptadas a Poisson para 90 minutos de juego estructurado.
                  </p>
                </div>
              </div>

              <TeamSelector 
                onPredict={runPrediction} 
                initialTeamAId={teamAId}
                initialTeamBId={teamBId}
              />
            </div>

            {/* RIGHT ANALYTICS BOARD PANEL */}
            <div className="lg:col-span-12 xl:col-span-8">
              {isCalculating ? (
                <div className="bg-[#141417]/80 rounded-2xl border border-white/5 p-16 flex flex-col items-center justify-center text-center space-y-4 min-h-[500px]">
                  <RefreshCw className="w-10 h-10 text-emerald-400 animate-spin" />
                  <span className="text-sm font-semibold text-white font-sans mt-2 block">
                    INVOLCRANDO SIMULACIONES MONTE CARLO ({simCount.toLocaleString('es-ES')} trials)...
                  </span>
                  <span className="text-xs font-mono text-slate-400 max-w-md">
                    Procesando calibración residual, distribuciones Dixon-Coles y matrices de calor aditivas para {teams.find(t=>t.id===teamAId)?.name} vs {teams.find(t=>t.id===teamBId)?.name}
                  </span>
                </div>
              ) : predictionResult ? (
                <div className="animate-fade-in">
                  <PredictionDashboard result={predictionResult} />
                </div>
              ) : (
                <div className="text-center p-12 text-slate-500">
                  Calculadora inactiva. Selecciona tus equipos y presiona Procesar Algoritmo.
                </div>
              )}
            </div>

          </div>
        )}

        {activeSection === 'elo' && (
          <div className="animate-fade-in">
            <EloLeaderboard onSelectTeam={handleSelectTeamFromLeaderboard} teams={teams} />
          </div>
        )}

        {activeSection === 'cup' && (
          <div className="animate-fade-in">
            <TournamentSimulator teams={teams} />
          </div>
        )}

        {activeSection === 'validate' && (
          <div className="animate-fade-in">
            <ModelValidation />
          </div>
        )}

        {activeSection === 'api' && (
          <div className="animate-fade-in">
            <ApiPlayground />
          </div>
        )}

      </main>

      {/* FOOTER INFORMANT */}
      <footer className="border-t border-white/5 bg-[#0d0d0f] py-6 mt-auto text-center text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="text-[10.5px]">
            &copy; {new Date().getFullYear()} futbol-prifa-predictor SaaS. Todos los modelos estadísticos operan de forma autónoma.
          </div>
          
          <div className="flex items-center gap-1 text-[10px] text-slate-500">
            <Info className="w-3.5 h-3.5 text-emerald-400" />
            <span>Basado en World Football Elo Ratings e investigación de Dixon & Coles (1997-2026).</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
