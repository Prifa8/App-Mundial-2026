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

  // In-memory store starting with our completed 50 matches
  let currentResults: RealMatch[] = [...WC_2026_REAL_RESULTS];

  // API - Get current list of played match results
  app.get("/api/wc-results", (req, res) => {
    try {
      res.json({
        success: true,
        count: currentResults.length,
        results: currentResults
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
