/**
 * Settlement Game - Global State Management
 * Zustand store for game state, UI state, and actions
 */

import { create } from 'zustand';
import { GameStore, GameSession, UIState, PartyId, ProposalAction, PlayedCard, Move } from './types';
import { EquityAnalyzer } from './financial-engine';
import { getCardById } from './cards';
import { saveToStorage, loadFromStorage } from './storage';

const initialUIState: UIState = {
  view: 'setup',
  setupStep: 1,
  selectedCard: undefined,
  showCardLibrary: false,
  showEquityDetail: false,
  showHistory: false,
  showHelp: false,
  activeModal: undefined,
  modalData: undefined,
  notifications: [],
};

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  session: null,
  ui: initialUIState,
  currentEquity: null,
  canFinalize: false,
  
  // Session management
  createSession: (setup) => {
    const newSession: GameSession = {
      id: `game-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'playing',
      county: setup.county || '',
      caseNumber: setup.caseNumber,
      marriageDate: setup.marriageDate || new Date(),
      separationDate: setup.separationDate,
      partyA: setup.partyA || { id: 'A', name: 'Party A' },
      partyB: setup.partyB || { id: 'B', name: 'Party B' },
      children: setup.children || [],
      initialAssets: setup.initialAssets || { vehicles: [], accounts: [], retirement: [] },
      initialDebts: setup.initialDebts || [],
      incomes: setup.incomes || { partyA: 0, partyB: 0 },
      currentTurn: 'A',
      turnNumber: 1,
      agreementPointsA: 0,
      agreementPointsB: 0,
      acceptedCards: [],
      pendingProposal: undefined,
      moveHistory: [],
    };
    
    set({ session: newSession, ui: { ...initialUIState, view: 'game' } });
    get().saveSession();
    get().addNotification({ type: 'success', message: 'Game created successfully!' });
  },
  
  loadSession: (id) => {
    const session = loadFromStorage(); // ID parameter unused, loads from localStorage
    if (session) {
      set({ session, ui: { ...initialUIState, view: 'game' } });
      get().recalculateEquity();
      get().addNotification({ type: 'success', message: 'Game loaded!' });
    } else {
      get().addNotification({ type: 'error', message: 'Could not load game' });
    }
  },
  
  saveSession: () => {
    const { session } = get();
    if (session) {
      saveToStorage(session);
    }
  },
  
  // Game actions
  playCard: (cardId, customValues) => {
    const { session } = get();
    if (!session) return;
    
    const card = getCardById(cardId);
    if (!card) {
      get().addNotification({ type: 'error', message: 'Card not found' });
      return;
    }
    
    // Validate required fields
    const missingFields = card.customizationFields
      .filter(field => field.required && !customValues[field.id])
      .map(field => field.label);
    
    if (missingFields.length > 0) {
      get().addNotification({
        type: 'error',
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
      return;
    }
    
    // Create played card
    const playedCard: PlayedCard = {
      id: `card-${Date.now()}`,
      cardId,
      playedBy: session.currentTurn,
      playedAt: new Date(),
      customValues,
      status: 'pending',
    };
    
    // Create proposal
    const proposal = {
      id: `proposal-${Date.now()}`,
      card: playedCard,
      proposedBy: session.currentTurn,
      proposedAt: new Date(),
      status: 'pending' as const,
    };
    
    // Add move to history
    const move: Move = {
      id: `move-${Date.now()}`,
      type: 'play-card',
      player: session.currentTurn,
      timestamp: new Date(),
      data: { cardId, values: customValues },
      equityBefore: get().currentEquity || undefined,
    };
    
    // Update session
    set({
      session: {
        ...session,
        pendingProposal: proposal,
        moveHistory: [...session.moveHistory, move],
        currentTurn: session.currentTurn === 'A' ? 'B' : 'A',
        turnNumber: session.turnNumber + 1,
        updatedAt: new Date(),
      }
    });
    
    get().saveSession();
    get().addNotification({
      type: 'info',
      message: `${card.name} proposed. Waiting for response...`
    });
  },
  
  respondToProposal: (action, data) => {
    const { session } = get();
    if (!session || !session.pendingProposal) return;
    
    const proposal = session.pendingProposal;
    const card = getCardById(proposal.card.cardId);
    if (!card) return;
    
    const equityBefore = get().currentEquity;
    
    switch (action) {
      case 'accept':
        // Add to accepted cards
        const acceptedCard = { ...proposal.card, status: 'accepted' as const };
        const newAcceptedCards = [...session.acceptedCards, acceptedCard];
        
        // Update agreement points
        const newPointsA = session.currentTurn === 'A' 
          ? session.agreementPointsA + card.agreementPoints 
          : session.agreementPointsA;
        const newPointsB = session.currentTurn === 'B' 
          ? session.agreementPointsB + card.agreementPoints 
          : session.agreementPointsB;
        
        // Add move
        const acceptMove: Move = {
          id: `move-${Date.now()}`,
          type: 'accept-card',
          player: session.currentTurn,
          timestamp: new Date(),
          data: { proposalId: proposal.id, cardId: proposal.card.cardId },
          equityBefore: equityBefore || undefined,
        };
        
        set({
          session: {
            ...session,
            acceptedCards: newAcceptedCards,
            pendingProposal: undefined,
            agreementPointsA: newPointsA,
            agreementPointsB: newPointsB,
            moveHistory: [...session.moveHistory, acceptMove],
            currentTurn: session.currentTurn === 'A' ? 'B' : 'A',
            turnNumber: session.turnNumber + 1,
            updatedAt: new Date(),
          }
        });
        
        get().recalculateEquity();
        get().saveSession();
        get().addNotification({ type: 'success', message: `${card.name} accepted!` });
        break;
      
      case 'reject':
        const rejectMove: Move = {
          id: `move-${Date.now()}`,
          type: 'reject-card',
          player: session.currentTurn,
          timestamp: new Date(),
          data: { proposalId: proposal.id, message: data?.message },
        };
        
        set({
          session: {
            ...session,
            pendingProposal: undefined,
            moveHistory: [...session.moveHistory, rejectMove],
            currentTurn: session.currentTurn === 'A' ? 'B' : 'A',
            turnNumber: session.turnNumber + 1,
            updatedAt: new Date(),
          }
        });
        
        get().saveSession();
        get().addNotification({ type: 'info', message: `${card.name} rejected` });
        break;
      
      case 'modify':
        // Return to proposer with modifications
        const modifiedCard = {
          ...proposal.card,
          customValues: data?.modifiedValues || proposal.card.customValues,
        };
        
        const modifiedProposal = {
          ...proposal,
          card: modifiedCard,
          status: 'modified' as const,
          response: {
            action: 'modify' as const,
            respondedBy: session.currentTurn,
            respondedAt: new Date(),
            modifiedValues: data?.modifiedValues,
            message: data?.message,
          },
        };
        
        const modifyMove: Move = {
          id: `move-${Date.now()}`,
          type: 'modify-card',
          player: session.currentTurn,
          timestamp: new Date(),
          data: { proposalId: proposal.id, values: data?.modifiedValues },
        };
        
        set({
          session: {
            ...session,
            pendingProposal: modifiedProposal,
            moveHistory: [...session.moveHistory, modifyMove],
            currentTurn: session.currentTurn === 'A' ? 'B' : 'A',
            turnNumber: session.turnNumber + 1,
            updatedAt: new Date(),
          }
        });
        
        get().saveSession();
        get().addNotification({ type: 'info', message: `${card.name} modified and returned` });
        break;
      
      case 'counter':
        // Reject current, propose alternative
        get().respondToProposal('reject', { message: 'Counter-proposed alternative' });
        // Note: UI should handle playing the counter card
        break;
    }
  },
  
  undoLastMove: () => {
    const { session } = get();
    if (!session || session.moveHistory.length === 0) return;
    
    // For now, just show a message - full undo is complex
    get().addNotification({
      type: 'warning',
      message: 'Undo requires mutual agreement. Contact your attorney to modify the agreement.'
    });
  },
  
  finalizeAgreement: () => {
    const { session, canFinalize } = get();
    if (!session || !canFinalize) {
      get().addNotification({
        type: 'error',
        message: 'Both parties must reach 100 agreement points to finalize'
      });
      return;
    }
    
    set({
      session: {
        ...session,
        status: 'completed',
        updatedAt: new Date(),
      },
      ui: {
        ...get().ui,
        view: 'document',
      }
    });
    
    get().saveSession();
    get().addNotification({
      type: 'success',
      message: 'Agreement finalized! Generating document...'
    });
  },
  
  // Computed values
  recalculateEquity: () => {
    const { session } = get();
    if (!session) {
      set({ currentEquity: null, canFinalize: false });
      return;
    }
    
    // Build settlement state from accepted cards
    // This is simplified - full implementation would convert cards to financial state
    const equity = null; // EquityAnalyzer.analyze(settlementState);
    const canFinalize = session.agreementPointsA >= 100 && session.agreementPointsB >= 100;
    
    set({ currentEquity: equity, canFinalize });
  },
  
  // UI actions
  setView: (view) => set({ ui: { ...get().ui, view } }),
  
  selectCard: (cardId) => set({ ui: { ...get().ui, selectedCard: cardId } }),
  
  showModal: (modal, data) => set({ ui: { ...get().ui, activeModal: modal, modalData: data } }),
  
  hideModal: () => set({ ui: { ...get().ui, activeModal: undefined, modalData: undefined } }),
  
  addNotification: (notification) => {
    const newNotification = {
      ...notification,
      id: `notif-${Date.now()}`,
      timestamp: new Date(),
    };
    
    set({
      ui: {
        ...get().ui,
        notifications: [...get().ui.notifications, newNotification],
      }
    });
    
    // Auto-clear after 5 seconds
    setTimeout(() => {
      get().clearNotification(newNotification.id);
    }, 5000);
  },
  
  clearNotification: (id) => {
    set({
      ui: {
        ...get().ui,
        notifications: get().ui.notifications.filter(n => n.id !== id),
      }
    });
  },
}));
