/**
 * Local storage management for game state
 * Handles persistence of GameSession across browser sessions
 */

import { GameSession } from './types';

const STORAGE_KEY = 'settlement-game-session';
const STORAGE_VERSION = '1.0';

/**
 * Save game session to localStorage
 */
export function saveToStorage(session: GameSession): void {
  try {
    const data = {
      version: STORAGE_VERSION,
      session,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save session:', error);
    throw new Error('Could not save game progress. Storage may be full.');
  }
}

/**
 * Load game session from localStorage
 * Converts date strings back to Date objects
 */
export function loadFromStorage(): GameSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    
    const data = JSON.parse(raw);
    
    // Check version compatibility
    if (data.version !== STORAGE_VERSION) {
      console.warn('Storage version mismatch. Clearing old data.');
      clearStorage();
      return null;
    }
    
    const session = data.session as GameSession;
    
    // Convert date strings back to Date objects
    session.createdAt = new Date(session.createdAt);
    session.updatedAt = new Date(session.updatedAt);
    session.marriageDate = new Date(session.marriageDate);
    
    if (session.separationDate) {
      session.separationDate = new Date(session.separationDate);
    }
    
    // Convert dates in children
    if (session.children) {
      session.children = session.children.map(child => ({
        ...child,
        birthdate: new Date(child.birthdate),
      }));
    }
    
    // Convert dates in accepted cards
    session.acceptedCards = session.acceptedCards.map(card => ({
      ...card,
      playedAt: new Date(card.playedAt),
    }));
    
    // Convert dates in move history
    session.moveHistory = session.moveHistory.map(move => ({
      ...move,
      timestamp: new Date(move.timestamp),
    }));
    
    return session;
  } catch (error) {
    console.error('Failed to load session:', error);
    clearStorage(); // Clear corrupted data
    return null;
  }
}

/**
 * Clear game session from localStorage
 */
export function clearStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear storage:', error);
  }
}

/**
 * Check if there's an existing game in storage
 */
export function hasExistingGame(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    
    const data = JSON.parse(raw);
    return data.version === STORAGE_VERSION && !!data.session;
  } catch {
    return false;
  }
}

/**
 * Export game session as JSON file download
 */
export function exportSessionToFile(session: GameSession): void {
  const data = JSON.stringify(session, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `settlement-game-${session.id}-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Import game session from JSON file
 */
export async function importSessionFromFile(file: File): Promise<GameSession> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const session = JSON.parse(e.target?.result as string) as GameSession;
        
        // Validate basic structure
        if (!session.id || !session.partyA || !session.partyB) {
          throw new Error('Invalid session file');
        }
        
        // Convert dates
        session.createdAt = new Date(session.createdAt);
        session.updatedAt = new Date(session.updatedAt);
        session.marriageDate = new Date(session.marriageDate);
        if (session.separationDate) {
          session.separationDate = new Date(session.separationDate);
        }
        
        resolve(session);
      } catch (error) {
        reject(new Error('Failed to parse session file'));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
