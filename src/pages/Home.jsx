import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchUserGames, isLikelyUsername, extractGameId } from '../api/lichess'

function Home() {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [games, setGames] = useState(null)
  const [username, setUsername] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    setLoading(true)
    setError(null)
    setGames(null)

    try {
      // Check if input is a username
      if (isLikelyUsername(input)) {
        // Fetch user's recent games
        const data = await fetchUserGames(input.trim())
        setGames(data.games)
        setUsername(data.username)
      } else {
        // Extract game ID and navigate to analysis
        const gameId = extractGameId(input)
        navigate(`/analysis/${gameId}`)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGameClick = (gameId) => {
    navigate(`/analysis/${gameId}`)
  }

  const handleReset = () => {
    setInput('')
    setGames(null)
    setUsername(null)
    setError(null)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">
            Lichess Game Review
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            AI-powered chess analysis with instructive commentary
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="game-input"
                className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
              >
                Enter Lichess Username or Game URL/ID
              </label>
              <input
                id="game-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g., DrNykterstein or lichess.org/abc123XYZ"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                disabled={loading}
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                {loading ? 'Loading...' : games ? 'Search Again' : 'Analyze Game'}
              </button>

              {games && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 rounded-lg">
              <p className="text-red-700 dark:text-red-200 text-sm">{error}</p>
            </div>
          )}

          {!games && !error && (
            <div className="mt-6 text-sm text-gray-600 dark:text-gray-400">
              <p className="font-medium mb-2">Features:</p>
              <ul className="space-y-1 ml-4">
                <li>• Move-by-move classification (Brilliant → Blunder)</li>
                <li>• AI-generated instructive commentary</li>
                <li>• Opening insights and famous games</li>
                <li>• Evaluation graphs and statistics</li>
              </ul>
            </div>
          )}
        </div>

        {games && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Recent Games for {username}
            </h2>

            {games.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400">
                No games found for this user.
              </p>
            ) : (
              <div className="space-y-3">
                {games.map((game) => (
                  <div
                    key={game.id}
                    onClick={() => handleGameClick(game.id)}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {game.players.white.user?.name || 'Anonymous'}
                          </span>
                          {game.players.white.rating && (
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              ({game.players.white.rating})
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {game.players.black.user?.name || 'Anonymous'}
                          </span>
                          {game.players.black.rating && (
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              ({game.players.black.rating})
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className={`text-lg font-bold ${
                          game.winner === 'white' ? 'text-gray-900 dark:text-white' :
                          game.winner === 'black' ? 'text-gray-900 dark:text-white' :
                          'text-gray-600 dark:text-gray-400'
                        }`}>
                          {game.winner === 'white' ? '1-0' :
                           game.winner === 'black' ? '0-1' :
                           '½-½'}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(game.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {game.opening && (
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {game.opening.name}
                      </div>
                    )}

                    <div className="flex gap-2 text-xs">
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-gray-700 dark:text-gray-300">
                        {game.speed}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-gray-700 dark:text-gray-300">
                        {game.rated ? 'Rated' : 'Casual'}
                      </span>
                      {game.variant !== 'standard' && (
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded text-blue-700 dark:text-blue-300">
                          {game.variant}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
