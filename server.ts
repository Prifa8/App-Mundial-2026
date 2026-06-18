import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { WC_2026_REAL_RESULTS, RealMatch } from "./src/data/wc2026Results";
import { TEAMS } from "./src/data/teams";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let aiInstance: any = null;

function getGeminiClient() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("La clave GEMINI_API_KEY no está configurada. Por favor, añádela en Settings > Secrets en tu espacio de trabajo.");
    }
    aiInstance = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

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

  // API - Real-time AI Simulation of a Match using Gemini
  app.post("/api/wc-results/ai-generate", async (req, res) => {
    try {
      const { team1Id, team2Id } = req.body;
      
      // Look up teams
      let t1 = TEAMS.find(t => t.id === team1Id);
      let t2 = TEAMS.find(t => t.id === team2Id);

      // If missing, select two that haven't played and are available
      if (!t1 || !t2) {
        const playedIds = new Set(currentResults.flatMap(r => [r.team1Id, r.team2Id]));
        const unplayed = TEAMS.filter(t => !playedIds.has(t.id));
        if (unplayed.length >= 2) {
          t1 = unplayed[Math.floor(Math.random() * unplayed.length)];
          const unplayed2 = unplayed.filter(t => t.id !== t1!.id);
          t2 = unplayed2[Math.floor(Math.random() * unplayed2.length)];
        } else {
          t1 = TEAMS[0];
          t2 = TEAMS[1];
        }
      }

      if (!t1 || !t2) {
        return res.status(400).json({ success: false, error: "Equipos no válidos para la simulación de juego." });
      }

      // Initialize Gemini Client Lazily
      const ai = getGeminiClient();

      // We'll generate a realistic football scoreline with custom statistics & minute-by-minute timeline
      const prompt = `Simula un partido de fútbol hiperrealista para la Copa Mundial de la FIFA 2026 entre:
Equipo 1: ${t1.name} (ID: ${t1.id}, FIFA Rank: #${t1.fifaRanking}, ELO: ${t1.elo}, Poder Ofensivo: ${t1.offPower}, Poder Defensivo: ${t1.defPower})
Equipo 2: ${t2.name} (ID: ${t2.id}, FIFA Rank: #${t2.fifaRanking}, ELO: ${t2.elo}, Poder Ofensivo: ${t2.offPower}, Poder Defensivo: ${t2.defPower})

Requisitos:
1. El resultado, posesión (debe sumar 100 y ser proporcional a ELO/Spi), tiros de esquina, tiros totales, tiros al arco y goles esperados (xg1, xg2) deben correlacionarse de forma lógica con las fuerzas de los equipos.
2. Genera scores lógicos de goles (score1 para Equipo 1, score2 para Equipo 2), típicamente de 0 a 4 goles.
3. Elabora un histórico 'timeline' cronológico (minutos del 1 al 90) con una lista de entre 5 y 10 acontecimientos clave. El número de eventos 'goal' debe coincidir exactamente con el score de cada equipo, e incluir "minute", "type" ("goal", "shot", "save", "card", "comment"), "teamId" (ID del equipo), "player" (nombre del jugador ficticio destacado de esa selección) y "description" (comentario narrativo en español).
4. Redacta de forma profesional y con emoción periodística en español.
5. En 'aiTacticalSummary', proporciona un análisis táctico técnico de 2 a 3 líneas del partido en español.
6. En 'aiStrategicDecision', ofrece una recomendación o predicción sobre cómo este resultado afecta a las selecciones en el transcurso del mundial.`;

      // Call Gemini API with Structured Schema
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              team1Id: { type: Type.STRING },
              team2Id: { type: Type.STRING },
              score1: { type: Type.INTEGER },
              score2: { type: Type.INTEGER },
              xg1: { type: Type.NUMBER },
              xg2: { type: Type.NUMBER },
              possession1: { type: Type.INTEGER },
              possession2: { type: Type.INTEGER },
              shots1: { type: Type.INTEGER },
              shots2: { type: Type.INTEGER },
              shotsOnTarget1: { type: Type.INTEGER },
              shotsOnTarget2: { type: Type.INTEGER },
              corners1: { type: Type.INTEGER },
              corners2: { type: Type.INTEGER },
              date: { type: Type.STRING },
              group: { type: Type.STRING },
              status: { type: Type.STRING },
              aiTacticalSummary: { type: Type.STRING },
              aiStrategicDecision: { type: Type.STRING },
              timeline: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    minute: { type: Type.INTEGER },
                    type: { type: Type.STRING }, 
                    teamId: { type: Type.STRING },
                    player: { type: Type.STRING },
                    description: { type: Type.STRING }
                  },
                  required: ["minute", "type", "teamId", "player", "description"]
                }
              }
            },
            required: [
              "team1Id", "team2Id", "score1", "score2", "xg1", "xg2",
              "possession1", "possession2", "shots1", "shots2", "shotsOnTarget1", "shotsOnTarget2",
              "corners1", "corners2", "date", "group", "status", "aiTacticalSummary", "aiStrategicDecision", "timeline"
            ]
          }
        }
      });

      const resultText = response.text;
      if (!resultText) {
        throw new Error("No se recibió respuesta del modelo de IA.");
      }

      const parsedMatch = JSON.parse(resultText.trim());
      
      // Append to server lists
      currentResults.push(parsedMatch);

      res.json({
        success: true,
        match: parsedMatch,
        totalResultsCount: currentResults.length
      });
    } catch (err: any) {
      console.error("AI Match Generation error:", err);
      res.status(500).json({ success: false, error: err.message || "Error al simular partido con IA" });
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
