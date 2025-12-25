import { describe, test, expect } from '@jest/globals';
import { Chess } from 'chess.js';

describe('PGN Parsing', () => {
  test('parses complete game with annotations', () => {
    const pgnWithAnnotations = `[Event "Test Game"]
[White "Player1"]
[Black "Player2"]

1. e4 {[%clk 0:30:00]} e5 {[%clk 0:30:00]}
2. Nf3 {[%clk 0:29:55]} Nc6 {[%eval 0.2]}`;

    const chess = new Chess();
    chess.loadPgn(pgnWithAnnotations);
    const history = chess.history({ verbose: true });

    expect(history.length).toBe(4);
    expect(history[0].san).toBe('e4');
    expect(history[1].san).toBe('e5');
    expect(history[2].san).toBe('Nf3');
    expect(history[3].san).toBe('Nc6');
  });

  test('parses PGN with clock annotations', () => {
    const pgnWithClocks = `1. d4 {[%clk 0:10:00]} d5 {[%clk 0:10:00]}
2. c4 {[%clk 0:09:58]} c6 {[%clk 0:09:57]}`;

    const chess = new Chess();
    chess.loadPgn(pgnWithClocks);
    const history = chess.history({ verbose: true });

    expect(history.length).toBe(4);
    expect(history.map(m => m.san)).toEqual(['d4', 'd5', 'c4', 'c6']);
  });

  test('parses PGN with evaluation annotations', () => {
    const pgnWithEvals = `1. e4 {[%eval 0.3]} e5 {[%eval 0.2]} 2. Nf3 {[%eval 0.5]} Nc6 {[%eval 0.3]}`;

    const chess = new Chess();
    chess.loadPgn(pgnWithEvals);
    const history = chess.history({ verbose: true });

    expect(history.length).toBe(4);
    expect(history.map(m => m.san)).toEqual(['e4', 'e5', 'Nf3', 'Nc6']);
  });

  test('generates correct number of positions', () => {
    const pgn = `1. e4 e5 2. Nf3 Nc6 3. Bb5 a6`;

    const chess = new Chess();
    chess.loadPgn(pgn);
    const history = chess.history({ verbose: true });

    expect(history.length).toBe(6);

    // Generate positions list (starting position + position after each move)
    const positionsList = [new Chess().fen()];
    const chessReplay = new Chess();

    history.forEach((move) => {
      chessReplay.move(move.san);
      positionsList.push(chessReplay.fen());
    });

    expect(positionsList.length).toBe(7); // Starting + 6 moves
    expect(positionsList[0]).toContain('rnbqkbnr/pppppppp'); // Starting position
  });

  test('handles complex PGN with multiple annotation types', () => {
    const complexPgn = `[Event "Rated Rapid game"]
[Site "https://lichess.org/abc123XY"]

1. d4 {[%clk 0:05:00] [%eval 0.08]} d5 {[%clk 0:05:00] [%eval 0.07]}
2. c4 {[%clk 0:04:58] [%eval 0.1]} c6 {[%clk 0:04:57] [%eval 0.14]}
3. Nc3 {[%clk 0:04:55] [%eval 0.12]} Nf6 {[%clk 0:04:54] [%eval 0.1]}`;

    const chess = new Chess();
    chess.loadPgn(complexPgn);
    const history = chess.history({ verbose: true });

    expect(history.length).toBe(6);
    expect(history.map(m => m.san)).toEqual(['d4', 'd5', 'c4', 'c6', 'Nc3', 'Nf6']);
  });

  test('parses long game without losing moves', () => {
    // Create a PGN with 40 moves (typical game length)
    const longPgn = `1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7
6. Re1 b5 7. Bb3 d6 8. c3 O-O 9. h3 Nb8 10. d4 Nbd7
11. Nbd2 Bb7 12. Bc2 Re8 13. Nf1 Bf8 14. Ng3 g6 15. a4 c5
16. d5 c4 17. Bg5 Nc5 18. Qd2 h6 19. Bxf6 Qxf6 20. Nh2 Qd8`;

    const chess = new Chess();
    chess.loadPgn(longPgn);
    const history = chess.history({ verbose: true });

    expect(history.length).toBe(40); // Should parse all 40 moves
  });

  test('handles PGN with text comments', () => {
    const pgnWithComments = `1. e4 {Good opening!} e5 {Standard response}
2. Nf3 {Developing} Nc6 {Developing}`;

    const chess = new Chess();
    chess.loadPgn(pgnWithComments);
    const history = chess.history({ verbose: true });

    expect(history.length).toBe(4);
    expect(history.map(m => m.san)).toEqual(['e4', 'e5', 'Nf3', 'Nc6']);
  });

  test('positions list matches move count', () => {
    const pgn = `1. d4 d5 2. c4 e6 3. Nc3 Nf6 4. Bg5 Be7 5. e3 O-O`;

    const chess = new Chess();
    chess.loadPgn(pgn);
    const history = chess.history({ verbose: true });

    const positionsList = [new Chess().fen()];
    const chessReplay = new Chess();

    history.forEach((move) => {
      chessReplay.move(move.san);
      positionsList.push(chessReplay.fen());
    });

    // Positions should be move count + 1 (starting position)
    expect(positionsList.length).toBe(history.length + 1);
    expect(positionsList.length).toBe(11); // 10 moves + starting position
  });
});
