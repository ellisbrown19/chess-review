/**
 * Tests for AI commentary prompt generation
 */

import { describe, test, expect } from '@jest/globals';
import { generateMoveCommentaryPrompt } from './prompts.js';

describe('generateMoveCommentaryPrompt', () => {
  test('generates prompt for a good move', () => {
    const moveData = {
      fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1',
      move: 'e4',
      classification: 'best',
      cpLoss: 0,
      moveNumber: 1,
      player: 'white',
    };

    const prompt = generateMoveCommentaryPrompt(moveData);

    expect(prompt).toBeDefined();
    expect(typeof prompt).toBe('string');
    expect(prompt.length).toBeGreaterThan(0);
    expect(prompt).toContain('e4');
    expect(prompt).toContain('best');
  });

  test('generates prompt for a blunder with centipawn loss', () => {
    const moveData = {
      fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2',
      move: 'Qh5',
      classification: 'blunder',
      cpLoss: 250,
      moveNumber: 2,
      player: 'white',
      bestMove: 'Nf3',
    };

    const prompt = generateMoveCommentaryPrompt(moveData);

    expect(prompt).toContain('Qh5');
    expect(prompt).toContain('blunder');
    expect(prompt).toContain('250');
    expect(prompt).toContain('Nf3');
  });

  test('generates concise prompt under 500 characters', () => {
    const moveData = {
      fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      move: 'd4',
      classification: 'best',
      cpLoss: 0,
      moveNumber: 1,
      player: 'white',
    };

    const prompt = generateMoveCommentaryPrompt(moveData);

    // Prompt should be concise for cost optimization
    expect(prompt.length).toBeLessThan(500);
  });

  test('includes position context in prompt', () => {
    const moveData = {
      fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3',
      move: 'Bc4',
      classification: 'good',
      cpLoss: 15,
      moveNumber: 3,
      player: 'white',
    };

    const prompt = generateMoveCommentaryPrompt(moveData);

    // Should include FEN for position context
    expect(prompt).toContain(moveData.fen);
  });

  test('generates prompt for brilliant move', () => {
    const moveData = {
      fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 4 5',
      move: 'Bxf7+',
      classification: 'brilliant',
      cpLoss: 0,
      moveNumber: 5,
      player: 'white',
      isSacrifice: true,
    };

    const prompt = generateMoveCommentaryPrompt(moveData);

    expect(prompt).toContain('brilliant');
    expect(prompt).toContain('Bxf7+');
  });
});
