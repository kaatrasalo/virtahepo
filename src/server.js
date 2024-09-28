import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { Virtahepo } from "./virtahepo/engine.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());

// Serve static files from "public" folder
app.use(express.static(path.join(__dirname, "../src", "public")));

// Create an endpoint at /engine that takes in a FEN string and returns a chess move
app.get("/engine", (req, res) => {
  const fen = req.query.fen;
  if (!fen) {
    return res.status(400).json({ error: "FEN string is required" });
  }

  const virtahepo = new Virtahepo();
  const move = virtahepo.getMove(fen);
  res.json({ move });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
