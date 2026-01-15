/**
 * Settlement Game - Financial Analysis Engine
 * 
 * Real-time calculation system for tracking equity, obligations, and fairness
 * Ensures Wisconsin law compliance throughout gameplay
 * 
 * @version 1.0.0
 * @created 2026-01-14
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface PartyFinancials {
  partyId: 'A' | 'B';
  partyName?: string;
  
  // Assets received
  cashAssets: number;
  propertyValue: number;
  investmentValue: number;
  businessValue: number;
  personalPropertyValue: number;
  otherAssets: number;
  
  // Debts assigned
  mortgageDebt: number;
  consumerDebt: number;
  studentLoanDebt: number;
  businessDebt: number;
  otherDebts: number;
  
  // Ongoing obligations
  childSupportPayable: number;    // monthly
  childSupportReceivable: number; // monthly
  spousalSupportPayable: number;  // monthly
  spousalSupportReceivable: number; // monthly
  
  // Parenting time
  parentingTimePercentage: number; // 0-100
  hasLegalCustody: boolean;
  hasFinalDecisionAuthority: string[]; // areas where they have final say
}

export interface SettlementState {
  partyA: PartyFinancials;
  partyB: PartyFinancials;
  
  // Marital estate totals
  totalMaritalAssets: number;
  totalMaritalDebts: number;
  netMaritalEstate: number;
  
  // Children info
  numberOfChildren: number;
  childrenAges: number[];
  
  // Agreement progress
  agreementPointsA: number; // 0-100
  agreementPointsB: number; // 0-100
  acceptedCards: string[]; // card IDs
}

export interface EquityAnalysis {
  // Asset division
  partyAAssets: number;
  partyBAssets: number;
  partyADebts: number;
  partyBDebts: number;
  partyANetWorth: number;
  partyBNetWorth: number;
  
  // Percentages
  partyAPercentage: number; // 0-100
  partyBPercentage: number; // 0-100
  
  // Fairness scoring
  equityScore: number; // 0-100, where 100 is perfectly fair
  deviationFromEqual: number; // percentage points away from 50/50
  
  // Wisconsin law compliance
  isCompliant: boolean;
  warnings: string[];
  errors: string[];
  suggestions: string[];
}

export interface ChildSupportCalculation {
  payorIncome: number;
  payeeIncome: number;
  numberOfChildren: number;
  placementPercentage: number; // payor's percentage
  
  // Guideline percentage
  guidelinePercentage: number;
  guidelineAmount: number;
  
  // Adjustments
  sharedPlacementCredit: number;
  healthInsuranceCost: number;
  childcareCost: number;
  
  // Final amount
  finalAmount: number;
  
  // Deviation info (if applicable)
  isDeviation: boolean;
  deviationJustification?: string;
}

// ============================================================================
// WISCONSIN CHILD SUPPORT GUIDELINES
// ============================================================================

/**
 * Calculate child support per Wisconsin §49.22
 */
export function calculateChildSupport(
  payorIncome: number,
  payeeIncome: number,
  numberOfChildren: number,
  payorPlacementPercentage: number, // 0-100
  healthInsuranceCost: number = 0,
  childcareCost: number = 0
): ChildSupportCalculation {
  
  // Wisconsin guideline percentages
  const guidelinePercentages: Record<number, number> = {
    1: 0.17,
    2: 0.25,
    3: 0.29,
    4: 0.31,
    5: 0.34
  };
  
  const guidelinePercentage = guidelinePercentages[Math.min(numberOfChildren, 5)] || 0.34;
  
  // Base guideline amount
  const guidelineAmount = payorIncome * guidelinePercentage;
  
  // Shared placement credit (if placement > 25%)
  let sharedPlacementCredit = 0;
  if (payorPlacementPercentage > 25) {
    // Wisconsin uses a sliding scale for shared placement
    const creditPercentage = Math.min((payorPlacementPercentage - 25) / 25, 1);
    sharedPlacementCredit = guidelineAmount * creditPercentage * 0.5;
  }
  
  // Add-ons for healthcare and childcare
  const payorShareOfAddons = (healthInsuranceCost + childcareCost) * 
    (payorIncome / (payorIncome + payeeIncome));
  
  // Final calculation
  const finalAmount = Math.max(0, 
    guidelineAmount - sharedPlacementCredit + payorShareOfAddons
  );
  
  return {
    payorIncome,
    payeeIncome,
    numberOfChildren,
    placementPercentage: payorPlacementPercentage,
    guidelinePercentage,
    guidelineAmount,
    sharedPlacementCredit,
    healthInsuranceCost,
    childcareCost,
    finalAmount,
    isDeviation: false
  };
}

