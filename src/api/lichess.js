/**
 * Frontend API client for Lichess integration
 *
 * Handles all communication with our Vercel serverless functions
 * that proxy Lichess API requests
 */

const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env?.DEV)
  ? 'http://localhost:3000'
  : '';

/**
 * Fetch recent games for a Lichess username
 * @param {string} username - Lichess username
 * @param {number} max - Maximum number of games to fetch (default: 10)
 * @returns {Promise<Object>} - { username, games, count }
 */
export async function fetchUserGames(username, max = 10) {
  try {
    const response = await fetch(
      `${API_BASE}/api/lichess/games?username=${encodeURIComponent(username)}&max=${max}`
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch games');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user games:', error);
    throw error;
  }
}

/**
 * Fetch a specific game by ID
 * @param {string} gameId - Lichess game ID
 * @returns {Promise<Object>} - Complete game data with PGN and metadata
 */
export async function fetchGame(gameId) {
  try {
    const response = await fetch(
      `${API_BASE}/api/lichess/game?id=${encodeURIComponent(gameId)}`
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch game');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching game:', error);
    throw error;
  }
}

/**
 * Get position evaluations from Lichess Cloud Eval
 * @param {string[]} fens - Array of FEN strings
 * @param {number} multiPv - Number of principal variations to return (default: 3)
 * @returns {Promise<Object>} - { evaluations, count, cached }
 */
export async function evaluatePositions(fens, multiPv = 3) {
  try {
    const response = await fetch(`${API_BASE}/api/lichess/evaluate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fens, multiPv }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to evaluate positions');
    }

    return await response.json();
  } catch (error) {
    console.error('Error evaluating positions:', error);
    throw error;
  }
}

/**
 * Extract game ID from Lichess URL
 * @param {string} input - Lichess URL or game ID
 * @returns {string} - Game ID
 */
export function extractGameId(input) {
  if (!input) return '';

  // If it's already just an ID (8-12 characters, alphanumeric)
  if (/^[a-zA-Z0-9]{8,12}$/.test(input.trim())) {
    return input.trim();
  }

  // Extract from URL patterns:
  // https://lichess.org/abc123XYZ
  // https://lichess.org/abc123XYZ/white
  // lichess.org/abc123XYZ
  const urlMatch = input.match(/lichess\.org\/([a-zA-Z0-9]{8,12})/);
  if (urlMatch) {
    return urlMatch[1];
  }

  // If no match, return trimmed input and let API handle error
  return input.trim();
}

/**
 * Check if input looks like a username (not a game ID or URL)
 * @param {string} input - User input
 * @returns {boolean} - True if likely a username
 */
export function isLikelyUsername(input) {
  if (!input) return false;

  const trimmed = input.trim();

  // Contains URL = not a username
  if (trimmed.includes('lichess.org') || trimmed.includes('http')) {
    return false;
  }

  // Username-specific characters (underscore or hyphen) indicate username
  if (/_|-/.test(trimmed)) {
    return true;
  }

  // Exactly 8 characters = likely game ID
  if (trimmed.length === 8) {
    return false;
  }

  // 9-12 chars without special chars = assume username for better UX
  // Let API validate gracefully if wrong
  if (/^[a-zA-Z0-9]{9,12}$/.test(trimmed)) {
    return true;
  }

  // Usernames are typically 2-20 characters, alphanumeric with - and _
  if (/^[a-zA-Z0-9_-]{2,20}$/.test(trimmed)) {
    return true;
  }

  return false;
}

/**
 * Analyze a game using backend classification and opening detection
 * @param {string} pgn - Game PGN
 * @param {Object[]} evaluations - Array of position evaluations from Cloud Eval
 * @returns {Promise<Object>} - { moves, opening, stats, totalMoves }
 */
export async function analyzeGame(pgn, evaluations) {
  try {
    const response = await fetch(`${API_BASE}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pgn, evaluations }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to analyze game');
    }

    return await response.json();
  } catch (error) {
    console.error('Error analyzing game:', error);
    throw error;
  }
}

/**
 * Generate AI commentary for a move
 * @param {Object} moveData - Move data for commentary generation
 * @returns {Promise<Object>} - { commentary, cached, error }
 */
export async function generateCommentary(moveData) {
  try {
    const response = await fetch(`${API_BASE}/api/commentary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ moveData }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate commentary');
    }

    return await response.json();
  } catch (error) {
    console.error('Error generating commentary:', error);
    throw error;
  }
}
