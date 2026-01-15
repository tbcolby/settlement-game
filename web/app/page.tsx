'use client';

import { useRouter } from 'next/navigation';
import { useGameStore } from '@/lib/store';
import { hasExistingGame } from '@/lib/storage';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const router = useRouter();
  const loadSession = useGameStore(state => state.loadSession);
  const [hasGame, setHasGame] = useState(false);
  
  // Check for existing game on client-side only
  useEffect(() => {
    setHasGame(hasExistingGame());
  }, []);
  
  const handleResume = () => {
    loadSession(undefined); // ID is optional, loads from localStorage
    router.push('/game');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-gray-100 flex items-center justify-center p-8">
      <div className="max-w-3xl w-full">
        
        {/* Title */}
        <div className="text-center mb-12">
          <div className="text-7xl mb-4">⚖️</div>
          <h1 className="text-6xl font-bold mb-4 text-gray-900">
            Settlement Game
          </h1>
          <p className="text-xl text-gray-600">
            A Dominion-Style Marital Settlement Agreement Generator
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Transform adversarial divorce into collaborative gameplay
          </p>
        </div>
        
        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-2xl p-8 mb-6">
          
          {/* Description */}
          <h2 className="text-2xl font-bold mb-6 text-gray-900">
            How It Works
          </h2>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl">🎴</div>
              <div className="flex-1">
                <div className="font-bold text-lg">Play Cards</div>
                <div className="text-sm text-gray-700">
                  Each card represents a settlement term: marital home, child custody, 
                  spousal support, debt division, and more. Customize the details and 
                  propose them to your partner.
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg">
              <div className="text-3xl">🤝</div>
              <div className="flex-1">
                <div className="font-bold text-lg">Negotiate Turn-by-Turn</div>
                <div className="text-sm text-gray-700">
                  Take turns proposing terms. Accept, reject, or modify each proposal.
                  Earn agreement points as you build consensus. Reach 100 points each to finalize.
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl">⚖️</div>
              <div className="flex-1">
                <div className="font-bold text-lg">Real-Time Equity Analysis</div>
                <div className="text-sm text-gray-700">
                  See live calculations of financial equity, child support (Wisconsin §49.22), 
                  and fairness scores. Get instant compliance warnings for legal requirements.
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 bg-yellow-50 rounded-lg">
              <div className="text-3xl">📄</div>
              <div className="flex-1">
                <div className="font-bold text-lg">Generate Legal Documents</div>
                <div className="text-sm text-gray-700">
                  When both parties reach 100 agreement points, export a court-ready 
                  Wisconsin Marital Settlement Agreement (MSA) formatted to legal standards.
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => router.push('/setup')}
              className="w-full py-4 bg-blue-600 text-white rounded-lg font-bold text-lg hover:bg-blue-700 shadow-lg transition-all"
            >
              🎮 Start New Game
            </button>
            
            {hasGame && (
              <button
                onClick={handleResume}
                className="w-full py-4 bg-gray-700 text-white rounded-lg font-bold text-lg hover:bg-gray-800 shadow-lg transition-all"
              >
                ▶️ Resume Existing Game
              </button>
            )}
          </div>
          
          {/* Legal Disclaimer */}
          <div className="mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
            <div className="flex items-start gap-2">
              <div className="text-2xl">⚖️</div>
              <div>
                <div className="text-sm font-bold text-red-900 mb-1">
                  Legal Disclaimer
                </div>
                <div className="text-xs text-red-800 leading-relaxed">
                  This tool generates <strong>DRAFT</strong> documents that <strong>MUST</strong> be 
                  reviewed by qualified legal counsel before filing with any court. This is NOT legal advice. 
                  Both parties should have independent attorneys review all terms. By using this tool, 
                  you acknowledge that it is for educational and negotiation purposes only.
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="text-center space-y-2">
          <div className="text-sm text-gray-600">
            <strong>IP Rights:</strong> 50% Tyler Colby, 50% [Negotiation Pending]
          </div>
          <div className="text-xs text-gray-500">
            Compliant with Wisconsin Family Law • Built with ❤️ for Maelee
          </div>
        </div>
      </div>
    </div>
  );
}
