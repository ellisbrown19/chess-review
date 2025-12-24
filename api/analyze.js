/**
 * Serverless function for comprehensive game analysis
 * POST /api/analyze
 *
 * Orchestrates:
 * - Position evaluation via Lichess Cloud Eval
 * - Move classification using chess.com-compatible system
 * - Opening detection with fun facts and famous games
 */

import { Chess } from 'chess.js'
import { classifyMove } from '../lib/analysis/classifier.js'
import { detectOpening } from '../lib/analysis/openings.js'

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Content-Type', 'application/json')

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).json({ ok: true })
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Parse request body
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    const { pgn, evaluations } = body

    // Validate input
    if (!pgn) {
      return res.status(400).json({ error: 'Missing required field: pgn' })
    }

    if (!evaluations || !Array.isArray(evaluations)) {
      return res.status(400).json({ error: 'Missing required field: evaluations (array)' })
    }

    // Parse PGN and generate moves
    const chess = new Chess()
    const moves = []
    const movesSAN = []

    // Load PGN
    chess.loadPgn(pgn)

    // Get move history
    const history = chess.history({ verbose: true })

    // Reset and replay to build move list
    chess.reset()
    history.forEach((move, index) => {
      movesSAN.push(move.san)
      chess.move(move.san)
    })

    // Detect opening from first moves
    const opening = detectOpening(movesSAN)

    // Classify each move
    chess.reset()
    const classifiedMoves = []

    history.forEach((move, index) => {
      const evalBefore = evaluations[index]
      const evalAfter = evaluations[index + 1]

      if (!evalBefore || !evalAfter) {
        classifiedMoves.push({
          san: move.san,
          from: move.from,
          to: move.to,
          moveNumber: Math.floor(index / 2) + 1,
          color: move.color,
        })
        return
      }

      // Normalize evaluations
      const normalizeBefore = evalBefore.mate !== undefined
        ? { type: 'mate', value: evalBefore.mate }
        : evalBefore.cp

      const normalizeAfter = evalAfter.mate !== undefined
        ? { type: 'mate', value: evalAfter.mate }
        : evalAfter.cp

      // Get best move (first PV move)
      const bestMove = evalBefore.pvs && evalBefore.pvs[0] && evalBefore.pvs[0].moves
        ? evalBefore.pvs[0].moves.split(' ')[0]
        : move.san

      const isBestMove = move.san === bestMove || move.from + move.to === bestMove

      // Classify the move
      const classification = classifyMove({
        movePlayed: move.san,
        evalBefore: normalizeBefore,
        evalAfter: normalizeAfter,
        bestMove,
        isBestMove,
        isSacrifice: false, // TODO: Detect material sacrifice
        evalSwing: 0, // TODO: Calculate evaluation swing
      })

      classifiedMoves.push({
        san: move.san,
        from: move.from,
        to: move.to,
        moveNumber: Math.floor(index / 2) + 1,
        color: move.color,
        classification: classification.classification,
        cpLoss: classification.cpLoss,
        evaluation: normalizeAfter,
        bestMove: isBestMove ? null : bestMove,
      })

      // Make the move for next iteration
      chess.move(move.san)
    })

    // Calculate move statistics
    const stats = {
      brilliant: 0,
      great: 0,
      best: 0,
      good: 0,
      inaccuracy: 0,
      mistake: 0,
      blunder: 0,
    }

    classifiedMoves.forEach(move => {
      if (move.classification) {
        stats[move.classification] = (stats[move.classification] || 0) + 1
      }
    })

    // Return complete analysis
    return res.status(200).json({
      moves: classifiedMoves,
      opening: opening || null,
      stats,
      totalMoves: classifiedMoves.length,
    })

  } catch (error) {
    console.error('Analysis error:', error)
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    })
  }
}
