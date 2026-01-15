/**
 * Tests for Document Generator
 */

import { 
  DocumentGenerator,
  type MaritalSettlementAgreement,
  type PlayedCard 
} from '../document-generator';

describe('Document Generator', () => {
  const createMockMSA = (): MaritalSettlementAgreement => ({
    county: 'Milwaukee',
    caseNumber: '2024FA000123',
    partyAName: 'Tyler Colby',
    partyBName: 'Tiffany Smith',
    marriageDate: new Date('2015-06-15'),
    separationDate: new Date('2023-11-01'),
    children: [
      {
        name: 'Child One',
        birthdate: new Date('2017-08-22'),
      },
    ],
    assetDivisionCards: [],
    custodyCards: [],
    supportCards: [],
    debtCards: [],
    propertyCards: [],
    futureObligationCards: [],
    specialCards: [],
    equityAnalysis: {
      partyAAssets: 150000,
      partyBAssets: 150000,
      partyADebts: 50000,
      partyBDebts: 50000,
      partyANetWorth: 100000,
      partyBNetWorth: 100000,
      partyAPercentage: 50,
      partyBPercentage: 50,
      equityScore: 100,
      deviationFromEqual: 0,
      isCompliant: true,
      warnings: [],
      errors: [],
      suggestions: [],
    },
    generatedDate: new Date('2024-01-15'),
    version: '1.0.0',
  });

  describe('generate', () => {
    it('should generate complete MSA document', () => {
      const msa = createMockMSA();
      const document = DocumentGenerator.generate(msa);

      expect(document).toBeDefined();
      expect(typeof document).toBe('string');
      expect(document.length).toBeGreaterThan(0);
    });

    it('should include case header information', () => {
      const msa = createMockMSA();
      const document = DocumentGenerator.generate(msa);

      expect(document).toContain('MILWAUKEE COUNTY');
      expect(document).toContain('2024FA000123');
      expect(document).toContain('Tyler Colby');
      expect(document).toContain('Tiffany Smith');
      expect(document).toContain('MARITAL SETTLEMENT AGREEMENT');
    });

    it('should include marriage and separation dates', () => {
      const msa = createMockMSA();
      const document = DocumentGenerator.generate(msa);

      expect(document).toContain('2015');
      expect(document).toContain('2023');
    });

    it('should list children information', () => {
      const msa = createMockMSA();
      const document = DocumentGenerator.generate(msa);

      expect(document).toContain('Child One');
      expect(document).toContain('2017');
    });

    it('should include standard boilerplate sections', () => {
      const msa = createMockMSA();
      const document = DocumentGenerator.generate(msa);

      expect(document).toContain('GENERAL PROVISIONS');
      expect(document).toContain('Mutual Release');
      expect(document).toContain('Voluntary Agreement');
      expect(document).toContain('Governing Law');
      expect(document).toContain('Wisconsin');
    });

    it('should include signature block', () => {
      const msa = createMockMSA();
      const document = DocumentGenerator.generate(msa);

      expect(document).toContain('IN WITNESS WHEREOF');
      expect(document).toContain('Tyler Colby');
      expect(document).toContain('Party A');
      expect(document).toContain('Party B');
    });

    it('should include Warp co-author attribution', () => {
      const msa = createMockMSA();
      const document = DocumentGenerator.generate(msa);

      expect(document).toContain('Co-Authored-By: Warp <agent@warp.dev>');
    });
  });

  describe('generate with cards', () => {
    it('should include keep-house card language', () => {
      const msa = createMockMSA();
      msa.assetDivisionCards = [
        {
          cardId: 'keep-house',
          category: 'asset-division',
          name: 'Keep the House',
          customValues: {
            keepingParty: 'A',
            address: '123 Main St, Milwaukee, WI',
            buyoutAmount: 100000,
            refinanceTimeline: '180 days',
          },
          playedBy: 'A',
          acceptedBy: 'both',
          timestamp: new Date(),
        },
      ];

      const document = DocumentGenerator.generate(msa);

      expect(document).toContain('DIVISION OF PROPERTY');
      expect(document).toContain('123 Main St');
      expect(document).toContain('$100,000');
    });

    it('should include 50/50 placement language', () => {
      const msa = createMockMSA();
      msa.custodyCards = [
        {
          cardId: '50-50-placement',
          category: 'custody',
          name: '50/50 Placement',
          customValues: {
            schedule: 'Week on/week off',
            holidaySchedule: 'Alternating years',
          },
          playedBy: 'B',
          acceptedBy: 'both',
          timestamp: new Date(),
        },
      ];

      const document = DocumentGenerator.generate(msa);

      expect(document).toContain('CUSTODY AND PLACEMENT');
      expect(document).toContain('50/50');
      expect(document).toContain('Week on/week off');
    });

    it('should include child support language', () => {
      const msa = createMockMSA();
      msa.supportCards = [
        {
          cardId: 'child-support-guidelines',
          category: 'support',
          name: 'Child Support',
          customValues: {
            payor: 'A',
            amount: 1200,
            percentage: 17,
            paymentMethod: 'Direct deposit',
          },
          playedBy: 'A',
          acceptedBy: 'both',
          timestamp: new Date(),
        },
      ];

      const document = DocumentGenerator.generate(msa);

      expect(document).toContain('CHILD SUPPORT AND MAINTENANCE');
      expect(document).toContain('$1,200');
      expect(document).toContain('17%');
    });

    it('should include no spousal support language', () => {
      const msa = createMockMSA();
      msa.supportCards = [
        {
          cardId: 'no-spousal-support',
          category: 'support',
          name: 'No Spousal Support',
          customValues: {},
          playedBy: 'B',
          acceptedBy: 'both',
          timestamp: new Date(),
        },
      ];

      const document = DocumentGenerator.generate(msa);

      expect(document).toContain('maintenance');
      expect(document).toContain('waives');
    });
  });

  describe('generateSummary', () => {
    it('should generate summary sheet', () => {
      const msa = createMockMSA();
      const summary = DocumentGenerator.generateSummary(msa);

      expect(summary).toContain('MARITAL SETTLEMENT AGREEMENT SUMMARY');
      expect(summary).toContain('Tyler Colby vs. Tiffany Smith');
      expect(summary).toContain('2024FA000123');
    });

    it('should include financial summary', () => {
      const msa = createMockMSA();
      const summary = DocumentGenerator.generateSummary(msa);

      expect(summary).toContain('FINANCIAL SUMMARY');
      expect(summary).toContain('Party A Receives');
      expect(summary).toContain('Party B Receives');
      expect(summary).toContain('$150,000');
      expect(summary).toContain('50.0%');
    });

    it('should show equity score', () => {
      const msa = createMockMSA();
      const summary = DocumentGenerator.generateSummary(msa);

      expect(summary).toContain('Equity Score: 100');
      expect(summary).toContain('COMPLIANT');
    });

    it('should show errors if present', () => {
      const msa = createMockMSA();
      msa.equityAnalysis.errors = ['Missing custody arrangement'];
      msa.equityAnalysis.isCompliant = false;

      const summary = DocumentGenerator.generateSummary(msa);

      expect(summary).toContain('ERRORS REQUIRING ATTENTION');
      expect(summary).toContain('Missing custody arrangement');
    });

    it('should show warnings if present', () => {
      const msa = createMockMSA();
      msa.equityAnalysis.warnings = ['Consider mediation clause'];

      const summary = DocumentGenerator.generateSummary(msa);

      expect(summary).toContain('WARNINGS');
      expect(summary).toContain('Consider mediation');
    });

    it('should include important notices', () => {
      const msa = createMockMSA();
      const summary = DocumentGenerator.generateSummary(msa);

      expect(summary).toContain('IMPORTANT NOTICES');
      expect(summary).toContain('reviewed by qualified legal counsel');
      expect(summary).toContain('independent legal representation');
    });

    it('should include Warp attribution', () => {
      const msa = createMockMSA();
      const summary = DocumentGenerator.generateSummary(msa);

      expect(summary).toContain('Co-Authored-By: Warp');
    });
  });

  describe('exportToText', () => {
    it('should export as plain text', () => {
      const msa = createMockMSA();
      const text = DocumentGenerator.exportToText(msa);

      expect(typeof text).toBe('string');
      expect(text).toContain('MARITAL SETTLEMENT AGREEMENT');
    });
  });

  describe('exportToHTML', () => {
    it('should export as HTML', () => {
      const msa = createMockMSA();
      const html = DocumentGenerator.exportToHTML(msa);

      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('<html>');
      expect(html).toContain('</html>');
      expect(html).toContain('<title>');
    });

    it('should include styling', () => {
      const msa = createMockMSA();
      const html = DocumentGenerator.exportToHTML(msa);

      expect(html).toContain('<style>');
      expect(html).toContain('font-family');
    });
  });

  describe('exportToMarkdown', () => {
    it('should export as markdown', () => {
      const msa = createMockMSA();
      const markdown = DocumentGenerator.exportToMarkdown(msa);

      expect(typeof markdown).toBe('string');
      expect(markdown.length).toBeGreaterThan(0);
    });
  });

  describe('Edge cases', () => {
    it('should handle MSA with no children', () => {
      const msa = createMockMSA();
      msa.children = [];

      const document = DocumentGenerator.generate(msa);

      expect(document).toContain('no minor children');
    });

    it('should handle MSA with no case number', () => {
      const msa = createMockMSA();
      delete msa.caseNumber;

      const document = DocumentGenerator.generate(msa);

      expect(document).toContain('______________');
    });

    it('should handle MSA with no separation date', () => {
      const msa = createMockMSA();
      delete msa.separationDate;

      const document = DocumentGenerator.generate(msa);

      expect(document).toBeDefined();
    });

    it('should handle multiple children', () => {
      const msa = createMockMSA();
      msa.children = [
        { name: 'Child 1', birthdate: new Date('2017-01-01') },
        { name: 'Child 2', birthdate: new Date('2019-01-01') },
        { name: 'Child 3', birthdate: new Date('2021-01-01') },
      ];

      const document = DocumentGenerator.generate(msa);

      expect(document).toContain('Child 1');
      expect(document).toContain('Child 2');
      expect(document).toContain('Child 3');
    });
  });
});
