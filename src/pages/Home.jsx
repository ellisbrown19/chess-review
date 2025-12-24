import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Home() {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    setLoading(true)
    // TODO: Implement game fetching logic
    // For now, just navigate to analysis page
    const gameId = input.includes('lichess.org')
      ? input.split('/').pop()
      : input

    navigate(`/analysis/${gameId}`)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Lichess Game Review</h1>
          <p className="text-gray-600 dark:text-gray-400">
            AI-powered chess analysis with instructive commentary
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="game-input"
                className="block text-sm font-medium mb-2"
              >
                Enter Lichess Username or Game URL/ID
              </label>
              <input
                id="game-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g., DrNykterstein or lichess.org/abc123XYZ"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              {loading ? 'Loading...' : 'Analyze Game'}
            </button>
          </form>

          <div className="mt-6 text-sm text-gray-600 dark:text-gray-400">
            <p className="font-medium mb-2">Features:</p>
            <ul className="space-y-1 ml-4">
              <li>• Move-by-move classification (Brilliant → Blunder)</li>
              <li>• AI-generated instructive commentary</li>
              <li>• Opening insights and famous games</li>
              <li>• Evaluation graphs and statistics</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
