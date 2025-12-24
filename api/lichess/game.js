/**
 * Vercel Serverless Function: Fetch a specific game by ID
 *
 * GET /api/lichess/game?id=abc123XYZ
 *
 * Returns complete game data including PGN, moves, metadata, opening
 */

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Game ID parameter is required' });
  }

  try {
    // Fetch game from Lichess API with PGN in JSON format
    const url = `https://lichess.org/game/export/${id}?pgnInJson=true&clocks=true&evals=true&opening=true`;

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ error: 'Game not found' });
      }
      throw new Error(`Lichess API error: ${response.status}`);
    }

    const game = await response.json();

    // Structure the game data for our frontend
    const gameData = {
      id: game.id,
      rated: game.rated,
      variant: game.variant,
      speed: game.speed,
      perf: game.perf,
      createdAt: game.createdAt,
      lastMoveAt: game.lastMoveAt,
      status: game.status,
      players: {
        white: {
          user: game.players.white.user?.name || 'Anonymous',
          rating: game.players.white.rating,
          ratingDiff: game.players.white.ratingDiff,
        },
        black: {
          user: game.players.black.user?.name || 'Anonymous',
          rating: game.players.black.rating,
          ratingDiff: game.players.black.ratingDiff,
        },
      },
      winner: game.winner || 'draw',
      opening: game.opening ? {
        eco: game.opening.eco,
        name: game.opening.name,
        ply: game.opening.ply,
      } : null,
      pgn: game.pgn,
      moves: game.moves ? game.moves.split(' ') : [],
      clocks: game.clocks || null,
      // Note: evals might not be available for all games
      // We'll use Cloud Eval API separately for comprehensive analysis
    };

    return res.status(200).json(gameData);

  } catch (error) {
    console.error('Error fetching game:', error);
    return res.status(500).json({
      error: 'Failed to fetch game from Lichess',
      details: error.message
    });
  }
}
