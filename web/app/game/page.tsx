'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/lib/store';
import { Header } from '@/components/Header';
import { GameBoard } from '@/components/GameBoard';
import { EquityDashboard, EquityDashboardToggle } from '@/components/EquityDashboard';
import { MoveHistorySidebar, MoveHistoryToggle } from '@/components/MoveHistory';

export default function GamePage() {
  const router = useRouter();
  const session = useGameStore(state => state.session);
  const notifications = useGameStore(state => state.ui.notifications);
  const clearNotification = useGameStore(state => state.clearNotification);
  
  const [showEquity, setShowEquity] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  
  useEffect(() => {
    if (!session) {
      router.push('/');
    }
  }, [session, router]);
  
  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚖️</div>
          <div className="text-xl text-gray-600">Loading game...</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      {/* Sidebar Toggles */}
      <EquityDashboardToggle isOpen={showEquity} onToggle={() => setShowEquity(!showEquity)} />
      <MoveHistoryToggle isOpen={showHistory} onToggle={() => setShowHistory(!showHistory)} />
      
      {/* Sidebars */}
      {showEquity && <EquityDashboard />}
      {showHistory && <MoveHistorySidebar />}
      
      <GameBoard />
      
      {/* Notifications */}
      <div className="fixed top-4 right-4 space-y-2 z-50">
        {notifications.map(notif => (
          <div
            key={notif.id}
            className={`p-4 rounded-lg shadow-lg cursor-pointer transition-all border-2 ${
              notif.type === 'success' ? 'bg-green-100 border-green-400 text-green-900' :
              notif.type === 'error' ? 'bg-red-100 border-red-400 text-red-900' :
              notif.type === 'warning' ? 'bg-yellow-100 border-yellow-400 text-yellow-900' :
              'bg-blue-100 border-blue-400 text-blue-900'
            }`}
            onClick={() => clearNotification(notif.id)}
          >
            <div className="flex items-start gap-2">
              <div className="text-xl">
                {notif.type === 'success' ? '✅' : 
                 notif.type === 'error' ? '❌' : 
                 notif.type === 'warning' ? '⚠️' : 'ℹ️'}
              </div>
              <div className="flex-1">
                <div className="font-semibold">{notif.message}</div>
                <div className="text-xs mt-1 opacity-75">Click to dismiss</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
