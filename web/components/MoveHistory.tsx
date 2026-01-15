'use client';

import { useGameStore } from '@/lib/store';
import { getCardById } from '@/lib/cards';
import { format } from 'date-fns';

export function MoveHistory() {
  const session = useGameStore(state => state.session);
  
  if (!session) return null;
  
  const moves = [...session.moveHistory].reverse(); // Most recent first
  
  const getMoveIcon = (moveType: string) => {
    switch (moveType) {
      case 'play-card': return '🎴';
      case 'accept-card': return '✅';
      case 'reject-card': return '❌';
      case 'modify-card': return '✏️';
      case 'counter-propose': return '🔄';
      case 'undo': return '↩️';
      case 'message': return '💬';
      default: return '📝';
    }
  };
  
  const getMoveColor = (moveType: string) => {
    switch (moveType) {
      case 'play-card': return 'bg-blue-50 border-blue-200';
      case 'accept-card': return 'bg-green-50 border-green-200';
      case 'reject-card': return 'bg-red-50 border-red-200';
      case 'modify-card': return 'bg-yellow-50 border-yellow-200';
      case 'counter-propose': return 'bg-purple-50 border-purple-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };
  
  const getMoveDescription = (move: typeof moves[0]) => {
    const playerName = move.player === 'A' ? session.partyA.name : session.partyB.name;
    
    switch (move.type) {
      case 'play-card': {
        const card = move.data.cardId ? getCardById(move.data.cardId) : null;
        return `${playerName} proposed ${card?.name || 'a card'}`;
      }
      case 'accept-card': {
        const card = move.data.cardId ? getCardById(move.data.cardId) : null;
        return `${playerName} accepted ${card?.name || 'the proposal'}`;
      }
      case 'reject-card': {
        return `${playerName} rejected the proposal`;
      }
      case 'modify-card': {
        return `${playerName} modified and counter-proposed`;
      }
      case 'counter-propose': {
        return `${playerName} made a counter-proposal`;
      }
      case 'message': {
        return move.data.message || `${playerName} sent a message`;
      }
      default:
        return `${playerName} made a move`;
    }
  };
  
  if (moves.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <div className="text-4xl mb-2">📜</div>
        <div className="text-sm">No moves yet</div>
        <div className="text-xs mt-1">Start playing cards to see history</div>
      </div>
    );
  }
  
  return (
    <div className="p-4 space-y-3">
      {moves.map((move, index) => {
        const card = move.data.cardId ? getCardById(move.data.cardId) : null;
        
        return (
          <div
            key={move.id}
            className={`p-4 border rounded-lg ${getMoveColor(move.type)} transition-all hover:shadow-md`}
          >
            {/* Header */}
            <div className="flex items-start gap-3 mb-2">
              <div className="text-2xl">{getMoveIcon(move.type)}</div>
              <div className="flex-1">
                <div className="font-semibold text-sm">
                  {getMoveDescription(move)}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {format(move.timestamp, 'MMM d, h:mm a')} • Turn #{session.turnNumber - index}
                </div>
              </div>
            </div>
            
            {/* Card Details */}
            {card && (
              <div className="ml-11 pl-3 border-l-2 border-gray-300">
                <div className="text-xs font-semibold text-gray-700 mb-1">
                  {card.icon} {card.name}
                </div>
                <div className="text-xs text-gray-600">
                  {card.description}
                </div>
              </div>
            )}
            
            {/* Custom Values */}
            {move.data.values && Object.keys(move.data.values).length > 0 && (
              <div className="ml-11 mt-2 p-2 bg-white rounded border border-gray-200">
                <div className="text-xs font-semibold text-gray-700 mb-1">Details:</div>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(move.data.values).map(([key, value]) => (
                    <div key={key} className="text-xs">
                      <span className="text-gray-600">{key}:</span>{' '}
                      <span className="font-medium">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Message */}
            {move.data.message && (
              <div className="ml-11 mt-2 p-2 bg-white rounded border border-gray-200 text-xs italic text-gray-700">
                "{move.data.message}"
              </div>
            )}
            
            {/* Equity Delta */}
            {move.equityBefore && move.equityAfter && (
              <div className="ml-11 mt-2 flex items-center gap-2 text-xs">
                <span className="text-gray-600">Equity:</span>
                <span className="font-mono">{move.equityBefore.equityScore}</span>
                <span>→</span>
                <span className="font-mono font-bold">{move.equityAfter.equityScore}</span>
                {move.equityAfter.equityScore > move.equityBefore.equityScore ? (
                  <span className="text-green-600">↑</span>
                ) : move.equityAfter.equityScore < move.equityBefore.equityScore ? (
                  <span className="text-red-600">↓</span>
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/**
 * Move history modal/sidebar toggle
 */
export function MoveHistoryToggle({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) {
  const session = useGameStore(state => state.session);
  const moveCount = session?.moveHistory.length || 0;
  
  return (
    <button
      onClick={onToggle}
      className={`fixed left-4 top-20 z-50 px-4 py-2 rounded-lg shadow-lg font-semibold text-sm transition-all ${
        isOpen
          ? 'bg-gray-700 text-white'
          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
      }`}
    >
      {isOpen ? 'Hide →' : '📜 Show'} History
      {moveCount > 0 && (
        <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
          {moveCount}
        </span>
      )}
    </button>
  );
}

/**
 * Move history sidebar (left side)
 */
export function MoveHistorySidebar() {
  return (
    <div className="fixed left-0 top-16 bottom-0 w-96 bg-white border-r shadow-lg overflow-auto z-40">
      <div className="sticky top-0 bg-white border-b p-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <span>📜</span>
          <span>Move History</span>
        </h2>
        <p className="text-xs text-gray-600 mt-1">
          Complete timeline of negotiations
        </p>
      </div>
      <MoveHistory />
    </div>
  );
}
