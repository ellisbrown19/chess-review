/**
 * Serverless function for AI commentary generation
 * POST /api/commentary
 */

import { generateCommentary } from '../lib/ai/commentary.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).json({ ok: true });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse request body
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { moveData } = body;

    // Validate move data
    if (!moveData || !moveData.fen || !moveData.move) {
      return res.status(400).json({
        error: 'Missing required fields: moveData with fen and move',
      });
    }

    // Generate commentary with metadata
    const result = await generateCommentary(moveData, { returnMetadata: true });

    // Return response
    return res.status(200).json({
      commentary: result.commentary,
      cached: result.cached || false,
      error: result.error || false,
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
}
