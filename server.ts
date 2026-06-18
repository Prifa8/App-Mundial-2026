import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { WC_2026_REAL_RESULTS, RealMatch } from "./src/data/wc2026Results";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory store starting with our completed 24 Round 1 matches
  let currentResults: RealMatch[] = [...WC_2026_REAL_RESULTS];

  // Extra matches for Round 2, representing live data feed increments
  const ROUND_2_RESULTS: RealMatch[] = [
    {
      team1Id: 'mex', team2Id: 'kor', score1: 2, score2: 2,
      date: '18 de junio, 2026', status: 'FT', group: 'Grupo A',
      xg1: 1.85, xg2: 1.92, possession1: 53, possession2: 47,
      shots1: 14, shots2: 15, shotsOnTarget1: 5, shotsOnTarget2: 6,
      corners1: 4, corners2: 5
    },
    {
      team1Id: 'rsa', team2Id: 'cze', score1: 0, score2: 1,
      date: '18 de junio, 2026', status: 'FT', group: 'Grupo A',
      xg1: 0.65, xg2: 1.48, possession1: 44, possession2: 56,
      shots1: 8, shots2: 16, shotsOnTarget1: 2, shotsOnTarget2: 5,
      corners1: 2, corners2: 7
    },
    {
      team1Id: 'can', team2Id: 'sui', score1: 1, score2: 2,
      date: '18 de junio, 2026', status: 'FT', group: 'Grupo B',
      xg1: 1.30, xg2: 1.75, possession1: 50, possession2: 50,
      shots1: 11, shots2: 14, shotsOnTarget1: 4, shotsOnTarget2: 6,
      corners1: 3, corners2: 4
    },
    {
      team1Id: 'bih', team2Id: 'qat', score1: 2, score2: 0,
      date: '18 de junio, 2026', status: 'FT', group: 'Grupo B',
      xg1: 1.95, xg2: 0.52, possession1: 59, possession2: 41,
      shots1: 18, shots2: 7, shotsOnTarget1: 8, shotsOnTarget2: 2,
      corners1: 8, corners2: 1
    },
    {
      team1Id: 'bra', team2Id: 'hai', score1: 4, score2: 0,
      date: '19 de junio, 2026', status: 'FT', group: 'Grupo C',
      xg1: 3.25, xg2: 0.15, possession1: 68, possession2: 32,
      shots1: 24, shots2: 4, shotsOnTarget1: 11, shotsOnTarget2: 1,
      corners1: 10, corners2: 1
    },
    {
      team1Id: 'mar', team2Id: 'sco', score1: 2, score2: 1,
      date: '19 de junio, 2026', status: 'FT', group: 'Grupo C',
      xg1: 1.62, xg2: 1.12, possession1: 55, possession2: 45,
      shots1: 15, shots2: 10, shotsOnTarget1: 6, shotsOnTarget2: 3,
      corners1: 5, corners2: 3
    },
    {
      team1Id: 'usa', team2Id: 'aus', score1: 2, score2: 1,
      date: '19 de junio, 2026', status: 'FT', group: 'Grupo D',
      xg1: 1.94, xg2: 1.10, possession1: 56, possession2: 44,
      shots1: 16, shots2: 11, shotsOnTarget1: 6, shotsOnTarget2: 4,
      corners1: 6, corners2: 3
    },
    {
      team1Id: 'par', team2Id: 'tur', score1: 1, score2: 2,
      date: '19 de junio, 2026', status: 'FT', group: 'Grupo D',
      xg1: 1.05, xg2: 1.88, possession1: 43, possession2: 57,
      shots1: 9, shots2: 17, shotsOnTarget1: 3, shotsOnTarget2: 7,
      corners1: 2, corners2: 6
    },
    {
      team1Id: 'ger', team2Id: 'nor', score1: 3, score2: 2,
      date: '20 de junio, 2026', status: 'FT', group: 'Grupo E',
      xg1: 2.45, xg2: 2.10, possession1: 60, possession2: 40,
      shots1: 20, shots2: 13, shotsOnTarget1: 9, shotsOnTarget2: 5,
      corners1: 7, corners2: 2
    },
    {
      team1Id: 'cuw', team2Id: 'irq', score1: 1, score2: 1,
      date: '20 de junio, 2026', status: 'FT', group: 'Grupo E',
      xg1: 0.95, xg2: 1.05, possession1: 48, possession2: 52,
      shots1: 11, shots2: 13, shotsOnTarget1: 4, shotsOnTarget2: 4,
      corners1: 3, corners2: 5
    },
    {
      team1Id: 'uru', team2Id: 'aut', score1: 1, score2: 0,
      date: '20 de junio, 2026', status: 'FT', group: 'Grupo F',
      xg1: 1.35, xg2: 0.90, possession1: 49, possession2: 51,
      shots1: 12, shots2: 10, shotsOnTarget1: 4, shotsOnTarget2: 3,
      corners1: 4, corners2: 4
    },
    {
      team1Id: 'ksa', team2Id: 'jor', score1: 2, score2: 1,
      date: '20 de junio, 2026', status: 'FT', group: 'Grupo F',
      xg1: 1.70, xg2: 1.15, possession1: 52, possession2: 48,
      shots1: 14, shots2: 11, shotsOnTarget1: 5, shotsOnTarget2: 4,
      corners1: 5, corners2: 3
    },
    {
      team1Id: 'irn', team2Id: 'cro', score1: 1, score2: 3,
      date: '21 de junio, 2026', status: 'FT', group: 'Grupo G',
      xg1: 1.05, xg2: 2.54, possession1: 41, possession2: 59,
      shots1: 9, shots2: 22, shotsOnTarget1: 3, shotsOnTarget2: 9,
      corners1: 3, corners2: 8
    },
    {
      team1Id: 'nzl', team2Id: 'ven', score1: 1, score2: 2,
      date: '21 de junio, 2026', status: 'FT', group: 'Grupo G',
      xg1: 1.12, xg2: 1.85, possession1: 46, possession2: 54,
      shots1: 10, shots2: 16, shotsOnTarget1: 3, shotsOnTarget2: 6,
      corners1: 4, corners2: 5
    },
    {
      team1Id: 'ned', team2Id: 'bel', score1: 2, score2: 1,
      date: '21 de junio, 2026', status: 'FT', group: 'Grupo H',
      xg1: 1.95, xg2: 1.60, possession1: 51, possession2: 49,
      shots1: 15, shots2: 13, shotsOnTarget1: 5, shotsOnTarget2: 5,
      corners1: 5, corners2: 4
    },
    {
      team1Id: 'jpn', team2Id: 'egy', score1: 2, score2: 0,
      date: '21 de junio, 2026', status: 'FT', group: 'Grupo H',
      xg1: 1.78, xg2: 0.84, possession1: 58, possession2: 42,
      shots1: 16, shots2: 9, shotsOnTarget1: 6, shotsOnTarget2: 3,
      corners1: 6, corners2: 3
    }
  ];

  // API - Get current list of played match results
  app.get("/api/wc-results", (req, res) => {
    try {
      res.json({
        success: true,
        count: currentResults.length,
        results: currentResults,
        canSyncMore: currentResults.length < (WC_2026_REAL_RESULTS.length + ROUND_2_RESULTS.length)
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // API - Sync more matches from Flashscore (Simulated API connection)
  app.post("/api/wc-results/sync", (req, res) => {
    try {
      const initialCount = currentResults.length;
      
      // If we are still on the first 24, sync the next 16 games
      if (initialCount === WC_2026_REAL_RESULTS.length) {
        currentResults = [...WC_2026_REAL_RESULTS, ...ROUND_2_RESULTS];
      }
      
      res.json({
        success: true,
        message: `Sincronización con Flashscore API completada de forma correcta.`,
        syncedCount: currentResults.length - initialCount,
        totalCount: currentResults.length,
        results: currentResults,
        canSyncMore: false
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // API - Reset to baseline Round 1 (24 games)
  app.post("/api/wc-results/reset", (req, res) => {
    try {
      currentResults = [...WC_2026_REAL_RESULTS];
      res.json({
        success: true,
        message: "Restaurado al baseline de 24 partidos de Round 1 de la Copa del Mundo.",
        count: currentResults.length,
        results: currentResults,
        canSyncMore: true
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Serve static files / Vite SPA router
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Futbol Predictor] Express server is live at http://0.0.0.0:${PORT}`);
  });
}

startServer();
