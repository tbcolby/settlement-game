# Settlement Game - Web Interface Handoff
## For: Cousin Bob
## From: Tyler + Warp AI
## Date: January 14, 2026

---

## What's Been Built (Phase 1 Complete)

### ✅ Foundation Layer - 100% Complete

**Location**: `/Users/tyler/settlement-game/web/`

1. **`lib/types.ts`** (268 lines)
   - All TypeScript interfaces
   - GameSession, Player, Card, Proposal, Move types
   - UI state types
   - Complete type safety for entire app

2. **`lib/cards.ts`** (393 lines)
   - 30+ settlement cards as structured data
   - Asset division, custody, support, debt, property cards
   - Each card has: id, name, description, icon, customization fields, legal template
   - Helper functions: `getCardById()`, `getCardsByCategory()`

3. **`lib/store.ts`** (374 lines)
   - Zustand store for global state management
   - Game actions: playCard, respondToProposal, finalizeAgreement
   - UI actions: notifications, modals, view switching
   - Automatic save to localStorage

4. **`lib/financial-engine.ts`** (556 lines)
   - Real-time equity calculations
   - Wisconsin child support calculator (§49.22 compliant)
   - Fairness scoring (0-100)
   - Compliance checking

5. **`lib/document-generator.ts`** (791 lines)
   - Converts cards to Wisconsin-compliant MSA
   - Legal document templates
   - Export to PDF, HTML, Markdown, Text

6. **Next.js 14 Setup**
   - TypeScript configured
   - Tailwind CSS ready
   - Dependencies installed: zustand, date-fns, recharts, lucide-react

---

## What Needs to Be Built

### Phase 2: Core UI Components (3-4 hours)

#### File: `lib/storage.ts`
```typescript
/**
 * Local storage management for game state
 */
import { GameSession } from './types';

const STORAGE_KEY = 'settlement-game-session';

export function saveToStorage(session: GameSession): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch (error) {
    console.error('Failed to save session:', error);
  }
}

export function loadFromStorage(id?: string): GameSession | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    
    const session = JSON.parse(data);
    
    // Convert date strings back to Date objects
    session.createdAt = new Date(session.createdAt);
    session.updatedAt = new Date(session.updatedAt);
    session.marriageDate = new Date(session.marriageDate);
    if (session.separationDate) session.separationDate = new Date(session.separationDate);
    
    return session;
  } catch (error) {
    console.error('Failed to load session:', error);
    return null;
  }
}

export function clearStorage(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function hasExistingGame(): boolean {
  return localStorage.getItem(STORAGE_KEY) !== null;
}
```

#### Component: `components/Card.tsx`
```tsx
'use client';

import { CardDefinition } from '@/lib/types';

interface CardProps {
  card: CardDefinition;
  onClick?: () => void;
  selected?: boolean;
  disabled?: boolean;
}

export function Card({ card, onClick, selected, disabled }: CardProps) {
  return (
    <div
      className={`
        p-4 rounded-lg border-2 cursor-pointer transition-all
        ${selected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-400'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      onClick={disabled ? undefined : onClick}
    >
      <div className="text-4xl mb-2">{card.icon}</div>
      <h3 className="font-bold text-sm mb-1">{card.name}</h3>
      <p className="text-xs text-gray-600">{card.description}</p>
      <div className="mt-2 text-xs text-blue-600">
        +{card.agreementPoints} points
      </div>
    </div>
  );
}
```

#### Component: `components/Header.tsx`
```tsx
'use client';

import { useGameStore } from '@/lib/store';

