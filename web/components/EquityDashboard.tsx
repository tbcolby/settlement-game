'use client';

import { useGameStore } from '@/lib/store';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export function EquityDashboard() {
  const session = useGameStore(state => state.session);
  const currentEquity = useGameStore(state => state.currentEquity);
  
  if (!session) return null;
  
  // Calculate basic metrics from accepted cards
  const metrics = {
    totalCards: session.acceptedCards.length,
    partyAPoints: session.agreementPointsA,
    partyBPoints: session.agreementPointsB,
    equityScore: currentEquity?.equityScore || 0,
  };
  
  // Data for agreement points chart
  const pointsData = [
    {
      name: session.partyA.name,
      points: session.agreementPointsA,
      fill: '#3B82F6', // blue
    },
    {
      name: session.partyB.name,
      points: session.agreementPointsB,
      fill: '#10B981', // green
    },
  ];
  
  // Data for equity score gauge
  const equityScoreColor = 
    metrics.equityScore >= 70 ? '#10B981' : // green
    metrics.equityScore >= 50 ? '#F59E0B' : // yellow
    '#EF4444'; // red
  
  // Data for asset distribution (if we had real equity data)
  const assetData = currentEquity ? [
    { name: session.partyA.name, value: currentEquity.partyAPercentage, fill: '#3B82F6' },
    { name: session.partyB.name, value: currentEquity.partyBPercentage, fill: '#10B981' },
  ] : [
    { name: session.partyA.name, value: 50, fill: '#3B82F6' },
    { name: session.partyB.name, value: 50, fill: '#10B981' },
  ];
  
  return (
    <div className="fixed right-0 top-16 bottom-0 w-96 bg-white border-l shadow-lg overflow-auto z-40">
      
      {/* Header */}
      <div className="sticky top-0 bg-white border-b p-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <span>⚖️</span>
          <span>Equity Dashboard</span>
        </h2>
        <p className="text-xs text-gray-600 mt-1">
          Real-time fairness analysis
        </p>
      </div>
      
      {/* Content */}
      <div className="p-4 space-y-6">
        
        {/* Agreement Points Progress */}
        <div>
          <h3 className="text-sm font-bold mb-3">Agreement Progress</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold">{session.partyA.name}</span>
                <span className="text-blue-600 font-bold">{session.agreementPointsA}/100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${session.agreementPointsA}%` }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold">{session.partyB.name}</span>
                <span className="text-green-600 font-bold">{session.agreementPointsB}/100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${session.agreementPointsB}%` }}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Points Comparison Chart */}
        <div>
          <h3 className="text-sm font-bold mb-3">Points Comparison</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={pointsData}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="points" radius={[8, 8, 0, 0]}>
                {pointsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Equity Score */}
        <div>
          <h3 className="text-sm font-bold mb-3">Fairness Score</h3>
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <div className="text-5xl font-bold mb-2" style={{ color: equityScoreColor }}>
              {metrics.equityScore}
            </div>
            <div className="text-xs text-gray-600 font-semibold uppercase tracking-wide">
              {metrics.equityScore >= 70 ? 'Fair Split' :
               metrics.equityScore >= 50 ? 'Moderate Imbalance' :
               'Significant Imbalance'}
            </div>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-500"
                style={{ 
                  width: `${metrics.equityScore}%`,
                  backgroundColor: equityScoreColor
                }}
              />
            </div>
          </div>
        </div>
        
        {/* Asset Distribution */}
        {currentEquity && (
          <div>
            <h3 className="text-sm font-bold mb-3">Asset Distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={assetData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={entry => `${entry.value.toFixed(1)}%`}
                  outerRadius={80}
                  dataKey="value"
                >
                  {assetData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
        
        {/* Statistics */}
        <div>
          <h3 className="text-sm font-bold mb-3">Game Statistics</h3>
          <div className="space-y-2">
            <div className="flex justify-between p-3 bg-gray-50 rounded">
              <span className="text-xs text-gray-600">Accepted Terms</span>
              <span className="text-sm font-bold">{metrics.totalCards}</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded">
              <span className="text-xs text-gray-600">Turn Number</span>
              <span className="text-sm font-bold">{session.turnNumber}</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded">
              <span className="text-xs text-gray-600">Total Moves</span>
              <span className="text-sm font-bold">{session.moveHistory.length}</span>
            </div>
          </div>
        </div>
        
        {/* Compliance Warnings */}
        {currentEquity && currentEquity.warnings.length > 0 && (
          <div>
            <h3 className="text-sm font-bold mb-3">⚠️ Warnings</h3>
            <div className="space-y-2">
              {currentEquity.warnings.map((warning, i) => (
                <div key={i} className="p-3 bg-yellow-50 border border-yellow-200 rounded text-xs">
                  {warning}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Errors */}
        {currentEquity && currentEquity.errors.length > 0 && (
          <div>
            <h3 className="text-sm font-bold mb-3">❌ Compliance Errors</h3>
            <div className="space-y-2">
              {currentEquity.errors.map((error, i) => (
                <div key={i} className="p-3 bg-red-50 border border-red-200 rounded text-xs">
                  {error}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Suggestions */}
        {currentEquity && currentEquity.suggestions.length > 0 && (
          <div>
            <h3 className="text-sm font-bold mb-3">💡 Suggestions</h3>
            <div className="space-y-2">
              {currentEquity.suggestions.map((suggestion, i) => (
                <div key={i} className="p-3 bg-blue-50 border border-blue-200 rounded text-xs">
                  {suggestion}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Toggle button for equity dashboard
 */
export function EquityDashboardToggle({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`fixed right-4 top-20 z-50 px-4 py-2 rounded-lg shadow-lg font-semibold text-sm transition-all ${
        isOpen
          ? 'bg-gray-700 text-white'
          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
      }`}
    >
      {isOpen ? '← Hide' : '⚖️ Show'} Equity
    </button>
  );
}
