/**
 * Move classification logic following chess.com's system
 * Based on centipawn loss from best move
 */

/**
 * Classify a chess move based on evaluation change
 * @param {Object} params
 * @param {string} params.movePlayed - The move that was played
 * @param {number|Object} params.evalBefore - Evaluation before the move (cp or mate object)
 * @param {number|Object} params.evalAfter - Evaluation after the move (cp or mate object)
 * @param {string} params.bestMove - The best move according to engine
 * @param {boolean} params.isBestMove - Whether the played move was the best move
 * @param {boolean} [params.isSacrifice] - Whether the move sacrifices material
 * @param {number} [params.evalSwing] - Size of evaluation swing (for great moves)
 * @returns {Object} - { classification, cpLoss, evalSwing? }
 */
export function classifyMove({
  movePlayed,
  evalBefore,
  evalAfter,
  bestMove,
  isBestMove,
  isSacrifice = false,
  evalSwing = 0,
}) {
  // Convert mate scores to large centipawn values
  const cpBefore = normalizeEval(evalBefore);
  const cpAfter = normalizeEval(evalAfter);

  // Calculate centipawn loss (from player's perspective)
  const cpLoss = Math.abs(cpBefore - cpAfter);

  // Brilliant: Best move + material sacrifice OR creates huge swing
  if (isBestMove && isSacrifice) {
    return {
      classification: 'brilliant',
      cpLoss: 0,
    };
  }

  // Great: Best move with significant evaluation swing (critical position)
  if (isBestMove && evalSwing >= 300) {
    return {
      classification: 'great',
      cpLoss: 0,
      evalSwing,
    };
  }

  // Best: Top engine move (0 cp loss)
  if (isBestMove || cpLoss === 0) {
    return {
      classification: 'best',
      cpLoss: 0,
    };
  }

  // Good: 0-50 cp loss
  if (cpLoss < 50) {
    return {
      classification: 'good',
      cpLoss,
    };
  }

  // Inaccuracy: 50-100 cp loss
  if (cpLoss < 100) {
    return {
      classification: 'inaccuracy',
      cpLoss,
    };
  }

  // Mistake: 100-200 cp loss
  if (cpLoss < 200) {
    return {
      classification: 'mistake',
      cpLoss,
    };
  }

  // Blunder: 200+ cp loss
  return {
    classification: 'blunder',
    cpLoss,
  };
}

/**
 * Normalize evaluation to centipawns
 * Converts mate scores to large cp values
 */
function normalizeEval(evaluation) {
  if (typeof evaluation === 'number') {
    return evaluation;
  }

  // Handle mate scores: { type: 'mate', value: N }
  if (evaluation && evaluation.type === 'mate') {
    // Mate in N moves
    // Positive mate = winning, negative = losing
    // Convert to large centipawn value (10000 = mate)
    const mateValue = evaluation.value > 0 ? 10000 : -10000;
    return mateValue;
  }

  return 0;
}