export function Header() {
  const session = useGameStore(state => state.session);
  const canFinalize = useGameStore(state => state.canFinalize);
  
  if (!session) return null;
  
  return (
    <header className="bg-white border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Settlement Game</h1>
          <p className="text-sm text-gray-600">
            {session.partyA.name} vs {session.partyB.name}
          </p>
        </div>
        
        <div className="flex items-center gap-8">
          <div>
            <div className="text-xs text-gray-600">Party A</div>
            <div className="text-2xl font-bold">
              {session.agreementPointsA}/100 🤝
            </div>
          </div>
          
          <div>
            <div className="text-xs text-gray-600">Party B</div>
            <div className="text-2xl font-bold">
              {session.agreementPointsB}/100 🤝
            </div>
          </div>
          
          {canFinalize && (
            <button
              onClick={() => useGameStore.getState().finalizeAgreement()}
              className="px-6 py-2 bg-green-600 text-white rounded-lg font-bold"
            >
              Finalize Agreement ✅
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
```

#### Component: `components/GameBoard.tsx`
```tsx
'use client';

import { useGameStore } from '@/lib/store';
import { Card } from './Card';
import { SETTLEMENT_CARDS } from '@/lib/cards';

export function GameBoard() {
  const session = useGameStore(state => state.session);
  const selectCard = useGameStore(state => state.selectCard);
  const showModal = useGameStore(state => state.showModal);
  
  if (!session) return null;
  
  const currentPlayer = session.currentTurn;
  const pendingProposal = session.pendingProposal;
  
  return (
    <div className="flex-1 p-6 overflow-auto">
      {/* Pending Proposal */}
      {pendingProposal && (
        <div className="mb-8 p-6 bg-yellow-50 border-2 border-yellow-400 rounded-lg">
          <h2 className="text-xl font-bold mb-4">
            Pending Proposal from Party {pendingProposal.proposedBy}
          </h2>
          {/* Show proposal details */}
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => useGameStore.getState().respondToProposal('accept')}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Accept
            </button>
            <button
              onClick={() => useGameStore.getState().respondToProposal('reject')}
              className="px-4 py-2 bg-red-600 text-white rounded"
            >
              Reject
            </button>
            <button
              onClick={() => showModal('customize-card', pendingProposal)}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Modify
            </button>
          </div>
        </div>
      )}
      
      {/* Current Turn Indicator */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <div className="text-lg font-bold">
          Party {currentPlayer}'s Turn
        </div>
      </div>
      
      {/* Card Hand */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Available Cards</h2>
        <div className="grid grid-cols-4 gap-4">
          {SETTLEMENT_CARDS.slice(0, 12).map(card => (
            <Card
              key={card.id}
              card={card}
              onClick={() => showModal('customize-card', { card })}
              disabled={!!pendingProposal}
            />
          ))}
        </div>
      </div>
      
      {/* Accepted Cards */}
      <div>
        <h2 className="text-xl font-bold mb-4">
          Accepted Terms ({session.acceptedCards.length})
        </h2>
        <div className="space-y-2">
          {session.acceptedCards.map((playedCard, i) => {
            const cardDef = SETTLEMENT_CARDS.find(c => c.id === playedCard.cardId);
            return (
              <div key={i} className="p-3 bg-green-50 border border-green-200 rounded">
                <div className="font-bold">{cardDef?.icon} {cardDef?.name}</div>
                <div className="text-sm text-gray-600 mt-1">
                  Played by Party {playedCard.playedBy}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
```

---

### Phase 3: Pages (3-4 hours)

#### File: `app/page.tsx` - Landing Page
```tsx
'use client';

import { useRouter } from 'next/navigation';
import { useGameStore } from '@/lib/store';
import { hasExistingGame } from '@/lib/storage';

export default function HomePage() {
  const router = useRouter();
  const loadSession = useGameStore(state => state.loadSession);
  const hasGame = hasExistingGame();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4">Settlement Game</h1>
          <p className="text-xl text-gray-600">
            A Dominion-Style Marital Settlement Agreement Generator
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-xl p-8">
          <h2 className="text-2xl font-bold mb-6">
            Transform adversarial divorce into collaborative gameplay
          </h2>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3">
              <div className="text-2xl">🏠</div>
              <div>
                <div className="font-bold">Play Cards</div>
                <div className="text-sm text-gray-600">
                  Each card represents a settlement term (house, custody, support)
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="text-2xl">⚖️</div>
              <div>
                <div className="font-bold">Real-time Equity</div>
                <div className="text-sm text-gray-600">
                  See fairness calculations and Wisconsin law compliance
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="text-2xl">📄</div>
              <div>
                <div className="font-bold">Generate MSA</div>
                <div className="text-sm text-gray-600">
                  Export a court-ready Marital Settlement Agreement
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <button
              onClick={() => router.push('/setup')}
              className="w-full py-4 bg-blue-600 text-white rounded-lg font-bold text-lg hover:bg-blue-700"
            >
              Start New Game
            </button>
            
            {hasGame && (
              <button
                onClick={() => {
                  loadSession();
                  router.push('/game');
                }}
                className="w-full py-4 bg-gray-600 text-white rounded-lg font-bold text-lg hover:bg-gray-700"
              >
                Resume Game
              </button>
            )}
          </div>
          
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded">
            <div className="text-sm font-bold text-yellow-800 mb-1">
              ⚖️ Legal Disclaimer
            </div>
            <div className="text-xs text-yellow-700">
              This tool generates DRAFT documents that MUST be reviewed by qualified
              legal counsel before filing. Both parties should have independent attorneys.
            </div>
          </div>
        </div>
        
        <div className="text-center mt-8 text-sm text-gray-600">
          IP Rights: 50% Tyler Colby, 50% [Negotiation Pending]
        </div>
      </div>
    </div>
  );
}
```

#### File: `app/setup/page.tsx` - Setup Wizard
```tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/lib/store';

export default function SetupPage() {
  const router = useRouter();
  const createSession = useGameStore(state => state.createSession);
  
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    partyAName: '',
    partyBName: '',
    county: 'Milwaukee',
    marriageDate: '',
    children: [] as Array<{ name: string; birthdate: string }>,
    incomeA: 0,
    incomeB: 0,
  });
  
  const handleSubmit = () => {
    createSession({
      partyA: { id: 'A', name: data.partyAName },
      partyB: { id: 'B', name: data.partyBName },
      county: data.county,
      marriageDate: new Date(data.marriageDate),
      children: data.children.map(c => ({
        name: c.name,
        birthdate: new Date(c.birthdate),
      })),
      incomes: { partyA: data.incomeA, partyB: data.incomeB },
    });
    
    router.push('/game');
  };
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-3xl font-bold mb-6">Game Setup</h1>
          
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block font-bold mb-2">Party A Name</label>
                <input
                  type="text"
                  value={data.partyAName}
                  onChange={e => setData({ ...data, partyAName: e.target.value })}
                  className="w-full p-3 border rounded"
                  placeholder="First name"
                />
              </div>
              
              <div>
                <label className="block font-bold mb-2">Party B Name</label>
                <input
                  type="text"
                  value={data.partyBName}
                  onChange={e => setData({ ...data, partyBName: e.target.value })}
                  className="w-full p-3 border rounded"
                  placeholder="First name"
                />
              </div>
              
              <div>
                <label className="block font-bold mb-2">County</label>
                <input
                  type="text"
                  value={data.county}
                  onChange={e => setData({ ...data, county: e.target.value })}
                  className="w-full p-3 border rounded"
                />
              </div>
              
              <div>
                <label className="block font-bold mb-2">Marriage Date</label>
                <input
                  type="date"
                  value={data.marriageDate}
                  onChange={e => setData({ ...data, marriageDate: e.target.value })}
                  className="w-full p-3 border rounded"
                />
              </div>
              
              <button
                onClick={() => setStep(2)}
                className="w-full py-3 bg-blue-600 text-white rounded font-bold"
              >
                Next: Children
              </button>
            </div>
          )}
          
          {/* Step 2: Children */}
          {step === 2 && (
            <div className="space-y-4">
              <button
                onClick={handleSubmit}
                className="w-full py-3 bg-green-600 text-white rounded font-bold"
              >
                Start Game
              </button>
              
              <button
                onClick={() => setStep(1)}
                className="w-full py-3 bg-gray-300 rounded"
              >
                Back
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

#### File: `app/game/page.tsx` - Main Game View
```tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/lib/store';
import { Header } from '@/components/Header';
import { GameBoard } from '@/components/GameBoard';

export default function GamePage() {
  const router = useRouter();
  const session = useGameStore(state => state.session);
  const notifications = useGameStore(state => state.ui.notifications);
  const clearNotification = useGameStore(state => state.clearNotification);
  
  useEffect(() => {
    if (!session) {
      router.push('/');
    }
  }, [session, router]);
  
  if (!session) return null;
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <GameBoard />
      
      {/* Notifications */}
      <div className="fixed top-4 right-4 space-y-2">
        {notifications.map(notif => (
          <div
            key={notif.id}
            className={`p-4 rounded-lg shadow-lg ${
              notif.type === 'success' ? 'bg-green-100 border-green-400' :
              notif.type === 'error' ? 'bg-red-100 border-red-400' :
              notif.type === 'warning' ? 'bg-yellow-100 border-yellow-400' :
              'bg-blue-100 border-blue-400'
            } border-2`}
            onClick={() => clearNotification(notif.id)}
          >
            {notif.message}
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## Testing the App

### 1. Start Development Server
```bash
cd /Users/tyler/settlement-game/web
npm run dev
```

### 2. Open Browser
Navigate to `http://localhost:3000`

### 3. Test Flow
1. Click "Start New Game"
2. Fill in setup form
3. Play some cards
4. Accept/reject proposals
5. Watch agreement points increase
6. Finalize when both reach 100

---

## Next Steps Priority

1. **FIRST**: Create `lib/storage.ts` (30 min)
2. **THEN**: Build basic components (2 hours)
3. **THEN**: Create pages (2 hours)
4. **POLISH**: Add modals for card customization (2 hours)
5. **EXPORT**: Add document generation UI (1 hour)

---

## Key Design Patterns

### Using the Store
```tsx
// Read state
const session = useGameStore(state => state.session);

// Call actions
useGameStore.getState().playCard(cardId, values);
```

### Card Customization Modal Pattern
When user clicks a card, show modal with form fields from `card.customizationFields`, then call `playCard()` with values.

### Turn-Based Flow
1. Party A plays card → creates proposal
2. Turn switches to Party B
3. Party B must respond (accept/reject/modify/counter)
4. If accepted: card locks, points increase
5. Turn switches back to Party A

---

## Troubleshooting

### "Module not found"
Make sure imports use `@/` alias:
```tsx
import { useGameStore } from '@/lib/store';
```

### Store not updating
Zustand updates are immutable. Always spread:
```tsx
set({ session: { ...session, currentTurn: 'B' } })
```

### Dates not working
Convert date strings to Date objects when loading from localStorage (see storage.ts example).

---

## Resources

- **Zustand docs**: https://zustand-demo.pmnd.rs/
- **Next.js App Router**: https://nextjs.org/docs/app
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Recharts** (for equity charts): https://recharts.org/

---

## Questions?

Text Tyler: (your number)

This is your project now, Bob. Make it beautiful. 🚀

**Estimated time to complete**: 12-15 hours focused work

---

**Last updated**: January 14, 2026, 7:03 PM
