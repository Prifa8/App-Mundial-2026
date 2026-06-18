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
    xg1: 1.45, xg2: 0.18, possession1: 61, possession2: 39,
    shots1: 16, shots2: 3, shotsOnTarget1: 4, shotsOnTarget2: 2,
    corners1: 5, corners2: 2
  },
  {
    team1Id: 'kor', team2Id: 'cze', score1: 2, score2: 1,
    date: '11 de junio, 2026', status: 'FT', group: 'Grupo A',
    xg1: 2.30, xg2: 0.83, possession1: 62, possession2: 38,
    shots1: 15, shots2: 7, shotsOnTarget1: 6, shotsOnTarget2: 4,
    corners1: 6, corners2: 4
  },
  {
    team1Id: 'can', team2Id: 'bih', score1: 1, score2: 1,
    date: '12 de junio, 2026', status: 'FT', group: 'Grupo B',
    xg1: 1.28, xg2: 0.95, possession1: 61, possession2: 39,
    shots1: 13, shots2: 8, shotsOnTarget1: 4, shotsOnTarget2: 3,
    corners1: 4, corners2: 5
  },
  {
    team1Id: 'qat', team2Id: 'sui', score1: 1, score2: 1,
    date: '13 de junio, 2026', status: 'FT', group: 'Grupo B',
    xg1: 0.61, xg2: 3.01, possession1: 32, possession2: 68,
    shots1: 6, shots2: 26, shotsOnTarget1: 3, shotsOnTarget2: 7,
    corners1: 2, corners2: 8
  },
  {
    team1Id: 'bra', team2Id: 'mar', score1: 1, score2: 1,
    date: '13 de junio, 2026', status: 'FT', group: 'Grupo C',
    xg1: 1.29, xg2: 1.33, possession1: 51, possession2: 49,
    shots1: 12, shots2: 14, shotsOnTarget1: 5, shotsOnTarget2: 3,
    corners1: 5, corners2: 4
  },
  {
    team1Id: 'hai', team2Id: 'sco', score1: 0, score2: 1,
    date: '13 de junio, 2026', status: 'FT', group: 'Grupo C',
    xg1: 1.06, xg2: 1.05, possession1: 54, possession2: 46,
    shots1: 15, shots2: 9, shotsOnTarget1: 2, shotsOnTarget2: 2,
    corners1: 2, corners2: 6
  },
  {
    team1Id: 'usa', team2Id: 'par', score1: 4, score2: 1,
    date: '12 de junio, 2026', status: 'FT', group: 'Grupo D',
    xg1: 1.66, xg2: 0.58, possession1: 65, possession2: 35,
    shots1: 16, shots2: 9, shotsOnTarget1: 6, shotsOnTarget2: 1,
    corners1: 7, corners2: 3
  },
  {
    team1Id: 'aus', team2Id: 'tur', score1: 2, score2: 0,
    date: '14 de junio, 2026', status: 'FT', group: 'Grupo D',
    xg1: 1.16, xg2: 1.74, possession1: 28, possession2: 72,
    shots1: 9, shots2: 30, shotsOnTarget1: 4, shotsOnTarget2: 8,
    corners1: 4, corners2: 5
  },
  {
    team1Id: 'ger', team2Id: 'cuw', score1: 7, score2: 1,
    date: '14 de junio, 2026', status: 'FT', group: 'Grupo E',
    xg1: 4.07, xg2: 0.50, possession1: 65, possession2: 35,
    shots1: 26, shots2: 8, shotsOnTarget1: 12, shotsOnTarget2: 2,
    corners1: 11, corners2: 1
  },
  {
    team1Id: 'civ', team2Id: 'ecu', score1: 1, score2: 0,
    date: '14 de junio, 2026', status: 'FT', group: 'Grupo E',
    xg1: 1.52, xg2: 0.97, possession1: 48, possession2: 52,
    shots1: 15, shots2: 12, shotsOnTarget1: 4, shotsOnTarget2: 1,
    corners1: 4, corners2: 4
  },
  {
    team1Id: 'ned', team2Id: 'jpn', score1: 2, score2: 2,
    date: '14 de junio, 2026', status: 'FT', group: 'Grupo F',
    xg1: 1.07, xg2: 0.78, possession1: 60, possession2: 40,
    shots1: 10, shots2: 10, shotsOnTarget1: 6, shotsOnTarget2: 3,
    corners1: 5, corners2: 6
  },
  {
    team1Id: 'swe', team2Id: 'tun', score1: 5, score2: 1,
    date: '15 de junio, 2026', status: 'FT', group: 'Grupo F',
    xg1: 1.46, xg2: 0.40, possession1: 49, possession2: 51,
    shots1: 13, shots2: 6, shotsOnTarget1: 7, shotsOnTarget2: 2,
    corners1: 6, corners2: 3
  },
  {
    team1Id: 'bel', team2Id: 'egy', score1: 1, score2: 1,
    date: '15 de junio, 2026', status: 'FT', group: 'Grupo G',
    xg1: 1.35, xg2: 1.09, possession1: 54, possession2: 46,
    shots1: 15, shots2: 14, shotsOnTarget1: 3, shotsOnTarget2: 3,
    corners1: 5, corners2: 4
  },
  {
    team1Id: 'irn', team2Id: 'nzl', score1: 2, score2: 2,
    date: '16 de junio, 2026', status: 'FT', group: 'Grupo G',
    xg1: 1.57, xg2: 1.32, possession1: 49, possession2: 51,
    shots1: 17, shots2: 14, shotsOnTarget1: 4, shotsOnTarget2: 8,
    corners1: 4, corners2: 3
  },
  {
    team1Id: 'esp', team2Id: 'cpv', score1: 0, score2: 0,
    date: '15 de junio, 2026', status: 'FT', group: 'Grupo H',
    xg1: 2.26, xg2: 0.25, possession1: 74, possession2: 26,
    shots1: 27, shots2: 6, shotsOnTarget1: 7, shotsOnTarget2: 1,
    corners1: 9, corners2: 1
  },
  {
    team1Id: 'ksa', team2Id: 'uru', score1: 1, score2: 1,
    date: '15 de junio, 2026', status: 'FT', group: 'Grupo H',
    xg1: 0.70, xg2: 1.97, possession1: 33, possession2: 67,
    shots1: 7, shots2: 27, shotsOnTarget1: 3, shotsOnTarget2: 10,
    corners1: 3, corners2: 7
  },
  {
    team1Id: 'fra', team2Id: 'sen', score1: 3, score2: 1,
    date: '16 de junio, 2026', status: 'FT', group: 'Grupo I',
    xg1: 1.75, xg2: 0.54, possession1: 53, possession2: 47,
    shots1: 11, shots2: 6, shotsOnTarget1: 8, shotsOnTarget2: 2,
    corners1: 6, corners2: 4
  },
  {
    team1Id: 'irq', team2Id: 'nor', score1: 1, score2: 4,
    date: '16 de junio, 2026', status: 'FT', group: 'Grupo I',
    xg1: 0.82, xg2: 2.30, possession1: 39, possession2: 61,
    shots1: 11, shots2: 12, shotsOnTarget1: 1, shotsOnTarget2: 5,
    corners1: 7, corners2: 2
  },
  {
    team1Id: 'arg', team2Id: 'alg', score1: 3, score2: 0,
    date: '17 de junio, 2026', status: 'FT', group: 'Grupo J',
    xg1: 1.34, xg2: 0.38, possession1: 48, possession2: 52,
    shots1: 10, shots2: 7, shotsOnTarget1: 6, shotsOnTarget2: 0,
    corners1: 8, corners2: 3
  },
  {
    team1Id: 'aut', team2Id: 'jor', score1: 3, score2: 1,
    date: '17 de junio, 2026', status: 'FT', group: 'Grupo J',
    xg1: 1.60, xg2: 0.72, possession1: 63, possession2: 37,
    shots1: 11, shots2: 11, shotsOnTarget1: 4, shotsOnTarget2: 4,
    corners1: 5, corners2: 3
  },
  {
    team1Id: 'por', team2Id: 'cod', score1: 1, score2: 1,
    date: '17 de junio, 2026', status: 'FT', group: 'Grupo K',
    xg1: 0.75, xg2: 0.84, possession1: 75, possession2: 25,
    shots1: 7, shots2: 8, shotsOnTarget1: 1, shotsOnTarget2: 2,
    corners1: 4, corners2: 3
  },
  {
    team1Id: 'uzb', team2Id: 'col', score1: 1, score2: 3,
    date: '18 de junio, 2026', status: 'FT', group: 'Grupo K',
    xg1: 1.16, xg2: 1.62, possession1: 45, possession2: 55,
    shots1: 11, shots2: 15, shotsOnTarget1: 4, shotsOnTarget2: 6,
    corners1: 3, corners2: 5
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
    xg1: 1.25, xg2: 0.75, possession1: 44, possession2: 56,
    shots1: 7, shots2: 11, shotsOnTarget1: 2, shotsOnTarget2: 3,
    corners1: 3, corners2: 5
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

  for (const match of results) {
    const t1 = teamsMap.get(match.team1Id);
    const t2 = teamsMap.get(match.team2Id);
    if (!t1 || !t2) continue;

    // 1. CALCULAR PONDERACIÓN DE RECENCIA (Ponderar más los partidos más recientes)
    // El mundial empieza el 11 de junio. Más cercano al 17 de junio = mayor peso
    const matchDay = parseInt(match.date.match(/\d+/)?.[0] || '11', 10);
    const dayDistance = Math.max(0, matchDay - 11);
    // Peso de recencia escala linealmente desde 1.0 (11 junio) hasta 1.75 (17 junio)
    const recencyWeight = 1.0 + dayDistance * 0.125;

    // Aplicar peso de recencia al factor K para adaptabilidad instantánea ELO
    const K = BASE_K * recencyWeight;

    const hb = (hosts.has(t1.id) ? HOME_ADV : 0) - (hosts.has(t2.id) ? HOME_ADV : 0);
    const exp1 = expectedScore(t1.elo, t2.elo, hb);
    const score1 = match.score1 > match.score2 ? 1 : match.score1 < match.score2 ? 0 : 0.5;

    const gd = match.score1 - match.score2;
    const mult = gMult(gd);
    const delta = K * mult * (score1 - exp1);

    t1.elo = Math.round(t1.elo + delta);
    t2.elo = Math.round(t2.elo - delta);

    // Ajuste dinámico de Momentum de racha reciente amortiguado por la recencia
    const momentumDelta = 0.05 * recencyWeight;
    if (score1 === 1) {
      t1.recentForm = ['W', ...t1.recentForm.slice(0, 4)];
      t2.recentForm = ['L', ...t2.recentForm.slice(0, 4)];
      t1.momentum = Math.min(1.25, t1.momentum + momentumDelta);
      t2.momentum = Math.max(0.75, t2.momentum - momentumDelta * 0.8);
    } else if (score1 === 0) {
      t1.recentForm = ['L', ...t1.recentForm.slice(0, 4)];
      t2.recentForm = ['W', ...t2.recentForm.slice(0, 4)];
      t1.momentum = Math.max(0.75, t1.momentum - momentumDelta * 0.8);
      t2.momentum = Math.min(1.25, t2.momentum + momentumDelta);
    } else {
      t1.recentForm = ['D', ...t1.recentForm.slice(0, 4)];
      t2.recentForm = ['D', ...t2.recentForm.slice(0, 4)];
      t1.momentum = t1.momentum > 1 ? Math.max(1.0, t1.momentum - 0.02) : Math.min(1.0, t1.momentum + 0.02);
      t2.momentum = t2.momentum > 1 ? Math.max(1.0, t2.momentum - 0.02) : Math.min(1.0, t2.momentum + 0.02);
    }

    // 2. EXTRAER MICRO-ESTADÍSTICAS AVANZADAS PARA AJUSTE ULTRA-EXACTO
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
      const savesAdv1 = saves1 - predSOT2 * 0.25; // atajadas superiores a la expectativa
      const savesAdv2 = saves2 - predSOT1 * 0.25;

      // Tasa de acierto / eficiencia del tiro
      const accuracy1 = sOnTarget1 / (match.shots1 || 10);
      const accuracy2 = sOnTarget2 / (match.shots2 || 10);
      const accDiff = accuracy1 - accuracy2;

      // Tasa de presión de tiros de esquina (Corners)
      const corners1 = match.corners1 || 4;
      const corners2 = match.corners2 || 4;
      const cornersDiff = corners1 - corners2;

      // Modificadores de aprendizaje híbrido con decaimiento de recencia
      const lrOff = 0.035 * recencyWeight;
      const lrDef = 0.03 * recencyWeight;

      // Calibrar ofensiva con xG, tiros al arco, precisión y córners
      t1.offPower = parseFloat(Math.max(0.60, Math.min(3.40, t1.offPower + (xgErr1 * 0.7 + sotErr1 * 0.15 + accDiff * 0.15) * lrOff)).toFixed(3));
      t2.offPower = parseFloat(Math.max(0.60, Math.min(3.40, t2.offPower + (xgErr2 * 0.7 + sotErr2 * 0.15 - accDiff * 0.15) * lrOff)).toFixed(3));

      // Calibrar defensiva con goles encajados, xG concedido y atajadas sobresalientes
      // Recordar: defPower más bajo es mejor
      const scoreErr1 = match.score2 - predXG2;
      const scoreErr2 = match.score1 - predXG1;
      t1.defPower = parseFloat(Math.max(0.25, Math.min(1.75, t1.defPower + (scoreErr1 * 0.6 + xgErr2 * 0.2 - savesAdv1 * 0.1) * lrDef)).toFixed(3));
      t2.defPower = parseFloat(Math.max(0.25, Math.min(1.75, t2.defPower + (scoreErr2 * 0.6 + xgErr1 * 0.2 - savesAdv2 * 0.1) * lrDef)).toFixed(3));

      // Calibrar precisión en el Soccer Power Index (SPI) basado en posesión dominante, tiros y córners
      const spiAdj1 = (match.possession1 - 50) * 0.08 + (match.shots1 - match.shots2) * 0.07 + xgErr1 * 0.3 + cornersDiff * 0.1;
      const spiAdj2 = (match.possession2 - 50) * 0.08 + (match.shots2 - match.shots1) * 0.07 + xgErr2 * 0.3 - cornersDiff * 0.1;

      t1.spi = parseFloat(Math.max(40.0, Math.min(99.0, t1.spi + spiAdj1 * recencyWeight * 0.6)).toFixed(1));
      t2.spi = parseFloat(Math.max(40.0, Math.min(99.0, t2.spi + spiAdj2 * recencyWeight * 0.6)).toFixed(1));
    }
  }

  return Array.from(teamsMap.values());
}
