import React, { useState, useEffect, useRef } from 'react';
import { Team } from '../types';
import { getFlagEmoji } from '../data/teams';
import { Cpu, Tv, Play, RefreshCw, AlertTriangle, ArrowRight, CheckCircle, Flame, ShieldAlert, Award } from 'lucide-react';

interface AiSimulationCenterProps {
  teamAId: string;
  teamBId: string;
  teams: Team[];
  realResultsCount: number;
  onResultsUpdated: (newResults: any[]) => void;
  onReset: () => void;
}

export default function AiSimulationCenter({
  teamAId,
  teamBId,
  teams,
  realResultsCount,
  onResultsUpdated,
  onReset
}: AiSimulationCenterProps) {
  const teamA = teams.find(t => t.id === teamAId) || teams[0];
  const teamB = teams.find(t => t.id === teamBId) || teams[1];

  const [simStatus, setSimStatus] = useState<'idle' | 'calling' | 'playing' | 'completed' | 'error'>('idle');
  const [currentMatch, setCurrentMatch] = useState<any | null>(null);
  const [currentMinute, setCurrentMinute] = useState<number>(0);
  const [activeEvents, setActiveEvents] = useState<any[]>([]);
  const [latestEvent, setLatestEvent] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Stats running tickers
  const [runningScoreA, setRunningScoreA] = useState<number>(0);
  const [runningScoreB, setRunningScoreB] = useState<number>(0);

  const simulationInterval = useRef<any>(null);

  const handleStartSimulation = async () => {
    if (simStatus === 'playing' || simStatus === 'calling') return;

    setSimStatus('calling');
    setErrorMsg(null);
    setCurrentMinute(0);
    setActiveEvents([]);
    setLatestEvent(null);
    setRunningScoreA(0);
    setRunningScoreB(0);
    setCurrentMatch(null);

    try {
      const response = await fetch('/api/wc-results/ai-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ team1Id: teamA.id, team2Id: teamB.id })
      });

      if (!response.ok) {
        const text = await response.text();
        const cleanText = text.replace(/<[^>]*>/g, '').trim().slice(0, 150);
        throw new Error(`[HTTP ${response.status}] ${cleanText || response.statusText}`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        const cleanText = text.replace(/<[^>]*>/g, '').trim().slice(0, 150);
        throw new Error(`Respuesta no es JSON válida: ${cleanText || 'Vacía'}`);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || "Error desconocido al procesar la IA.");
      }

      const match = data.match;
      setCurrentMatch(match);
      setSimStatus('playing');

      // Start the minute ticker animation
      let minute = 0;
      simulationInterval.current = setInterval(() => {
        minute += 9; // fast simulation step (0 to 90 in 10 steps)
        if (minute > 90) {
          clearInterval(simulationInterval.current);
          setSimStatus('completed');
          
          // Finalize scoreboards exactly as generated
          setRunningScoreA(match.score1);
          setRunningScoreB(match.score2);
          
          // Pull all events
          const allTimeline = match.timeline || [];
          setActiveEvents(allTimeline);
          
          // Trigger parent refresh to load the calibrated results & update whole app!
          // We can call /api/wc-results to pull the updated full results array and notify the parent
          fetch('/api/wc-results')
            .then(async r => {
              if (!r.ok) {
                const text = await r.text();
                throw new Error(`[HTTP ${r.status}] ${text.replace(/<[^>]*>/g, '').trim().slice(0, 100)}`);
              }
              const cType = r.headers.get("content-type");
              if (!cType || !cType.includes("application/json")) {
                throw new Error("Respuesta no es JSON válida");
              }
              return r.json();
            })
            .then(resData => {
              if (resData.success) {
                onResultsUpdated(resData.results);
              }
            })
            .catch(err => {
              console.error("Error updating WC results in AI simulation:", err);
            });
          return;
        }

        setCurrentMinute(minute);

        // Filter and add events up to current minute
        const timeline = match.timeline || [];
        const happenedEvents = timeline.filter((e: any) => e.minute <= minute);
        
        // Count goals happened up to this minute
        const goalsA = happenedEvents.filter((e: any) => e.type === 'goal' && e.teamId === match.team1Id).length;
        const goalsB = happenedEvents.filter((e: any) => e.type === 'goal' && e.teamId === match.team2Id).length;
        
        setRunningScoreA(goalsA);
        setRunningScoreB(goalsB);
        setActiveEvents(happenedEvents);

        // Spot the latest new event
        if (happenedEvents.length > 0) {
          setLatestEvent(happenedEvents[happenedEvents.length - 1]);
        }
      }, 1000); // 1 second per step, total 10 seconds simulation

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "No se pudo conectar con el servicio de IA de Google.");
      setSimStatus('error');
    }
  };

  // Helper extension for promise mapping to avoid standard React ESLint issues
  useEffect(() => {
    return () => {
      if (simulationInterval.current) {
        clearInterval(simulationInterval.current);
      }
    };
  }, []);

  return (
    <div className="bg-[#111114] border border-violet-500/20 rounded-2xl p-6 shadow-2xl relative overflow-hidden" id="ai-simulation-center-card">
      
      {/* Decorative backdrop glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-600/5 rounded-full filter blur-3xl pointer-events-none" />

      {/* HEADER BAR */}
      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/10 shrink-0">
            <Cpu className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-violet-505/10 text-violet-400 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border border-violet-500/20 uppercase tracking-wider">
                Motor Predictivo Gemini 3.5.0
              </span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
              </span>
            </div>
            <h3 className="text-base font-sans font-black text-white tracking-tight mt-0.5 uppercase">
              ORÁCULO IA & SIMULADOR LIVEFEED
            </h3>
            <p className="text-xs text-slate-400 font-sans">
              Simula partidos completos en minutos con narrativas tácticas detalladas y calibración de ELO.
            </p>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-2.5">
          <button
            onClick={handleStartSimulation}
            disabled={simStatus === 'playing' || simStatus === 'calling'}
            className="px-4.5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-mono font-bold rounded-xl shadow-lg transition-all duration-350 cursor-pointer flex items-center gap-2 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed group active:scale-95 border border-violet-500/30"
          >
            {simStatus === 'calling' ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : simStatus === 'playing' ? (
              <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-pulse shrink-0" />
            ) : (
              <Play className="w-4 h-4 transition-transform group-hover:scale-110 text-emerald-400" />
            )}
            <span>
              {simStatus === 'calling' 
                ? 'Convocando Red Neuronal...' 
                : simStatus === 'playing' 
                ? `Jugando Minuto ${currentMinute}'` 
                : 'Simular Partido Completo en Vivo ✓'}
            </span>
          </button>
        </div>
      </div>

      {/* CORE DISPLAY STAGE */}
      <div className="mt-6">
        
        {/* IDLE VIEW */}
        {simStatus === 'idle' && (
          <div className="p-8 text-center bg-black/40 rounded-xl border border-white/5 flex flex-col items-center max-w-xl mx-auto space-y-4">
            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-slate-400 relative">
              <Tv className="w-6 h-6 text-slate-300" />
              <div className="absolute -bottom-1 -right-1 bg-violet-500 text-white rounded-full p-0.5">
                <Cpu className="w-3.5 h-3.5" />
              </div>
            </div>
            <div>
              <p className="text-sm font-sans font-bold text-slate-200">Simulador Alternativo Multipunto</p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                ¿Quieres auditar el comportamiento del modelo ante un marcador real provisto por la IA? Selecciona equipos en la pestaña izquierda superior y presiona el botón morado.
              </p>
            </div>
            
            <div className="flex items-center gap-3 w-full bg-slate-900/60 p-3.5 rounded-lg border border-white/5 justify-center">
              <span className="text-xl">{getFlagEmoji(teamA)}</span>
              <span className="text-xs font-mono font-bold text-slate-300">{teamA.name}</span>
              <ArrowRight className="w-3.5 h-3.5 text-violet-550" />
              <span className="text-xl">{getFlagEmoji(teamB)}</span>
              <span className="text-xs font-mono font-bold text-slate-300">{teamB.name}</span>
            </div>
          </div>
        )}

        {/* LOADING CALLING VIEW */}
        {simStatus === 'calling' && (
          <div className="p-10 text-center flex flex-col items-center justify-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-violet-500/10 border-t-violet-500 animate-spin" />
              <Cpu className="w-6 h-6 text-violet-400 absolute top-5 left-5 animate-pulse" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-mono font-bold text-slate-200">CORRIENDO SIMULACIÓN GENERATIVA</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                Gemini está analizando los descriptores ELO ({teamA.elo} vs {teamB.elo}), poder ofensivo y defensivo de los planteles y el momentum histórico para simular un partido estadísticamente probable.
              </p>
            </div>
          </div>
        )}

        {/* SIMULATING / PLAYING STAGE */}
        {(simStatus === 'playing' || simStatus === 'completed') && (
          <div className="space-y-6">
            
            {/* VIRTUAL LED SCOREBOARDBOARD */}
            <div className="bg-slate-950 rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
              <div className="p-1 px-4 bg-orange-500/10 border-b border-orange-500/10 flex items-center justify-between text-[11px] font-mono font-bold text-orange-400">
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 bg-orange-400 rounded-full animate-ping" />
                  {simStatus === 'playing' ? "TRANSMISIÓN EN VIVO MONTO" : "SIMULACIÓN COMPLETADA"}
                </span>
                <span>FECHA: {currentMatch?.date || '18 de junio, 2026'}</span>
              </div>
              
              <div className="p-6 md:p-8 flex items-center justify-between gap-4 text-center">
                {/* Team 1 info */}
                <div className="flex-1 flex flex-col items-center justify-center space-y-2">
                  <span className="text-4xl md:text-5xl filter drop-shadow-lg">{getFlagEmoji(teamA)}</span>
                  <div className="space-y-0.5">
                    <span className="text-sm md:text-base font-sans font-black text-white block">{teamA.name}</span>
                    <span className="text-[10px] font-mono text-slate-500">Rank #{teamA.fifaRanking} • ELO {teamA.elo}</span>
                  </div>
                </div>

                {/* Score numbers */}
                <div className="shrink-0 flex flex-col items-center justify-center space-y-1 bg-black/60 px-5 py-3 rounded-2xl border border-white/5 leading-none">
                  <div className="text-3xl md:text-5xl font-mono font-extrabold tracking-widest text-[#00ff88]">
                    {runningScoreA} - {runningScoreB}
                  </div>
                  <div className="text-xs font-mono font-bold text-orange-500 bg-orange-500/10 py-1 px-2.5 rounded-md uppercase tracking-tight mt-2.5">
                    {simStatus === 'playing' ? `${currentMinute}' Mins` : "FINALIZADO"}
                  </div>
                </div>

                {/* Team 2 info */}
                <div className="flex-1 flex flex-col items-center justify-center space-y-2">
                  <span className="text-4xl md:text-5xl filter drop-shadow-lg">{getFlagEmoji(teamB)}</span>
                  <div className="space-y-0.5">
                    <span className="text-sm md:text-base font-sans font-black text-white block">{teamB.name}</span>
                    <span className="text-[10px] font-mono text-slate-500">Rank #{teamB.fifaRanking} • ELO {teamB.elo}</span>
                  </div>
                </div>
              </div>

              {/* STATS PROGRESS TICKERS */}
              {currentMatch && (
                <div className="grid grid-cols-3 gap-4 px-6 md:px-8 pb-6 border-t border-white/5 pt-4 bg-slate-900/15">
                  <div className="text-center space-y-1">
                    <span className="text-[10px] font-mono text-slate-500 block uppercase">Posesión</span>
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-350">{currentMatch.possession1}%</span>
                      <div className="h-1.5 flex-1 mx-2 bg-slate-800 rounded-full overflow-hidden flex">
                        <div style={{ width: `${currentMatch.possession1}%` }} className="bg-violet-500" />
                        <div style={{ width: `${currentMatch.possession2}%` }} className="bg-cyan-500" />
                      </div>
                      <span className="text-slate-350">{currentMatch.possession2}%</span>
                    </div>
                  </div>
                  
                  <div className="text-center space-y-0.5">
                    <span className="text-[10px] font-mono text-slate-500 block uppercase">Goles Esperados (xG)</span>
                    <div className="text-xs font-mono font-bold text-slate-300">
                      {(currentMatch.xg1 * (currentMinute / 90)).toFixed(2)} - {(currentMatch.xg2 * (currentMinute / 90)).toFixed(2)}
                    </div>
                  </div>

                  <div className="text-center space-y-0.5">
                    <span className="text-[10px] font-mono text-slate-500 block uppercase">Tiros de Esquina</span>
                    <div className="text-xs font-mono font-bold text-slate-300">
                      {Math.ceil(currentMatch.corners1 * (currentMinute / 90))} - {Math.ceil(currentMatch.corners2 * (currentMinute / 90))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* LIVE COMMENTARY SCROLL */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Live events timeline log */}
              <div className="lg:col-span-7 bg-[#0d0d0f] rounded-xl border border-white/5 p-4.5 space-y-3 max-h-[300px] overflow-y-auto">
                <h4 className="text-xs font-mono font-bold text-violet-400 uppercase tracking-widest flex items-center gap-1.5 pb-2 border-b border-white/5">
                  <Play className="w-3.5 h-3.5 fill-violet-500/10 text-violet-400" />
                  REPORTE EN TIEMPO REAL COMENTANDO EL MATCH
                </h4>
                
                <div className="space-y-2.5">
                  {activeEvents.map((evt: any, i: number) => {
                    const isGoal = evt.type === 'goal';
                    const isCard = evt.type === 'card';
                    const isSave = evt.type === 'save';

                    return (
                      <div 
                        key={i} 
                        className={`p-2.5 rounded-lg text-xs leading-relaxed transition-all duration-350 flex items-start gap-2.5 ${
                          isGoal 
                            ? 'bg-emerald-500/10 border border-emerald-500/25 text-slate-200' 
                            : isCard 
                            ? 'bg-amber-500/10 border border-amber-500/25 text-slate-200'
                            : 'bg-white/[0.02] border border-white/5 text-slate-405'
                        }`}
                      >
                        <span className={`px-1.5 py-0.5 rounded font-mono font-bold text-[10px] shrink-0 ${
                          isGoal ? 'bg-emerald-500 text-black' : isCard ? 'bg-amber-500 text-black' : 'bg-white/10 text-slate-400'
                        }`}>
                          {evt.minute}'
                        </span>
                        <div>
                          {isGoal && <span className="font-sans font-bold text-emerald-400 block mb-0.5">¡¡¡GOOOOOL DE {evt.player.toUpperCase()}!!!</span>}
                          {isSave && <span className="font-sans font-semibold text-cyan-400 block mb-0.5">¡Gran Atajada! ({evt.player})</span>}
                          {isCard && <span className="font-sans font-semibold text-amber-500 block mb-0.5">Tarjeta Arbitral ({evt.player})</span>}
                          <p className="text-slate-300 font-sans">{evt.description}</p>
                        </div>
                      </div>
                    );
                  })}
                  {activeEvents.length === 0 && (
                    <div className="p-8 text-center text-xs font-sans text-slate-500">
                      Esperando pitido inicial del silbato del árbitro...
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: AI Oracle Decisions & Metrics */}
              <div className="lg:col-span-5 flex flex-col justify-between gap-4">
                
                {/* AI Tactical Summary */}
                <div className="bg-[#121115] border border-white/5 rounded-xl p-4.5 space-y-1.5 flex-1">
                  <h4 className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-orange-400" />
                    ANÁLISIS TÁCTICO DE LA IA
                  </h4>
                  {simStatus === 'playing' ? (
                    <div className="text-xs text-slate-500 font-sans italic leading-relaxed py-4">
                      Compilando micro-movimientos sobre el campo. Generando matriz de posesión y xG ponderado...
                    </div>
                  ) : (
                    <p className="text-xs text-slate-350 font-sans leading-relaxed">
                      {currentMatch?.aiTacticalSummary || "No disponible."}
                    </p>
                  )}
                </div>

                {/* AI Strategic Decision (Or Oracle recommendation) */}
                <div className="bg-violet-950/20 border border-violet-500/15 rounded-xl p-4.5 space-y-1.5 flex-1">
                  <h4 className="text-xs font-mono font-bold text-violet-400 uppercase flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-violet-400" />
                    RECOMENDACIÓN Y DECISIÓN DE LA IA
                  </h4>
                  {simStatus === 'playing' ? (
                    <div className="text-xs text-slate-550 font-sans italic leading-relaxed py-4">
                      Analizando probabilidades de coeficiente ELO y reclasificando campeones potenciales...
                    </div>
                  ) : (
                    <p className="text-xs text-slate-300 font-sans leading-relaxed italic border-l-2 border-violet-500 pl-2.5">
                      {currentMatch?.aiStrategicDecision || "No disponible."}
                    </p>
                  )}
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ERROR SCREEN */}
        {simStatus === 'error' && (
          <div className="p-8 bg-red-950/25 border border-red-500/20 rounded-xl space-y-4 text-center max-w-xl mx-auto">
            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-mono font-bold text-slate-205">ERROR EN INTERFAZ ORÁCULO DE IA DE GEMINI</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                {errorMsg}
              </p>
              <div className="mt-4 p-3 bg-black/60 rounded-lg text-left text-[11px] font-mono text-slate-400 max-w-lg mx-auto border border-white/5 space-y-2">
                <span className="text-red-400 font-bold block">💡 Solución recomendada:</span>
                <p>Las llamadas a la API de IA requieren que configures tu clave API personal de Gemini. Sigue estos pasos sencillos:</p>
                <ol className="list-decimal pl-4.5 space-y-1 mt-1 text-[10.5px]">
                  <li>Ve al menú de <strong className="text-white">Settings</strong> arriba en la barra de tu espacio de trabajo.</li>
                  <li>Selecciona la opción de <strong className="text-white">Secrets</strong>.</li>
                  <li>Añade una variable llamada <strong className="text-cyan-400 select-all">GEMINI_API_KEY</strong> y pega tu clave.</li>
                </ol>
              </div>
            </div>
            
            <button
              onClick={handleStartSimulation}
              className="px-4.5 py-2 bg-red-500 hover:bg-red-405 text-white font-mono text-xs rounded-lg cursor-pointer"
            >
              Reintentar Conexión
            </button>
          </div>
        )}

      </div>
      
    </div>
  );
}
