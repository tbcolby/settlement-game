'use client';

import { useState } from 'react';
import { useGameStore } from '@/lib/store';
import { Card, CardCompact } from './Card';
import { SETTLEMENT_CARDS } from '@/lib/cards';
import { CardCustomizationModal } from './CardCustomizationModal';
import { getCardById } from '@/lib/cards';

export function GameBoard() {
  const session = useGameStore(state => state.session);
  const showModal = useGameStore(state => state.showModal);
  const respondToProposal = useGameStore(state => state.respondToProposal);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [showCustomizationModal, setShowCustomizationModal] = useState(false);
  
  if (!session) return null;
  
  const currentPlayer = session.currentTurn;
  const pendingProposal = session.pendingProposal;
  const isCurrentPlayersTurn = !pendingProposal;
  
  const handleCardClick = (cardId: string) => {
    if (pendingProposal) return; // Can't play cards when responding to proposal
    setSelectedCard(cardId);
    setShowCustomizationModal(true);
  };
  
  const handleAccept = () => {
    respondToProposal('accept');
  };
  
  const handleReject = () => {
    respondToProposal('reject');
  };
  
  const handleModify = () => {
    if (pendingProposal) {
      setSelectedCard(pendingProposal.card.cardId);
      setShowCustomizationModal(true);
    }
  };
  
  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        
        {/* Pending Proposal Section */}
        {pendingProposal && (
          <div className="mb-8 p-6 bg-yellow-50 border-2 border-yellow-400 rounded-lg">
            <h2 className="text-xl font-bold mb-2 text-yellow-900">
              ⚠️ Pending Proposal from Party {pendingProposal.proposedBy}
            </h2>
            <p className="text-sm text-yellow-800 mb-4">
              Party {session.currentTurn} must respond to this proposal
            </p>
            
            {/* Show proposal card */}
            <div className="mb-4 max-w-xs">
              <Card 
                card={getCardById(pendingProposal.card.cardId)!}
                selected={true}
              />
            </div>
            
            {/* Show customization values */}
            {Object.keys(pendingProposal.card.customValues).length > 0 && (
              <div className="mb-4 p-4 bg-white rounded border border-yellow-300">
                <h3 className="font-bold text-sm mb-2">Proposed Terms:</h3>
                <div className="space-y-2">
                  {Object.entries(pendingProposal.card.customValues).map(([key, value]) => (
                    <div key={key} className="text-sm">
                      <span className="font-semibold">{key}:</span> {value}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Response actions */}
            <div className="flex gap-3">
              <button
                onClick={handleAccept}
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700"
              >
                ✅ Accept
              </button>
              <button
                onClick={handleReject}
                className="px-6 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700"
              >
                ❌ Reject
              </button>
              <button
                onClick={handleModify}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700"
              >
                ✏️ Modify & Counter
              </button>
            </div>
          </div>
        )}
        
        {/* Current Turn Indicator */}
        {isCurrentPlayersTurn && (
          <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-600 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="text-2xl">👉</div>
              <div>
                <div className="text-lg font-bold text-blue-900">
                  Party {currentPlayer}'s Turn
                </div>
                <div className="text-sm text-blue-700">
                  Select a card to propose a settlement term
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Available Cards */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span>🎴</span>
            <span>Available Settlement Cards</span>
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {SETTLEMENT_CARDS.map(card => (
              <Card
                key={card.id}
                card={card}
                onClick={() => handleCardClick(card.id)}
                disabled={!!pendingProposal}
              />
            ))}
          </div>
        </div>
        
        {/* Accepted Cards */}
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span>✅</span>
            <span>Accepted Terms ({session.acceptedCards.length})</span>
          </h2>
          
          {session.acceptedCards.length === 0 ? (
            <div className="p-8 bg-white border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500">
              No terms accepted yet. Start playing cards to build your settlement agreement!
            </div>
          ) : (
            <div className="space-y-3">
              {session.acceptedCards.map((playedCard, i) => {
                const cardDef = getCardById(playedCard.cardId);
                if (!cardDef) return null;
                
                return (
                  <div key={i} className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="text-3xl">{cardDef.icon}</div>
                      <div className="flex-1">
                        <div className="font-bold text-lg">{cardDef.name}</div>
                        <div className="text-sm text-gray-700 mt-1">{cardDef.description}</div>
                        
                        {/* Show customization values */}
                        {Object.keys(playedCard.customValues).length > 0 && (
                          <div className="mt-2 p-3 bg-white rounded border border-green-300">
                            <div className="font-semibold text-sm mb-1">Terms:</div>
                            <div className="grid grid-cols-2 gap-2">
                              {Object.entries(playedCard.customValues).map(([key, value]) => (
                                <div key={key} className="text-sm">
                                  <span className="text-gray-600">{key}:</span>{' '}
                                  <span className="font-medium">{value}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="mt-2 text-xs text-gray-600">
                          Played by Party {playedCard.playedBy} • {playedCard.playedAt.toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div className="text-sm font-bold text-green-700">
                        +{cardDef.agreementPoints} pts
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      
      {/* Card Customization Modal */}
      {showCustomizationModal && selectedCard && (
        <CardCustomizationModal
          card={getCardById(selectedCard)!}
          isModification={!!pendingProposal}
          onClose={() => {
            setShowCustomizationModal(false);
            setSelectedCard(null);
          }}
        />
      )}
    </div>
  );
}
