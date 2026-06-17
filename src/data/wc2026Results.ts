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

export const WC_2026_REAL_RESULTS: RealMatch[] = [
  {
    team1Id: 'mex', team2Id: 'rsa', score1: 2, score2: 0,
    date: '11 de junio, 2026', status: 'FT', group: 'Grupo A',
    xg1: 1.41, xg2: 0.07, possession1: 58, possession2: 42,
    shots1: 15, shots2: 3, shotsOnTarget1: 6, shotsOnTarget2: 1,
    corners1: 5, corners2: 2
  },
  {
    team1Id: 'kor', team2Id: 'cze', score1: 2, score2: 1,
    date: '11 de junio, 2026', status: 'FT', group: 'Grupo A',
    xg1: 1.84, xg2: 0.81, possession1: 61, possession2: 39,
    shots1: 18, shots2: 8, shotsOnTarget1: 7, shotsOnTarget2: 3,
    corners1: 6, corners2: 4
  },
  {
    team1Id: 'can', team2Id: 'bih', score1: 1, score2: 1,
    date: '12 de junio, 2026', status: 'FT', group: 'Grupo B',
    xg1: 1.15, xg2: 1.05, possession1: 52, possession2: 48,
    shots1: 12, shots2: 10, shotsOnTarget1: 4, shotsOnTarget2: 4,
    corners1: 4, corners2: 5
  },
  {
    team1Id: 'usa', team2Id: 'par', score1: 4, score2: 1,
    date: '12 de junio, 2026', status: 'FT', group: 'Grupo D',
    xg1: 2.65, xg2: 0.95, possession1: 55, possession2: 45,
    shots1: 22, shots2: 11, shotsOnTarget1: 10, shotsOnTarget2: 3,
    corners1: 7, corners2: 3
  },
  {
    team1Id: 'qat', team2Id: 'sui', score1: 1, score2: 1,
    date: '13 de junio, 2026', status: 'FT', group: 'Grupo B',
    xg1: 0.85, xg2: 1.65, possession1: 40, possession2: 60,
    shots1: 7, shots2: 17, shotsOnTarget1: 2, shotsOnTarget2: 5,
    corners1: 2, corners2: 8
  },
  {
    team1Id: 'bra', team2Id: 'mar', score1: 1, score2: 1,
    date: '13 de junio, 2026', status: 'FT', group: 'Grupo C',
    xg1: 1.45, xg2: 1.25, possession1: 54, possession2: 46,
    shots1: 13, shots2: 11, shotsOnTarget1: 4, shotsOnTarget2: 4,
    corners1: 5, corners2: 4
  },
  {
    team1Id: 'hai', team2Id: 'sco', score1: 0, score2: 1,
    date: '13 de junio, 2026', status: 'FT', group: 'Grupo C',
    xg1: 0.55, xg2: 1.25, possession1: 35, possession2: 65,
    shots1: 5, shots2: 14, shotsOnTarget1: 1, shotsOnTarget2: 5,
    corners1: 2, corners2: 6
  },
  {
    team1Id: 'aus', team2Id: 'tur', score1: 2, score2: 0,
    date: '14 de junio, 2026', status: 'FT', group: 'Grupo D',
    xg1: 1.35, xg2: 0.85, possession1: 48, possession2: 52,
    shots1: 11, shots2: 9, shotsOnTarget1: 5, shotsOnTarget2: 2,
    corners1: 4, corners2: 5
  },
  {
    team1Id: 'ger', team2Id: 'cuw', score1: 7, score2: 1,
    date: '14 de junio, 2026', status: 'FT', group: 'Grupo E',
    xg1: 4.85, xg2: 0.45, possession1: 72, possession2: 28,
    shots1: 28, shots2: 4, shotsOnTarget1: 14, shotsOnTarget2: 1,
    corners1: 11, corners2: 1
  },
  {
    team1Id: 'ned', team2Id: 'jpn', score1: 2, score2: 2,
    date: '14 de junio, 2026', status: 'FT', group: 'Grupo H',
    xg1: 1.95, xg2: 1.85, possession1: 50, possession2: 50,
    shots1: 14, shots2: 15, shotsOnTarget1: 6, shotsOnTarget2: 7,
    corners1: 5, corners2: 6
  },
  {
    team1Id: 'civ', team2Id: 'ecu', score1: 1, score2: 0,
    date: '14 de junio, 2026', status: 'FT', group: 'Grupo B',
    xg1: 1.05, xg2: 0.95, possession1: 45, possession2: 55,
    shots1: 10, shots2: 11, shotsOnTarget1: 3, shotsOnTarget2: 2,
    corners1: 4, corners2: 4
  },
  {
    team1Id: 'swe', team2Id: 'tun', score1: 5, score2: 1,
    date: '14 de junio, 2026', status: 'FT', group: 'Grupo B',
    xg1: 3.15, xg2: 0.75, possession1: 60, possession2: 40,
    shots1: 19, shots2: 7, shotsOnTarget1: 9, shotsOnTarget2: 2,
    corners1: 6, corners2: 3
  },
  {
    team1Id: 'bel', team2Id: 'egy', score1: 1, score2: 1,
    date: '15 de junio, 2026', status: 'FT', group: 'Grupo H',
    xg1: 1.35, xg2: 1.15, possession1: 57, possession2: 43,
    shots1: 13, shots2: 10, shotsOnTarget1: 4, shotsOnTarget2: 3,
    corners1: 5, corners2: 4
  },
  {
    team1Id: 'irn', team2Id: 'nzl', score1: 2, score2: 2,
    date: '15 de junio, 2026', status: 'FT', group: 'Grupo G',
    xg1: 1.55, xg2: 1.35, possession1: 55, possession2: 45,
    shots1: 12, shots2: 9, shotsOnTarget1: 5, shotsOnTarget2: 4,
    corners1: 4, corners2: 3
  },
  {
    team1Id: 'esp', team2Id: 'cpv', score1: 0, score2: 0,
    date: '15 de junio, 2026', status: 'FT', group: 'Grupo B',
    xg1: 1.55, xg2: 0.22, possession1: 75, possession2: 25,
    shots1: 16, shots2: 2, shotsOnTarget1: 4, shotsOnTarget2: 0,
    corners1: 9, corners2: 1
  },
  {
    team1Id: 'ksa', team2Id: 'uru', score1: 1, score2: 1,
    date: '15 de junio, 2026', status: 'FT', group: 'Grupo F',
    xg1: 0.95, xg2: 1.75, possession1: 41, possession2: 59,
    shots1: 8, shots2: 16, shotsOnTarget1: 3, shotsOnTarget2: 6,
    corners1: 3, corners2: 7
  },
  {
    team1Id: 'fra', team2Id: 'sen', score1: 3, score2: 1,
    date: '16 de junio, 2026', status: 'FT', group: 'Grupo C',
    xg1: 2.25, xg2: 1.05, possession1: 58, possession2: 42,
    shots1: 17, shots2: 10, shotsOnTarget1: 6, shotsOnTarget2: 3,
    corners1: 6, corners2: 4
  },
  {
    team1Id: 'nor', team2Id: 'irq', score1: 4, score2: 1,
    date: '16 de junio, 2026', status: 'FT', group: 'Grupo E',
    xg1: 2.55, xg2: 0.85, possession1: 62, possession2: 38,
    shots1: 19, shots2: 7, shotsOnTarget1: 8, shotsOnTarget2: 2,
    corners1: 7, corners2: 2
  },
  {
    team1Id: 'arg', team2Id: 'alg', score1: 3, score2: 0,
    date: '17 de junio, 2026', status: 'FT', group: 'Grupo C',
    xg1: 2.80, xg2: 0.40, possession1: 64, possession2: 36,
    shots1: 18, shots2: 6, shotsOnTarget1: 8, shotsOnTarget2: 2,
    corners1: 8, corners2: 3
  },
  {
    team1Id: 'aut', team2Id: 'jor', score1: 3, score2: 1,
    date: '17 de junio, 2026', status: 'FT', group: 'Grupo F',
    xg1: 1.95, xg2: 0.75, possession1: 58, possession2: 42,
    shots1: 14, shots2: 7, shotsOnTarget1: 6, shotsOnTarget2: 2,
    corners1: 5, corners2: 3
  }
];