// ============================================================================
// EQUITY ANALYSIS ENGINE
// ============================================================================

export class EquityAnalyzer {
  
  /**
   * Calculate comprehensive equity analysis
   */
  static analyze(state: SettlementState): EquityAnalysis {
    const { partyA, partyB } = state;
    
    // Calculate net worth for each party
    const partyAAssets = this.calculateTotalAssets(partyA);
    const partyBAssets = this.calculateTotalAssets(partyB);
    const partyADebts = this.calculateTotalDebts(partyA);
    const partyBDebts = this.calculateTotalDebts(partyB);
    
    const partyANetWorth = partyAAssets - partyADebts;
    const partyBNetWorth = partyBAssets - partyBDebts;
    
    const totalNetWorth = partyANetWorth + partyBNetWorth;
    
    // Calculate percentages
    const partyAPercentage = totalNetWorth > 0 
      ? (partyANetWorth / totalNetWorth) * 100 
      : 50;
    const partyBPercentage = 100 - partyAPercentage;
    
    // Calculate deviation from equal split
    const deviationFromEqual = Math.abs(50 - partyAPercentage);
    
    // Calculate equity score (100 = perfect 50/50 split)
    const equityScore = Math.max(0, 100 - (deviationFromEqual * 2));
    
    // Check compliance and generate feedback
    const { isCompliant, warnings, errors, suggestions } = 
      this.checkCompliance(state, partyAPercentage, partyBPercentage);
    
    return {
      partyAAssets,
      partyBAssets,
      partyADebts,
      partyBDebts,
      partyANetWorth,
      partyBNetWorth,
      partyAPercentage,
      partyBPercentage,
      equityScore,
      deviationFromEqual,
      isCompliant,
      warnings,
      errors,
      suggestions
    };
  }
  
  /**
   * Calculate total assets for a party
   */
  private static calculateTotalAssets(party: PartyFinancials): number {
    return party.cashAssets +
           party.propertyValue +
           party.investmentValue +
           party.businessValue +
           party.personalPropertyValue +
           party.otherAssets;
  }
  
  /**
   * Calculate total debts for a party
   */
  private static calculateTotalDebts(party: PartyFinancials): number {
    return party.mortgageDebt +
           party.consumerDebt +
           party.studentLoanDebt +
           party.businessDebt +
           party.otherDebts;
  }
  
  /**
   * Check Wisconsin law compliance
   */
  private static checkCompliance(
    state: SettlementState,
    partyAPercentage: number,
    partyBPercentage: number
  ): {
    isCompliant: boolean;
    warnings: string[];
    errors: string[];
    suggestions: string[];
  } {
    const warnings: string[] = [];
    const errors: string[] = [];
    const suggestions: string[] = [];
    
    // Check asset division fairness
    const deviation = Math.abs(50 - partyAPercentage);
    
    if (deviation > 30) {
      errors.push(
        `Asset division is heavily skewed (${partyAPercentage.toFixed(1)}% / ${partyBPercentage.toFixed(1)}%). ` +
        `Wisconsin law presumes equal division unless justified by specific factors.`
      );
    } else if (deviation > 15) {
      warnings.push(
        `Asset division deviates significantly from 50/50 split. ` +
        `Consider whether this can be justified under Wisconsin §767.61.`
      );
    }
    
    // Check custody arrangement
    if (state.partyA.parentingTimePercentage === 0 && state.partyB.parentingTimePercentage === 0) {
      if (state.numberOfChildren > 0) {
        errors.push('No custody/placement arrangement specified for minor children.');
      }
    }
    
    // Check child support
    if (state.numberOfChildren > 0) {
      const hasChildSupport = 
        state.partyA.childSupportPayable > 0 || 
        state.partyB.childSupportPayable > 0;
      
      const isSharedPlacement = 
        state.partyA.parentingTimePercentage >= 25 && 
        state.partyB.parentingTimePercentage >= 25;
      
      if (!hasChildSupport && !isSharedPlacement) {
        warnings.push(
          'No child support specified. Wisconsin requires child support unless parties have ' +
          'equal shared placement and similar incomes.'
        );
      }
    }
    
    // Check agreement completeness
    if (state.agreementPointsA < 100 || state.agreementPointsB < 100) {
      suggestions.push(
        `Agreement is ${Math.min(state.agreementPointsA, state.agreementPointsB)}% complete. ` +
        `Both parties must reach 100% agreement points to finalize.`
      );
    }
    
    // Suggest balance improvements
    if (deviation > 10 && deviation <= 15) {
      const advantagedParty = partyAPercentage > 50 ? 'A' : 'B';
      const disadvantagedParty = advantagedParty === 'A' ? 'B' : 'A';
      
      suggestions.push(
        `Consider additional assets or spousal support to Party ${disadvantagedParty} ` +
        `to achieve a more balanced settlement.`
      );
    }
    
    // Check for required provisions
    const requiredProvisions = [
      'Asset division',
      'Debt division',
      'Name change rights',
      'Tax filing',
      'Health insurance (if children)'
    ];
    
    // This would check against accepted cards in a real implementation
    // For now, just suggest what's needed
    if (state.acceptedCards.length < 5) {
      suggestions.push(
        'Ensure agreement includes all required provisions: ' +
        requiredProvisions.join(', ')
      );
    }
    
    const isCompliant = errors.length === 0;
    
    return { isCompliant, warnings, errors, suggestions };
  }
  
