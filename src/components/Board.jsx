import { Chessboard } from 'react-chessboard'

/**
 * Chess board display component
 * Display-only board showing current position
 */
function Board({ position, boardOrientation = 'white' }) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <Chessboard
        position={position}
        boardOrientation={boardOrientation}
        arePiecesDraggable={false}
        customBoardStyle={{
          borderRadius: '4px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      />
    </div>
  )
}

export default Board
