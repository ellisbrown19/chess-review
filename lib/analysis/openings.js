/**
 * Opening detection logic
 * Matches move sequences to opening database
 */

// Minimal opening database for testing
// In Phase 4, we'll populate this from eco.json GitHub repo
const OPENINGS_DATABASE = [
  {
    eco: 'B20',
    name: 'Sicilian Defense',
    moves: ['e4', 'c5'],
  },
  {
    eco: 'C50',
    name: 'Italian Game',
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4'],
  },
  {
    eco: 'C53',
    name: 'Italian Game: Classical Variation',
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5'],
  },
  {
    eco: 'D06',
    name: 'Queens Gambit',
    moves: ['d4', 'd5', 'c4'],
  },
];

/**
 * Detect chess opening from move list
 * @param {string[]} moves - Array of moves in algebraic notation
 * @returns {Object|null} - { eco, name, ply } or null if not found
 */
export function detectOpening(moves) {
  if (!moves || moves.length === 0) {
    return null;
  }

  // Find longest matching opening sequence
  let bestMatch = null;
  let longestMatch = 0;

  for (const opening of OPENINGS_DATABASE) {
    // Check if moves match the opening sequence
    if (movesMatch(moves, opening.moves)) {
      const matchLength = opening.moves.length;
      if (matchLength > longestMatch) {
        longestMatch = matchLength;
        bestMatch = {
          eco: opening.eco,
          name: opening.name,
          ply: matchLength,
        };
      }
    }
  }

  return bestMatch;
}

/**
 * Check if played moves match opening sequence
 */
function movesMatch(playedMoves, openingMoves) {
  if (playedMoves.length < openingMoves.length) {
    return false;
  }

  for (let i = 0; i < openingMoves.length; i++) {
    if (playedMoves[i] !== openingMoves[i]) {
      return false;
    }
  }

  return true;
}