  /**
   * Calculate monthly obligation summary
   */
  static calculateMonthlyObligations(party: PartyFinancials): {
    totalPayable: number;
    totalReceivable: number;
    netObligation: number;
    breakdown: string[];
  } {
    const breakdown: string[] = [];
    let totalPayable = 0;
    let totalReceivable = 0;
    
    if (party.childSupportPayable > 0) {
      totalPayable += party.childSupportPayable;
      breakdown.push(`Child support payable: $${party.childSupportPayable.toFixed(2)}/mo`);
    }
    
    if (party.childSupportReceivable > 0) {
      totalReceivable += party.childSupportReceivable;
      breakdown.push(`Child support receivable: $${party.childSupportReceivable.toFixed(2)}/mo`);
    }
    
    if (party.spousalSupportPayable > 0) {
      totalPayable += party.spousalSupportPayable;
      breakdown.push(`Spousal support payable: $${party.spousalSupportPayable.toFixed(2)}/mo`);
    }
    
    if (party.spousalSupportReceivable > 0) {
      totalReceivable += party.spousalSupportReceivable;
      breakdown.push(`Spousal support receivable: $${party.spousalSupportReceivable.toFixed(2)}/mo`);
    }
    
    const netObligation = totalPayable - totalReceivable;
    
    return {
      totalPayable,
      totalReceivable,
      netObligation,
      breakdown
    };
  }
  
  /**
   * Generate human-readable summary
   */
  static generateSummary(state: SettlementState, analysis: EquityAnalysis): string {
    const lines: string[] = [];
    
    lines.push('=== SETTLEMENT SUMMARY ===\n');
    
    lines.push('ASSET DIVISION:');
    lines.push(`  Party A receives: $${analysis.partyAAssets.toLocaleString()} in assets`);
    lines.push(`  Party A assumes: $${analysis.partyADebts.toLocaleString()} in debts`);
    lines.push(`  Party A net: $${analysis.partyANetWorth.toLocaleString()} (${analysis.partyAPercentage.toFixed(1)}%)`);
    lines.push('');
    lines.push(`  Party B receives: $${analysis.partyBAssets.toLocaleString()} in assets`);
    lines.push(`  Party B assumes: $${analysis.partyBDebts.toLocaleString()} in debts`);
    lines.push(`  Party B net: $${analysis.partyBNetWorth.toLocaleString()} (${analysis.partyBPercentage.toFixed(1)}%)`);
    lines.push('');
    
    if (state.numberOfChildren > 0) {
      lines.push('PARENTING TIME:');
      lines.push(`  Party A: ${state.partyA.parentingTimePercentage}%`);
      lines.push(`  Party B: ${state.partyB.parentingTimePercentage}%`);
      lines.push('');
      
      const obligationsA = this.calculateMonthlyObligations(state.partyA);
      const obligationsB = this.calculateMonthlyObligations(state.partyB);
      
      if (obligationsA.breakdown.length > 0 || obligationsB.breakdown.length > 0) {
        lines.push('MONTHLY OBLIGATIONS:');
        if (obligationsA.netObligation !== 0) {
          const action = obligationsA.netObligation > 0 ? 'pays' : 'receives';
          lines.push(`  Party A ${action}: $${Math.abs(obligationsA.netObligation).toFixed(2)}/month`);
        }
        if (obligationsB.netObligation !== 0) {
          const action = obligationsB.netObligation > 0 ? 'pays' : 'receives';
          lines.push(`  Party B ${action}: $${Math.abs(obligationsB.netObligation).toFixed(2)}/month`);
        }
        lines.push('');
      }
    }
    
    lines.push('FAIRNESS ANALYSIS:');
    lines.push(`  Equity Score: ${analysis.equityScore.toFixed(1)}/100`);
    lines.push(`  Deviation from Equal: ${analysis.deviationFromEqual.toFixed(1)} percentage points`);
    lines.push(`  Wisconsin Compliance: ${analysis.isCompliant ? '✅ Compliant' : '⚠️ Issues found'}`);
    lines.push('');
    
    if (analysis.errors.length > 0) {
      lines.push('❌ ERRORS:');
      analysis.errors.forEach(error => lines.push(`  - ${error}`));
      lines.push('');
    }
    
    if (analysis.warnings.length > 0) {
      lines.push('⚠️  WARNINGS:');
      analysis.warnings.forEach(warning => lines.push(`  - ${warning}`));
      lines.push('');
    }
    
    if (analysis.suggestions.length > 0) {
      lines.push('💡 SUGGESTIONS:');
      analysis.suggestions.forEach(suggestion => lines.push(`  - ${suggestion}`));
      lines.push('');
    }
    
    lines.push('AGREEMENT PROGRESS:');
    lines.push(`  Party A: ${state.agreementPointsA}/100 points`);
    lines.push(`  Party B: ${state.agreementPointsB}/100 points`);
    
    if (state.agreementPointsA >= 100 && state.agreementPointsB >= 100) {
      lines.push('\n✅ Both parties ready to finalize agreement!');
    }
    
    return lines.join('\n');
  }
}

