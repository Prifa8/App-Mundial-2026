import { Team } from '../types';

export interface RealMatch {
  team1Id: string;
  team2Id: string;
  score1: number;
  score2: number;
  date: string;
  status: string;
  group: string;
  // Advanced Match Statistics
  xg1?: number;
  xg2?: number;
  possession1?: number;
  possession2?: number;
  shots1?: number;
  shots2?: number;
  shotsOnTarget1?: number;
  shotsOnTarget2?: number;
  corners1?: number;
  corners2?: number;
}

export let WC_2026_REAL_RESULTS: RealMatch[] = [
  {
    team1Id: 'mex', team2Id: 'rsa', score1: 2, score2: 0,
    date: '11 de junio, 2026', status: 'FT', group: 'Grupo A',
    xg1: 1.41, xg2: 0.07, possession1: 61, possession2: 39,
    shots1: 16, shots2: 3, shotsOnTarget1: 4, shotsOnTarget2: 2,
    corners1: 5, corners2: 2
  },
  {
    team1Id: 'kor', team2Id: 'cze', score1: 2, score2: 1,
    date: '11 de junio, 2026', status: 'FT', group: 'Grupo A',
    xg1: 1.84, xg2: 0.81, possession1: 62, possession2: 38,
    shots1: 15, shots2: 7, shotsOnTarget1: 6, shotsOnTarget2: 4,
    corners1: 6, corners2: 4
  },
  {
    team1Id: 'can', team2Id: 'bih', score1: 1, score2: 1,
    date: '12 de junio, 2026', status: 'FT', group: 'Grupo B',
    xg1: 1.25, xg2: 0.98, possession1: 61, possession2: 39,
    shots1: 13, shots2: 8, shotsOnTarget1: 4, shotsOnTarget2: 3,
    corners1: 4, corners2: 5
  },
  {
    team1Id: 'usa', team2Id: 'par', score1: 4, score2: 1,
    date: '12 de junio, 2026', status: 'FT', group: 'Grupo D',
    xg1: 1.35, xg2: 0.47, possession1: 65, possession2: 35,
    shots1: 16, shots2: 9, shotsOnTarget1: 6, shotsOnTarget2: 1,
    corners1: 7, corners2: 3
  },
  {
    team1Id: 'qat', team2Id: 'sui', score1: 1, score2: 1,
    date: '13 de junio, 2026', status: 'FT', group: 'Grupo B',
    xg1: 0.76, xg2: 3.24, possession1: 32, possession2: 68,
    shots1: 6, shots2: 26, shotsOnTarget1: 3, shotsOnTarget2: 7,
    corners1: 2, corners2: 8
  },
  {
    team1Id: 'bra', team2Id: 'mar', score1: 1, score2: 1,
    date: '13 de junio, 2026', status: 'FT', group: 'Grupo C',
    xg1: 1.23, xg2: 1.53, possession1: 51, possession2: 49,
    shots1: 12, shots2: 14, shotsOnTarget1: 5, shotsOnTarget2: 3,
    corners1: 5, corners2: 4
  },
  {
    team1Id: 'hai', team2Id: 'sco', score1: 0, score2: 1,
    date: '13 de junio, 2026', status: 'FT', group: 'Grupo C',
    xg1: 1.21, xg2: 1.05, possession1: 54, possession2: 46,
    shots1: 15, shots2: 9, shotsOnTarget1: 2, shotsOnTarget2: 2,
    corners1: 2, corners2: 6
  },
  {
    team1Id: 'aus', team2Id: 'tur', score1: 2, score2: 0,
    date: '13 de junio, 2026', status: 'FT', group: 'Grupo D',
    xg1: 0.77, xg2: 1.33, possession1: 28, possession2: 72,
    shots1: 9, shots2: 30, shotsOnTarget1: 4, shotsOnTarget2: 8,
    corners1: 4, corners2: 5
  },
  {
    team1Id: 'ger', team2Id: 'cuw', score1: 7, score2: 1,
    date: '14 de junio, 2026', status: 'FT', group: 'Grupo E',
    xg1: 4.22, xg2: 0.41, possession1: 65, possession2: 35,
    shots1: 26, shots2: 8, shotsOnTarget1: 12, shotsOnTarget2: 2,
    corners1: 11, corners2: 1
  },
  {
    team1Id: 'ned', team2Id: 'jpn', score1: 2, score2: 2,
    date: '14 de junio, 2026', status: 'FT', group: 'Grupo H',
    xg1: 0.78, xg2: 0.59, possession1: 60, possession2: 40,
    shots1: 10, shots2: 10, shotsOnTarget1: 6, shotsOnTarget2: 3,
    corners1: 5, corners2: 6
  },
  {
    team1Id: 'civ', team2Id: 'ecu', score1: 1, score2: 0,
    date: '14 de junio, 2026', status: 'FT', group: 'Grupo I',
    xg1: 1.68, xg2: 1.03, possession1: 48, possession2: 52,
    shots1: 15, shots2: 12, shotsOnTarget1: 4, shotsOnTarget2: 1,
    corners1: 4, corners2: 4
  },
  {
    team1Id: 'swe', team2Id: 'tun', score1: 5, score2: 1,
    date: '14 de junio, 2026', status: 'FT', group: 'Grupo J',
    xg1: 1.36, xg2: 0.28, possession1: 49, possession2: 51,
    shots1: 13, shots2: 6, shotsOnTarget1: 7, shotsOnTarget2: 2,
    corners1: 6, corners2: 3
  },
  {
    team1Id: 'esp', team2Id: 'cpv', score1: 0, score2: 0,
    date: '15 de junio, 2026', status: 'FT', group: 'Grupo I',
    xg1: 2.29, xg2: 0.30, possession1: 74, possession2: 26,
    shots1: 27, shots2: 6, shotsOnTarget1: 7, shotsOnTarget2: 1,
    corners1: 9, corners2: 1
  },
  {
    team1Id: 'bel', team2Id: 'egy', score1: 1, score2: 1,
    date: '15 de junio, 2026', status: 'FT', group: 'Grupo H',
    xg1: 1.35, xg2: 1.08, possession1: 54, possession2: 46,
    shots1: 15, shots2: 14, shotsOnTarget1: 3, shotsOnTarget2: 3,
    corners1: 5, corners2: 4
  },
  {
    team1Id: 'ksa', team2Id: 'uru', score1: 1, score2: 1,
    date: '15 de junio, 2026', status: 'FT', group: 'Grupo F',
    xg1: 0.99, xg2: 1.54, possession1: 33, possession2: 67,
    shots1: 7, shots2: 27, shotsOnTarget1: 3, shotsOnTarget2: 10,
    corners1: 3, corners2: 7
  },
  {
    team1Id: 'irn', team2Id: 'nzl', score1: 2, score2: 2,
    date: '15 de junio, 2026', status: 'FT', group: 'Grupo G',
    xg1: 1.50, xg2: 1.24, possession1: 49, possession2: 51,
    shots1: 17, shots2: 14, shotsOnTarget1: 4, shotsOnTarget2: 8,
    corners1: 4, corners2: 3
  },
  {
    team1Id: 'fra', team2Id: 'sen', score1: 3, score2: 1,
    date: '16 de junio, 2026', status: 'FT', group: 'Grupo J',
    xg1: 1.79, xg2: 0.56, possession1: 53, possession2: 47,
    shots1: 11, shots2: 6, shotsOnTarget1: 8, shotsOnTarget2: 2,
    corners1: 6, corners2: 4
  },
  {
    team1Id: 'irq', team2Id: 'nor', score1: 1, score2: 4,
    date: '16 de junio, 2026', status: 'FT', group: 'Grupo E',
    xg1: 0.77, xg2: 2.53, possession1: 39, possession2: 61,
    shots1: 11, shots2: 12, shotsOnTarget1: 1, shotsOnTarget2: 5,
    corners1: 7, corners2: 2
  },
  {
    team1Id: 'arg', team2Id: 'alg', score1: 3, score2: 0,
    date: '16 de junio, 2026', status: 'FT', group: 'Grupo K',
    xg1: 1.23, xg2: 0.31, possession1: 48, possession2: 52,
    shots1: 10, shots2: 7, shotsOnTarget1: 6, shotsOnTarget2: 0,
    corners1: 8, corners2: 3
  },
  {
    team1Id: 'aut', team2Id: 'jor', score1: 3, score2: 1,
    date: '16 de junio, 2026', status: 'FT', group: 'Grupo F',
    xg1: 1.66, xg2: 0.53, possession1: 63, possession2: 37,
    shots1: 11, shots2: 11, shotsOnTarget1: 4, shotsOnTarget2: 4,
    corners1: 5, corners2: 3
  },
  {
    team1Id: 'por', team2Id: 'cod', score1: 1, score2: 1,
    date: '17 de junio, 2026', status: 'FT', group: 'Grupo K',
    xg1: 0.64, xg2: 0.82, possession1: 75, possession2: 25,
    shots1: 7, shots2: 8, shotsOnTarget1: 1, shotsOnTarget2: 2,
    corners1: 4, corners2: 3
  },
  {
    team1Id: 'eng', team2Id: 'cro', score1: 4, score2: 2,
    date: '17 de junio, 2026', status: 'FT', group: 'Grupo L',
    xg1: 2.80, xg2: 0.71, possession1: 52, possession2: 48,
    shots1: 22, shots2: 10, shotsOnTarget1: 11, shotsOnTarget2: 5,
    corners1: 6, corners2: 4
  },
  {
    team1Id: 'gha', team2Id: 'pan', score1: 1, score2: 0,
    date: '17 de junio, 2026', status: 'FT', group: 'Grupo L',
    xg1: 1.31, xg2: 0.75, possession1: 44, possession2: 56,
    shots1: 7, shots2: 11, shotsOnTarget1: 2, shotsOnTarget2: 3,
    corners1: 3, corners2: 5
  },
  {
    team1Id: 'uzb', team2Id: 'col', score1: 1, score2: 3,
    date: '17 de junio, 2026', status: 'FT', group: 'Grupo K',
    xg1: 1.16, xg2: 1.62, possession1: 45, possession2: 55,
    shots1: 11, shots2: 15, shotsOnTarget1: 4, shotsOnTarget2: 6,
    corners1: 3, corners2: 5
  },
  {
    team1Id: 'cze', team2Id: 'rsa', score1: 1, score2: 1,
    date: '18 de junio, 2026', status: 'FT', group: 'Grupo A',
    xg1: 1.02, xg2: 1.39, possession1: 46, possession2: 54,
    shots1: 10, shots2: 13, shotsOnTarget1: 3, shotsOnTarget2: 4,
    corners1: 4, corners2: 5
  },
  {
    team1Id: 'sui', team2Id: 'bih', score1: 4, score2: 1,
    date: '18 de junio, 2026', status: 'FT', group: 'Grupo B',
    xg1: 2.06, xg2: 0.23, possession1: 64, possession2: 36,
    shots1: 18, shots2: 5, shotsOnTarget1: 8, shotsOnTarget2: 2,
    corners1: 7, corners2: 2
  },
  {
    team1Id: 'can', team2Id: 'qat', score1: 6, score2: 0,
    date: '18 de junio, 2026', status: 'FT', group: 'Grupo B',
    xg1: 4.75, xg2: 0.18, possession1: 68, possession2: 32,
    shots1: 24, shots2: 4, shotsOnTarget1: 11, shotsOnTarget2: 1,
    corners1: 9, corners2: 2
  },
  {
    team1Id: 'mex', team2Id: 'kor', score1: 1, score2: 0,
    date: '19 de junio, 2026', status: 'FT', group: 'Grupo A',
    xg1: 0.48, xg2: 0.69, possession1: 45, possession2: 55,
    shots1: 8, shots2: 12, shotsOnTarget1: 3, shotsOnTarget2: 4,
    corners1: 3, corners2: 5
  },
  {
    team1Id: 'usa', team2Id: 'aus', score1: 2, score2: 0,
    date: '19 de junio, 2026', status: 'FT', group: 'Grupo D',
    xg1: 1.50, xg2: 0.45, possession1: 58, possession2: 42,
    shots1: 14, shots2: 8, shotsOnTarget1: 5, shotsOnTarget2: 2,
    corners1: 6, corners2: 4
  },
  {
    team1Id: 'sco', team2Id: 'mar', score1: 0, score2: 1,
    date: '19 de junio, 2026', status: 'FT', group: 'Grupo C',
    xg1: 0.65, xg2: 1.45, possession1: 41, possession2: 59,
    shots1: 9, shots2: 15, shotsOnTarget1: 2, shotsOnTarget2: 5,
    corners1: 3, corners2: 6
  }
];

