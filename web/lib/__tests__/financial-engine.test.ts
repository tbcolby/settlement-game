/**
 * Tests for Financial Analysis Engine
 */

import {
  calculateChildSupport,
  EquityAnalyzer,
  type SettlementState,
  type PartyFinancials,
} from '../financial-engine';

describe('Financial Engine', () => {
  describe('calculateChildSupport', () => {
    it('should calculate basic child support for 1 child', () => {
      const result = calculateChildSupport(
        60000, // payor income
        40000, // payee income
        1,     // number of children
        0      // payor placement percentage
      );

      expect(result.guidelinePercentage).toBe(0.17);
      expect(result.guidelineAmount).toBe(10200); // 60000 * 0.17
      expect(result.finalAmount).toBe(10200);
    });

    it('should calculate child support for 2 children', () => {
      const result = calculateChildSupport(
        80000,
        50000,
        2,
        0
      );

      expect(result.guidelinePercentage).toBe(0.25);
      expect(result.guidelineAmount).toBe(20000); // 80000 * 0.25
      expect(result.finalAmount).toBe(20000);
    });

    it('should apply shared placement credit for 50/50', () => {
      const result = calculateChildSupport(
        80000,
        50000,
        1,
        50 // 50% placement
      );

      expect(result.guidelineAmount).toBeCloseTo(13600, 1); // 80000 * 0.17
      expect(result.sharedPlacementCredit).toBeGreaterThan(0);
      expect(result.finalAmount).toBeLessThan(result.guidelineAmount);
    });

    it('should not apply credit for placement under 25%', () => {
      const result = calculateChildSupport(
        80000,
        50000,
        1,
        20 // 20% placement
      );

      expect(result.sharedPlacementCredit).toBe(0);
    });

    it('should add healthcare and childcare costs', () => {
      const result = calculateChildSupport(
        80000,
        40000,
        1,
        0,
        200,  // health insurance
        500   // childcare
      );

      expect(result.healthInsuranceCost).toBe(200);
      expect(result.childcareCost).toBe(500);
      expect(result.finalAmount).toBeGreaterThan(result.guidelineAmount);
    });

    it('should handle multiple children correctly', () => {
      const result3 = calculateChildSupport(100000, 50000, 3, 0);
      const result4 = calculateChildSupport(100000, 50000, 4, 0);
      const result5 = calculateChildSupport(100000, 50000, 5, 0);

      expect(result3.guidelinePercentage).toBe(0.29);
      expect(result4.guidelinePercentage).toBe(0.31);
      expect(result5.guidelinePercentage).toBe(0.34);
    });

    it('should never return negative child support', () => {
      const result = calculateChildSupport(
        30000,
        70000,
        1,
        50 // high shared placement
      );

      expect(result.finalAmount).toBeGreaterThanOrEqual(0);
    });
  });

  describe('EquityAnalyzer', () => {
    const createBasicParty = (id: 'A' | 'B'): PartyFinancials => ({
      partyId: id,
      cashAssets: 0,
      propertyValue: 0,
      investmentValue: 0,
      businessValue: 0,
      personalPropertyValue: 0,
      otherAssets: 0,
      mortgageDebt: 0,
      consumerDebt: 0,
      studentLoanDebt: 0,
      businessDebt: 0,
      otherDebts: 0,
      childSupportPayable: 0,
      childSupportReceivable: 0,
      spousalSupportPayable: 0,
      spousalSupportReceivable: 0,
      parentingTimePercentage: 0,
      hasLegalCustody: false,
      hasFinalDecisionAuthority: [],
    });

    const createBasicState = (): SettlementState => ({
      partyA: createBasicParty('A'),
      partyB: createBasicParty('B'),
      totalMaritalAssets: 0,
      totalMaritalDebts: 0,
      netMaritalEstate: 0,
      numberOfChildren: 0,
      childrenAges: [],
      agreementPointsA: 0,
      agreementPointsB: 0,
      acceptedCards: [],
    });

    describe('analyze', () => {
      it('should calculate perfect 50/50 split', () => {
        const state = createBasicState();
        state.partyA.cashAssets = 100000;
        state.partyB.cashAssets = 100000;

        const analysis = EquityAnalyzer.analyze(state);

        expect(analysis.partyAAssets).toBe(100000);
        expect(analysis.partyBAssets).toBe(100000);
        expect(analysis.partyAPercentage).toBe(50);
        expect(analysis.partyBPercentage).toBe(50);
        expect(analysis.equityScore).toBe(100);
        expect(analysis.deviationFromEqual).toBe(0);
      });

      it('should handle assets and debts correctly', () => {
        const state = createBasicState();
        state.partyA.propertyValue = 300000;
        state.partyA.mortgageDebt = 200000;
        state.partyB.cashAssets = 100000;

        const analysis = EquityAnalyzer.analyze(state);

        expect(analysis.partyANetWorth).toBe(100000); // 300k - 200k
        expect(analysis.partyBNetWorth).toBe(100000);
        expect(analysis.partyAPercentage).toBe(50);
        expect(analysis.partyBPercentage).toBe(50);
      });

      it('should detect unequal splits', () => {
        const state = createBasicState();
        state.partyA.cashAssets = 150000;
        state.partyB.cashAssets = 50000;

        const analysis = EquityAnalyzer.analyze(state);

        expect(analysis.partyAPercentage).toBe(75);
        expect(analysis.partyBPercentage).toBe(25);
        expect(analysis.deviationFromEqual).toBe(25);
        expect(analysis.equityScore).toBeLessThan(100);
      });

      it('should warn on significant deviations', () => {
        const state = createBasicState();
        state.partyA.cashAssets = 135000; // 67.5% split  
        state.partyB.cashAssets = 65000;   // 32.5% split

        const analysis = EquityAnalyzer.analyze(state);

        // Deviation is 17.5 percentage points, should trigger warning (>15% triggers warning, <=30% doesn't error)
        expect(analysis.warnings.length).toBeGreaterThan(0);
      });

      it('should error on extreme deviations', () => {
        const state = createBasicState();
        state.partyA.cashAssets = 190000;
        state.partyB.cashAssets = 10000;

        const analysis = EquityAnalyzer.analyze(state);

        expect(analysis.errors.length).toBeGreaterThan(0);
        expect(analysis.isCompliant).toBe(false);
      });

      it('should check for custody when children present', () => {
        const state = createBasicState();
        state.numberOfChildren = 1;
        state.partyA.cashAssets = 100000;
        state.partyB.cashAssets = 100000;

        const analysis = EquityAnalyzer.analyze(state);

        expect(analysis.errors.length).toBeGreaterThan(0);
        expect(analysis.errors.some(e => e.includes('custody'))).toBe(true);
      });

      it('should suggest child support when appropriate', () => {
        const state = createBasicState();
        state.numberOfChildren = 1;
        state.partyA.parentingTimePercentage = 20;
        state.partyB.parentingTimePercentage = 80;
        state.partyA.cashAssets = 100000;
        state.partyB.cashAssets = 100000;

        const analysis = EquityAnalyzer.analyze(state);

        expect(analysis.warnings.some(w => w.includes('child support'))).toBe(true);
      });

      it('should handle agreement completion tracking', () => {
        const state = createBasicState();
        state.agreementPointsA = 75;
        state.agreementPointsB = 50;
        state.partyA.cashAssets = 100000;
        state.partyB.cashAssets = 100000;

        const analysis = EquityAnalyzer.analyze(state);

        expect(analysis.suggestions.some(s => s.includes('50%'))).toBe(true);
      });
    });

    describe('calculateMonthlyObligations', () => {
      it('should calculate child support payable', () => {
        const party = createBasicParty('A');
        party.childSupportPayable = 1000;

        const result = EquityAnalyzer.calculateMonthlyObligations(party);

        expect(result.totalPayable).toBe(1000);
        expect(result.totalReceivable).toBe(0);
        expect(result.netObligation).toBe(1000);
        expect(result.breakdown.length).toBeGreaterThan(0);
      });

      it('should calculate spousal support receivable', () => {
        const party = createBasicParty('B');
        party.spousalSupportReceivable = 2000;

        const result = EquityAnalyzer.calculateMonthlyObligations(party);

        expect(result.totalPayable).toBe(0);
        expect(result.totalReceivable).toBe(2000);
        expect(result.netObligation).toBe(-2000);
      });

      it('should net obligations correctly', () => {
        const party = createBasicParty('A');
        party.childSupportPayable = 1500;
        party.spousalSupportReceivable = 500;

        const result = EquityAnalyzer.calculateMonthlyObligations(party);

        expect(result.totalPayable).toBe(1500);
        expect(result.totalReceivable).toBe(500);
        expect(result.netObligation).toBe(1000); // net pays $1000
      });
    });

    describe('generateSummary', () => {
      it('should generate readable summary', () => {
        const state = createBasicState();
        state.partyA.cashAssets = 100000;
        state.partyB.cashAssets = 100000;
        state.agreementPointsA = 100;
        state.agreementPointsB = 100;

        const analysis = EquityAnalyzer.analyze(state);
        const summary = EquityAnalyzer.generateSummary(state, analysis);

        expect(summary).toContain('SETTLEMENT SUMMARY');
        expect(summary).toContain('ASSET DIVISION');
        expect(summary).toContain('Party A');
        expect(summary).toContain('Party B');
        expect(summary).toContain('100/100');
      });

      it('should include parenting info when children present', () => {
        const state = createBasicState();
        state.numberOfChildren = 2;
        state.partyA.parentingTimePercentage = 50;
        state.partyB.parentingTimePercentage = 50;
        state.partyA.cashAssets = 100000;
        state.partyB.cashAssets = 100000;

        const analysis = EquityAnalyzer.analyze(state);
        const summary = EquityAnalyzer.generateSummary(state, analysis);

        expect(summary).toContain('PARENTING TIME');
      });
    });
  });
});
