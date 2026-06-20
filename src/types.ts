/**
 * futbol-prifa-predictor - Tipo de Datos
 */

export interface Team {
  id: string;
  name: string;
  code: string; // ISO 3-letter code, e.g., ARG, BRA, ESP
  type: 'national' | 'club';
  continent: 'UEFA' | 'CONMEBOL' | 'CONCACAF' | 'CAF' | 'AFC' | 'OFC';
  elo: number;
  fifaRanking: number;
  marketValueM: number; // in Millions of EUR
  avgAge: number;
  worldCupExp: number; // 0-10 scale rating
  recentForm: Array<'W' | 'D' | 'L'>; // last 5 games, e.g. ['W', 'W', 'D', 'W', 'L']
  spi: number; // FiveThirtyEight overall Soccer Power Index (0-100)
  offPower: number; // offensive rating (goals scored per match vs league avg)
  defPower: number; // defensive rating (goals conceded per match vs league avg)
  momentum: number; // current form factor (0.8 - 1.2)
  flagUrl?: string;
}

export interface MatchPredictionInput {
  teamAId: string;
  teamBId: string;
  isNeutral: boolean;
  simulationCount: number; // 100,000 or 1,000,000
  isKnockout: boolean; // if true, can have penalties/overtime
}

export interface ExactScoreProbability {
  scoreA: number;
  scoreB: number;
  prob: number; // 0 to 1
}

export interface ModelContribution {
  modelName: string;
  weight: number;
  winA: number;
  draw: number;
  winB: number;
  expectedGoalsA: number;
  expectedGoalsB: number;
}

export interface ShapValue {
  feature: string;
  impactA: number; // Negative or positive impact on team A's probability
  impactB: number;
  description: string;
}

export interface MatchPredictionResult {
  teamA: Team;
  teamB: Team;
  isNeutral: boolean;
  isKnockout: boolean;
  simulationsRun: number;
  
  h2h?: {
    played: number;
    winsA: number;
    winsB: number;
    draws: number;
    goalsA: number;
    goalsB: number;
    advantage: 'A' | 'B' | 'none';
    description: string;
  };
  
  // Probabilidades Finales (Ensemble Metamodel)
  probA: number; // 0 to 1
  probDraw: number; // 0 to 1
  probB: number; // 0 to 1
  
  // Goles Esperados (xG)
  xGA: number;
  xGB: number;
  
  // Resultados exactos
  mostProbableScore: { scoreA: number; scoreB: number; prob: number };
  topScores: ExactScoreProbability[];
  scoreMatrix: number[][]; // 0-5 x 0-5 matrix
  
  // Over / Under probabilidades
  overUnder: {
    over0_5: number;
    over1_5: number;
    over2_5: number;
    over3_5: number;
    under0_5: number;
    under1_5: number;
    under2_5: number;
    under3_5: number;
  };
  
  // Ambos marcan (BTTS)
  btts: number; // 0 to 1
  
  // Eliminatorias (Penales y clasificación)
  qualifyA: number; // 0 to 1
  qualifyB: number; // 0 to 1
  probPens: number; // 0 to 1
  probOvert: number; // 0 to 1
  pensWinner?: 'A' | 'B';
  
  // Desglose de modelos individuales (Capa Ensamble)
  modelBreakdown: ModelContribution[];
  
  // Valores Explicativos (SHAP)
  shapValues: ShapValue[];
  
  // Simulación temporal de goles (Muestras de Monte Carlo)
  simulatedHistA: number[]; // Goles local en simulación
  simulatedHistB: number[]; // Goles visitante en simulación

