import React, { useState } from 'react';
import { TEAMS } from '../data/teams';
import { PredictorEngine } from '../engine/PredictorEngine';
import { Send, Terminal, Code, Copy, CheckCircle } from 'lucide-react';

export default function ApiPlayground() {
  const [activeEndpoint, setActiveEndpoint] = useState<string>('GET /predict');
  const [selectedLocal, setSelectedLocal] = useState('arg');
  const [selectedVisitor, setSelectedVisitor] = useState('fra');
  
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const endpoints = [
    { name: 'GET /predict', desc: 'Predecir resultado entre dos equipos usando ensamble multicapa.' },
    { name: 'POST /predict', desc: 'Predecir lote de partidos o simulación avanzada por POST payload.' },
    { name: 'GET /team', desc: 'Obtener estadísticas detalladas, edad, forma y poderes xG de un plantel.' },
    { name: 'GET /elo', desc: 'Ranking de ratings mundiales Elo filtrado opcionalmente por continente.' },
    { name: 'GET /simulation', desc: 'Consultar registro de simulación Monte Carlo por ID.' },
    { name: 'GET /world-cup', desc: 'Grupos, seccione clasificados e historial de seeding FIFA 2026.' },
    { name: 'GET /champion-odds', desc: 'Probabilidades agregadas de consagración de campeón mundial.' }
  ];

  const handleCopyCode = () => {
    const code = getCodeSnippet();
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCodeSnippet = () => {
    switch (activeEndpoint) {
      case 'GET /predict':
        return `curl -X GET "https://api.futbol-ai-predictor.com/v1/predict?local=${selectedLocal}&visitor=${selectedVisitor}&simulations=100000" \\\n  -H "Authorization: Bearer YOUR_AI_STUDIO_API_KEY"`;
      case 'POST /predict':
        return `curl -X POST "https://api.futbol-ai-predictor.com/v1/predict" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "localId": "${selectedLocal}",\n    "visitorId": "${selectedVisitor}",\n    "isNeutralSelection": true,\n    "simulationIterCount": 500000\n  }'`;
      case 'GET /team':
        return `curl -X GET "https://api.futbol-ai-predictor.com/v1/team?id=${selectedLocal}"`;
      case 'GET /elo':
        return `curl -X GET "https://api.futbol-ai-predictor.com/v1/elo?continent=CONMEBOL"`;
      case 'GET /simulation':
        return `curl -X GET "https://api.futbol-ai-predictor.com/v1/simulation?id=sim_mc_987x1"`;
      case 'GET /world-cup':
        return `curl -X GET "https://api.futbol-ai-predictor.com/v1/world-cup"`;
      case 'GET /champion-odds':
        return `curl -X GET "https://api.futbol-ai-predictor.com/v1/champion-odds?trials=100000"`;
      default:
        return 'curl -X GET "https://api.futbol-ai-predictor.com"';
    }
  };

  const runSimulatedRequest = () => {
    setLoading(true);
    setApiResponse(null);

    setTimeout(() => {
      let payload: any = {};
      
      const teamAObj = TEAMS.find(t => t.id === selectedLocal) || TEAMS[0];
      const teamBObj = TEAMS.find(t => t.id === selectedVisitor) || TEAMS[1];

      switch (activeEndpoint) {
        case 'GET /predict':
        case 'POST /predict':
          const pred = PredictorEngine.predict({
            teamAId: teamAObj.id,
            teamBId: teamBObj.id,
            isNeutral: true,
            simulationCount: 1000,
            isKnockout: false
          }, TEAMS);
          
          payload = {
            status: 'success',
            timestamp: new Date().toISOString(),
            model_layers: {
              active_ensembles: 9,
              meta_stacking_logloss: 0.612,
              brier_score_calibration: 0.178
            },
            matchup: {
              local: { id: teamAObj.id, name: teamAObj.name, elo: teamAObj.elo },
              visitor: { id: teamBObj.id, name: teamBObj.name, elo: teamBObj.elo }
            },
            probabilities: {
              win_local: parseFloat(pred.probA.toFixed(4)),
              draw: parseFloat(pred.probDraw.toFixed(4)),
              win_visitor: parseFloat(pred.probB.toFixed(4)),
              btts_yes: parseFloat(pred.btts.toFixed(4))
            },
            goals_expected: {
              local_xg: pred.xGA,
              visitor_xg: pred.xGB
            },
            simulation_summary: {
              trials_run: 1000,
              most_probable_score: `${pred.mostProbableScore.scoreA}-${pred.mostProbableScore.scoreB}`,
              top_scores: pred.topScores.slice(0, 3).map(s => ({ score: `${s.scoreA}-${s.scoreB}`, prob: parseFloat(s.prob.toFixed(4)) }))
            }
          };
          break;

        case 'GET /team':
          payload = {
            status: 'success',
            team: teamAObj
          };
          break;

        case 'GET /elo':
          payload = {
            status: 'success',
            leaderboard_size: 4,
            rankings: TEAMS.slice(0, 4).map(t => ({ id: t.id, name: t.name, elo: t.elo, spi: t.spi }))
          };
          break;

        case 'GET /simulation':
          payload = {
            status: 'success',
            simulation_id: 'sim_mc_987x1',
            creation: new Date().toISOString(),
            state: 'COMPLETED',
            parameters: { trials: 100000, match_type: 'KNOCKOUT' },
            winner: teamAObj.name
          };
          break;

        case 'GET /world-cup':
          payload = {
            status: 'success',
            total_groups: 8,
            qualified_teams: 48,
            seeding_date: '2026-06-16'
          };
          break;

        case 'GET /champion-odds':
          payload = {
            status: 'success',
            simulations_run: 100000,
            odds: TEAMS.slice(0, 5).map((t, i) => ({ team: t.name, prob: (0.15 - i * 0.02).toFixed(4) }))
          };
          break;

        default:
          payload = { message: 'Endpoint no mapeado.' };
      }

      setApiResponse(JSON.stringify(payload, null, 2));
      setLoading(false);
    }, 450);
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 p-6 shadow-xl space-y-6" id="api-playground-root">
      
      {/* SECTION HEADER */}
      <div>
        <h3 className="text-lg font-sans font-bold text-white flex items-center gap-2">
          <Terminal className="w-5 h-5 text-indigo-400" />
          FUTBOL AI PREDICTOR — DESARROLLADORES REST API PLAYGROUND
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Integra predicciones deportivas precisas en tus propios sistemas o software de apuestas mediante nuestra documentación interactiva para desarrolladores SaaS.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ENDPOINT SELECTORS LIST */}
        <div className="lg:col-span-4 space-y-2.5">
          <span className="text-[10px] font-mono text-slate-500 font-bold uppercase block">
            Endpoints del Servidor AI
          </span>
          
          <div className="space-y-2">
            {endpoints.map((ep, idx) => {
              const isActive = activeEndpoint === ep.name;
              const isGet = ep.name.startsWith('GET');
              
              return (
                <div
                  key={idx}
                  onClick={() => {
                    setActiveEndpoint(ep.name);
                    setApiResponse(null);
                  }}
                  className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${isActive ? 'bg-indigo-950/40 border-indigo-500/60' : 'bg-slate-950/40 border-slate-850 hover:border-slate-800'}`}
                >
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded leading-none ${isGet ? 'bg-sky-500/10 text-sky-400' : 'bg-pink-500/10 text-pink-400'}`}>
                    {isGet ? 'GET' : 'POST'}
                  </span>
                  <span className="text-xs font-mono font-bold text-white ml-2">
                    {ep.name.split(' ')[1]}
                  </span>
                  <p className="text-[10.5px] text-slate-400 mt-1 font-sans">
                    {ep.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* INPUT SELECTION AND TERMINAL CONSOLE */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Quick parameter selection */}
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-850 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-slate-400 uppercase font-semibold">Parámetros locales:</span>
              <div className="flex gap-2">
                <select
                  value={selectedLocal}
                  onChange={(e) => {
                    setSelectedLocal(e.target.value);
                    setApiResponse(null);
                  }}
                  className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white cursor-pointer font-sans"
                >
                  {TEAMS.slice(0, 10).map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>

                <select
                  value={selectedVisitor}
                  onChange={(e) => {
                    setSelectedVisitor(e.target.value);
                    setApiResponse(null);
                  }}
                  className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white cursor-pointer font-sans"
                >
                  {TEAMS.slice(0, 10).map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={runSimulatedRequest}
              disabled={loading}
              className="py-1.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all shadow cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{loading ? 'POSTING...' : 'EJECUTAR REQUEST'}</span>
            </button>
          </div>

          {/* CURL CONSOLE */}
          <div className="bg-slate-950 rounded-xl border border-slate-850 overflow-hidden relative">
            <div className="bg-slate-900 px-4 py-2 border-b border-slate-850 flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-400 font-bold uppercase flex items-center gap-2">
                <Code className="w-4 h-4 text-sky-400" />
                COMANDO CURL DE PETICIÓN
              </span>
              
              <button
                onClick={handleCopyCode}
                className="text-slate-400 hover:text-white transition-colors p-1"
                title="Copiar comando"
              >
                {copied ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            
            <pre className="p-4 overflow-x-auto text-[11px] font-mono text-slate-300 leading-relaxed bg-slate-950/80">
              <code>{getCodeSnippet()}</code>
            </pre>
          </div>

          {/* RESPONSE TERMINAL */}
          <div className="bg-slate-950 rounded-xl border border-slate-850 overflow-hidden relative min-h-[150px]">
            <div className="bg-slate-900 px-4 py-2 border-b border-slate-850 flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-400 font-bold uppercase flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                RESPUESTA DEL SERVIDOR JSON (200 OK)
              </span>
            </div>
            
            {loading ? (
              <div className="p-8 text-center text-xs font-mono text-slate-500 animate-pulse">
                Procesando modelo Dixon-Coles y simulación Monte Carlo para JSON response...
              </div>
            ) : apiResponse ? (
              <pre className="p-4 overflow-x-auto text-[11px] font-mono text-emerald-300 leading-relaxed bg-black/60 max-h-80">
                <code>{apiResponse}</code>
              </pre>
            ) : (
              <div className="p-8 text-center text-xs font-mono text-slate-500 italic">
                Ninguna solicitud activa. Presiona "EJECUTAR REQUEST" arriba para simular la petición REST real.
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
