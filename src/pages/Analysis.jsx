import { useParams } from 'react-router-dom'

function Analysis() {
  const { gameId } = useParams()

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Game Analysis</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Analyzing game: {gameId}
        </p>
        <div className="mt-8 text-gray-500 dark:text-gray-500">
          Analysis UI coming soon...
        </div>
      </div>
    </div>
  )
}

export default Analysis
