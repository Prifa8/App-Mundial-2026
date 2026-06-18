import React, { useState } from 'react';
import { TEAMS, WC_2026_SIMULATION_GROUPS, getFlagEmoji } from '../data/teams';
import { Team } from '../types';
import { PredictorEngine } from '../engine/PredictorEngine';
import { Play, RotateCcw, Award, ChevronRight, BarChart3, HelpCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { WC_2026_REAL_RESULTS } from '../data/wc2026Results';

interface StandingRow {
  team: Team;
  points: number;
  gf: number;
  ga: number;
  gd: number;
  wins: number;
  draws: number;
  losses: number;
  firstCount: number;
  qualifyCount: number;
  champCount: number;
}

interface ConcreteStanding {
  team: Team;
  pts: number;
  pj: number;
  pg: number;
  pe: number;
  pp: number;
  gf: number;
  ga: number;
  gd: number;
}

interface ConcreteThirdPlaced {
  team: Team;
  groupName: string;
  pts: number;
  pj: number;
  pg: number;
  pe: number;
  pp: number;
  gf: number;
  ga: number;
  gd: number;
  qualified: boolean;
}

interface KnockoutMatch {
  id: string;
  label: string;
  teamA: Team;
  teamB: Team;
  scoreA: number;
  scoreB: number;
  overtimeScoreA?: number;
  overtimeScoreB?: number;
  penaltiesScoreA?: number;
  penaltiesScoreB?: number;
  winner: Team;
}

export default function TournamentSimulator({ teams }: { teams: Team[] }) {
  const [selectedGroupName, setSelectedGroupName] = useState('Grupo A');
  const [groupStandings, setGroupStandings] = useState<Record<string, StandingRow[]>>({});
  const [isSimulatingGroup, setIsSimulatingGroup] = useState(false);
  const [conditionOnRealResults, setConditionOnRealResults] = useState(true);
  
  // Knockout playoff simulation values (Monte Carlo summary fallback)
  const [playoffsOutcome, setPlayoffsOutcome] = useState<any | null>(null);

  // Full Tournament Live Simulation States
  const [fullTourState, setFullTourState] = useState<'idle' | 'simulating' | 'done'>('idle');
  const [fullTourStandings, setFullTourStandings] = useState<Record<string, ConcreteStanding[]>>({});
  const [fullTourThirds, setFullTourThirds] = useState<ConcreteThirdPlaced[]>([]);
  const [fullTourR32, setFullTourR32] = useState<KnockoutMatch[]>([]);
  const [fullTourR16, setFullTourR16] = useState<KnockoutMatch[]>([]);
  const [fullTourQF, setFullTourQF] = useState<KnockoutMatch[]>([]);
  const [fullTourSF, setFullTourSF] = useState<KnockoutMatch[]>([]);
  const [fullTourFinal, setFullTourFinal] = useState<KnockoutMatch | null>(null);
  const [fullTourChampion, setFullTourChampion] = useState<Team | null>(null);
  const [activeTab, setActiveTab] = useState<'groups' | 'thirds' | 'bracket'>('bracket');
  const [activeBracketRound, setActiveBracketRound] = useState<'r32' | 'r16' | 'qf' | 'sf' | 'final'>('r32');

  const activeGroup = WC_2026_SIMULATION_GROUPS.find(g => g.name === selectedGroupName)!;
  const activeGroupTeams = activeGroup.teams.map(id => teams.find(t => t.id === id) || TEAMS.find(t => t.id === id)!);

  /**
   * Ejecuta 5,000 simulaciones Monte Carlo del Grupo seleccionado para obtener standings probabilísticos reales
   */
  const handleSimulateGroup = () => {
    setIsSimulatingGroup(true);
    
    setTimeout(() => {
      const teamsInGroup = activeGroup.teams.map(id => teams.find(t => t.id === id) || TEAMS.find(t => t.id === id)!);
      const simTrials = 5000;
      
      // Initialize tally matrices for each team
      const tally: Record<string, { points: number[], gf: number, ga: number, wins: number, draws: number, losses: number, firsts: number, qualifies: number }> = {};
      teamsInGroup.forEach(t => {
        tally[t.id] = { points: [], gf: 0, ga: 0, wins: 0, draws: 0, losses: 0, firsts: 0, qualifies: 0 };
      });

      // Match pairings for a round-robin (6 matches)
      // [0 vs 1], [2 vs 3], [0 vs 2], [1 vs 3], [0 vs 3], [1 vs 2]
      const matches = [
        [0, 1], [2, 3],
        [0, 2], [1, 3],
        [0, 3], [1, 2]
      ];

      // Run Monte Carlo Trials
      for (let trial = 0; trial < simTrials; trial++) {
        const trialStandings: Record<string, { pts: number, gf: number, ga: number, wins: number, draws: number, losses: number }> = {};
        teamsInGroup.forEach(t => {
          trialStandings[t.id] = { pts: 0, gf: 0, ga: 0, wins: 0, draws: 0, losses: 0 };
        });

        // Simulate each match in this trial
        matches.forEach(([idxA, idxB]) => {
          const teamA = teamsInGroup[idxA];
          const teamB = teamsInGroup[idxB];

          let scoreA = 0;
          let scoreB = 0;

          // If toggle is enabled, check if match was played in real life and lock-it!
          const realMatch = conditionOnRealResults ? WC_2026_REAL_RESULTS.find(
            rm => (rm.team1Id === teamA.id && rm.team2Id === teamB.id) ||
                  (rm.team1Id === teamB.id && rm.team2Id === teamA.id)
          ) : undefined;

          if (realMatch) {
            if (realMatch.team1Id === teamA.id) {
              scoreA = realMatch.score1;
              scoreB = realMatch.score2;
            } else {
              scoreA = realMatch.score2;
              scoreB = realMatch.score1;
            }
          } else {
            // Compute expected goals under true Monte Carlo sampling
            // Home field advantage is disabled since World Cup is neutral for neutral groups
            const out = PredictorEngine.predict({
              teamAId: teamA.id,
              teamBId: teamB.id,
              isNeutral: true,
              simulationCount: 1, // sample one match for this Monte Carlo trial
              isKnockout: false
            }, teams);

            scoreA = out.simulatedHistA[0] !== undefined ? out.simulatedHistA[0] : out.mostProbableScore.scoreA;
            scoreB = out.simulatedHistB[0] !== undefined ? out.simulatedHistB[0] : out.mostProbableScore.scoreB;
          }

          // Record goals
          trialStandings[teamA.id].gf += scoreA;
          trialStandings[teamA.id].ga += scoreB;
          trialStandings[teamB.id].gf += scoreB;
          trialStandings[teamB.id].ga += scoreA;

          if (scoreA > scoreB) {
            trialStandings[teamA.id].pts += 3;
            trialStandings[teamA.id].wins += 1;
            trialStandings[teamB.id].losses += 1;
          } else if (scoreA < scoreB) {
            trialStandings[teamB.id].pts += 3;
            trialStandings[teamB.id].wins += 1;
            trialStandings[teamA.id].losses += 1;
          } else {
            trialStandings[teamA.id].pts += 1;
            trialStandings[teamB.id].pts += 1;
            trialStandings[teamA.id].draws += 1;
            trialStandings[teamB.id].draws += 1;
          }
        });

        // Sort standing table of this trial to establish places
        const trialSorted = Object.keys(trialStandings).map(tid => ({
          teamId: tid,
          ...trialStandings[tid],
          gd: trialStandings[tid].gf - trialStandings[tid].ga
        })).sort((a, b) => {
          if (b.pts !== a.pts) return b.pts - a.pts;
          if (b.gd !== a.gd) return b.gd - a.gd;
          return b.gf - a.gf;
        });

        // Tally results
        trialSorted.forEach((row, idx) => {
          const tId = row.teamId;
          tally[tId].points.push(row.pts);
          tally[tId].gf += row.gf;
          tally[tId].ga += row.ga;
          tally[tId].wins += row.wins;
          tally[tId].draws += row.draws;
          tally[tId].losses += row.losses;

          if (idx === 0) tally[tId].firsts++;
          if (idx < 2) tally[tId].qualifies++;
        });
      }

      // Compile averaged standing row results
      const finalStandingsRows: StandingRow[] = teamsInGroup.map(t => {
        const stats = tally[t.id];
        const sumPoints = stats.points.reduce((a, b) => a + b, 0);
        
        return {
          team: t,
          points: parseFloat((sumPoints / simTrials).toFixed(1)),
          gf: parseFloat((stats.gf / simTrials).toFixed(1)),
          ga: parseFloat((stats.ga / simTrials).toFixed(1)),
          gd: parseFloat(((stats.gf - stats.ga) / simTrials).toFixed(1)),
          wins: parseFloat((stats.wins / simTrials).toFixed(1)),
          draws: parseFloat((stats.draws / simTrials).toFixed(1)),
          losses: parseFloat((stats.losses / simTrials).toFixed(1)),
          firstCount: stats.firsts / simTrials,
          qualifyCount: stats.qualifies / simTrials,
          champCount: 0 // Will remain 0 on group level
        };
      }).sort((a, b) => b.firstCount - a.firstCount); // Sorted by probability of 1st place!

      setGroupStandings({
        ...groupStandings,
        [selectedGroupName]: finalStandingsRows
      });
      setIsSimulatingGroup(false);
    }, 400);
  };

  /**
   * Simula un recorrido real de la Copa Mundial de la FIFA 2026 de 48 equipos en vivo!
   * Simula los matches de fase de grupos (72 partidos), extrae y ordena los terceros puestos,
   * arma los emparejamientos dinámicos de Dieciseisavos de Final (32 selecciones) y juega
   * las llaves eliminatorias directas hasta obtener al Campeón del Mundo.
   */
  const handleSimulateFullTournament = () => {
    setFullTourState('simulating');
    
    // Helper para muestreo de Poisson
    const samplePoissonLocal = (lambda: number): number => {
      const L = Math.exp(-lambda);
      let k = 0;
      let p = 1;
      do {
        k++;
        p *= Math.random();
      } while (p > L);
      return k - 1;
    };

    const standings: Record<string, ConcreteStanding[]> = {};
    const thirds: ConcreteThirdPlaced[] = [];
    
    // 1. Simular Fase de Grupos (12 Grupos x 4 equipos = 48 equipos)
    WC_2026_SIMULATION_GROUPS.forEach(g => {
      const groupTeams = g.teams.map(id => teams.find(t => t.id === id) || TEAMS.find(t => t.id === id)!);
      
      const teamRecords: Record<string, ConcreteStanding> = {};
      groupTeams.forEach(t => {
        teamRecords[t.id] = { team: t, pts: 0, pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, ga: 0, gd: 0 };
      });
      
      const pairings = [
        [0, 1], [2, 3],
        [0, 2], [1, 3],
        [0, 3], [1, 2]
      ];
      
      pairings.forEach(([idxA, idxB]) => {
        const teamA = groupTeams[idxA];
        const teamB = groupTeams[idxB];
        
        let scoreA = 0;
        let scoreB = 0;
        
        // Comprobar si hay un resultado de partido oficial jugado real
        const realMatch = conditionOnRealResults ? WC_2026_REAL_RESULTS.find(
          m => (m.team1Id === teamA.id && m.team2Id === teamB.id) || (m.team1Id === teamB.id && m.team2Id === teamA.id)
        ) : null;
        
        if (realMatch) {
          if (realMatch.team1Id === teamA.id) {
            scoreA = realMatch.score1;
            scoreB = realMatch.score2;
          } else {
            scoreA = realMatch.score2;
            scoreB = realMatch.score1;
          }
        } else {
          // Modelar mediante regresión Dixon-Coles en PredictorEngine
          const pred = PredictorEngine.predict({
            teamAId: teamA.id,
            teamBId: teamB.id,
            isNeutral: true,
            simulationCount: 1,
            isKnockout: false
          }, teams);
          scoreA = pred.simulatedHistA[0] !== undefined ? pred.simulatedHistA[0] : pred.mostProbableScore.scoreA;
          scoreB = pred.simulatedHistB[0] !== undefined ? pred.simulatedHistB[0] : pred.mostProbableScore.scoreB;
        }
        
        // Actualizar registros del grupo
        const recA = teamRecords[teamA.id];
        const recB = teamRecords[teamB.id];
        recA.pj += 1;
        recB.pj += 1;
        recA.gf += scoreA;
        recA.ga += scoreB;
        recB.gf += scoreB;
        recB.ga += scoreA;
        recA.gd = recA.gf - recA.ga;
        recB.gd = recB.gf - recB.ga;
        
        if (scoreA > scoreB) {
          recA.pg += 1;
          recA.pts += 3;
          recB.pp += 1;
        } else if (scoreA < scoreB) {
          recB.pg += 1;
          recB.pts += 3;
          recA.pp += 1;
        } else {
          recA.pe += 1;
          recB.pe += 1;
          recA.pts += 1;
          recB.pts += 1;
        }
      });
      
      // Clasificación del Grupo usando Reglas FIFA: PTS > GD > GF > ELO Rating (para desempates definitivos)
      const sortedGroup = Object.values(teamRecords).sort((a, b) => {
        if (b.pts !== a.pts) return b.pts - a.pts;
        if (b.gd !== a.gd) return b.gd - a.gd;
        if (b.gf !== a.gf) return b.gf - a.gf;
        return b.team.elo - a.team.elo;
      });
      
      standings[g.name] = sortedGroup;
      
      // Enviar el 3er clasificado para ranking general de terceros
      const thirdPlaceRec = sortedGroup[2];
      thirds.push({
        ...thirdPlaceRec,
        groupName: g.name,
        qualified: false
      });
    });
    
    // 2. Ordenar y clasificar la "Tabla de Terceros" (Clasifican mejores 8 de los de 12 grupos)
    thirds.sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts;
      if (b.gd !== a.gd) return b.gd - a.gd;
      if (b.gf !== a.gf) return b.gf - a.gf;
      return b.team.elo - a.team.elo;
    });
    
    for (let i = 0; i < 12; i++) {
      if (i < 8) thirds[i].qualified = true;
    }
    
    const best8Thirds = thirds.slice(0, 8);
    
    // 3. Organizar Dieciseisavos de Final (Round of 32)
    // Los ganadores de los grupos E, I, A, L, G, D, B, K se emparejan con los 3ros de forma que no jueguen contra su propio grupo!
    const winnersPlayingThirds = [
      { groupCode: 'E', groupName: 'Grupo E' },
      { groupCode: 'I', groupName: 'Grupo I' },
      { groupCode: 'A', groupName: 'Grupo A' },
      { groupCode: 'L', groupName: 'Grupo L' },
      { groupCode: 'G', groupName: 'Grupo G' },
      { groupCode: 'D', groupName: 'Grupo D' },
      { groupCode: 'B', groupName: 'Grupo B' },
      { groupCode: 'K', groupName: 'Grupo K' },
    ];
    
    const thirdPlacedAssigned: Record<string, Team> = {};
    const usedThirdTeamIds = new Set<string>();
    
    winnersPlayingThirds.forEach(w => {
      // Intentar encontrar un 3ro elegible que no sea del mismo grupo ni haya sido ya asignado
      const eligible3rd = best8Thirds.find(t => t.groupName !== w.groupName && !usedThirdTeamIds.has(t.team.id));
      if (eligible3rd) {
        thirdPlacedAssigned[w.groupName] = eligible3rd.team;
        usedThirdTeamIds.add(eligible3rd.team.id);
      } else {
        // Fallback rápido si se agotan opciones (rara vez en desempates restrictivos)
        const fallback3rd = best8Thirds.find(t => !usedThirdTeamIds.has(t.team.id));
        if (fallback3rd) {
          thirdPlacedAssigned[w.groupName] = fallback3rd.team;
          usedThirdTeamIds.add(fallback3rd.team.id);
        }
      }
    });
    
    // Auxiliares para extraer ganadores y segundos lugares en standings de simulación
    const getWinner = (code: string) => standings[`Grupo ${code}`][0].team;
    const getRunnerUp = (code: string) => standings[`Grupo ${code}`][1].team;
    const getThirdAssigned = (code: string) => thirdPlacedAssigned[`Grupo ${code}`] || standings[`Grupo ${code}`][2].team;
    
    // Jugar un partido eliminatorio (Tiempos extras de 30 min y tanda de penales si persiste el empate)
    const playKnockoutGame = (id: string, label: string, teamA: Team, teamB: Team): KnockoutMatch => {
      const pred = PredictorEngine.predict({
        teamAId: teamA.id,
        teamBId: teamB.id,
        isNeutral: true,
        simulationCount: 1,
        isKnockout: true
      }, teams);
      
      let baseScoreA = pred.simulatedHistA[0] !== undefined ? pred.simulatedHistA[0] : pred.mostProbableScore.scoreA;
      let baseScoreB = pred.simulatedHistB[0] !== undefined ? pred.simulatedHistB[0] : pred.mostProbableScore.scoreB;
      
      let matchRes: KnockoutMatch = {
        id,
        label,
        teamA,
        teamB,
        scoreA: baseScoreA,
        scoreB: baseScoreB,
        winner: teamA
      };
      
      if (baseScoreA > baseScoreB) {
        matchRes.winner = teamA;
      } else if (baseScoreA < baseScoreB) {
        matchRes.winner = teamB;
      } else {
        // Tiempo Extra (OT)
        const otGoalsA = samplePoissonLocal(pred.xGA * 0.33);
        const otGoalsB = samplePoissonLocal(pred.xGB * 0.33);
        
        matchRes.overtimeScoreA = baseScoreA + otGoalsA;
        matchRes.overtimeScoreB = baseScoreB + otGoalsB;
        
        if (matchRes.overtimeScoreA > matchRes.overtimeScoreB) {
          matchRes.winner = teamA;
        } else if (matchRes.overtimeScoreA < matchRes.overtimeScoreB) {
          matchRes.winner = teamB;
        } else {
          // Tanda de Penales
          const skillGap = (teamA.elo - teamB.elo) / 600 + (teamA.momentum - teamB.momentum) * 0.1;
          const probFactorA = 0.5 + Math.min(0.2, Math.max(-0.2, skillGap));
          
          let pensA = 0;
          let pensB = 0;
          
          while (pensA === pensB) {
            pensA = 0;
            pensB = 0;
            for (let i = 0; i < 5; i++) {
              if (Math.random() < 0.75 + probFactorA * 0.05) pensA++;
              if (Math.random() < 0.75 - probFactorA * 0.05) pensB++;
            }
            if (pensA === pensB) {
              for (let round = 0; round < 10; round++) {
                const shotA = Math.random() < 0.72 + probFactorA * 0.05 ? 1 : 0;
                const shotB = Math.random() < 0.72 - probFactorA * 0.05 ? 1 : 0;
                if (shotA !== shotB) {
                  pensA += shotA;
                  pensB += shotB;
                  break;
                }
              }
              if (pensA === pensB) {
                if (Math.random() < 0.5 + probFactorA * 0.1) pensA++;
                else pensB++;
              }
            }
          }
          
          matchRes.penaltiesScoreA = pensA;
          matchRes.penaltiesScoreB = pensB;
          matchRes.winner = pensA > pensB ? teamA : teamB;
        }
      }
      return matchRes;
    };
    
    // Cuadro oficial de Dieciseisavos de Final (32 equipos):
    const r32PairConfigs = [
      { id: 'R32-1', label: '2A vs 2B', teamA: getRunnerUp('A'), teamB: getRunnerUp('B') },
      { id: 'R32-2', label: '1C vs 2F', teamA: getWinner('C'), teamB: getRunnerUp('F') },
      { id: 'R32-3', label: '1E vs 3er puesto', teamA: getWinner('E'), teamB: getThirdAssigned('E') },
      { id: 'R32-4', label: '1F vs 2C', teamA: getWinner('F'), teamB: getRunnerUp('C') },
      { id: 'R32-5', label: '2E vs 2I', teamA: getRunnerUp('E'), teamB: getRunnerUp('I') },
      { id: 'R32-6', label: '1I vs 3er puesto', teamA: getWinner('I'), teamB: getThirdAssigned('I') },
      { id: 'R32-7', label: '1A vs 3er puesto', teamA: getWinner('A'), teamB: getThirdAssigned('A') },
      { id: 'R32-8', label: '1L vs 3er puesto', teamA: getWinner('L'), teamB: getThirdAssigned('L') },
      { id: 'R32-9', label: '1G vs 3er puesto', teamA: getWinner('G'), teamB: getThirdAssigned('G') },
      { id: 'R32-10', label: '1D vs 3er puesto', teamA: getWinner('D'), teamB: getThirdAssigned('D') },
      { id: 'R32-11', label: '1H vs 2J', teamA: getWinner('H'), teamB: getRunnerUp('J') },
      { id: 'R32-12', label: '2K vs 2L', teamA: getRunnerUp('K'), teamB: getRunnerUp('L') },
      { id: 'R32-13', label: '1B vs 3er puesto', teamA: getWinner('B'), teamB: getThirdAssigned('B') },
      { id: 'R32-14', label: '2D vs 2G', teamA: getRunnerUp('D'), teamB: getRunnerUp('G') },
      { id: 'R32-15', label: '1J vs 2H', teamA: getWinner('J'), teamB: getRunnerUp('H') },
      { id: 'R32-16', label: '1K vs 3er puesto', teamA: getWinner('K'), teamB: getThirdAssigned('K') },
    ];
    
    // Simular Dieciseisavos
    const r32Outcomes = r32PairConfigs.map(cfg => playKnockoutGame(cfg.id, cfg.label, cfg.teamA, cfg.teamB));
    
    // Simular Octavos de Final (G73-G88 representan los Dieciseisavos según la estructura oficial)
    const r16PairConfigs = [
      { id: 'R16-1', label: 'G73 vs G75 (P7 o P8)', teamA: r32Outcomes[6].winner, teamB: r32Outcomes[7].winner },
      { id: 'R16-2', label: 'G74 vs G77 (P1 o P5)', teamA: r32Outcomes[0].winner, teamB: r32Outcomes[4].winner },
      { id: 'R16-3', label: 'G76 vs G78 (P4 o P6)', teamA: r32Outcomes[3].winner, teamB: r32Outcomes[5].winner },
      { id: 'R16-4', label: 'G79 vs G80 (P2 o P3)', teamA: r32Outcomes[1].winner, teamB: r32Outcomes[2].winner },
      { id: 'R16-5', label: 'G83 vs G84 (P11 o P12)', teamA: r32Outcomes[10].winner, teamB: r32Outcomes[11].winner },
      { id: 'R16-6', label: 'G81 vs G82 (P9 o P10)', teamA: r32Outcomes[8].winner, teamB: r32Outcomes[9].winner },
      { id: 'R16-7', label: 'G86 vs G88 (P14 o P16)', teamA: r32Outcomes[13].winner, teamB: r32Outcomes[15].winner },
      { id: 'R16-8', label: 'G85 vs G87 (P13 o P15)', teamA: r32Outcomes[12].winner, teamB: r32Outcomes[14].winner },
    ];
    const r16Outcomes = r16PairConfigs.map(cfg => playKnockoutGame(cfg.id, cfg.label, cfg.teamA, cfg.teamB));
    
    // Simular Cuartos de Final
    const qfPairConfigs = [
      { id: 'QF-1', label: 'Ganador Octavos 1 vs 4', teamA: r16Outcomes[0].winner, teamB: r16Outcomes[3].winner },
      { id: 'QF-2', label: 'Ganador Octavos 2 vs 3', teamA: r16Outcomes[1].winner, teamB: r16Outcomes[2].winner },
      { id: 'QF-3', label: 'Ganador Octavos 5 vs 6', teamA: r16Outcomes[4].winner, teamB: r16Outcomes[5].winner },
      { id: 'QF-4', label: 'Ganador Octavos 7 vs 8', teamA: r16Outcomes[6].winner, teamB: r16Outcomes[7].winner },
    ];
    const qfOutcomes = qfPairConfigs.map(cfg => playKnockoutGame(cfg.id, cfg.label, cfg.teamA, cfg.teamB));
    
    // Simular Semifinales
    const sfPairConfigs = [
      { id: 'SF-1', label: 'Semifinal Oeste', teamA: qfOutcomes[0].winner, teamB: qfOutcomes[1].winner },
      { id: 'SF-2', label: 'Semifinal Este', teamA: qfOutcomes[2].winner, teamB: qfOutcomes[3].winner },
    ];
    const sfOutcomes = sfPairConfigs.map(cfg => playKnockoutGame(cfg.id, cfg.label, cfg.teamA, cfg.teamB));
    
    // Simular Gran Final
    const finalOutcome = playKnockoutGame('FINAL', 'Gran Final', sfOutcomes[0].winner, sfOutcomes[1].winner);
    
    setTimeout(() => {
      setFullTourStandings(standings);
      setFullTourThirds(thirds);
      setFullTourR32(r32Outcomes);
      setFullTourR16(r16Outcomes);
      setFullTourQF(qfOutcomes);
      setFullTourSF(sfOutcomes);
      setFullTourFinal(finalOutcome);
      setFullTourChampion(finalOutcome.winner);
      setFullTourState('done');
      setActiveTab('bracket'); // abre la pestaña bracket al finalizar
      setActiveBracketRound('r32'); // abre el primer cuadro al finalizar
    }, 800);
  };

  /**
   * Simulación heredada compatible para mantener dashboard unificado
   */
  const handleSimulatePlayoffs = () => {
    // Al hacer clic, redirigimos directamente a la nueva simulación completa súper escalada!
    handleSimulateFullTournament();
  };

  const currentStandingResult = groupStandings[selectedGroupName];

  return (
    <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 p-6 shadow-xl space-y-8" id="tournament-simulator">
      
      {/* SECTION 1 — GROUP STAGE MONTE CARLO CLASSIFIER */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-sans font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            SIMULADOR COPA MUNDIAL 2026 — FASE DE GRUPOS MONTE CARLO
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Simula 5,000 combinatorias de partidos de ida y vuelta para cada grupo del Mundial de la FIFA y obtén probabilidades robustas de clasificación de cada selección nacional.
          </p>
        </div>

        {/* Group list Selector Row */}
        <div className="flex flex-wrap gap-2 pt-2">
          {WC_2026_SIMULATION_GROUPS.map(g => (
            <button
              key={g.name}
              onClick={() => {
                setSelectedGroupName(g.name);
              }}
              className={`py-1.5 px-3.5 text-xs font-mono rounded-lg border font-semibold transition-all cursor-pointer ${selectedGroupName === g.name ? 'bg-indigo-500/20 border-indigo-500/60 text-indigo-300' : 'bg-slate-950 border-slate-850 text-slate-500 hover:text-slate-350'}`}
            >
              {g.name}
            </button>
          ))}
        </div>

        {/* Selected group content preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Teams preview card list */}
          <div className="lg:col-span-4 bg-slate-950/60 p-4 rounded-xl border border-slate-850 space-y-3">
            <span className="text-[10px] font-mono text-slate-500 font-bold block uppercase tracking-wide">
              Integrantes de {selectedGroupName}
            </span>
            
            {/* Real Results Conditioning Switch */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-indigo-950/20 border border-indigo-900/40">
              <div className="flex flex-col">
                <span className="text-[10.5px] font-sans font-bold text-indigo-300">Condicionar Resultados</span>
                <span className="text-[9px] font-sans text-slate-400">Bloquea marcadores reales jugados del Mundial</span>
              </div>
              <button
                type="button"
                onClick={() => setConditionOnRealResults(!conditionOnRealResults)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${conditionOnRealResults ? 'bg-indigo-500' : 'bg-slate-700'}`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${conditionOnRealResults ? 'translate-x-4' : 'translate-x-0'}`}
                />
              </button>
            </div>

            <div className="space-y-2">
              {activeGroupTeams.map(t => (
                <div key={t.id} className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-850">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{getFlagEmoji(t)}</span>
                    <span className="text-xs font-sans font-bold text-white leading-none">{t.name}</span>
                  </div>
                  <div className="text-right font-mono text-[10px] text-slate-400">
                    <span>Rank: #{t.fifaRanking}</span>
                    <span className="mx-1">•</span>
                    <span>Elo: <strong className="text-sky-400">{t.elo}</strong></span>
                  </div>
                </div>
              ))}
            </div>
            
            <button
              onClick={handleSimulateGroup}
              disabled={isSimulatingGroup}
              className="w-full py-3 px-4 bg-linear-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-sans text-xs font-bold rounded-lg transition-all duration-300 shadow-md shadow-indigo-950 flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
            >
              <Play className="w-4 h-4" />
              <span>{isSimulatingGroup ? 'SIMULANDO MATCHES...' : 'SIMULAR FASE DE GRUPO'}</span>
            </button>
          </div>

          {/* STANDINGS TABLE RESULTS */}
          <div className="lg:col-span-8 bg-slate-950/40 border border-slate-850 rounded-xl overflow-hidden min-h-[220px] flex flex-col justify-between">
            {currentStandingResult ? (
              <div className="w-full">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-850">
                    <tr>
                      <th className="p-3 text-center w-8">Lugar</th>
                      <th className="p-3">Selección</th>
                      <th className="p-3 text-center">Goles GD</th>
                      <th className="p-3 text-center">PTS Prom.</th>
                      <th className="p-3 text-center text-indigo-400 font-bold">1er Puesto</th>
                      <th className="p-3 text-center text-teal-400 font-bold">Clasifica</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900 text-slate-300">
                    {currentStandingResult.map((row, idx) => (
                      <tr key={row.team.id} className="hover:bg-slate-900/10">
                        <td className="p-3 text-center text-slate-500 font-bold">{idx + 1}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{getFlagEmoji(row.team)}</span>
                            <span className="font-sans font-bold text-white text-xs">{row.team.name}</span>
                          </div>
                        </td>
                        <td className="p-3 text-center text-slate-450">{row.gd > 0 ? `+${row.gd}` : row.gd}</td>
                        <td className="p-3 text-center text-slate-200 font-bold">{row.points}</td>
                        <td className="p-3 text-center text-indigo-400 font-bold">
                          {(row.firstCount * 100).toFixed(1)}%
                        </td>
                        <td className="p-3 text-center text-teal-400 font-bold">
                          {(row.qualifyCount * 100).toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="p-3.5 bg-slate-950 text-[10px] text-slate-500 font-mono italic text-center">
                  * stand calculado mediante 5,000 partidos de regresión Dixon-Coles simulados por equipo.
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-500">
                <BarChart3 className="w-10 h-10 text-slate-700 mb-2" />
                <span className="text-xs font-mono">Simulación de Grupo Pendiente</span>
                <span className="text-[10px] text-slate-600 mt-1">Haz clic en "SIMULAR FASE DE GRUPO" para poblar los standings probabilísticos instantáneamente.</span>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* SECTION 2 — PLAYOFF TREE SYSTEM & BRACKET ODDS */}
      <div className="pt-6 border-t border-slate-800 space-y-4" id="seccion-eliminatorias-completas">
        <div>
          <h3 className="text-lg font-sans font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            SIMULACIÓN EN VIVO — RECORRIDO COPA MUNDIAL 2026 (48 SELECCIONES)
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Simula las llaves auténticas de la Copa Mundial 2026 de la FIFA. El sistema procesa la fase de grupos completa para los 12 grupos, calcula la Tabla de Terceros en tiempo real clasificando a los 8 mejores, y simula cada instancia de playoffs en vivo.
          </p>
        </div>

        <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-850 space-y-6">
          {/* Main simulator trigger container */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/40 border border-slate-850">
            <div className="text-xs text-slate-300 max-w-lg">
              Ejecuta la ecuación conjunta en tiempo real: 12 grupos de 4 integrantes, repesca general de terceros mejores posicionados, y cuadro eliminatorio directo a partido único con tiempo extra y penaltis.
            </div>
            
            <button
              id="btn-simular-torneo"
              onClick={handleSimulateFullTournament}
              disabled={fullTourState === 'simulating'}
              className="py-3 px-6 bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-slate-950 font-sans text-xs font-bold rounded-lg transition-all duration-300 shadow-md shadow-amber-950/25 flex items-center justify-center gap-2 shrink-0 cursor-pointer text-center"
            >
              <RotateCcw className={`w-4 h-4 shrink-0 ${fullTourState === 'simulating' ? 'animate-spin' : ''}`} />
              <span>{fullTourState === 'simulating' ? 'SIMULANDO SELECCIONES...' : fullTourState === 'done' ? 'RE-SIMULAR COPA COMPLETA' : 'SIMULAR COPA MUNDIAL COMPLETA'}</span>
            </button>
          </div>

          {fullTourState === 'simulating' && (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-3" id="loading-simulador-completo">
              <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm font-sans font-medium text-slate-200">Simulando fase de grupos y sorteando cruces...</p>
              <p className="text-xs text-slate-500 max-w-sm">Calculando 72 partidos de ida y vuelta e infiriendo probabilidades de coeficientes ELO/SPI</p>
            </div>
          )}

          {fullTourState === 'idle' && (
            <div className="flex flex-col items-center justify-center py-12 text-center text-slate-500" id="idle-pantalla-copa">
              <Award className="w-12 h-12 text-slate-800 mb-2" />
              <span className="text-xs font-mono">Simulación General de Copa Mundial Pendiente</span>
              <p className="text-[11.5px] text-slate-600 max-w-xs mt-1">Haz clic en el botón superior para realizar una simulación viva desde la fase de grupos hasta la final.</p>
            </div>
          )}

          {fullTourState === 'done' && (
            <div className="space-y-6" id="dashboard-resultados-simulacion">
              
              {/* CHAMPION METALLIC GLORY BANNER */}
              {fullTourFinal && fullTourChampion && (
                <div className="bg-linear-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/15 border-2 border-amber-500/40 p-6 rounded-2xl text-center space-y-4 max-w-2xl mx-auto shadow-2xl relative overflow-hidden" id="banner-campeon-copa">
                  <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-extrabold block">🏆 CAMPEÓN MUNDIAL DE LA FIFA 2026 🏆</span>
                  <div className="text-6xl filter drop-shadow-xl select-none">{getFlagEmoji(fullTourChampion)}</div>
                  <h4 className="text-2xl font-sans font-black text-white uppercase tracking-tight">{fullTourChampion.name}</h4>
                  <div className="text-xs text-slate-350 max-w-md mx-auto font-sans leading-relaxed">
                    ¡La selección de {fullTourChampion.name} se consagra campeona del mundo! Derrota en la Gran Final a <strong>{fullTourFinal.teamA.id === fullTourChampion.id ? fullTourFinal.teamB.name : fullTourFinal.teamA.name}</strong> en un duelo simulado por Dixon-Coles por marcador de{' '}
                    <strong>
                      {fullTourFinal.scoreA}-{fullTourFinal.scoreB}
                      {fullTourFinal.overtimeScoreA && ` (TE: ${fullTourFinal.overtimeScoreA}-${fullTourFinal.overtimeScoreB})`}
                      {fullTourFinal.penaltiesScoreA && ` (PEN: ${fullTourFinal.penaltiesScoreA}-${fullTourFinal.penaltiesScoreB})`}
                    </strong>
                    .
                  </div>
                </div>
              )}

              {/* THREE MAIN VIEW NAVIGATION PATH TABS */}
              <div className="flex border-b border-slate-850 gap-2 overflow-x-auto justify-center" id="tabs-simulador-mca">
                <button
                  onClick={() => setActiveTab('bracket')}
                  className={`py-2 px-5 text-xs font-sans font-bold transition-all border-b-2 cursor-pointer ${activeTab === 'bracket' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-450 hover:text-slate-200'}`}
                >
                  🎯 CUADRO DE JUEGO (BRACKET)
                </button>
                <button
                  onClick={() => setActiveTab('groups')}
                  className={`py-2 px-5 text-xs font-sans font-bold transition-all border-b-2 cursor-pointer ${activeTab === 'groups' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-450 hover:text-slate-200'}`}
                >
                  📊 TABLAS DE GRUPOS (12)
                </button>
                <button
                  onClick={() => setActiveTab('thirds')}
                  className={`py-2 px-5 text-xs font-sans font-bold transition-all border-b-2 cursor-pointer ${activeTab === 'thirds' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-450 hover:text-slate-200'}`}
                >
                  🏅 TABLA DE TERCEROS (REPESCA)
                </button>
              </div>

              {/* TAB 1 CONTENT — BRACKET ELIMINATOR (WITH NESTED ROUND SELECTOR) */}
              {activeTab === 'bracket' && (
                <div className="space-y-6" id="panel-bracket-eliminatorio">
                  {/* Round Sub-selector Row */}
                  <div className="flex flex-wrap gap-2 justify-center" id="selector-rondas-fya">
                    <button
                      onClick={() => setActiveBracketRound('r32')}
                      className={`py-1 px-3 text-xs font-mono font-semibold rounded-lg border transition-all cursor-pointer ${activeBracketRound === 'r32' ? 'bg-amber-500/10 border-amber-500/50 text-amber-300' : 'bg-slate-900/60 border-slate-850 text-slate-400 hover:text-slate-200'}`}
                    >
                      Dieciseisavos (32)
                    </button>
                    <button
                      onClick={() => setActiveBracketRound('r16')}
                      className={`py-1 px-3 text-xs font-mono font-semibold rounded-lg border transition-all cursor-pointer ${activeBracketRound === 'r16' ? 'bg-amber-500/10 border-amber-500/50 text-amber-300' : 'bg-slate-900/60 border-slate-850 text-slate-400 hover:text-slate-200'}`}
                    >
                      Octavos (16)
                    </button>
                    <button
                      onClick={() => setActiveBracketRound('qf')}
                      className={`py-1 px-3 text-xs font-mono font-semibold rounded-lg border transition-all cursor-pointer ${activeBracketRound === 'qf' ? 'bg-amber-500/10 border-amber-500/50 text-amber-300' : 'bg-slate-900/60 border-slate-850 text-slate-400 hover:text-slate-200'}`}
                    >
                      Cuartos (8)
                    </button>
                    <button
                      onClick={() => setActiveBracketRound('sf')}
                      className={`py-1 px-3 text-xs font-mono font-semibold rounded-lg border transition-all cursor-pointer ${activeBracketRound === 'sf' ? 'bg-amber-500/10 border-amber-500/50 text-amber-300' : 'bg-slate-900/60 border-slate-850 text-slate-400 hover:text-slate-200'}`}
                    >
                      Semifinales (4)
                    </button>
                    <button
                      onClick={() => setActiveBracketRound('final')}
                      className={`py-1 px-3 text-xs font-mono font-semibold rounded-lg border transition-all cursor-pointer ${activeBracketRound === 'final' ? 'bg-amber-500/10 border-amber-500/50 text-amber-300' : 'bg-slate-900/60 border-slate-850 text-slate-400 hover:text-slate-200'}`}
                    >
                      Gran Final (2)
                    </button>
                  </div>

                  {/* Render matches of selected round */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="cards-llaves-partidos">
                    
                    {/* DIECISEISAVOS (32 TEAMS, 16 MATCHES) */}
                    {activeBracketRound === 'r32' && fullTourR32.map((m) => {
                      const wonA = m.winner.id === m.teamA.id;
                      return (
                        <div key={m.id} className="bg-slate-950/70 p-3 rounded-xl border border-slate-900 flex flex-col justify-between hover:border-slate-800 transition-colors">
                          <span className="text-[9px] font-mono text-slate-500 block mb-2 font-bold uppercase tracking-wider">{m.label} ({m.id})</span>
                          <div className="space-y-2">
                            {/* Team A Grid Row */}
                            <div className="flex items-center justify-between text-xs font-sans">
                              <div className="flex items-center gap-2">
                                <span className="text-lg leading-none">{getFlagEmoji(m.teamA)}</span>
                                <span className={`font-semibold ${wonA ? 'text-white' : 'text-slate-500'}`}>{m.teamA.name}</span>
                              </div>
                              <div className="flex items-center gap-1.5 font-mono">
                                {m.penaltiesScoreA !== undefined && (
                                  <span className="text-[10px] text-purple-400">({m.penaltiesScoreA})</span>
                                )}
                                <span className={`font-bold ${wonA ? 'text-amber-400' : 'text-slate-500'}`}>
                                  {m.overtimeScoreA !== undefined ? m.overtimeScoreA : m.scoreA}
                                </span>
                              </div>
                            </div>
                            {/* Team B Grid Row */}
                            <div className="flex items-center justify-between text-xs font-sans">
                              <div className="flex items-center gap-2">
                                <span className="text-lg leading-none">{getFlagEmoji(m.teamB)}</span>
                                <span className={`font-semibold ${!wonA ? 'text-white' : 'text-slate-500'}`}>{m.teamB.name}</span>
                              </div>
                              <div className="flex items-center gap-1.5 font-mono">
                                {m.penaltiesScoreB !== undefined && (
                                  <span className="text-[10px] text-purple-400">({m.penaltiesScoreB})</span>
                                )}
                                <span className={`font-bold ${!wonA ? 'text-amber-400' : 'text-slate-500'}`}>
                                  {m.overtimeScoreB !== undefined ? m.overtimeScoreB : m.scoreB}
                                </span>
                              </div>
                            </div>
                          </div>
                          {m.overtimeScoreA !== undefined && (
                            <div className="text-[9px] font-mono text-slate-500 mt-2 text-right">
                              * definido en {m.penaltiesScoreA !== undefined ? 'tanda de penaltis' : 'prórroga (TE)'}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* OCTAVOS DE FINAL (16 TEAMS, 8 MATCHES) */}
                    {activeBracketRound === 'r16' && fullTourR16.map((m) => {
                      const wonA = m.winner.id === m.teamA.id;
                      return (
                        <div key={m.id} className="bg-slate-950/70 p-3 rounded-xl border border-slate-900 flex flex-col justify-between hover:border-slate-800 transition-colors">
                          <span className="text-[9px] font-mono text-slate-500 block mb-2 font-bold uppercase tracking-wider">{m.label} ({m.id})</span>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs font-sans">
                              <div className="flex items-center gap-2">
                                <span className="text-lg leading-none">{getFlagEmoji(m.teamA)}</span>
                                <span className={`font-semibold ${wonA ? 'text-white' : 'text-slate-500'}`}>{m.teamA.name}</span>
                              </div>
                              <div className="flex items-center gap-1.5 font-mono">
                                {m.penaltiesScoreA !== undefined && (
                                  <span className="text-[10px] text-purple-400">({m.penaltiesScoreA})</span>
                                )}
                                <span className={`font-bold ${wonA ? 'text-amber-400' : 'text-slate-500'}`}>
                                  {m.overtimeScoreA !== undefined ? m.overtimeScoreA : m.scoreA}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-xs font-sans">
                              <div className="flex items-center gap-2">
                                <span className="text-lg leading-none">{getFlagEmoji(m.teamB)}</span>
                                <span className={`font-semibold ${!wonA ? 'text-white' : 'text-slate-500'}`}>{m.teamB.name}</span>
                              </div>
                              <div className="flex items-center gap-1.5 font-mono">
                                {m.penaltiesScoreB !== undefined && (
                                  <span className="text-[10px] text-purple-400">({m.penaltiesScoreB})</span>
                                )}
                                <span className={`font-bold ${!wonA ? 'text-amber-400' : 'text-slate-500'}`}>
                                  {m.overtimeScoreB !== undefined ? m.overtimeScoreB : m.scoreB}
                                </span>
                              </div>
                            </div>
                          </div>
                          {m.overtimeScoreA !== undefined && (
                            <div className="text-[9px] font-mono text-slate-500 mt-2 text-right">
                              * definido en {m.penaltiesScoreA !== undefined ? 'tanda de penaltis' : 'prórroga (TE)'}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* CUARTOS DE FINAL (8 TEAMS, 4 MATCHES) */}
                    {activeBracketRound === 'qf' && fullTourQF.map((m) => {
                      const wonA = m.winner.id === m.teamA.id;
                      return (
                        <div key={m.id} className="bg-slate-950/70 p-3 rounded-xl border border-slate-900 flex flex-col justify-between hover:border-slate-800 transition-colors">
                          <span className="text-[9px] font-mono text-slate-500 block mb-2 font-bold uppercase tracking-wider">{m.label} ({m.id})</span>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs font-sans">
                              <div className="flex items-center gap-2">
                                <span className="text-lg leading-none">{getFlagEmoji(m.teamA)}</span>
                                <span className={`font-semibold ${wonA ? 'text-white' : 'text-slate-500'}`}>{m.teamA.name}</span>
                              </div>
                              <div className="flex items-center gap-1.5 font-mono">
                                {m.penaltiesScoreA !== undefined && (
                                  <span className="text-[10px] text-purple-400">({m.penaltiesScoreA})</span>
                                )}
                                <span className={`font-bold ${wonA ? 'text-amber-400' : 'text-slate-500'}`}>
                                  {m.overtimeScoreA !== undefined ? m.overtimeScoreA : m.scoreA}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-xs font-sans">
                              <div className="flex items-center gap-2">
                                <span className="text-lg leading-none">{getFlagEmoji(m.teamB)}</span>
                                <span className={`font-semibold ${!wonA ? 'text-white' : 'text-slate-500'}`}>{m.teamB.name}</span>
                              </div>
                              <div className="flex items-center gap-1.5 font-mono">
                                {m.penaltiesScoreB !== undefined && (
                                  <span className="text-[10px] text-purple-400">({m.penaltiesScoreB})</span>
                                )}
                                <span className={`font-bold ${!wonA ? 'text-amber-400' : 'text-slate-500'}`}>
                                  {m.overtimeScoreB !== undefined ? m.overtimeScoreB : m.scoreB}
                                </span>
                              </div>
                            </div>
                          </div>
                          {m.overtimeScoreA !== undefined && (
                            <div className="text-[9px] font-mono text-slate-500 mt-2 text-right">
                              * definido en {m.penaltiesScoreA !== undefined ? 'tanda de penaltis' : 'prórroga (TE)'}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* SEMIFINALES (4 TEAMS, 2 MATCHES) */}
                    {activeBracketRound === 'sf' && fullTourSF.map((m) => {
                      const wonA = m.winner.id === m.teamA.id;
                      return (
                        <div key={m.id} className="bg-slate-950/70 p-4 rounded-xl border border-slate-900 flex flex-col justify-between hover:border-slate-800 transition-colors col-span-1 md:col-span-2 lg:col-span-1">
                          <span className="text-[9px] font-mono text-slate-500 block mb-2 font-bold uppercase tracking-wider">{m.label} ({m.id})</span>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-xs font-sans pt-1">
                              <div className="flex items-center gap-2.5">
                                <span className="text-xl leading-none">{getFlagEmoji(m.teamA)}</span>
                                <span className={`font-bold ${wonA ? 'text-white' : 'text-slate-500'}`}>{m.teamA.name}</span>
                              </div>
                              <div className="flex items-center gap-1.5 font-mono">
                                {m.penaltiesScoreA !== undefined && (
                                  <span className="text-[10px] text-purple-400">({m.penaltiesScoreA})</span>
                                )}
                                <span className={`text-sm font-black ${wonA ? 'text-amber-400' : 'text-slate-500'}`}>
                                  {m.overtimeScoreA !== undefined ? m.overtimeScoreA : m.scoreA}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-xs font-sans pb-1">
                              <div className="flex items-center gap-2.5">
                                <span className="text-xl leading-none">{getFlagEmoji(m.teamB)}</span>
                                <span className={`font-bold ${!wonA ? 'text-white' : 'text-slate-500'}`}>{m.teamB.name}</span>
                              </div>
                              <div className="flex items-center gap-1.5 font-mono">
                                {m.penaltiesScoreB !== undefined && (
                                  <span className="text-[10px] text-purple-400">({m.penaltiesScoreB})</span>
                                )}
                                <span className={`text-sm font-black ${!wonA ? 'text-amber-400' : 'text-slate-500'}`}>
                                  {m.overtimeScoreB !== undefined ? m.overtimeScoreB : m.scoreB}
                                </span>
                              </div>
                            </div>
                          </div>
                          {m.overtimeScoreA !== undefined && (
                            <div className="text-[9px] font-mono text-slate-500 mt-2 text-right">
                              * definido en {m.penaltiesScoreA !== undefined ? 'tanda de penaltis' : 'prórroga (TE)'}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* GRAN FINAL (2 TEAMS, 1 MATCH) */}
                    {activeBracketRound === 'final' && fullTourFinal && (() => {
                      const m = fullTourFinal;
                      const wonA = m.winner.id === m.teamA.id;
                      return (
                        <div className="bg-linear-to-b from-slate-900 to-slate-950 p-5 rounded-xl border-2 border-amber-500/30 flex flex-col justify-between shadow-lg col-span-1 md:col-span-2 lg:col-span-3 max-w-lg mx-auto w-full">
                          <span className="text-[10px] font-mono text-amber-500 block mb-3 font-extrabold uppercase tracking-widest text-center">🏆 GRAN FINAL DE LA COPA 2026 🏆</span>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between text-sm font-sans py-1 border-b border-slate-900 pb-2">
                              <div className="flex items-center gap-3">
                                <span className="text-2xl leading-none">{getFlagEmoji(m.teamA)}</span>
                                <span className={`font-black ${wonA ? 'text-white' : 'text-slate-500'}`}>{m.teamA.name}</span>
                              </div>
                              <div className="flex items-center gap-2 font-mono">
                                {m.penaltiesScoreA !== undefined && (
                                  <span className="text-xs text-purple-400">({m.penaltiesScoreA})</span>
                                )}
                                <span className={`text-base font-black ${wonA ? 'text-amber-400' : 'text-slate-500'}`}>
                                  {m.overtimeScoreA !== undefined ? m.overtimeScoreA : m.scoreA}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-sm font-sans py-1 pb-2">
                              <div className="flex items-center gap-3">
                                <span className="text-2xl leading-none">{getFlagEmoji(m.teamB)}</span>
                                <span className={`font-black ${!wonA ? 'text-white' : 'text-slate-500'}`}>{m.teamB.name}</span>
                              </div>
                              <div className="flex items-center gap-2 font-mono">
                                {m.penaltiesScoreB !== undefined && (
                                  <span className="text-xs text-purple-400">({m.penaltiesScoreB})</span>
                                )}
                                <span className={`text-base font-black ${!wonA ? 'text-amber-400' : 'text-slate-500'}`}>
                                  {m.overtimeScoreB !== undefined ? m.overtimeScoreB : m.scoreB}
                                </span>
                              </div>
                            </div>
                          </div>
                          {m.overtimeScoreA !== undefined && (
                            <div className="text-[10.5px] font-mono text-amber-500/75 mt-3 text-center bg-amber-500/5 py-1 px-2 rounded border border-amber-500/10">
                              Definido en {m.penaltiesScoreA !== undefined ? 'tanda de penaltis espectacular' : 'tiempo extra reglamentario (TE)'}
                            </div>
                          )}
                        </div>
                      );
                    })()}

                  </div>
                </div>
              )}

              {/* TAB 2 CONTENT — PHASE GROUPS (12 DYNAMIC CARDS) */}
              {activeTab === 'groups' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="panel-fase-tablas-grupos">
                  {Object.keys(fullTourStandings).sort().map((gName) => {
                    const rows = fullTourStandings[gName];
                    return (
                      <div key={gName} className="bg-slate-950/50 rounded-xl border border-slate-900 overflow-hidden flex flex-col">
                        <div className="bg-slate-900 p-2.5 border-b border-slate-850 px-4">
                          <span className="text-xs font-sans font-extrabold text-white uppercase tracking-wider">{gName}</span>
                        </div>
                        <table className="w-full text-left font-mono text-[10.5px]">
                          <thead className="text-slate-500 bg-slate-950 text-[9px] border-b border-slate-900 uppercase">
                            <tr>
                              <th className="p-2 pl-3 w-5">#</th>
                              <th className="p-2">País</th>
                              <th className="p-2 text-center w-8">GD</th>
                              <th className="p-2 text-center w-8">GF</th>
                              <th className="p-2 text-center w-8">PTS</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-900 text-slate-350">
                            {rows.map((row, idx) => {
                              const isTop2 = idx < 2;
                              const is3rd = idx === 2;
                              return (
                                <tr key={row.team.id} className={`${isTop2 ? 'bg-teal-500/5 text-teal-300 font-bold' : is3rd ? 'bg-amber-500/5 text-amber-400' : 'text-slate-500 hover:bg-slate-900/10'}`}>
                                  <td className="p-2 pl-3 text-slate-550">{idx + 1}</td>
                                  <td className="p-2">
                                    <div className="flex items-center gap-1.5 font-sans font-medium text-xs truncate max-w-[130px]">
                                      <span>{getFlagEmoji(row.team)}</span>
                                      <span className={`${isTop2 ? 'text-teal-200' : is3rd ? 'text-amber-300/90' : 'text-slate-400'}`}>{row.team.name}</span>
                                    </div>
                                  </td>
                                  <td className="p-2 text-center">{row.gd > 0 ? `+${row.gd}` : row.gd}</td>
                                  <td className="p-2 text-center">{row.gf}</td>
                                  <td className="p-2 text-center font-bold text-xs">{row.pts}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* TAB 3 CONTENT — THIRD-PLACED LEADER BOARD TABLE */}
              {activeTab === 'thirds' && (
                <div className="bg-slate-950/70 rounded-xl border border-slate-900 overflow-hidden" id="panel-tabla-repesca-terceros">
                  <div className="p-4 bg-slate-900 border-b border-slate-850">
                    <span className="text-xs font-sans font-extrabold text-white uppercase tracking-wider block">TABLA DE COMPARATIVA DE TERCEROS LUGARES</span>
                    <span className="text-[10px] text-slate-450 block mt-0.5 font-sans leading-relaxed">
                      Se agrupan los 12 seleccionados que finalizaron en la tercera plaza de su grupo. Solo los <strong>mejores 8 terceros</strong> clasifican a los Dieciseisavos de Final (Round of 32) de la Copa Mundial.
                    </span>
                  </div>

                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-950 text-slate-400 border-b border-slate-850 text-[10px] uppercase">
                      <tr>
                        <th className="p-3 text-center w-12">Puesto</th>
                        <th className="p-3">Selección</th>
                        <th className="p-3 text-center w-24">Grupo Orig.</th>
                        <th className="p-3 text-center w-12">PJ</th>
                        <th className="p-3 text-center w-12">PG</th>
                        <th className="p-3 text-center w-12">PE</th>
                        <th className="p-3 text-center w-12">PP</th>
                        <th className="p-3 text-center w-16">Goles GD</th>
                        <th className="p-3 text-center w-16">Goles GF</th>
                        <th className="p-3 text-center w-20 text-amber-400">PTS</th>
                        <th className="p-3 text-center">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900 text-slate-350">
                      {fullTourThirds.map((row, idx) => {
                        const q = row.qualified;
                        return (
                          <tr key={row.team.id} className={`hover:bg-slate-900/10 ${q ? 'bg-emerald-950/15' : 'bg-rose-950/15'}`}>
                            <td className="p-3 text-center font-bold text-slate-500">{idx + 1}</td>
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <span className="text-lg leading-none">{getFlagEmoji(row.team)}</span>
                                <span className="font-sans font-bold text-white text-xs">{row.team.name}</span>
                              </div>
                            </td>
                            <td className="p-3 text-center text-slate-400">{row.groupName}</td>
                            <td className="p-3 text-center text-slate-450">{row.pj}</td>
                            <td className="p-3 text-center text-slate-450">{row.pg}</td>
                            <td className="p-3 text-center text-slate-450">{row.pe}</td>
                            <td className="p-3 text-center text-slate-450">{row.pp}</td>
                            <td className="p-3 text-center text-slate-400 font-semibold">{row.gd > 0 ? `+${row.gd}` : row.gd}</td>
                            <td className="p-3 text-center text-slate-400">{row.gf}</td>
                            <td className="p-3 text-center text-amber-300 font-extrabold text-sm">{row.pts}</td>
                            <td className="p-3 text-center">
                              {q ? (
                                <span className="inline-flex items-center gap-1 font-sans text-[10px] font-bold text-emerald-400 bg-emerald-950/50 py-1 px-2.5 rounded-full border border-emerald-900/40">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                                  CLASIFICA (TOP 8)
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 font-sans text-[10px] font-bold text-rose-450 bg-rose-950/45 py-1 px-2.5 rounded-full border border-rose-950/30">
                                  ELIMINADO
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
