/**
 * Tests for Claude API integration
 */

import { describe, test, expect, beforeEach } from '@jest/globals';
import { generateCommentary, clearCommentaryCache } from './commentary.js';

describe('generateCommentary', () => {
  beforeEach(() => {
    // Clear cache before each test
    clearCommentaryCache();
  });

  test('generates commentary for a move', async () => {
    const moveData = {
      fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1',
      move: 'e4',
      classification: 'best',
      cpLoss: 0,
      moveNumber: 1,
      player: 'white',
    };

    const commentary = await generateCommentary(moveData);

    expect(commentary).toBeDefined();
    expect(typeof commentary).toBe('string');
    expect(commentary.length).toBeGreaterThan(0);
  });

  test('returns error message when API key is missing', async () => {
    // Save original env var
    const originalKey = process.env.ANTHROPIC_API_KEY;
    delete process.env.ANTHROPIC_API_KEY;

    const moveData = {
      fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      move: 'd4',
      classification: 'best',
      cpLoss: 0,
      moveNumber: 1,
      player: 'white',
    };

    const commentary = await generateCommentary(moveData);

    expect(commentary).toContain('API key');

    // Restore env var
    process.env.ANTHROPIC_API_KEY = originalKey;
  });

  test('caches commentary by position hash', async () => {
    const moveData = {
      fen: 'rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKB1R b KQkq - 1 1',
      move: 'Nf3',
      classification: 'best',
      cpLoss: 0,
      moveNumber: 1,
      player: 'white',
    };

    // First call
    const commentary1 = await generateCommentary(moveData);

    // Second call with same data should return cached result
    const commentary2 = await generateCommentary(moveData);

    expect(commentary1).toBe(commentary2);
  });

  test('returns cached flag for cached responses', async () => {
    const moveData = {
      fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3',
      move: 'Bc4',
      classification: 'good',
      cpLoss: 15,
      moveNumber: 3,
      player: 'white',
    };

    // First call - not cached
    const result1 = await generateCommentary(moveData, { returnMetadata: true });
    expect(result1.cached).toBe(false);

    // Second call - cached
    const result2 = await generateCommentary(moveData, { returnMetadata: true });
    expect(result2.cached).toBe(true);
  });

  test('handles API errors gracefully', async () => {
    // Use invalid API key to trigger error
    const originalKey = process.env.ANTHROPIC_API_KEY;
    process.env.ANTHROPIC_API_KEY = 'invalid-key-12345';

    const moveData = {
      fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      move: 'e4',
      classification: 'best',
      cpLoss: 0,
      moveNumber: 1,
      player: 'white',
    };

    const commentary = await generateCommentary(moveData);

    // Should return error message, not throw
    expect(commentary).toBeDefined();
    expect(typeof commentary).toBe('string');

    // Restore env var
    process.env.ANTHROPIC_API_KEY = originalKey;
  });
});
