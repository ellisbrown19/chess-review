/**
 * Move navigation controls
 * Buttons to navigate through game moves
 */
function Controls({ currentMove, totalMoves, onFirst, onPrevious, onNext, onLast }) {
  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      <button
        onClick={onFirst}
        disabled={currentMove === 0}
        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
        title="First move"
      >
        ⏮
      </button>
      <button
        onClick={onPrevious}
        disabled={currentMove === 0}
        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
        title="Previous move"
      >
        ◀
      </button>
      <span className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
        {currentMove} / {totalMoves}
      </span>
      <button
        onClick={onNext}
        disabled={currentMove === totalMoves}
        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
        title="Next move"
      >
        ▶
      </button>
      <button
        onClick={onLast}
        disabled={currentMove === totalMoves}
        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
        title="Last move"
      >
        ⏭
      </button>
    </div>
  )
}

export default Controls
