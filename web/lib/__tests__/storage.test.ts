/**
 * Tests for Storage Module
 */

import {
  saveToStorage,
  loadFromStorage,
  clearStorage,
  hasExistingGame,
} from '../storage';
import type { GameSession } from '../types';

describe('Storage Module', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  const createMockSession = (): GameSession => ({
    id: 'test-session-123',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-02'),
    status: 'playing',
    county: 'Milwaukee',
    marriageDate: new Date('2015-06-15'),
    partyA: { id: 'A', name: 'Party A' },
    partyB: { id: 'B', name: 'Party B' },
    children: [
      {
        name: 'Child 1',
        birthdate: new Date('2017-08-22'),
      },
    ],
    initialAssets: {
      vehicles: [],
      accounts: [],
      retirement: [],
    },
    initialDebts: [],
    incomes: { partyA: 50000, partyB: 40000 },
    currentTurn: 'A',
    turnNumber: 1,
    agreementPointsA: 0,
    agreementPointsB: 0,
    acceptedCards: [],
    moveHistory: [],
  });

  describe('saveToStorage', () => {
    it('should save session to localStorage', () => {
      const session = createMockSession();
      saveToStorage(session);

      const stored = localStorage.getItem('settlement-game-session');
      expect(stored).not.toBeNull();
      
      const parsed = JSON.parse(stored!);
      expect(parsed.version).toBe('1.0');
      expect(parsed.session).toBeDefined();
      expect(parsed.session.id).toBe('test-session-123');
    });

    it('should include savedAt timestamp', () => {
      const session = createMockSession();
      saveToStorage(session);

      const stored = localStorage.getItem('settlement-game-session');
      const parsed = JSON.parse(stored!);
      
      expect(parsed.savedAt).toBeDefined();
      expect(new Date(parsed.savedAt)).toBeInstanceOf(Date);
    });

    it('should handle complex session data', () => {
      const session = createMockSession();
      session.acceptedCards = [
        {
          id: 'card-1',
          cardId: 'keep-house',
          playedBy: 'A',
          playedAt: new Date('2024-01-01'),
          customValues: { address: '123 Main St' },
          status: 'accepted',
        },
      ];

      saveToStorage(session);

      const stored = localStorage.getItem('settlement-game-session');
      const parsed = JSON.parse(stored!);
      
      expect(parsed.session.acceptedCards.length).toBe(1);
      expect(parsed.session.acceptedCards[0].cardId).toBe('keep-house');
    });
  });

  describe('loadFromStorage', () => {
    it('should return null when no data exists', () => {
      const result = loadFromStorage();
      expect(result).toBeNull();
    });

    it('should load saved session', () => {
      const session = createMockSession();
      saveToStorage(session);

      const loaded = loadFromStorage();
      
      expect(loaded).not.toBeNull();
      expect(loaded?.id).toBe('test-session-123');
      expect(loaded?.county).toBe('Milwaukee');
      expect(loaded?.partyA.name).toBe('Party A');
    });

    it('should convert date strings back to Date objects', () => {
      const session = createMockSession();
      saveToStorage(session);

      const loaded = loadFromStorage();
      
      expect(loaded?.createdAt).toBeInstanceOf(Date);
      expect(loaded?.updatedAt).toBeInstanceOf(Date);
      expect(loaded?.marriageDate).toBeInstanceOf(Date);
      expect(loaded?.children[0].birthdate).toBeInstanceOf(Date);
    });

    it('should handle optional separation date', () => {
      const session = createMockSession();
      session.separationDate = new Date('2023-11-01');
      saveToStorage(session);

      const loaded = loadFromStorage();
      
      expect(loaded?.separationDate).toBeInstanceOf(Date);
      expect(loaded?.separationDate?.getFullYear()).toBe(2023);
    });

    it('should convert dates in acceptedCards', () => {
      const session = createMockSession();
      session.acceptedCards = [
        {
          id: 'card-1',
          cardId: 'keep-house',
          playedBy: 'A',
          playedAt: new Date('2024-01-01'),
          customValues: {},
          status: 'accepted',
        },
      ];
      saveToStorage(session);

      const loaded = loadFromStorage();
      
      expect(loaded?.acceptedCards[0].playedAt).toBeInstanceOf(Date);
    });

    it('should convert dates in moveHistory', () => {
      const session = createMockSession();
      session.moveHistory = [
        {
          id: 'move-1',
          type: 'play-card',
          player: 'A',
          timestamp: new Date('2024-01-01'),
          data: { cardId: 'keep-house' },
        },
      ];
      saveToStorage(session);

      const loaded = loadFromStorage();
      
      expect(loaded?.moveHistory[0].timestamp).toBeInstanceOf(Date);
    });

    it('should handle corrupted data gracefully', () => {
      localStorage.setItem('settlement-game-session', 'invalid json');
      
      const loaded = loadFromStorage();
      expect(loaded).toBeNull();
      
      // Should also clear the corrupted data
      expect(localStorage.getItem('settlement-game-session')).toBeNull();
    });

    it('should handle version mismatch', () => {
      localStorage.setItem('settlement-game-session', JSON.stringify({
        version: '0.9',
        session: { id: 'old-version' },
      }));

      const loaded = loadFromStorage();
      expect(loaded).toBeNull();
    });
  });

  describe('clearStorage', () => {
    it('should remove session from localStorage', () => {
      const session = createMockSession();
      saveToStorage(session);
      
      expect(localStorage.getItem('settlement-game-session')).not.toBeNull();
      
      clearStorage();
      
      expect(localStorage.getItem('settlement-game-session')).toBeNull();
    });

    it('should not throw when nothing to clear', () => {
      expect(() => clearStorage()).not.toThrow();
    });
  });

  describe('hasExistingGame', () => {
    it('should return false when no game exists', () => {
      expect(hasExistingGame()).toBe(false);
    });

    it('should return true when valid game exists', () => {
      const session = createMockSession();
      saveToStorage(session);
      
      expect(hasExistingGame()).toBe(true);
    });

    it('should return false for corrupted data', () => {
      localStorage.setItem('settlement-game-session', 'invalid');
      
      expect(hasExistingGame()).toBe(false);
    });

    it('should return false for version mismatch', () => {
      localStorage.setItem('settlement-game-session', JSON.stringify({
        version: '0.5',
        session: {},
      }));
      
      expect(hasExistingGame()).toBe(false);
    });
  });

  describe('Round-trip persistence', () => {
    it('should preserve all data through save/load cycle', () => {
      const original = createMockSession();
      original.caseNumber = '2024FA000123';
      original.separationDate = new Date('2023-11-15');
      original.children = [
        { name: 'Child 1', birthdate: new Date('2017-08-22') },
        { name: 'Child 2', birthdate: new Date('2019-03-10') },
      ];

      saveToStorage(original);
      const loaded = loadFromStorage();

      expect(loaded?.id).toBe(original.id);
      expect(loaded?.caseNumber).toBe(original.caseNumber);
      expect(loaded?.county).toBe(original.county);
      expect(loaded?.children.length).toBe(2);
      expect(loaded?.children[1].name).toBe('Child 2');
      expect(loaded?.incomes.partyA).toBe(50000);
    });
  });
});
