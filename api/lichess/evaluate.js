/**
 * Vercel Serverless Function: Get position evaluations from Lichess Cloud Eval
 *
 * POST /api/lichess/evaluate
 * Body: { fens: ['fen1', 'fen2', ...], multiPv: 3 }
 *
 * Returns evaluations for each position with best moves and variations
 * Implements caching and rate limiting to be respectful of Lichess API
 */

// Simple in-memory cache for Cloud Eval results
// In production, consider Redis or similar for persistent cache
const evalCache = new Map();
const CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours
const RATE_LIMIT_DELAY = 100; // ms between requests

// Clean old cache entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of evalCache.entries()) {
    if (now - value.timestamp > CACHE_TTL) {
      evalCache.delete(key);
    }
  }
}, 1000 * 60 * 60); // Clean every hour

// Helper: delay between requests for rate limiting
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper: fetch evaluation for a single FEN with exponential backoff
async function fetchEvaluation(fen, multiPv = 3, retries = 3) {
  // Check cache first
  const cacheKey = `${fen}:${multiPv}`;
  const cached = evalCache.get(cacheKey);
  if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
    return cached.data;
  }

  // Fetch from Lichess Cloud Eval
  const url = `https://lichess.org/api/cloud-eval?fen=${encodeURIComponent(fen)}&multiPv=${multiPv}`;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.status === 429) {
        // Rate limited - wait and retry with exponential backoff
        const waitTime = Math.pow(2, attempt) * 1000;
        await delay(waitTime);
        continue;
      }

      if (!response.ok) {
        if (response.status === 404) {
          // Position not in cloud eval database
          return {
            fen,
            available: false,
            error: 'Position not in cloud database'
          };
        }
        throw new Error(`Cloud Eval API error: ${response.status}`);
      }

      const data = await response.json();

      // Cache the result
      evalCache.set(cacheKey, {
        data,
        timestamp: Date.now(),
      });

      return data;

    } catch (error) {
      if (attempt === retries - 1) {
        throw error;
      }
      // Wait before retry
      await delay(Math.pow(2, attempt) * 1000);
    }
  }
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { fens, multiPv = 3 } = req.body;

  if (!fens || !Array.isArray(fens) || fens.length === 0) {
    return res.status(400).json({
      error: 'fens array is required and must not be empty'
    });
  }

  if (fens.length > 100) {
    return res.status(400).json({
      error: 'Maximum 100 positions per request'
    });
  }

  try {
    const evaluations = [];

    // Process FENs with rate limiting
    for (let i = 0; i < fens.length; i++) {
      const fen = fens[i];

      try {
        const evaluation = await fetchEvaluation(fen, multiPv);
        evaluations.push({
          fen,
          index: i,
          ...evaluation,
        });
      } catch (error) {
        console.error(`Error evaluating position ${i}:`, error);
        evaluations.push({
          fen,
          index: i,
          available: false,
          error: error.message,
        });
      }

      // Rate limiting delay between requests (except for last one)
      if (i < fens.length - 1) {
        await delay(RATE_LIMIT_DELAY);
      }
    }

    return res.status(200).json({
      evaluations,
      count: evaluations.length,
      cached: evaluations.filter(e => e.cached).length,
    });

  } catch (error) {
    console.error('Error in evaluate endpoint:', error);
    return res.status(500).json({
      error: 'Failed to evaluate positions',
      details: error.message
    });
  }
}