export function computeCalibratedElos(baseTeams: Team[]): Team[] {
  // Deep copy baseTeams so we don't mutate input
  const teamsMap = new Map(baseTeams.map(t => [t.id, { ...t }]));

  const hosts = new Set(['usa', 'mex', 'can']);
  const HOME_ADV = 75;
  const K = 55; // World Cup K-Factor in backtest is 55.

  const gMult = (gd: number) => {
    const d = Math.abs(gd);
    return d <= 1 ? 1 : d === 2 ? 1.5 : (11 + d) / 8;
  };

  const expectedScore = (a: number, b: number, hb: number) => {
    return 1 / (1 + Math.pow(10, (b - (a + hb)) / 400));
  };

  for (const match of WC_2026_REAL_RESULTS) {
    const t1 = teamsMap.get(match.team1Id);
    const t2 = teamsMap.get(match.team2Id);
    if (!t1 || !t2) continue;

    const hb = (hosts.has(t1.id) ? HOME_ADV : 0) - (hosts.has(t2.id) ? HOME_ADV : 0);
    const exp1 = expectedScore(t1.elo, t2.elo, hb);
    const score1 = match.score1 > match.score2 ? 1 : match.score1 < match.score2 ? 0 : 0.5;

    const gd = match.score1 - match.score2;
    const mult = gMult(gd);
    const delta = K * mult * (score1 - exp1);

    t1.elo = Math.round(t1.elo + delta);
    t2.elo = Math.round(t2.elo - delta);

    // Update form indicator and momentum
    if (score1 === 1) {
      t1.recentForm = ['W', ...t1.recentForm.slice(0, 4)];
      t2.recentForm = ['L', ...t2.recentForm.slice(0, 4)];
      t1.momentum = Math.min(1.20, t1.momentum + 0.05);
      t2.momentum = Math.max(0.80, t2.momentum - 0.04);
    } else if (score1 === 0) {
      t1.recentForm = ['L', ...t1.recentForm.slice(0, 4)];
      t2.recentForm = ['W', ...t2.recentForm.slice(0, 4)];
      t1.momentum = Math.max(0.80, t1.momentum - 0.04);
      t2.momentum = Math.min(1.20, t2.momentum + 0.05);
    } else {
      t1.recentForm = ['D', ...t1.recentForm.slice(0, 4)];
      t2.recentForm = ['D', ...t2.recentForm.slice(0, 4)];
      t1.momentum = t1.momentum > 1 ? Math.max(1.0, t1.momentum - 0.01) : Math.min(1.0, t1.momentum + 0.01);
      t2.momentum = t2.momentum > 1 ? Math.max(1.0, t2.momentum - 0.01) : Math.min(1.0, t2.momentum + 0.01);
    }

    // Dynamic Bayesian-ready calibration of offense/defense attributes using real match statistics
    if (match.xg1 !== undefined && match.xg2 !== undefined) {
      const predXG1 = Math.max(0.3, t1.offPower * t2.defPower * 1.35);
      const predXG2 = Math.max(0.3, t2.offPower * t1.defPower * 1.35);

      const offErr1 = match.xg1 - predXG1;
      const offErr2 = match.xg2 - predXG2;
      
      const defErr1 = match.score2 - predXG2;
      const defErr2 = match.score1 - predXG1;

      // Adjust offPower (higher is better, clamp range [0.65, 3.20])
      t1.offPower = parseFloat(Math.max(0.65, Math.min(3.20, t1.offPower + offErr1 * 0.04)).toFixed(3));
      t2.offPower = parseFloat(Math.max(0.65, Math.min(3.20, t2.offPower + offErr2 * 0.04)).toFixed(3));

      // Adjust defPower (lower is better, clamp range [0.30, 1.60])
      t1.defPower = parseFloat(Math.max(0.30, Math.min(1.60, t1.defPower + defErr2 * 0.035)).toFixed(3));
      t2.defPower = parseFloat(Math.max(0.30, Math.min(1.60, t2.defPower + defErr1 * 0.035)).toFixed(3));
      
      // Calibrate Soccer Power Index (SPI) based on possession, shots and xG differentials
      const spiAdj1 = (match.possession1 - 50) * 0.05 + (match.shots1 - match.shots2) * 0.05 + offErr1 * 0.25;
      const spiAdj2 = (match.possession2 - 50) * 0.05 + (match.shots2 - match.shots1) * 0.05 + offErr2 * 0.25;
      
      t1.spi = parseFloat(Math.max(45, Math.min(98.5, t1.spi + spiAdj1)).toFixed(1));
      t2.spi = parseFloat(Math.max(45, Math.min(98.5, t2.spi + spiAdj2)).toFixed(1));
    }
  }

  return Array.from(teamsMap.values());
}
