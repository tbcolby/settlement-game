'use client';

import { CardDefinition } from '@/lib/types';

interface CardProps {
  card: CardDefinition;
  onClick?: () => void;
  selected?: boolean;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export function Card({ 
  card, 
  onClick, 
  selected = false, 
  disabled = false,
  size = 'medium'
}: CardProps) {
  const sizeClasses = {
    small: 'p-3 min-h-[140px]',
    medium: 'p-4 min-h-[180px]',
    large: 'p-6 min-h-[220px]',
  };

  const iconSizes = {
    small: 'text-3xl',
    medium: 'text-4xl',
    large: 'text-5xl',
  };

  const categoryColors: Record<string, string> = {
    'asset-division': 'border-l-blue-500',
    'custody': 'border-l-green-500',
    'support': 'border-l-purple-500',
    'debt': 'border-l-red-500',
    'property': 'border-l-yellow-500',
    'future-obligation': 'border-l-orange-500',
    'special': 'border-l-pink-500',
    'meta': 'border-l-gray-500',
  };

  const categoryColor = categoryColors[card.category] || 'border-l-gray-400';

  return (
    <div
      className={`
        ${sizeClasses[size]}
        rounded-lg border-2 border-l-4 transition-all cursor-pointer
        ${categoryColor}
        ${selected 
          ? 'border-blue-500 bg-blue-50 shadow-lg scale-105' 
          : 'border-gray-200 hover:border-gray-400 hover:shadow-md'
        }
        ${disabled 
          ? 'opacity-50 cursor-not-allowed grayscale' 
          : ''
        }
        flex flex-col
      `}
      onClick={disabled ? undefined : onClick}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={`${card.name} card`}
      aria-disabled={disabled}
    >
      {/* Icon */}
      <div className={`${iconSizes[size]} mb-2`}>
        {card.icon}
      </div>
      
      {/* Name */}
      <h3 className={`font-bold mb-1 ${size === 'small' ? 'text-xs' : 'text-sm'}`}>
        {card.name}
      </h3>
      
      {/* Description */}
      <p className={`text-xs text-gray-600 flex-1 line-clamp-3 ${size === 'small' ? 'line-clamp-2' : ''}`}>
        {card.description}
      </p>
      
      {/* Footer */}
      <div className="mt-2 pt-2 border-t border-gray-200 flex items-center justify-between">
        <div className="text-xs text-blue-600 font-bold">
          +{card.agreementPoints} pts
        </div>
        <div className="text-xs text-gray-500 capitalize">
          {card.category.replace('-', ' ')}
        </div>
      </div>
    </div>
  );
}

/**
 * Compact card view for displaying in lists
 */
export function CardCompact({ card, onClick }: { card: CardDefinition; onClick?: () => void }) {
  return (
    <div
      className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded hover:border-gray-400 cursor-pointer"
      onClick={onClick}
    >
      <div className="text-2xl">{card.icon}</div>
      <div className="flex-1">
        <div className="font-bold text-sm">{card.name}</div>
        <div className="text-xs text-gray-600">{card.description}</div>
      </div>
      <div className="text-xs text-blue-600 font-bold">
        +{card.agreementPoints}
      </div>
    </div>
  );
}

/**
 * Card placeholder for empty slots
 */
export function CardPlaceholder({ text }: { text?: string }) {
  return (
    <div className="p-4 min-h-[180px] rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-sm">
      {text || 'Empty slot'}
    </div>
  );
}
