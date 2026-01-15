'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/lib/store';

interface Child {
  name: string;
  birthdate: string;
}

export default function SetupPage() {
  const router = useRouter();
  const createSession = useGameStore(state => state.createSession);
  
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    partyAName: '',
    partyBName: '',
    county: 'Milwaukee',
    marriageDate: '',
    separationDate: '',
    children: [] as Child[],
    incomeA: 0,
    incomeB: 0,
  });
  
  const addChild = () => {
    setData({
      ...data,
      children: [...data.children, { name: '', birthdate: '' }],
    });
  };
  
  const removeChild = (index: number) => {
    setData({
      ...data,
      children: data.children.filter((_, i) => i !== index),
    });
  };
  
  const updateChild = (index: number, field: 'name' | 'birthdate', value: string) => {
    const updated = [...data.children];
    updated[index][field] = value;
    setData({ ...data, children: updated });
  };
  
  const handleSubmit = () => {
    createSession({
      partyA: { id: 'A', name: data.partyAName },
      partyB: { id: 'B', name: data.partyBName },
      county: data.county,
      marriageDate: new Date(data.marriageDate),
      separationDate: data.separationDate ? new Date(data.separationDate) : undefined,
      children: data.children
        .filter(c => c.name && c.birthdate)
        .map(c => ({
          name: c.name,
          birthdate: new Date(c.birthdate),
        })),
      incomes: { partyA: data.incomeA, partyB: data.incomeB },
    });
    
    router.push('/game');
  };
  
  const canProceedStep1 = data.partyAName && data.partyBName && data.marriageDate && data.county;
  const canProceedStep2 = true; // Optional step
  const canProceedStep3 = data.incomeA >= 0 && data.incomeB >= 0;
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Progress Indicator */}
        <div className="mb-8 flex items-center justify-center gap-4">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  s === step
                    ? 'bg-blue-600 text-white'
                    : s < step
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {s < step ? '✓' : s}
              </div>
              {s < 3 && <div className="w-16 h-1 bg-gray-300" />}
            </div>
          ))}
        </div>
        
        <div className="bg-white rounded-lg shadow-xl p-8">
          
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div>
              <h1 className="text-3xl font-bold mb-2">Game Setup</h1>
              <p className="text-gray-600 mb-6">Let's start with basic information about both parties</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block font-bold mb-2">
                    Party A Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={data.partyAName}
                    onChange={e => setData({ ...data, partyAName: e.target.value })}
                    className="w-full p-3 border rounded-lg"
                    placeholder="First name"
                  />
                </div>
                
                <div>
                  <label className="block font-bold mb-2">
                    Party B Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={data.partyBName}
                    onChange={e => setData({ ...data, partyBName: e.target.value })}
                    className="w-full p-3 border rounded-lg"
                    placeholder="First name"
                  />
                </div>
                
                <div>
                  <label className="block font-bold mb-2">
                    Wisconsin County <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={data.county}
                    onChange={e => setData({ ...data, county: e.target.value })}
                    className="w-full p-3 border rounded-lg"
                    placeholder="e.g., Milwaukee"
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    The county where the divorce will be filed
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold mb-2">
                      Marriage Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={data.marriageDate}
                      onChange={e => setData({ ...data, marriageDate: e.target.value })}
                      className="w-full p-3 border rounded-lg"
                    />
                  </div>
                  
                  <div>
                    <label className="block font-bold mb-2">
                      Separation Date <span className="text-gray-500">(optional)</span>
                    </label>
                    <input
                      type="date"
                      value={data.separationDate}
                      onChange={e => setData({ ...data, separationDate: e.target.value })}
                      className="w-full p-3 border rounded-lg"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex gap-3">
                <button
                  onClick={() => router.push('/')}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setStep(2)}
                  disabled={!canProceedStep1}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next: Children
                </button>
              </div>
            </div>
          )}
          
          {/* Step 2: Children */}
          {step === 2 && (
            <div>
              <h1 className="text-3xl font-bold mb-2">Children</h1>
              <p className="text-gray-600 mb-6">Add any minor children from the marriage</p>
              
              <div className="space-y-4 mb-6">
                {data.children.map((child, i) => (
                  <div key={i} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-bold">Child {i + 1}</div>
                      <button
                        onClick={() => removeChild(i)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-semibold mb-1">Name</label>
                        <input
                          type="text"
                          value={child.name}
                          onChange={e => updateChild(i, 'name', e.target.value)}
                          className="w-full p-2 border rounded"
                          placeholder="First name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-1">Birthdate</label>
                        <input
                          type="date"
                          value={child.birthdate}
                          onChange={e => updateChild(i, 'birthdate', e.target.value)}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                {data.children.length === 0 && (
                  <div className="p-8 border-2 border-dashed rounded-lg text-center text-gray-500">
                    No children added yet
                  </div>
                )}
              </div>
              
              <button
                onClick={addChild}
                className="w-full py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-bold hover:bg-blue-50"
              >
                + Add Child
              </button>
              
              <div className="mt-8 flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700"
                >
                  Next: Income
                </button>
              </div>
            </div>
          )}
          
          {/* Step 3: Income */}
          {step === 3 && (
            <div>
              <h1 className="text-3xl font-bold mb-2">Income Information</h1>
              <p className="text-gray-600 mb-6">
                Annual gross income for each party (used for support calculations)
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block font-bold mb-2">
                    Party A ({data.partyAName}) Annual Income <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">$</span>
                    <input
                      type="number"
                      step="1000"
                      value={data.incomeA}
                      onChange={e => setData({ ...data, incomeA: parseFloat(e.target.value) || 0 })}
                      className="w-full p-3 pl-8 border rounded-lg"
                      placeholder="0"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block font-bold mb-2">
                    Party B ({data.partyBName}) Annual Income <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">$</span>
                    <input
                      type="number"
                      step="1000"
                      value={data.incomeB}
                      onChange={e => setData({ ...data, incomeB: parseFloat(e.target.value) || 0 })}
                      className="w-full p-3 pl-8 border rounded-lg"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-900">
                  <strong>💡 Tip:</strong> Income values are used to calculate child support 
                  and spousal maintenance per Wisconsin law (§49.22). These can be adjusted 
                  later if needed.
                </div>
              </div>
              
              <div className="mt-8 flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!canProceedStep3}
                  className="flex-1 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  🎮 Start Game
                </button>
              </div>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}
