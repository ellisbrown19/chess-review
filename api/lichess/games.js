/**
 * Vercel Serverless Function: Fetch recent games for a Lichess username
 *
 * GET /api/lichess/games?username=DrNykterstein&max=10
 *
 * Returns simplified game list with id, players, result, opening, etc.
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

  const { username, max = 10 } = req.query;

  if (!username) {
    return res.status(400).json({ error: 'Username parameter is required' });
  }

  try {
    // Fetch games from Lichess API
    const url = `https://lichess.org/api/games/user/${username}?max=${max}&pgnInJson=true&clocks=false&evals=false&opening=true`;

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/x-ndjson', // Lichess returns NDJSON
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ error: 'User not found' });
      }
      throw new Error(`Lichess API error: ${response.status}`);
    }

    // Parse NDJSON (newline-delimited JSON)
    const text = await response.text();
    const games = text
      .trim()
      .split('\n')
      .filter(line => line.trim())
      .map(line => JSON.parse(line));

    // Simplify game data for frontend
    const simplifiedGames = games.map(game => ({
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
      moves: game.moves ? game.moves.split(' ').length : 0,
    }));

    return res.status(200).json({
      username,
      games: simplifiedGames,
      count: simplifiedGames.length,
    });

  } catch (error) {
    console.error('Error fetching games:', error);
    return res.status(500).json({
      error: 'Failed to fetch games from Lichess',
      details: error.message
    });
  }
}
