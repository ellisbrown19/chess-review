/**
 * Opening information display
 * Shows opening name, ECO code, fun facts, and famous games
 */
function OpeningInfo({ opening }) {
  if (!opening) {
    return null
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">
        Opening
      </h3>

      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
            {opening.name}
          </h4>
          {opening.eco && (
            <span className="text-sm text-gray-600 dark:text-gray-400">
              ({opening.eco})
            </span>
          )}
        </div>
      </div>

      {opening.wikiUrl && (
        <a
          href={opening.wikiUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-sm text-blue-600 dark:text-blue-400 hover:underline mb-3"
        >
          Learn more on Wikipedia →
        </a>
      )}

      {opening.funFact && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
          <p className="text-sm text-blue-900 dark:text-blue-200 leading-relaxed">
            {opening.funFact}
          </p>
        </div>
      )}

      {opening.famousGames && opening.famousGames.length > 0 && (
        <div>
          <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Famous Games
          </h5>
          <div className="space-y-2">
            {opening.famousGames.map((game, index) => (
              <div
                key={index}
                className="p-3 bg-gray-50 dark:bg-gray-700 rounded text-sm"
              >
                <div className="font-medium text-gray-900 dark:text-white mb-1">
                  {game.white} vs {game.black}
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-xs mb-1">
                  {game.event} ({game.year}) • Result: {game.result}
                </div>
                {game.why && (
                  <div className="text-gray-700 dark:text-gray-300 text-xs italic">
                    {game.why}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default OpeningInfo
