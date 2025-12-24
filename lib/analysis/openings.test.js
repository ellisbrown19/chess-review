/**
 * Tests for opening detection logic
 */

import { describe, test, expect } from '@jest/globals';
import { detectOpening } from './openings.js';

describe('detectOpening', () => {
  test('detects Sicilian Defense from move list', () => {
    const moves = ['e4', 'c5'];
    const result = detectOpening(moves);

    expect(result).toEqual({
      eco: 'B20',
      name: 'Sicilian Defense',
      ply: 2,
    });
  });

  test('detects Italian Game from move list', () => {
    const moves = ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4'];
    const result = detectOpening(moves);

    expect(result).toEqual({
      eco: 'C50',
      name: 'Italian Game',
      ply: 5,
    });
  });

  test('detects Queens Gambit from move list', () => {
    const moves = ['d4', 'd5', 'c4'];
    const result = detectOpening(moves);

    expect(result).toEqual({
      eco: 'D06',
      name: 'Queens Gambit',
      ply: 3,
    });
  });

  test('returns null for unknown opening', () => {
    const moves = ['a3', 'a6', 'b3', 'b6'];
    const result = detectOpening(moves);

    expect(result).toBeNull();
  });

  test('matches longest known opening sequence', () => {
    const moves = ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5'];
    const result = detectOpening(moves);

    // Should match more specific opening, not just Italian Game
    expect(result.eco).toBe('C53');
    expect(result.name).toBe('Italian Game: Classical Variation');
    expect(result.ply).toBe(6);
  });

  test('handles empty move list', () => {
    const moves = [];
    const result = detectOpening(moves);

    expect(result).toBeNull();
  });
});
