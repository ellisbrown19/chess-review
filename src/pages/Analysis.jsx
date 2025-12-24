import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Chess } from 'chess.js'
import { fetchGame, evaluatePositions } from '../api/lichess'
import Board from '../components/Board'
import Controls from '../components/Controls'
import MoveList from '../components/MoveList'
import AnalysisPanel from '../components/AnalysisPanel'
import OpeningInfo from '../components/OpeningInfo'
import GameStats from '../components/GameStats'

function Analysis() {
  const { gameId } = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [game, setGame] = useState(null)
  const [moves, setMoves] = useState([])
  const [positions, setPositions] = useState([])
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0)
  const [opening, setOpening] = useState(null)
  const [moveStats, setMoveStats] = useState(null)

  useEffect(() => {
    loadGame()
  }, [gameId])

  const loadGame = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch game data
      const gameData = await fetchGame(gameId)
      setGame(gameData)

      // Parse PGN and generate positions
      const chess = new Chess()
      const parsedMoves = []
      const positionsList = [chess.fen()]

      // Parse moves from PGN
      const pgnMoves = gameData.pgn.match(/\d+\.\s+(\S+)(?:\s+(\S+))?/g) || []
      pgnMoves.forEach(moveText => {
        const cleanMoves = moveText.replace(/\d+\.\s+/, '').split(/\s+/)
        cleanMoves.forEach(san => {
          if (san && san !== '1-0' && san !== '0-1' && san !== '1/2-1/2') {
            try {
              const move = chess.move(san)
              if (move) {
                parsedMoves.push({
                  san: move.san,
                  from: move.from,
                  to: move.to,
                  moveNumber: chess.moveNumber(),
                })
                positionsList.push(chess.fen())
              }
            } catch (e) {
              console.error('Error parsing move:', san, e)
            }
          }
        })
      })

      setMoves(parsedMoves)
      setPositions(positionsList)

      // Fetch evaluations for all positions
      await evaluatePositionsAndClassify(positionsList, parsedMoves)

      // Detect opening (placeholder - will use backend)
      if (gameData.opening) {
        setOpening({
          name: gameData.opening.name,
          eco: gameData.opening.eco,
        })
      }

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const evaluatePositionsAndClassify = async (positionsList, parsedMoves) => {
    try {
      // Get evaluations from Lichess Cloud Eval
      const { evaluations } = await evaluatePositions(positionsList)

      // Classify moves based on evaluations
      const classifiedMoves = parsedMoves.map((move, index) => {
        const evalBefore = evaluations[index]
        const evalAfter = evaluations[index + 1]

        if (!evalBefore || !evalAfter) {
          return { ...move }
        }

        // Simple classification based on centipawn loss
        const cpBefore = evalBefore.cp !== undefined ? evalBefore.cp : 0
        const cpAfter = evalAfter.cp !== undefined ? evalAfter.cp : 0
        const cpLoss = Math.abs(cpBefore - cpAfter)

        let classification = 'best'
        if (cpLoss < 50) classification = 'good'
        else if (cpLoss < 100) classification = 'inaccuracy'
        else if (cpLoss < 200) classification = 'mistake'
        else classification = 'blunder'

        return {
          ...move,
          classification,
          cpLoss,
          evaluation: evalAfter.cp,
        }
      })

      setMoves(classifiedMoves)

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

      setMoveStats(stats)

    } catch (err) {
      console.error('Error evaluating positions:', err)
    }
  }

  const handleGenerateCommentary = async (move) => {
    // TODO: Call commentary API
    console.log('Generate commentary for move:', move)
  }

  const handleMoveClick = (index) => {
    setCurrentMoveIndex(index)
  }

  const handleFirst = () => setCurrentMoveIndex(0)
  const handlePrevious = () => setCurrentMoveIndex(Math.max(0, currentMoveIndex - 1))
  const handleNext = () => setCurrentMoveIndex(Math.min(moves.length, currentMoveIndex + 1))
  const handleLast = () => setCurrentMoveIndex(moves.length)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
            Loading game analysis...
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            Fetching game data and evaluating positions
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-red-600 dark:text-red-400">
            Error Loading Game
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">{error}</p>
          <Link
            to="/"
            className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  const currentPosition = positions[currentMoveIndex] || positions[0]
  const currentMove = currentMoveIndex > 0 ? moves[currentMoveIndex - 1] : null

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/"
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
          >
            ← Back to Home
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Game Analysis
          </h1>
          <div className="w-20"></div> {/* Spacer for centering */}
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Board and Controls */}
          <div className="lg:col-span-2">
            <Board
              position={currentPosition}
              boardOrientation={game?.players?.white?.user?.name ? 'white' : 'white'}
            />
            <Controls
              currentMove={currentMoveIndex}
              totalMoves={moves.length}
              onFirst={handleFirst}
              onPrevious={handlePrevious}
              onNext={handleNext}
              onLast={handleLast}
            />

            <div className="mt-6">
              <AnalysisPanel
                move={currentMove}
                onGenerateCommentary={handleGenerateCommentary}
              />
            </div>
          </div>

          {/* Right Column - Info Panels */}
          <div className="space-y-6">
            <GameStats game={game} moveStats={moveStats} />
            <OpeningInfo opening={opening} />
            <MoveList
              moves={moves}
              currentMoveIndex={currentMoveIndex}
              onMoveClick={handleMoveClick}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analysis
