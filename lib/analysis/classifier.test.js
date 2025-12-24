/**
 * Tests for move classification logic
 * Following chess.com's classification system based on centipawn loss
 */

import { describe, test, expect } from '@jest/globals';
import { classifyMove } from './classifier.js';

describe('classifyMove', () => {
  test('classifies best move with 0 centipawn loss as BEST', () => {
    const result = classifyMove({
      movePlayed: 'e4',
      evalBefore: 50,
      evalAfter: 50,
      bestMove: 'e4',
      isBestMove: true,
    });

    expect(result.classification).toBe('best');
    expect(result.cpLoss).toBe(0);
  });

  test('classifies move with 25 centipawn loss as GOOD', () => {
    const result = classifyMove({
      movePlayed: 'Nf3',
      evalBefore: 50,
      evalAfter: 25,
      bestMove: 'e4',
      isBestMove: false,
    });

    expect(result.classification).toBe('good');
    expect(result.cpLoss).toBe(25);
  });

  test('classifies move with 75 centipawn loss as INACCURACY', () => {
    const result = classifyMove({
      movePlayed: 'a3',
      evalBefore: 100,
      evalAfter: 25,
      bestMove: 'Nf3',
      isBestMove: false,
    });

    expect(result.classification).toBe('inaccuracy');
    expect(result.cpLoss).toBe(75);
  });

  test('classifies move with 150 centipawn loss as MISTAKE', () => {
    const result = classifyMove({
      movePlayed: 'h3',
      evalBefore: 50,
      evalAfter: -100,
      bestMove: 'Nf3',
      isBestMove: false,
    });

    expect(result.classification).toBe('mistake');
    expect(result.cpLoss).toBe(150);
  });

  test('classifies move with 250 centipawn loss as BLUNDER', () => {
    const result = classifyMove({
      movePlayed: 'Qxh7',
      evalBefore: 0,
      evalAfter: -250,
      bestMove: 'Nf3',
      isBestMove: false,
    });

    expect(result.classification).toBe('blunder');
    expect(result.cpLoss).toBe(250);
  });

  test('handles mate scores correctly (converts to large centipawn values)', () => {
    const result = classifyMove({
      movePlayed: 'Kh1',
      evalBefore: { type: 'mate', value: 1 },
      evalAfter: { type: 'mate', value: -1 },
      bestMove: 'Qh7',
      isBestMove: false,
    });

    expect(result.classification).toBe('blunder');
    expect(result.cpLoss).toBeGreaterThan(200);
  });

  test('classifies brilliant move (best move with material sacrifice)', () => {
    const result = classifyMove({
      movePlayed: 'Qxh7',
      evalBefore: 50,
      evalAfter: 200,
      bestMove: 'Qxh7',
      isBestMove: true,
      isSacrifice: true,
    });

    expect(result.classification).toBe('brilliant');
    expect(result.cpLoss).toBe(0);
  });

  test('classifies great move (best move in critical position)', () => {
    const result = classifyMove({
      movePlayed: 'Qh7',
      evalBefore: -150,
      evalAfter: 150,
      bestMove: 'Qh7',
      isBestMove: true,
      evalSwing: 300,
    });

    expect(result.classification).toBe('great');
    expect(result.cpLoss).toBe(0);
    expect(result.evalSwing).toBe(300);
  });
});
