/**
 * Tests for Card Library
 */

import { 
  SETTLEMENT_CARDS, 
  getCardById, 
  getCardsByCategory, 
  getAllCategories 
} from '../cards';

describe('Card Library', () => {
  describe('SETTLEMENT_CARDS', () => {
    it('should have cards defined', () => {
      expect(SETTLEMENT_CARDS).toBeDefined();
      expect(Array.isArray(SETTLEMENT_CARDS)).toBe(true);
      expect(SETTLEMENT_CARDS.length).toBeGreaterThan(0);
    });

    it('should have unique card IDs', () => {
      const ids = SETTLEMENT_CARDS.map(card => card.id);
      const uniqueIds = new Set(ids);
      expect(ids.length).toBe(uniqueIds.size);
    });

    it('should have valid card structure', () => {
      SETTLEMENT_CARDS.forEach(card => {
        expect(card).toHaveProperty('id');
        expect(card).toHaveProperty('category');
        expect(card).toHaveProperty('name');
        expect(card).toHaveProperty('description');
        expect(card).toHaveProperty('icon');
        expect(card).toHaveProperty('agreementPoints');
        expect(card).toHaveProperty('customizationFields');
        expect(card).toHaveProperty('legalTemplate');
        expect(typeof card.id).toBe('string');
        expect(typeof card.name).toBe('string');
        expect(typeof card.agreementPoints).toBe('number');
        expect(Array.isArray(card.customizationFields)).toBe(true);
      });
    });

    it('should have non-negative agreement points', () => {
      SETTLEMENT_CARDS.forEach(card => {
        expect(card.agreementPoints).toBeGreaterThanOrEqual(0);
      });
    });

    it('should have valid customization fields', () => {
      SETTLEMENT_CARDS.forEach(card => {
        card.customizationFields.forEach(field => {
          expect(field).toHaveProperty('id');
          expect(field).toHaveProperty('label');
          expect(field).toHaveProperty('type');
          expect(field).toHaveProperty('required');
          expect(['text', 'number', 'currency', 'date', 'textarea', 'select', 'percentage']).toContain(field.type);
          expect(typeof field.required).toBe('boolean');
        });
      });
    });
  });

  describe('getCardById', () => {
    it('should return card when ID exists', () => {
      const card = getCardById('keep-house');
      expect(card).toBeDefined();
      expect(card?.id).toBe('keep-house');
      expect(card?.name).toBe('Keep the House');
    });

    it('should return undefined when ID does not exist', () => {
      const card = getCardById('non-existent-card');
      expect(card).toBeUndefined();
    });

    it('should find all major cards', () => {
      const majorCards = [
        'keep-house',
        'sell-and-split',
        '50-50-placement',
        'child-support-guidelines',
        'no-spousal-support',
        'qdro-split',
      ];

      majorCards.forEach(cardId => {
        const card = getCardById(cardId);
        expect(card).toBeDefined();
        expect(card?.id).toBe(cardId);
      });
    });
  });

  describe('getCardsByCategory', () => {
    it('should return asset-division cards', () => {
      const cards = getCardsByCategory('asset-division');
      expect(Array.isArray(cards)).toBe(true);
      expect(cards.length).toBeGreaterThan(0);
      cards.forEach(card => {
        expect(card.category).toBe('asset-division');
      });
    });

    it('should return custody cards', () => {
      const cards = getCardsByCategory('custody');
      expect(Array.isArray(cards)).toBe(true);
      expect(cards.length).toBeGreaterThan(0);
      cards.forEach(card => {
        expect(card.category).toBe('custody');
      });
    });

    it('should return empty array for non-existent category', () => {
      const cards = getCardsByCategory('non-existent');
      expect(Array.isArray(cards)).toBe(true);
      expect(cards.length).toBe(0);
    });

    it('should include all major categories', () => {
      const categories = [
        'asset-division',
        'custody',
        'support',
        'debt',
        'property',
        'future-obligation',
        'special',
        'meta',
      ];

      categories.forEach(category => {
        const cards = getCardsByCategory(category);
        expect(cards.length).toBeGreaterThan(0);
      });
    });
  });

  describe('getAllCategories', () => {
    it('should return array of categories', () => {
      const categories = getAllCategories();
      expect(Array.isArray(categories)).toBe(true);
      expect(categories.length).toBeGreaterThan(0);
    });

    it('should have unique categories', () => {
      const categories = getAllCategories();
      const uniqueCategories = new Set(categories);
      expect(categories.length).toBe(uniqueCategories.size);
    });

    it('should include all expected categories', () => {
      const categories = getAllCategories();
      expect(categories).toContain('asset-division');
      expect(categories).toContain('custody');
      expect(categories).toContain('support');
      expect(categories).toContain('debt');
    });
  });

  describe('Card content validation', () => {
    it('should have keep-house card with correct fields', () => {
      const card = getCardById('keep-house');
      expect(card).toBeDefined();
      expect(card?.agreementPoints).toBe(20);
      expect(card?.customizationFields.length).toBeGreaterThan(0);
      
      const fieldIds = card?.customizationFields.map(f => f.id);
      expect(fieldIds).toContain('keepingParty');
      expect(fieldIds).toContain('address');
      expect(fieldIds).toContain('buyoutAmount');
    });

    it('should have 50-50 placement card with schedule fields', () => {
      const card = getCardById('50-50-placement');
      expect(card).toBeDefined();
      expect(card?.agreementPoints).toBe(25);
      
      const fieldIds = card?.customizationFields.map(f => f.id);
      expect(fieldIds).toContain('schedule');
      expect(fieldIds).toContain('holidaySchedule');
    });

    it('should have child support card with required fields', () => {
      const card = getCardById('child-support-guidelines');
      expect(card).toBeDefined();
      expect(card?.agreementPoints).toBe(15);
      
      const fieldIds = card?.customizationFields.map(f => f.id);
      expect(fieldIds).toContain('payor');
      expect(fieldIds).toContain('amount');
    });
  });
});
