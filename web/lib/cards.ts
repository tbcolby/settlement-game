/**
 * Settlement Game - Card Library
 * All settlement cards as structured data
 * Based on docs/CARD_LIBRARY.md
 */

import { CardDefinition } from './types';

export const SETTLEMENT_CARDS: CardDefinition[] = [
  // =========================================================================
  // ASSET DIVISION CARDS
  // =========================================================================
  
  {
    id: 'keep-house',
    category: 'asset-division',
    name: 'Keep the House',
    description: 'One party retains the marital residence',
    icon: '🏠',
    agreementPoints: 20,
    customizationFields: [
      { id: 'keepingParty', label: 'Who keeps the house?', type: 'select', options: ['A', 'B'], required: true },
      { id: 'address', label: 'Property Address', type: 'text', required: true },
      { id: 'buyoutAmount', label: 'Buyout Amount', type: 'currency', required: true, helpText: 'Amount paid to other party for their equity' },
      { id: 'refinanceTimeline', label: 'Refinance Deadline', type: 'text', required: true, placeholder: '180 days from judgment' },
    ],
    legalTemplate: 'Party {{keepingParty}} shall be awarded the marital residence located at {{address}}, subject to refinancing the existing mortgage within {{refinanceTimeline}} and paying Party {{otherParty}} a buyout amount of ${{buyoutAmount}}.',
  },
  
  {
    id: 'sell-and-split',
    category: 'asset-division',
    name: 'Sell and Split',
    description: 'House sold, proceeds divided',
    icon: '🏡',
    agreementPoints: 20,
    customizationFields: [
      { id: 'timeline', label: 'Sale Timeline', type: 'text', required: true, placeholder: '12 months' },
      { id: 'partyAPercentage', label: 'Party A Percentage', type: 'percentage', required: true, validation: { min: 0, max: 100 } },
      { id: 'partyBPercentage', label: 'Party B Percentage', type: 'percentage', required: true, validation: { min: 0, max: 100 } },
    ],
    legalTemplate: 'The marital residence shall be sold within {{timeline}}. Net proceeds shall be divided {{partyAPercentage}}% to Party A and {{partyBPercentage}}% to Party B. Parties shall share equally in costs of sale unless otherwise agreed.',
  },
  
  {
    id: 'vehicle-to-party',
    category: 'asset-division',
    name: 'Vehicle Assignment',
    description: 'Assign vehicle to specific party',
    icon: '🚗',
    agreementPoints: 5,
    customizationFields: [
      { id: 'party', label: 'Assigned to Party', type: 'select', options: ['A', 'B'], required: true },
      { id: 'year', label: 'Year', type: 'number', required: true },
      { id: 'make', label: 'Make', type: 'text', required: true },
      { id: 'model', label: 'Model', type: 'text', required: true },
      { id: 'vin', label: 'VIN (last 6 digits)', type: 'text', required: false },
      { id: 'debt', label: 'Outstanding Loan', type: 'currency', required: false },
    ],
    legalTemplate: 'Party {{party}} shall be awarded the {{year}} {{make}} {{model}}{{#if vin}}, VIN ending in {{vin}}{{/if}} free and clear of claims by the other party. Party {{party}} shall be solely responsible for any outstanding loan.',
  },
  
  {
    id: 'split-account',
    category: 'asset-division',
    name: 'Split Account 50/50',
    description: 'Bank account divided equally',
    icon: '💰',
    agreementPoints: 5,
    customizationFields: [
      { id: 'institution', label: 'Bank/Institution', type: 'text', required: true },
      { id: 'accountType', label: 'Account Type', type: 'select', options: ['Checking', 'Savings', 'Investment'], required: true },
      { id: 'lastFour', label: 'Last 4 Digits', type: 'text', required: false },
      { id: 'balance', label: 'Approximate Balance', type: 'currency', required: true },
      { id: 'timeline', label: 'Distribution Timeline', type: 'text', required: true, placeholder: '30 days' },
    ],
    legalTemplate: 'The {{institution}} {{accountType}} account{{#if lastFour}} ending in {{lastFour}}{{/if}} with an approximate balance of ${{balance}} shall be divided equally between parties within {{timeline}}.',
  },
  
  {
    id: 'qdro-split',
    category: 'asset-division',
    name: 'QDRO Split',
    description: 'Divide retirement account via QDRO',
    icon: '📈',
    agreementPoints: 15,
    customizationFields: [
      { id: 'accountOwner', label: 'Account Owner', type: 'select', options: ['A', 'B'], required: true },
      { id: 'accountType', label: 'Account Type', type: 'select', options: ['401(k)', 'IRA', 'Pension', 'Other'], required: true },
      { id: 'institution', label: 'Institution', type: 'text', required: true },
      { id: 'balance', label: 'Approximate Value', type: 'currency', required: true },
      { id: 'percentage', label: 'Percentage to Other Party', type: 'percentage', required: true, validation: { min: 0, max: 100 } },
      { id: 'qdroCost', label: 'QDRO Preparation Responsibility', type: 'select', options: ['Split 50/50', 'Party A', 'Party B'], required: true },
    ],
    legalTemplate: 'Party {{otherParty}} shall be awarded {{percentage}}% of Party {{accountOwner}}\'s {{accountType}} with {{institution}}, valued at approximately ${{balance}} as of the date of divorce. Parties shall cooperate in preparing a Qualified Domestic Relations Order. {{qdroCost}} shall be responsible for QDRO preparation costs.',
  },
  
  // =========================================================================
  // CUSTODY & PARENTING TIME CARDS
  // =========================================================================
  
  {
    id: '50-50-placement',
    category: 'custody',
    name: '50/50 Placement',
    description: 'Equal shared placement',
    icon: '👶',
    agreementPoints: 25,
    customizationFields: [
      { id: 'schedule', label: 'Weekly Schedule', type: 'textarea', required: true, placeholder: 'Week on/week off alternating Mondays at 6:00 PM' },
      { id: 'holidaySchedule', label: 'Holiday Rotation', type: 'textarea', required: true, placeholder: 'Even years - Party A: Thanksgiving, Christmas Eve. Odd years alternate.' },
      { id: 'exchangeLocation', label: 'Exchange Location', type: 'text', required: false },
    ],
    legalTemplate: 'The parties shall share placement of the minor child(ren) equally on a 50/50 basis according to the following schedule: {{schedule}}. Holidays shall rotate annually as follows: {{holidaySchedule}}.{{#if exchangeLocation}} Exchanges shall occur at {{exchangeLocation}}.{{/if}}',
  },
  
  {
    id: 'primary-placement',
    category: 'custody',
    name: 'Primary Placement',
    description: 'One party has majority placement',
    icon: '👨‍👩‍👧',
    agreementPoints: 25,
    customizationFields: [
      { id: 'primaryParty', label: 'Primary Placement With', type: 'select', options: ['A', 'B'], required: true },
      { id: 'percentage', label: 'Primary Party Percentage', type: 'percentage', required: true, validation: { min: 51, max: 100 } },
      { id: 'visitationSchedule', label: 'Other Party Visitation', type: 'textarea', required: true },
    ],
    legalTemplate: 'Party {{primaryParty}} shall have primary placement with {{percentage}}% of the time. Party {{otherParty}} shall have placement according to the following schedule: {{visitationSchedule}}.',
  },
  
  {
    id: 'joint-legal-custody',
    category: 'custody',
    name: 'Joint Legal Custody',
    description: 'Both parties share major decisions',
    icon: '⚖️',
    agreementPoints: 10,
    customizationFields: [
      { id: 'tieBreaker', label: 'Tie-Breaking Mechanism', type: 'text', required: true, placeholder: 'mediation, arbitration, court decision' },
    ],
    legalTemplate: 'The parties shall share joint legal custody, making major decisions regarding the child(ren)\'s education, health care, and religious upbringing jointly. In the event of disagreement, {{tieBreaker}}.',
  },
  
  // =========================================================================
  // SUPPORT CARDS
  // =========================================================================
  
  {
    id: 'child-support-guidelines',
    category: 'support',
    name: 'Child Support Per Guidelines',
    description: 'Standard Wisconsin child support calculation',
    icon: '💳',
    agreementPoints: 15,
    customizationFields: [
      { id: 'payor', label: 'Paying Party', type: 'select', options: ['A', 'B'], required: true },
      { id: 'amount', label: 'Monthly Amount', type: 'currency', required: true, helpText: 'Calculated per WI §49.22' },
      { id: 'percentage', label: 'Percentage of Income', type: 'percentage', required: true },
      { id: 'paymentMethod', label: 'Payment Method', type: 'select', options: ['Direct deposit', 'Wisconsin Support Collections Trust Fund', 'Other'], required: true },
    ],
    legalTemplate: 'Party {{payor}} shall pay child support to Party {{payee}} in the amount of ${{amount}} per month, representing {{percentage}}% of income pursuant to Wisconsin Child Support Guidelines §49.22. Payment shall be made via {{paymentMethod}}. Support shall continue until the child graduates high school or turns 19, whichever occurs first.',
  },
  
  {
    id: 'no-spousal-support',
    category: 'support',
    name: 'No Spousal Support',
    description: 'Waive maintenance entirely',
    icon: '🚫',
    agreementPoints: 10,
    customizationFields: [],
    legalTemplate: 'Neither party shall pay maintenance to the other, now or in the future. Each party waives any right to maintenance from the other permanently.',
  },
  
  {
    id: 'spousal-maintenance',
    category: 'support',
    name: 'Spousal Maintenance',
    description: 'One party pays maintenance to other',
    icon: '💵',
    agreementPoints: 15,
    customizationFields: [
      { id: 'payor', label: 'Paying Party', type: 'select', options: ['A', 'B'], required: true },
      { id: 'amount', label: 'Monthly Amount', type: 'currency', required: true },
      { id: 'duration', label: 'Duration', type: 'text', required: true, placeholder: '36 months, indefinite, until remarriage' },
      { id: 'modifiable', label: 'Modifiable?', type: 'select', options: ['Yes', 'No'], required: true },
    ],
    legalTemplate: 'Party {{payor}} shall pay maintenance to Party {{payee}} in the amount of ${{amount}} per month for {{duration}}. Maintenance shall {{#if modifiable}}be modifiable upon a substantial change in circumstances{{else}}not be modifiable{{/if}}.',
  },
  
  // =========================================================================
  // DEBT CARDS
  // =========================================================================
  
  {
    id: 'split-debt-50-50',
    category: 'debt',
    name: 'Split Debt 50/50',
    description: 'Debt divided equally',
    icon: '💸',
    agreementPoints: 5,
    customizationFields: [
      { id: 'debtDescription', label: 'Debt Description', type: 'text', required: true, placeholder: 'Chase credit card ending in 1234' },
      { id: 'amount', label: 'Balance', type: 'currency', required: true },
    ],
    legalTemplate: 'The {{debtDescription}} with an approximate balance of ${{amount}} shall be the joint responsibility of the parties, with each party paying 50%. Each party shall indemnify and hold harmless the other from their respective share.',
  },
  
  {
    id: 'debt-to-incurring-party',
    category: 'debt',
    name: 'Debt to Party Who Incurred It',
    description: 'Party responsible for their own debt',
    icon: '📝',
    agreementPoints: 5,
    customizationFields: [
      { id: 'responsibleParty', label: 'Responsible Party', type: 'select', options: ['A', 'B'], required: true },
      { id: 'debtDescription', label: 'Debt Description', type: 'text', required: true },
      { id: 'amount', label: 'Balance', type: 'currency', required: true },
    ],
    legalTemplate: 'Party {{responsibleParty}} shall be solely responsible for {{debtDescription}} with a balance of approximately ${{amount}}. Party {{responsibleParty}} shall indemnify and hold harmless Party {{otherParty}} from any claims related to this debt.',
  },
  
  // =========================================================================
  // PROPERTY RIGHTS CARDS
  // =========================================================================
  
  {
    id: 'personal-property-current',
    category: 'property',
    name: 'Personal Property to Current Possessor',
    description: 'Each keeps what they have',
    icon: '📦',
    agreementPoints: 5,
    customizationFields: [
      { id: 'exceptions', label: 'Exceptions', type: 'textarea', required: false, placeholder: 'List any specific items handled differently' },
    ],
    legalTemplate: 'Each party shall retain the personal property currently in their possession, free from claims by the other party{{#if exceptions}}, except as follows: {{exceptions}}{{/if}}.',
  },
  
  {
    id: 'specific-item-assignment',
    category: 'property',
    name: 'Specific Item Assignment',
    description: 'Assign specific item to one party',
    icon: '🎁',
    agreementPoints: 2,
    customizationFields: [
      { id: 'party', label: 'Assigned to Party', type: 'select', options: ['A', 'B'], required: true },
      { id: 'itemDescription', label: 'Item Description', type: 'text', required: true },
      { id: 'value', label: 'Appraised Value', type: 'currency', required: false },
      { id: 'justification', label: 'Reason/Justification', type: 'textarea', required: false },
    ],
    legalTemplate: 'Party {{party}} shall be awarded {{itemDescription}}{{#if value}}, valued at approximately ${{value}}{{/if}}.{{#if justification}} {{justification}}{{/if}}',
  },
  
  // =========================================================================
  // FUTURE OBLIGATION CARDS
  // =========================================================================
  
  {
    id: 'health-insurance',
    category: 'future-obligation',
    name: 'Health Insurance Responsibility',
    description: 'Who provides insurance and how costs split',
    icon: '🏥',
    agreementPoints: 10,
    customizationFields: [
      { id: 'provider', label: 'Insurance Provider', type: 'select', options: ['A', 'B'], required: true },
      { id: 'uncoveredSplit', label: 'Uncovered Expenses Split', type: 'text', required: true, placeholder: '50/50, 60/40' },
      { id: 'receiptDays', label: 'Receipt Submission Days', type: 'number', required: true, validation: { min: 1, max: 90 } },
    ],
    legalTemplate: 'Party {{provider}} shall maintain health insurance for the minor child(ren) as long as available through employment at reasonable cost. Uninsured medical, dental, and vision expenses shall be divided {{uncoveredSplit}} between the parties. Each party shall provide receipts to the other within {{receiptDays}} days.',
  },
  
  {
    id: 'college-expenses',
    category: 'future-obligation',
    name: 'College Expenses',
    description: 'How post-secondary education costs are shared',
    icon: '🎓',
    agreementPoints: 10,
    customizationFields: [
      { id: 'partyASplit', label: 'Party A Percentage', type: 'percentage', required: true, validation: { min: 0, max: 100 } },
      { id: 'partyBSplit', label: 'Party B Percentage', type: 'percentage', required: true, validation: { min: 0, max: 100 } },
      { id: 'maxPerYear', label: 'Max Per Year Per Child', type: 'currency', required: false },
      { id: 'gpaRequirement', label: 'GPA Requirement', type: 'text', required: false, placeholder: '2.5' },
    ],
    legalTemplate: 'The parties shall contribute to the child(ren)\'s post-secondary education expenses as follows: Party A {{partyASplit}}%, Party B {{partyBSplit}}%. Covered expenses include tuition, room, board, books, and mandatory fees for up to 4 years of undergraduate education.{{#if maxPerYear}} Contributions shall not exceed ${{maxPerYear}} per year per child.{{/if}}{{#if gpaRequirement}} The child must maintain a {{gpaRequirement}} GPA.{{/if}}',
  },
  
  {
    id: 'cooperate-taxes',
    category: 'future-obligation',
    name: 'Tax Cooperation',
    description: 'How tax filing and refunds/liabilities handled',
    icon: '📋',
    agreementPoints: 5,
    customizationFields: [
      { id: 'dependentParty', label: 'Who Claims Dependent(s)?', type: 'select', options: ['A', 'B', 'Alternate years'], required: true },
      { id: 'refundSplit', label: 'Joint Refund/Liability Split', type: 'text', required: true, placeholder: '50/50' },
    ],
    legalTemplate: 'The parties shall cooperate in the preparation and filing of all necessary tax returns. {{#if dependentParty}}Party {{dependentParty}} shall claim the child(ren) as dependents for tax purposes.{{/if}} Any tax refunds or liabilities for joint returns shall be divided {{refundSplit}}. Each party shall provide the other access to all necessary tax documents within 30 days of request.',
  },
  
  {
    id: 'extracurricular-activities',
    category: 'future-obligation',
    name: 'Extracurricular Activities',
    description: 'How activity costs are shared',
    icon: '⚽',
    agreementPoints: 5,
    customizationFields: [
      { id: 'split', label: 'Cost Split', type: 'text', required: true, placeholder: '50/50, 60/40' },
      { id: 'approvalThreshold', label: 'Requires Mutual Approval Over', type: 'currency', required: false },
    ],
    legalTemplate: 'The parties shall share the cost of the child(ren)\'s extracurricular activities {{split}}.{{#if approvalThreshold}} Both parties must agree in advance to activities costing more than ${{approvalThreshold}}.{{/if}} Each party shall provide receipts to the other within 30 days.',
  },
  
  // =========================================================================
  // SPECIAL CIRCUMSTANCE CARDS
  // =========================================================================
  
  {
    id: 'name-change',
    category: 'special',
    name: 'Name Change Provision',
    description: 'Rights regarding name changes',
    icon: '✍️',
    agreementPoints: 2,
    customizationFields: [
      { id: 'party', label: 'Party Resuming Former Name', type: 'select', options: ['A', 'B', 'Neither'], required: false },
      { id: 'formerName', label: 'Former Name', type: 'text', required: false },
    ],
    legalTemplate: '{{#if party}}Party {{party}} shall have the right to resume use of their former name: {{formerName}}.{{/if}} Neither party shall change the child(ren)\'s surname without written consent of the other party or court order.',
  },
  
  {
    id: 'life-insurance',
    category: 'special',
    name: 'Life Insurance Requirement',
    description: 'Obligor must maintain life insurance',
    icon: '🛡️',
    agreementPoints: 10,
    customizationFields: [
      { id: 'obligor', label: 'Party Required to Maintain', type: 'select', options: ['A', 'B'], required: true },
      { id: 'amount', label: 'Coverage Amount', type: 'currency', required: true },
      { id: 'beneficiary', label: 'Beneficiary', type: 'text', required: true, placeholder: 'Children as irrevocable beneficiaries' },
      { id: 'duration', label: 'Duration', type: 'text', required: true, placeholder: 'Until youngest child turns 18' },
    ],
    legalTemplate: 'Party {{obligor}} shall maintain life insurance in the amount of ${{amount}} with {{beneficiary}} until {{duration}}. Party {{obligor}} shall provide proof of coverage annually.',
  },
  
  // =========================================================================
  // META-CARDS (GAME MECHANICS)
  // =========================================================================
  
  {
    id: 'equity-check',
    category: 'meta',
    name: 'Equity Check',
    description: 'View current settlement fairness',
    icon: '📊',
    agreementPoints: 0,
    customizationFields: [],
    legalTemplate: '', // No legal output
  },
  
  {
    id: 'finalize-agreement',
    category: 'meta',
    name: 'Finalize Agreement',
    description: 'End game and generate MSA',
    icon: '✅',
    agreementPoints: 0, // Requires 100 from both
    customizationFields: [],
    legalTemplate: '', // Triggers document generation
  },
];

// Helper functions
export function getCardById(id: string): CardDefinition | undefined {
  return SETTLEMENT_CARDS.find(card => card.id === id);
}

export function getCardsByCategory(category: string): CardDefinition[] {
  return SETTLEMENT_CARDS.filter(card => card.category === category);
}

export function getAllCategories(): string[] {
  return Array.from(new Set(SETTLEMENT_CARDS.map(card => card.category)));
}
