/**
 * AI commentary prompt generation
 * Creates concise prompts for Claude Haiku to generate instructive chess commentary
 */

/**
 * Generate a prompt for move commentary
 * @param {Object} moveData - Data about the move to comment on
 * @param {string} moveData.fen - Position FEN before the move
 * @param {string} moveData.move - Move played in algebraic notation
 * @param {string} moveData.classification - Move classification (brilliant, great, best, good, inaccuracy, mistake, blunder)
 * @param {number} moveData.cpLoss - Centipawn loss from best move
 * @param {number} moveData.moveNumber - Move number in the game
 * @param {string} moveData.player - Player who made the move (white or black)
 * @param {string} [moveData.bestMove] - Best move according to engine (if different from played move)
 * @param {boolean} [moveData.isSacrifice] - Whether the move sacrifices material
 * @returns {string} - Prompt for AI commentary generation
 */
export function generateMoveCommentaryPrompt(moveData) {
  const {
    fen,
    move,
    classification,
    cpLoss,
    moveNumber,
    player,
    bestMove,
    isSacrifice,
  } = moveData;

  // Build concise prompt for cost optimization
  let prompt = `Position: ${fen}\n`;
  prompt += `Move ${moveNumber} by ${player}: ${move}\n`;
  prompt += `Classification: ${classification}\n`;

  if (cpLoss > 0) {
    prompt += `Centipawn loss: ${cpLoss}\n`;
  }

  if (bestMove && bestMove !== move) {
    prompt += `Best move was: ${bestMove}\n`;
  }

  if (isSacrifice) {
    prompt += `This move sacrifices material.\n`;
  }

  prompt += `\nProvide brief instructive commentary (2-3 sentences) explaining why this move is ${classification}.`;

  return prompt;
}