export function updateWcRealResults(newResults: RealMatch[]) {
  WC_2026_REAL_RESULTS.length = 0;
  WC_2026_REAL_RESULTS.push(...newResults);
}

export function computeCalibratedElos(baseTeams: Team[], results: RealMatch[] = WC_2026_REAL_RESULTS): Team[] {
  // Deep copy baseTeams so we don't mutate input
  const teamsMap = new Map(baseTeams.map(t => [t.id, { ...t }]));

  const hosts = new Set(['usa', 'mex', 'can']);
  const HOME_ADV = 75;
  const BASE_K = 55; // World Cup baseline K-Factor is 55.

  const gMult = (gd: number) => {
    const d = Math.abs(gd);
    return d <= 1 ? 1 : d === 2 ? 1.5 : (11 + d) / 8;
  };

  const expectedScore = (a: number, b: number, hb: number) => {
    return 1 / (1 + Math.pow(10, (b - (a + hb)) / 400));
  };

  // Helper to parse dates into numerical days (handling June and July 2026)
  const parseDateToDay = (dateStr: string): number => {
    const dayMatch = dateStr.match(/(\d+)/);
    if (!dayMatch) return 11;
    const day = parseInt(dayMatch[1], 10);
    if (dateStr.includes("julio") || dateStr.includes("July")) {
      return day + 30; // July days are offset after 30 days of June
    }
    return day; // June day
  };

  // Sort results chronologically to ensure ELO is formulated in correct physical sequence
  const sortedResults = [...results].sort((a, b) => {
    return parseDateToDay(a.date) - parseDateToDay(b.date);
  });

  const latestDay = sortedResults.length > 0 
    ? Math.max(...sortedResults.map(m => parseDateToDay(m.date)))
    : 11;

  // Evaluate the relative weight based on the quality of the opponent
  const getOpponentQualityFactor = (oppElo: number, oppRank: number) => {
    const eloScore = (Math.max(1200, Math.min(2100, oppElo)) - 1200) / 600; // 0.0 to 1.5
    const rankScore = oppRank <= 10 ? 1.4 : oppRank <= 20 ? 1.25 : oppRank <= 40 ? 1.0 : 0.75;
    return (eloScore + rankScore) / 2.0; // returns within ~0.55 to 1.45
  };

  for (const match of sortedResults) {
    const t1 = teamsMap.get(match.team1Id);
    const t2 = teamsMap.get(match.team2Id);
    if (!t1 || !t2) continue;

    // 1. CALCULAR DECAIMIENTO TEMPORAL (Ponderar más los partidos recientes)
    const matchDay = parseDateToDay(match.date);
    const daysAgo = Math.max(0, latestDay - matchDay);
    // Exponential decay multiplier: weights decay smoothly from 1.5 (0 days ago) to 0.5 (older matches)
    const recencyWeight = 0.5 + 1.0 * Math.exp(-0.15 * daysAgo);

    // Apply temporal decay to the learning rate / K-factor, giving maximum weight to modern results
    const K = BASE_K * recencyWeight;

    // 2. PONDERAR CALIDAD DE LOS RIVALES
    const oppQuality1 = getOpponentQualityFactor(t2.elo, t2.fifaRanking);
    const oppQuality2 = getOpponentQualityFactor(t1.elo, t1.fifaRanking);

    const hb = (hosts.has(t1.id) ? HOME_ADV : 0) - (hosts.has(t2.id) ? HOME_ADV : 0);
    const exp1 = expectedScore(t1.elo, t2.elo, hb);
    const score1 = match.score1 > match.score2 ? 1 : match.score1 < match.score2 ? 0 : 0.5;

    const gd = match.score1 - match.score2;
    const mult = gMult(gd);
    const delta = K * mult * (score1 - exp1);

    // ELO transfer adjusted symmetrically by opponent quality:
    const delta1 = delta * (delta > 0 ? oppQuality1 : (1 / oppQuality1));
    const delta2 = -delta * ((-delta) > 0 ? oppQuality2 : (1 / oppQuality2));

    t1.elo = Math.round(t1.elo + delta1);
    t2.elo = Math.round(t2.elo + delta2);

    // Dynamic Momentum recent form updates scaled by temporal recency and opponent quality
    const momentumDelta1 = 0.05 * recencyWeight * oppQuality1;
    const momentumDelta2 = 0.05 * recencyWeight * oppQuality2;

    if (score1 === 1) {
      t1.recentForm = ['W', ...t1.recentForm.slice(0, 4)];
      t2.recentForm = ['L', ...t2.recentForm.slice(0, 4)];
      t1.momentum = Math.min(1.25, t1.momentum + momentumDelta1);
      t2.momentum = Math.max(0.75, t2.momentum - momentumDelta2 * 0.8);
    } else if (score1 === 0) {
      t1.recentForm = ['L', ...t1.recentForm.slice(0, 4)];
      t2.recentForm = ['W', ...t2.recentForm.slice(0, 4)];
      t1.momentum = Math.max(0.75, t1.momentum - momentumDelta1 * 0.8);
      t2.momentum = Math.min(1.25, t2.momentum + momentumDelta2);
    } else {
      t1.recentForm = ['D', ...t1.recentForm.slice(0, 4)];
      t2.recentForm = ['D', ...t2.recentForm.slice(0, 4)];
      t1.momentum = t1.momentum > 1 ? Math.max(1.0, t1.momentum - 0.02) : Math.min(1.0, t1.momentum + 0.02);
      t2.momentum = t2.momentum > 1 ? Math.max(1.0, t2.momentum - 0.02) : Math.min(1.0, t2.momentum + 0.02);
    }

    // EXTRAER MICRO-ESTADÍSTICAS AVANZADAS PARA AJUSTE ULTRA-EXACTO
    if (match.xg1 !== undefined && match.xg2 !== undefined) {
      // expected goals de base
      const predXG1 = Math.max(0.3, t1.offPower * t2.defPower * 1.35);
      const predXG2 = Math.max(0.3, t2.offPower * t1.defPower * 1.35);

      const xgErr1 = match.xg1 - predXG1;
      const xgErr2 = match.xg2 - predXG2;

      // Tiros al arco (Shots on Target) vs esperados
      const sOnTarget1 = match.shotsOnTarget1 || 4;
      const sOnTarget2 = match.shotsOnTarget2 || 4;
      const predSOT1 = Math.max(1.0, t1.offPower * t2.defPower * 4.2);
      const predSOT2 = Math.max(1.0, t2.offPower * t1.defPower * 4.2);
      const sotErr1 = sOnTarget1 - predSOT1;
      const sotErr2 = sOnTarget2 - predSOT2;

      // Atajadas del Portero (Goalkeeper Saves)
      const saves1 = Math.max(0, sOnTarget2 - match.score2);
      const saves2 = Math.max(0, sOnTarget1 - match.score1);
      const savesAdv1 = saves1 - predSOT2 * 0.25;
      const savesAdv2 = saves2 - predSOT1 * 0.25;

      // Tasa de acierto / eficiencia del tiro
      const accuracy1 = sOnTarget1 / (match.shots1 || 10);
      const accuracy2 = sOnTarget2 / (match.shots2 || 10);
      const accDiff = accuracy1 - accuracy2;

      // Tasa de presión de tiros de esquina (Corners)
      const corners1 = match.corners1 || 4;
      const corners2 = match.corners2 || 4;
      const cornersDiff = corners1 - corners2;

      // Learning rates scaled based on recency and opponent difficulty
      const lrOff1 = 0.035 * recencyWeight * oppQuality1;
      const lrOff2 = 0.035 * recencyWeight * oppQuality2;
      const lrDef1 = 0.03 * recencyWeight * oppQuality1;
      const lrDef2 = 0.03 * recencyWeight * oppQuality2;

      // Calibrar ofensiva con xG, tiros al arco, precisión y córners
      t1.offPower = parseFloat(Math.max(0.60, Math.min(3.40, t1.offPower + (xgErr1 * 0.7 + sotErr1 * 0.15 + accDiff * 0.15) * lrOff1)).toFixed(3));
      t2.offPower = parseFloat(Math.max(0.60, Math.min(3.40, t2.offPower + (xgErr2 * 0.7 + sotErr2 * 0.15 - accDiff * 0.15) * lrOff2)).toFixed(3));

      // Calibrar defensiva con goles encajados, xG de rival y atajadas
      const scoreErr1 = match.score2 - predXG2;
      const scoreErr2 = match.score1 - predXG1;
      t1.defPower = parseFloat(Math.max(0.25, Math.min(1.75, t1.defPower + (scoreErr1 * 0.6 + xgErr2 * 0.2 - savesAdv1 * 0.1) * lrDef1)).toFixed(3));
      t2.defPower = parseFloat(Math.max(0.25, Math.min(1.75, t2.defPower + (scoreErr2 * 0.6 + xgErr1 * 0.2 - savesAdv2 * 0.1) * lrDef2)).toFixed(3));

      // Calibrar precisión en el Soccer Power Index (SPI) basado en posesión dominante, tiros y córners
      const spiAdj1 = (match.possession1 - 50) * 0.08 + (match.shots1 - match.shots2) * 0.07 + xgErr1 * 0.3 + cornersDiff * 0.1;
      const spiAdj2 = (match.possession2 - 50) * 0.08 + (match.shots2 - match.shots1) * 0.07 + xgErr2 * 0.3 - cornersDiff * 0.1;

      t1.spi = parseFloat(Math.max(40.0, Math.min(99.0, t1.spi + spiAdj1 * recencyWeight * oppQuality1 * 0.6)).toFixed(1));
      t2.spi = parseFloat(Math.max(40.0, Math.min(99.0, t2.spi + spiAdj2 * recencyWeight * oppQuality2 * 0.6)).toFixed(1));
    }
  }

  // 3. REGULARIZACIÓN DE ANCLAJE AL RANKING FIFA
  for (const t of teamsMap.values()) {
    const fifaAnchorElo = 1920 - (t.fifaRanking - 1) * 7.2;
    const anchorStrength = 0.15;
    t.elo = Math.round(t.elo * (1 - anchorStrength) + fifaAnchorElo * anchorStrength);
  }

  return Array.from(teamsMap.values());
}
