'use client';

import { useState, FormEvent } from 'react';
import { CardDefinition } from '@/lib/types';
import { useGameStore } from '@/lib/store';

interface CardCustomizationModalProps {
  card: CardDefinition;
  isModification?: boolean;
  onClose: () => void;
}

export function CardCustomizationModal({ 
  card, 
  isModification = false,
  onClose 
}: CardCustomizationModalProps) {
  const playCard = useGameStore(state => state.playCard);
  const respondToProposal = useGameStore(state => state.respondToProposal);
  
  // Initialize form values
  const [values, setValues] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    card.customizationFields?.forEach(field => {
      initial[field.id] = '';
    });
    return initial;
  });
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (isModification) {
      // Counter-propose with modified values
      respondToProposal('modify', values);
    } else {
      // Play new card
      playCard(card.id, values);
    }
    
    onClose();
  };
  
  const handleChange = (fieldName: string, value: any) => {
    setValues(prev => ({
      ...prev,
      [fieldName]: value,
    }));
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
        
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              {card.icon} {card.name}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {isModification ? 'Modify and counter-propose' : 'Customize this settlement term'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        
        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6">
          
          {/* Card Description */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">{card.description}</p>
          </div>
          
          {/* Customization Fields */}
          {card.customizationFields && card.customizationFields.length > 0 ? (
            <div className="space-y-4 mb-6">
              {card.customizationFields.map(field => (
                <div key={field.id}>
                  <label className="block font-semibold mb-2">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  
                  {field.helpText && (
                    <p className="text-xs text-gray-600 mb-2">{field.helpText}</p>
                  )}
                  
                  {/* Text input */}
                  {field.type === 'text' && (
                    <input
                      type="text"
                      value={values[field.id] || ''}
                      onChange={e => handleChange(field.id, e.target.value)}
                      required={field.required}
                      placeholder={field.placeholder}
                      className="w-full p-3 border rounded-lg"
                    />
                  )}
                  
                  {/* Currency input */}
                  {field.type === 'currency' && (
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-500">$</span>
                      <input
                        type="number"
                        step="0.01"
                        value={values[field.id] || ''}
                        onChange={e => handleChange(field.id, parseFloat(e.target.value))}
                        required={field.required}
                        placeholder={field.placeholder}
                        className="w-full p-3 pl-7 border rounded-lg"
                      />
                    </div>
                  )}
                  
                  {/* Percentage input */}
                  {field.type === 'percentage' && (
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={values[field.id] || ''}
                        onChange={e => handleChange(field.id, parseInt(e.target.value))}
                        required={field.required}
                        placeholder={field.placeholder}
                        className="w-full p-3 pr-8 border rounded-lg"
                      />
                      <span className="absolute right-3 top-3 text-gray-500">%</span>
                    </div>
                  )}
                  
                  {/* Date input */}
                  {field.type === 'date' && (
                    <input
                      type="date"
                      value={values[field.id] || ''}
                      onChange={e => handleChange(field.id, e.target.value)}
                      required={field.required}
                      className="w-full p-3 border rounded-lg"
                    />
                  )}
                  
                  {/* Select dropdown */}
                  {field.type === 'select' && field.options && (
                    <select
                      value={values[field.id] || ''}
                      onChange={e => handleChange(field.id, e.target.value)}
                      required={field.required}
                      className="w-full p-3 border rounded-lg"
                    >
                      <option value="">-- Select --</option>
                      {field.options.map(option => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  )}
                  
                  {/* Textarea */}
                  {field.type === 'textarea' && (
                    <textarea
                      value={values[field.id] || ''}
                      onChange={e => handleChange(field.id, e.target.value)}
                      required={field.required}
                      placeholder={field.placeholder}
                      rows={4}
                      className="w-full p-3 border rounded-lg"
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg text-sm text-blue-800">
              This card doesn't require customization. Click "Play Card" to propose it.
            </div>
          )}
          
          {/* Agreement Points */}
          <div className="mb-6 p-4 bg-green-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-green-900">Agreement Points</span>
              <span className="text-2xl font-bold text-green-700">
                +{card.agreementPoints}
              </span>
            </div>
            <p className="text-xs text-green-700 mt-1">
              Both parties will receive these points when this term is accepted
            </p>
          </div>
          
          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700"
            >
              {isModification ? '✏️ Counter-Propose' : '🎴 Play Card'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
