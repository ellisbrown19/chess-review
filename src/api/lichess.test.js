import { describe, test, expect } from '@jest/globals';
import { isLikelyUsername, extractGameId } from './lichess.js';

describe('isLikelyUsername', () => {
  test('accepts usernames with underscores', () => {
    expect(isLikelyUsername('user_name')).toBe(true);
    expect(isLikelyUsername('test_user_123')).toBe(true);
  });

  test('accepts usernames with hyphens', () => {
    expect(isLikelyUsername('user-123')).toBe(true);
    expect(isLikelyUsername('test-user-name')).toBe(true);
  });

  test('accepts 9-12 character alphanumeric strings as usernames', () => {
    expect(isLikelyUsername('player123')).toBe(true); // 9 chars
    expect(isLikelyUsername('username12')).toBe(true); // 10 chars
    expect(isLikelyUsername('testuser1')).toBe(true); // 9 chars
    expect(isLikelyUsername('abcd123456')).toBe(true); // 10 chars
  });

  test('rejects 8-character strings as game IDs', () => {
    expect(isLikelyUsername('EOwvdMyl')).toBe(false);
    expect(isLikelyUsername('abc123XY')).toBe(false);
    expect(isLikelyUsername('12345678')).toBe(false);
  });

  test('accepts long usernames', () => {
    expect(isLikelyUsername('DrNykterstein')).toBe(true); // 13 chars
    expect(isLikelyUsername('MagnusCarlsen')).toBe(true); // 13 chars
  });

  test('accepts short usernames', () => {
    expect(isLikelyUsername('ab')).toBe(true); // 2 chars (minimum)
    expect(isLikelyUsername('test')).toBe(true); // 4 chars
  });

  test('rejects URLs', () => {
    expect(isLikelyUsername('https://lichess.org/abc123XY')).toBe(false);
    expect(isLikelyUsername('lichess.org/abc123XY')).toBe(false);
    expect(isLikelyUsername('http://example.com')).toBe(false);
  });

  test('rejects empty strings', () => {
    expect(isLikelyUsername('')).toBe(false);
    expect(isLikelyUsername('   ')).toBe(false);
  });

  test('rejects null or undefined', () => {
    expect(isLikelyUsername(null)).toBe(false);
    expect(isLikelyUsername(undefined)).toBe(false);
  });
});

describe('extractGameId', () => {
  test('extracts game ID from full URL', () => {
    expect(extractGameId('https://lichess.org/abc123XY')).toBe('abc123XY');
    expect(extractGameId('https://lichess.org/EOwvdMyl')).toBe('EOwvdMyl');
  });

  test('extracts game ID from URL without protocol', () => {
    expect(extractGameId('lichess.org/abc123XY')).toBe('abc123XY');
    expect(extractGameId('lichess.org/EOwvdMyl/white')).toBe('EOwvdMyl');
  });

  test('returns trimmed input if already a game ID', () => {
    expect(extractGameId('abc123XY')).toBe('abc123XY');
    expect(extractGameId(' EOwvdMyl ')).toBe('EOwvdMyl');
  });

  test('extracts game ID from URL with player color', () => {
    expect(extractGameId('https://lichess.org/abc123XY/white')).toBe('abc123XY');
    expect(extractGameId('lichess.org/EOwvdMyl/black')).toBe('EOwvdMyl');
  });

  test('handles empty strings', () => {
    expect(extractGameId('')).toBe('');
    expect(extractGameId('   ')).toBe('');
  });
});
