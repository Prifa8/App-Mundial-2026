import { Team } from '../types';

export interface RealMatch {
  team1Id: string;
  team2Id: string;
  score1: number;
  score2: number;
  date: string;
  status: string;
  group: string;
}

export const WC_2026_REAL_RESULTS: RealMatch[] = [
  { team1Id: 'mex', team2Id: 'rsa', score1: 2, score2: 0, date: '11 de junio, 2026', status: 'FT', group: 'Grupo A' },
  { team1Id: 'kor', team2Id: 'cze', score1: 2, score2: 1, date: '11 de junio, 2026', status: 'FT', group: 'Grupo A' },
  { team1Id: 'can', team2Id: 'bih', score1: 1, score2: 1, date: '12 de junio, 2026', status: 'FT', group: 'Grupo B' },
  { team1Id: 'usa', team2Id: 'par', score1: 4, score2: 1, date: '12 de junio, 2026', status: 'FT', group: 'Grupo D' },
  { team1Id: 'qat', team2Id: 'sui', score1: 1, score2: 1, date: '13 de junio, 2026', status: 'FT', group: 'Grupo B' },
  { team1Id: 'bra', team2Id: 'mar', score1: 1, score2: 1, date: '13 de junio, 2026', status: 'FT', group: 'Grupo C' },
  { team1Id: 'hai', team2Id: 'sco', score1: 0, score2: 1, date: '13 de junio, 2026', status: 'FT', group: 'Grupo C' },
  { team1Id: 'aus', team2Id: 'tur', score1: 2, score2: 0, date: '14 de junio, 2026', status: 'FT', group: 'Grupo D' },
  { team1Id: 'ger', team2Id: 'cuw', score1: 7, score2: 1, date: '14 de junio, 2026', status: 'FT', group: 'Grupo E' },
  { team1Id: 'ned', team2Id: 'jpn', score1: 2, score2: 2, date: '14 de junio, 2026', status: 'FT', group: 'Grupo H' },
  { team1Id: 'civ', team2Id: 'ecu', score1: 1, score2: 0, date: '14 de junio, 2026', status: 'FT', group: 'Grupo B' },
  { team1Id: 'swe', team2Id: 'tun', score1: 5, score2: 1, date: '14 de junio, 2026', status: 'FT', group: 'Grupo B' },
  { team1Id: 'bel', team2Id: 'egy', score1: 1, score2: 1, date: '15 de junio, 2026', status: 'FT', group: 'Grupo H' },
  { team1Id: 'irn', team2Id: 'nzl', score1: 2, score2: 2, date: '15 de junio, 2026', status: 'FT', group: 'Grupo G' },
  { team1Id: 'esp', team2Id: 'cpv', score1: 0, score2: 0, date: '15 de junio, 2026', status: 'FT', group: 'Grupo B' },
  { team1Id: 'ksa', team2Id: 'uru', score1: 1, score2: 1, date: '15 de junio, 2026', status: 'FT', group: 'Grupo F' },
  { team1Id: 'fra', team2Id: 'irq', score1: 3, score2: 1, date: '16 de junio, 2026', status: 'FT', group: 'Grupo C' }
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
  }

  return Array.from(teamsMap.values());
}
