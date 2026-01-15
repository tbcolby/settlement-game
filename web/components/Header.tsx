'use client';

import { useGameStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { exportSessionToFile } from '@/lib/storage';

export function Header() {
  const router = useRouter();
  const session = useGameStore(state => state.session);
  const canFinalize = useGameStore(state => state.canFinalize);
  const finalizeAgreement = useGameStore(state => state.finalizeAgreement);
  const currentEquity = useGameStore(state => state.currentEquity);
  
  if (!session) return null;
  
  const handleFinalize = () => {
    finalizeAgreement();
    router.push('/document');
  };
  
  const handleExport = () => {
    if (session) {
      exportSessionToFile(session);
    }
  };
  
  return (
    <header className="bg-white border-b shadow-sm">
      <div className="px-6 py-4">
        {/* Top row: Title and actions */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settlement Game</h1>
            <p className="text-sm text-gray-600">
              {session.partyA.name} vs {session.partyB.name}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
            >
              💾 Export
            </button>
            
            {canFinalize && (
              <button
                onClick={handleFinalize}
                className="px-6 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 shadow-md"
              >
                Finalize Agreement ✅
              </button>
            )}
          </div>
        </div>
        
        {/* Bottom row: Progress indicators */}
        <div className="grid grid-cols-3 gap-4">
          {/* Party A Progress */}
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-xs text-gray-600 mb-1">Party A Progress</div>
            <div className="flex items-end gap-2">
              <div className="text-2xl font-bold text-blue-700">
                {session.agreementPointsA}/100
              </div>
              <div className="text-lg mb-1">🤝</div>
            </div>
            <div className="mt-2 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${session.agreementPointsA}%` }}
              />
            </div>
          </div>
          
          {/* Equity Score */}
          <div className="bg-purple-50 rounded-lg p-3">
            <div className="text-xs text-gray-600 mb-1">Equity Score</div>
            <div className="flex items-end gap-2">
              <div className="text-2xl font-bold text-purple-700">
                {currentEquity?.equityScore || 0}
              </div>
              <div className="text-lg mb-1">⚖️</div>
            </div>
            <div className="text-xs text-gray-600 mt-1">
              {(currentEquity?.equityScore || 0) >= 70 ? 'Fair' : 
               (currentEquity?.equityScore || 0) >= 50 ? 'Moderate' : 'Unbalanced'}
            </div>
          </div>
          
          {/* Party B Progress */}
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-xs text-gray-600 mb-1">Party B Progress</div>
            <div className="flex items-end gap-2">
              <div className="text-2xl font-bold text-green-700">
                {session.agreementPointsB}/100
              </div>
              <div className="text-lg mb-1">🤝</div>
            </div>
            <div className="mt-2 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all"
                style={{ width: `${session.agreementPointsB}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