// ============================================================================
// EXAMPLE USAGE / TESTING
// ============================================================================

if (require.main === module) {
  // Example settlement scenario
  const exampleState: SettlementState = {
    partyA: {
      partyId: 'A',
      partyName: 'Tyler',
      cashAssets: 25000,
      propertyValue: 200000, // keeping house
      investmentValue: 50000,
      businessValue: 0,
      personalPropertyValue: 15000,
      otherAssets: 0,
      mortgageDebt: 150000,
      consumerDebt: 5000,
      studentLoanDebt: 0,
      businessDebt: 0,
      otherDebts: 0,
      childSupportPayable: 0,
      childSupportReceivable: 0,
      spousalSupportPayable: 0,
      spousalSupportReceivable: 0,
      parentingTimePercentage: 50,
      hasLegalCustody: true,
      hasFinalDecisionAuthority: []
    },
    partyB: {
      partyId: 'B',
      partyName: 'Tiffany',
      cashAssets: 100000, // buyout from house
      propertyValue: 0,
      investmentValue: 50000,
      businessValue: 0,
      personalPropertyValue: 15000,
      otherAssets: 0,
      mortgageDebt: 0,
      consumerDebt: 5000,
      studentLoanDebt: 10000,
      businessDebt: 0,
      otherDebts: 0,
      childSupportPayable: 0,
      childSupportReceivable: 0,
      spousalSupportPayable: 0,
      spousalSupportReceivable: 0,
      parentingTimePercentage: 50,
      hasLegalCustody: true,
      hasFinalDecisionAuthority: []
    },
    totalMaritalAssets: 455000,
    totalMaritalDebts: 170000,
    netMaritalEstate: 285000,
    numberOfChildren: 1,
    childrenAges: [7],
    agreementPointsA: 75,
    agreementPointsB: 75,
    acceptedCards: ['keep-house', '50-50-placement', 'split-retirement']
  };
  
  const analysis = EquityAnalyzer.analyze(exampleState);
  const summary = EquityAnalyzer.generateSummary(exampleState, analysis);
  
  console.log(summary);
  console.log('\n--- CHILD SUPPORT CALCULATION ---');
  
  const childSupport = calculateChildSupport(
    80000, // payor income
    50000, // payee income
    1,     // number of children
    50,    // shared placement (50/50)
    200,   // health insurance
    500    // childcare
  );
  
  console.log(`Guideline percentage: ${(childSupport.guidelinePercentage * 100).toFixed(1)}%`);
  console.log(`Guideline amount: $${childSupport.guidelineAmount.toFixed(2)}/month`);
  console.log(`Shared placement credit: -$${childSupport.sharedPlacementCredit.toFixed(2)}/month`);
  console.log(`Healthcare/childcare add-on: +$${(childSupport.healthInsuranceCost + childSupport.childcareCost).toFixed(2)}/month`);
  console.log(`Final child support: $${childSupport.finalAmount.toFixed(2)}/month`);
}

export default EquityAnalyzer;