  // Models 11-20 comparisons
  advancedModels?: {
    model11_bivariatePoisson: { winA: number; draw: number; winB: number; desc: string };
    model12_zeroInflatedPoisson: { winA: number; draw: number; winB: number; desc: string };
    model13_glicko2: { ratingA: number; rdA: number; volA: number; ratingB: number; rdB: number; volB: number; probA: number; probB: number; desc: string };
    model14_trueskill: { muA: number; sigmaA: number; muB: number; sigmaB: number; probA: number; probB: number; desc: string };
    model15_bayesianNetwork: { winRefinedA: number; drawRefined: number; winRefinedB: number; desc: string };
    model16_hmm: { stateA: string; stateB: string; multiplierA: number; multiplierB: number; desc: string };
    model17_survival: { finalistA: number; finalistB: number; champA: number; champB: number; desc: string };
    model18_tft: { forecastGoalA: number; forecastGoalB: number; probA: number; probB: number; desc: string };
    model19_gnn: { influenceA: number; influenceB: number; centralidadA: number; centralidadB: number; desc: string };
    model20_deepEnsemble: { meanProbA: number; stdDevProbA: number; meanProbB: number; stdDevProbB: number; desc: string };
  };

  // Unusual features details
  unusualFeatures?: {
    strengthOfScheduleA: number; // e.g. average Elos of recent opponents
    strengthOfScheduleB: number;
    tournamentPressureIndex: number; // e.g. worldcup (1.0), qualifiers (0.8), continental (0.75), friendly (0.3)
    travelFatigueA: { km: number; tz: number; restDays: number; impact: number };
    travelFatigueB: { km: number; tz: number; restDays: number; impact: number };
    squadContinuityA: number; // %
    squadContinuityB: number; // %
    coachStabilityA: { years: number; matches: number; winRate: number };
    coachStabilityB: { years: number; matches: number; winRate: number };
    marketValueIndexA: { total: number; avgPlayer: number; starters: number };
    marketValueIndexB: { total: number; avgPlayer: number; starters: number };
    experienceIndexA: number; // world cup cumulative minutes
    experienceIndexB: number;
    bigMatchIndexA: number; // win rate vs top 10 FIFA
    bigMatchIndexB: number;
    penaltyStrengthA: { conversions: number; saves: number; ratio: number };
    penaltyStrengthB: { conversions: number; saves: number; ratio: number };
    injuryImpactA: { rawScore: number; desc: string };
    injuryImpactB: { rawScore: number; desc: string };
    homeContinentAdvantageA: number; // multiplier or elo bonus
    homeContinentAdvantageB: number;
  };
  monteCarloCustom?: {
    statsA: TeamWC2026Stats;
    statsB: TeamWC2026Stats;
    lambdaSimpleA: number;
    lambdaSimpleB: number;
    lambdaFullA: number;
    lambdaFullB: number;
  };
  goalscorers?: {
    teamA: GoalscorerPrediction[];
    teamB: GoalscorerPrediction[];
  };
}

export interface GoalscorerPrediction {
  name: string;
  position: 'delantero' | 'mediocampista' | 'defensor';
  goalsScoredInTournament: number;
  anytimeScoringProbability: number;
  firstScorerProbability: number;
  multipleGoalsProbability: number;
  role: string;
  weight: number;
}

export interface TeamWC2026Stats {
  played: number;
  gf: number;
  gc: number;
  xgFavor: number;
  xgContra: number;
  gfAvg: number;
  gcAvg: number;
  xgFavorAvg: number;
  xgContraAvg: number;
  points: number;
  forma: number;
  diffGol: number;
  diffXg: number;
}

// Historial de validación para partidos reales
export interface ValidationResult {
  tournament: string;
  totalMatches: number;
  accuracy: number;
  logLoss: number;
  brierScore: number;
  calibrationScore: number; // 0-1 scale (closer to 1 is better)
}

// Para el simulador de torneo
export interface TournamentGroup {
  name: string;
  teams: string[]; // Team IDs
  standings?: {
    teamId: string;
    points: number;
    gf: number;
    ga: number;
    gd: number;
    probQualify: number;
    probFirst: number;
    probChampion: number;
  }[];
}
