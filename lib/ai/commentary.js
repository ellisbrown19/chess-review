/**
 * Claude API integration for chess commentary generation
 */

import Anthropic from '@anthropic-ai/sdk';
import { generateMoveCommentaryPrompt } from './prompts.js';

// In-memory cache for commentary
const commentaryCache = new Map();

/**
 * Generate a simple hash for caching
 */
function getCacheKey(moveData) {
  return `${moveData.fen}:${moveData.move}:${moveData.classification}`;
}

/**
 * Generate instructive chess commentary for a move using Claude Haiku
 * @param {Object} moveData - Data about the move
 * @param {Object} [options] - Generation options
 * @param {boolean} [options.returnMetadata] - Return metadata with commentary
 * @returns {Promise<string|Object>} - Commentary text or object with metadata
 */
export async function generateCommentary(moveData, options = {}) {
  const { returnMetadata = false } = options;

  // Check if API key is available
  if (!process.env.ANTHROPIC_API_KEY) {
    const errorMsg = 'Anthropic API key not configured. Set ANTHROPIC_API_KEY environment variable.';
    return returnMetadata ? { commentary: errorMsg, cached: false, error: true } : errorMsg;
  }

  // Check cache first
  const cacheKey = getCacheKey(moveData);
  if (commentaryCache.has(cacheKey)) {
    const cached = commentaryCache.get(cacheKey);
    return returnMetadata ? { commentary: cached, cached: true } : cached;
  }

  try {
    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    // Generate prompt
    const prompt = generateMoveCommentaryPrompt(moveData);

    // Call Claude Haiku API
    const message = await anthropic.messages.create({
      model: 'claude-haiku-20240307',
      max_tokens: 150,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // Extract commentary from response
    const commentary = message.content[0].text;

    // Cache the result
    commentaryCache.set(cacheKey, commentary);

    return returnMetadata ? { commentary, cached: false } : commentary;
  } catch (error) {
    // Handle API errors gracefully
    const errorMsg = `Failed to generate commentary: ${error.message}`;

    // Cache errors too to avoid repeated failed API calls
    commentaryCache.set(cacheKey, errorMsg);

    return returnMetadata ? { commentary: errorMsg, cached: false, error: true } : errorMsg;
  }
}

/**
 * Clear the commentary cache (useful for testing)
 */
export function clearCommentaryCache() {
  commentaryCache.clear();
}
