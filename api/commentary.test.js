/**
 * Tests for commentary serverless endpoint
 */

import { describe, test, expect } from '@jest/globals';
import handler from './commentary.js';

// Mock request and response objects
function createMockRequest(body) {
  return {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {},
  };
}

function createMockResponse() {
  const response = {
    statusCode: 200,
    headers: {},
    body: '',
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.body = JSON.stringify(data);
      return this;
    },
    setHeader(key, value) {
      this.headers[key] = value;
      return this;
    },
  };
  return response;
}

describe('commentary API endpoint', () => {
  test('returns 405 for non-POST requests', async () => {
    const req = { method: 'GET' };
    const res = createMockResponse();

    await handler(req, res);

    expect(res.statusCode).toBe(405);
  });

  test('returns 400 for missing moveData', async () => {
    const req = createMockRequest({});
    const res = createMockResponse();

    await handler(req, res);

    expect(res.statusCode).toBe(400);
    const body = JSON.parse(res.body);
    expect(body.error).toBeDefined();
  });

  test('generates commentary for valid move data', async () => {
    const req = createMockRequest({
      moveData: {
        fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1',
        move: 'e4',
        classification: 'best',
        cpLoss: 0,
        moveNumber: 1,
        player: 'white',
      },
    });
    const res = createMockResponse();

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.commentary).toBeDefined();
    expect(typeof body.commentary).toBe('string');
  });

  test('sets CORS headers', async () => {
    const req = createMockRequest({
      moveData: {
        fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        move: 'd4',
        classification: 'best',
        cpLoss: 0,
        moveNumber: 1,
        player: 'white',
      },
    });
    const res = createMockResponse();

    await handler(req, res);

    expect(res.headers['Access-Control-Allow-Origin']).toBeDefined();
    expect(res.headers['Content-Type']).toBe('application/json');
  });

  test('includes cached flag in response', async () => {
    const moveData = {
      fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3',
      move: 'Nc3',
      classification: 'good',
      cpLoss: 10,
      moveNumber: 3,
      player: 'white',
    };

    // First request
    const req1 = createMockRequest({ moveData });
    const res1 = createMockResponse();
    await handler(req1, res1);

    const body1 = JSON.parse(res1.body);
    expect(body1.cached).toBeDefined();
    expect(typeof body1.cached).toBe('boolean');

    // Second request - should return same commentary
    const req2 = createMockRequest({ moveData });
    const res2 = createMockResponse();
    await handler(req2, res2);

    const body2 = JSON.parse(res2.body);
    expect(body2.cached).toBeDefined();
    expect(body2.commentary).toBe(body1.commentary);
  });
});
