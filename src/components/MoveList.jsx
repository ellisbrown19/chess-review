/**
 * Move list sidebar
 * Shows all moves with classification badges
 */
function MoveList({ moves, currentMoveIndex, onMoveClick }) {
  const classificationColors = {
    brilliant: 'bg-cyan-500 text-white',
    great: 'bg-green-500 text-white',
    best: 'bg-green-400 text-white',
    good: 'bg-lime-400 text-gray-900',
    inaccuracy: 'bg-yellow-400 text-gray-900',
    mistake: 'bg-orange-500 text-white',
    blunder: 'bg-red-600 text-white',
  }

  const classificationSymbols = {
    brilliant: '!!',
    great: '!',
    best: '',
    good: '',
    inaccuracy: '?!',
    mistake: '?',
    blunder: '??',
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-h-96 overflow-y-auto">
      <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">
        Moves
      </h3>
      <div className="space-y-1">
        {moves.map((move, index) => {
          const moveNumber = Math.floor(index / 2) + 1
          const isWhite = index % 2 === 0
          const isCurrentMove = index === currentMoveIndex - 1

          return (
            <div
              key={index}
              onClick={() => onMoveClick(index + 1)}
              className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer transition-colors ${
                isCurrentMove
                  ? 'bg-blue-100 dark:bg-blue-900'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {isWhite && (
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400 w-8">
                  {moveNumber}.
                </span>
              )}
              {!isWhite && <span className="w-8"></span>}

              <span className="font-mono text-sm flex-1 text-gray-900 dark:text-white">
                {move.san}
                {move.classification && classificationSymbols[move.classification]}
              </span>

              {move.classification && move.classification !== 'best' && move.classification !== 'good' && (
                <span
                  className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                    classificationColors[move.classification] || 'bg-gray-400 text-white'
                  }`}
                >
                  {classificationSymbols[move.classification]}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MoveList
