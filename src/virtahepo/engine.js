import debug from "debug";
import { Chess } from "chess.js";
const log = debug("virtahepo");
log.enabled = true;

class Virtahepo {
  constructor() {}

  /**
   * Given a FEN string, this method returns the next move for the engine.
   * The move selection process follows these steps:
   * 1. Check for captures that win material.
   * 2. Check for captures of hanging pieces.
   * 3. Play a move from the Hippo opening if available.
   * 4. If no specific move is found, return a random legal move.
   *
   * @param {string} fen - The FEN string representing the current board position.
   * @returns {string} - The selected move in SAN (Standard Algebraic Notation).
   */
  getMove(fen) {
    const chess = new Chess(fen);
    const legalMoves = chess.moves({ verbose: true });

    // Hippo opening moves for black
    const hippoOpeningMoves = [
      "g6",
      "d6",
      "e6",
      "b6",
      "g7",
      "d7",
      "e7",
      "b7",
      "Bg7",
      "Nd7",
      "Ne7",
      "Bb7",
    ];

    // Check for captures that win material
    for (let move of legalMoves) {
      if (move.captured) {
        const pieceValue = {
          p: 1,
          n: 3,
          b: 3,
          r: 5,
          q: 9,
        };
        const capturedValue = pieceValue[move.captured.toLowerCase()] || 0;
        const movedPieceValue = pieceValue[move.piece.toLowerCase()] || 0;
        if (capturedValue >= movedPieceValue) {
          log("Selected move (trade or winning material):", move);
          return move.san;
        }
      }
    }

    // Check for hanging pieces
    for (let move of legalMoves) {
      const chessCopy = new Chess(fen);
      chessCopy.move(move.san);
      const opponentMoves = chessCopy.moves({ verbose: true });
      let isHanging = true;
      for (let opponentMove of opponentMoves) {
        if (opponentMove.captured && opponentMove.to === move.to) {
          isHanging = false;
          break;
        }
      }
      if (isHanging && move.captured) {
        log("Selected move (capture hanging piece):", move);
        return move.san;
      }
    }

    // Play a move from the Hippo opening if available
    for (let move of legalMoves) {
      if (hippoOpeningMoves.includes(move.san)) {
        log("Selected move:", move);
        return move.san;
      }
    }

    // If no hippo opening move is found, return a random legal move
    const randomMove =
      legalMoves[Math.floor(Math.random() * legalMoves.length)];
    log("Selected random move:", randomMove);
    return randomMove.san;
  }
}

export { Virtahepo };
