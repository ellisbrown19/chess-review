/**
 * Tests for opening detection logic
 */

import { describe, test, expect } from '@jest/globals';
import { detectOpening } from './openings.js';

describe('detectOpening', () => {
  test('detects Sicilian Defense from move list', () => {
    const moves = ['e4', 'c5'];
    const result = detectOpening(moves);

    expect(result.eco).toBe('B20');
    expect(result.name).toBe('Sicilian Defense');
    expect(result.ply).toBe(2);
    expect(result.funFact).toBeDefined();
    expect(result.famousGames).toBeDefined();
  });

  test('detects Italian Game from move list', () => {
    const moves = ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4'];
    const result = detectOpening(moves);

    expect(result.eco).toBe('C50');
    expect(result.name).toBe('Italian Game');
    expect(result.ply).toBe(5);
    expect(result.funFact).toBeDefined();
    expect(result.famousGames).toBeDefined();
  });

  test('detects Queens Gambit from move list', () => {
    const moves = ['d4', 'd5', 'c4'];
    const result = detectOpening(moves);

    expect(result.eco).toBe('D06');
    expect(result.name).toBe('Queens Gambit');
    expect(result.ply).toBe(3);
    expect(result.funFact).toBeDefined();
    expect(result.famousGames).toBeDefined();
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

  test('returns fun fact when available for opening', () => {
    const moves = ['e4', 'c5'];
    const result = detectOpening(moves);

    expect(result.funFact).toBeDefined();
    expect(typeof result.funFact).toBe('string');
    expect(result.funFact.length).toBeGreaterThan(0);
  });

  test('returns famous games when available for opening', () => {
    const moves = ['e4', 'c5'];
    const result = detectOpening(moves);

    expect(result.famousGames).toBeDefined();
    expect(Array.isArray(result.famousGames)).toBe(true);
    expect(result.famousGames.length).toBeGreaterThan(0);

    const game = result.famousGames[0];
    expect(game.white).toBeDefined();
    expect(game.black).toBeDefined();
    expect(game.year).toBeDefined();
    expect(game.result).toBeDefined();
  });

  test('returns null for fun fact when not available', () => {
    const moves = ['a3', 'a6', 'b3', 'b6'];
    const result = detectOpening(moves);

    // Unknown opening returns null
    expect(result).toBeNull();
  });

  test('detects Ruy Lopez with complete data', () => {
    const moves = ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5'];
    const result = detectOpening(moves);

    expect(result.eco).toBe('C60');
    expect(result.name).toContain('Ruy Lopez');
    expect(result.funFact).toBeDefined();
    expect(result.famousGames).toBeDefined();
  });

  test('returns Wikipedia link when available', () => {
    const moves = ['e4', 'c5'];
    const result = detectOpening(moves);

    expect(result.wikiUrl).toBeDefined();
    expect(result.wikiUrl).toMatch(/^https:\/\/en\.wikipedia\.org\/wiki\//);
  });

  test('famous openings have Wikipedia links', () => {
    const testOpenings = [
      { moves: ['e4', 'c5'], name: 'Sicilian' },
      { moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5'], name: 'Ruy Lopez' },
      { moves: ['d4', 'd5', 'c4'], name: 'Queens Gambit' },
      { moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4'], name: 'Italian' },
    ];

    for (const opening of testOpenings) {
      const result = detectOpening(opening.moves);
      expect(result.wikiUrl).toBeDefined();
      expect(result.wikiUrl).toContain('wikipedia.org');
    }
  });
});
