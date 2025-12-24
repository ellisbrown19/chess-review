/**
 * Game statistics summary
 * Shows game metadata and move statistics
 */
function GameStats({ game, moveStats }) {
  if (!game) {
    return null
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">
        Game Info
      </h3>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">White:</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {game.players?.white?.user?.name || 'Anonymous'}
            {game.players?.white?.rating && ` (${game.players.white.rating})`}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Black:</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {game.players?.black?.user?.name || 'Anonymous'}
            {game.players?.black?.rating && ` (${game.players.black.rating})`}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Result:</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {game.winner === 'white' ? '1-0' :
             game.winner === 'black' ? '0-1' :
             '½-½'}
          </span>
        </div>

        {game.speed && (
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Time Control:</span>
            <span className="font-medium text-gray-900 dark:text-white capitalize">
              {game.speed}
            </span>
          </div>
        )}

        {game.rated !== undefined && (
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Rated:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {game.rated ? 'Yes' : 'No'}
            </span>
          </div>
        )}
      </div>

      {moveStats && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Move Statistics
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {moveStats.brilliant > 0 && (
              <div className="flex justify-between">
                <span className="text-cyan-600 dark:text-cyan-400">Brilliant:</span>
                <span className="font-medium">{moveStats.brilliant}</span>
              </div>
            )}
            {moveStats.great > 0 && (
              <div className="flex justify-between">
                <span className="text-green-600 dark:text-green-400">Great:</span>
                <span className="font-medium">{moveStats.great}</span>
              </div>
            )}
            {moveStats.best > 0 && (
              <div className="flex justify-between">
                <span className="text-green-500 dark:text-green-300">Best:</span>
                <span className="font-medium">{moveStats.best}</span>
              </div>
            )}
            {moveStats.inaccuracy > 0 && (
              <div className="flex justify-between">
                <span className="text-yellow-600 dark:text-yellow-400">Inaccuracies:</span>
                <span className="font-medium">{moveStats.inaccuracy}</span>
              </div>
            )}
            {moveStats.mistake > 0 && (
              <div className="flex justify-between">
                <span className="text-orange-600 dark:text-orange-400">Mistakes:</span>
                <span className="font-medium">{moveStats.mistake}</span>
              </div>
            )}
            {moveStats.blunder > 0 && (
              <div className="flex justify-between">
                <span className="text-red-600 dark:text-red-400">Blunders:</span>
                <span className="font-medium">{moveStats.blunder}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default GameStats
