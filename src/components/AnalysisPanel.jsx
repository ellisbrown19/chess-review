import { useState } from 'react'

/**
 * Analysis panel showing move classification and AI commentary
 */
function AnalysisPanel({ move, onGenerateCommentary }) {
  const [loadingCommentary, setLoadingCommentary] = useState(false)

  if (!move) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <p className="text-gray-600 dark:text-gray-400 text-center">
          Navigate through moves to see analysis
        </p>
      </div>
    )
  }

  const classificationColors = {
    brilliant: 'bg-cyan-500 text-white',
    great: 'bg-green-500 text-white',
    best: 'bg-green-400 text-white',
    good: 'bg-lime-400 text-gray-900',
    inaccuracy: 'bg-yellow-400 text-gray-900',
    mistake: 'bg-orange-500 text-white',
    blunder: 'bg-red-600 text-white',
  }

  const classificationLabels = {
    brilliant: 'Brilliant!!',
    great: 'Great!',
    best: 'Best Move',
    good: 'Good',
    inaccuracy: 'Inaccuracy',
    mistake: 'Mistake',
    blunder: 'Blunder',
  }

  const handleGenerateCommentary = async () => {
    setLoadingCommentary(true)
    try {
      await onGenerateCommentary(move)
    } finally {
      setLoadingCommentary(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {move.moveNumber}. {move.san}
          </h3>
          {move.classification && (
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                classificationColors[move.classification] || 'bg-gray-400 text-white'
              }`}
            >
              {classificationLabels[move.classification]}
            </span>
          )}
        </div>

        {move.cpLoss !== undefined && move.cpLoss > 0 && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Centipawn loss: {move.cpLoss}
          </p>
        )}
      </div>

      {move.evaluation && (
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Evaluation:
            </span>
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {move.evaluation.type === 'mate'
                ? `#${move.evaluation.value}`
                : `${(move.evaluation / 100).toFixed(2)}`}
            </span>
          </div>
        </div>
      )}

      {move.bestMove && move.bestMove !== move.san && (
        <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
          <p className="text-sm font-medium text-yellow-900 dark:text-yellow-200">
            Best move: {move.bestMove}
          </p>
        </div>
      )}

      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          AI Commentary
        </h4>

        {move.commentary ? (
          <div className="text-sm text-gray-900 dark:text-white leading-relaxed">
            {move.commentary}
            {move.commentaryCached && (
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                (cached)
              </span>
            )}
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              No commentary generated yet.
            </p>
            <button
              onClick={handleGenerateCommentary}
              disabled={loadingCommentary}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white text-sm font-medium rounded transition-colors"
            >
              {loadingCommentary ? 'Generating...' : 'Generate Commentary'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default AnalysisPanel
