/**
 * Settlement Game - Type Definitions
 * Core types for the entire web application
 */

import { PartyFinancials, SettlementState, EquityAnalysis } from './financial-engine';

// ============================================================================
// PLAYER & GAME SESSION
// ============================================================================

export type PartyId = 'A' | 'B';

export interface Player {
  id: PartyId;
  name: string;
  email?: string;
}

export interface GameSession {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'setup' | 'playing' | 'completed';
  
  // Basic info
  county: string;
  caseNumber?: string;
  marriageDate: Date;
  separationDate?: Date;
  
  // Players
  partyA: Player;
  partyB: Player;
  
  // Children
  children: Array<{
    name: string;
    birthdate: Date;
  }>;
  
  // Initial financials
  initialAssets: {
    house?: { address: string; value: number; mortgage: number };
    vehicles: Array<{ description: string; value: number; debt: number }>;
    accounts: Array<{ institution: string; type: string; balance: number }>;
    retirement: Array<{ institution: string; type: string; balance: number }>;
  };
  
  initialDebts: Array<{
    description: string;
    balance: number;
    responsibility?: PartyId;
  }>;
  
  // Incomes (for child support)
  incomes: {
    partyA: number;
    partyB: number;
  };
  
  // Game state
  currentTurn: PartyId;
  turnNumber: number;
  
  // Agreement tracking
  agreementPointsA: number;
  agreementPointsB: number;
  
  // Cards
  acceptedCards: PlayedCard[];
  pendingProposal?: Proposal;
  moveHistory: Move[];
}

// ============================================================================
// CARDS
// ============================================================================

export type CardCategory =
  | 'asset-division'
  | 'custody'
  | 'support'
  | 'debt'
  | 'property'
  | 'future-obligation'
  | 'special'
  | 'meta';

export interface CardField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'currency' | 'date' | 'textarea' | 'select' | 'percentage';
  required: boolean;
  placeholder?: string;
  options?: string[]; // for select type
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
  helpText?: string;
}

export interface CardDefinition {
  id: string;
  category: CardCategory;
  name: string;
  description: string;
  icon: string; // emoji or icon name
  
  // Gameplay
  agreementPoints: number; // how much this contributes to 100%
  
  // Customization
  customizationFields: CardField[];
  
  // Legal
  legalTemplate: string; // template with {{placeholders}}
  
  // Equity impact (function to calculate)
  calculateEquityImpact?: (values: Record<string, any>, currentState: SettlementState) => {
    partyADelta: number;
    partyBDelta: number;
  };
}

export interface PlayedCard {
  id: string; // unique instance ID
  cardId: string; // references CardDefinition
  playedBy: PartyId;
  playedAt: Date;
  customValues: Record<string, any>;
  status: 'accepted' | 'pending' | 'rejected';
}

// ============================================================================
// PROPOSALS & NEGOTIATIONS
// ============================================================================

export type ProposalAction = 'accept' | 'reject' | 'modify' | 'counter';

export interface Proposal {
  id: string;
  card: PlayedCard;
  proposedBy: PartyId;
  proposedAt: Date;
  status: 'pending' | 'accepted' | 'rejected' | 'modified' | 'countered';
  response?: {
    action: ProposalAction;
    respondedBy: PartyId;
    respondedAt: Date;
    modifiedValues?: Record<string, any>;
    counterCard?: PlayedCard;
    message?: string;
  };
}

// ============================================================================
// MOVES & HISTORY
// ============================================================================

export type MoveType =
  | 'play-card'
  | 'accept-card'
  | 'reject-card'
  | 'modify-card'
  | 'counter-propose'
  | 'undo'
  | 'message';

export interface Move {
  id: string;
  type: MoveType;
  player: PartyId;
  timestamp: Date;
  data: {
    cardId?: string;
    proposalId?: string;
    values?: Record<string, any>;
    message?: string;
  };
  equityBefore?: EquityAnalysis;
  equityAfter?: EquityAnalysis;
}

// ============================================================================
// UI STATE
// ============================================================================

export interface UIState {
  // Current view
  view: 'setup' | 'game' | 'document' | 'help';
  
  // Setup wizard
  setupStep: number;
  
  // Game UI
  selectedCard?: string;
  showCardLibrary: boolean;
  showEquityDetail: boolean;
  showHistory: boolean;
  showHelp: boolean;
  
  // Modals
  activeModal?: 'customize-card' | 'confirm-action' | 'help' | 'error';
  modalData?: any;
  
  // Notifications
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    timestamp: Date;
  }>;
}

// ============================================================================
// STORE STATE (Zustand)
// ============================================================================

export interface GameStore {
  // Game session
  session: GameSession | null;
  
  // UI state
  ui: UIState;
  
  // Computed values
  currentEquity: EquityAnalysis | null;
  canFinalize: boolean;
  
  // Actions
  createSession: (setup: Partial<GameSession>) => void;
  loadSession: (id?: string) => void;
  saveSession: () => void;
  
  // Game actions
  playCard: (cardId: string, customValues: Record<string, any>) => void;
  respondToProposal: (action: ProposalAction, data?: any) => void;
  undoLastMove: () => void;
  finalizeAgreement: () => void;
  
  // Computed
  recalculateEquity: () => void;
  
  // UI actions
  setView: (view: UIState['view']) => void;
  selectCard: (cardId?: string) => void;
  showModal: (modal: UIState['activeModal'], data?: any) => void;
  hideModal: () => void;
  addNotification: (notification: Omit<UIState['notifications'][0], 'id' | 'timestamp'>) => void;
  clearNotification: (id: string) => void;
}

// ============================================================================
// DOCUMENT EXPORT
// ============================================================================

export interface ExportOptions {
  format: 'pdf' | 'html' | 'text' | 'markdown';
  includeSummary: boolean;
  includeAnalysis: boolean;
}

export interface GeneratedDocument {
  content: string;
  format: string;
  generatedAt: Date;
  fileName: string;
}
