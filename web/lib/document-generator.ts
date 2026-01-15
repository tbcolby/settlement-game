/**
 * Settlement Game - Legal Document Generator
 * 
 * Converts played cards into Wisconsin-compliant Marital Settlement Agreement
 * Generates properly formatted legal documents ready for court filing
 * 
 * @version 1.0.0
 * @created 2026-01-14
 */

import { SettlementState, EquityAnalysis } from './financial-engine';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface PlayedCard {
  cardId: string;
  category: string;
  name: string;
  customValues: Record<string, any>;
  playedBy: 'A' | 'B';
  acceptedBy: 'A' | 'B' | 'both';
  timestamp: Date;
}

export interface MaritalSettlementAgreement {
  // Header info
  county: string;
  caseNumber?: string;
  partyAName: string;
  partyBName: string;
  marriageDate: Date;
  separationDate?: Date;
  
  // Children
  children: Array<{
    name: string;
    birthdate: Date;
  }>;
  
  // Played cards organized by category
  assetDivisionCards: PlayedCard[];
  custodyCards: PlayedCard[];
  supportCards: PlayedCard[];
  debtCards: PlayedCard[];
  propertyCards: PlayedCard[];
  futureObligationCards: PlayedCard[];
  specialCards: PlayedCard[];
  
  // Analysis
  equityAnalysis: EquityAnalysis;
  
  // Generation metadata
  generatedDate: Date;
  version: string;
}

// ============================================================================
// DOCUMENT TEMPLATES
// ============================================================================

class DocumentTemplates {
  
  /**
   * Main MSA header
   */
  static header(msa: MaritalSettlementAgreement): string {
    return `
STATE OF WISCONSIN                                   CIRCUIT COURT                              ${msa.county.toUpperCase()} COUNTY

${msa.partyAName},
    Petitioner,
                                                     Case No. ${msa.caseNumber || '______________'}
vs.

${msa.partyBName},
    Respondent.


                              MARITAL SETTLEMENT AGREEMENT


    The parties to this action, ${msa.partyAName} ("Party A") and ${msa.partyBName} ("Party B"), 
were married on ${this.formatDate(msa.marriageDate)}${msa.separationDate ? ` and separated on ${this.formatDate(msa.separationDate)}` : ''}. 
${msa.children.length > 0 ? `There ${msa.children.length === 1 ? 'is' : 'are'} ${msa.children.length} minor child${msa.children.length === 1 ? '' : 'ren'} of this marriage:` : 'There are no minor children of this marriage.'}
${msa.children.map(child => `    ${child.name}, born ${this.formatDate(child.birthdate)}`).join('\n')}

    The parties have reached a complete agreement regarding all matters related to the dissolution of their 
marriage and submit this Marital Settlement Agreement for the Court's approval.

    NOW, THEREFORE, in consideration of the mutual promises and covenants contained herein, and for other 
good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the parties 
agree as follows:

`;
  }

  /**
   * Custody and placement section
   */
  static custodySection(cards: PlayedCard[]): string {
    if (cards.length === 0) {
      return `
ARTICLE I - CUSTODY AND PLACEMENT

    The parties have no minor children.

`;
    }

    let section = `
ARTICLE I - CUSTODY AND PLACEMENT

`;

    cards.forEach((card, index) => {
      section += `    ${index + 1}. ${this.cardToLegalLanguage(card)}\n\n`;
    });

    return section;
  }

  /**
   * Child support section
   */
  static supportSection(cards: PlayedCard[]): string {
    if (cards.length === 0) {
      return `
ARTICLE II - CHILD SUPPORT AND MAINTENANCE

    No child support or maintenance is payable by either party.

`;
    }

    let section = `
ARTICLE II - CHILD SUPPORT AND MAINTENANCE

`;

    cards.forEach((card, index) => {
      section += `    ${index + 1}. ${this.cardToLegalLanguage(card)}\n\n`;
    });

    return section;
  }

  /**
   * Property division section
   */
  static propertySection(assetCards: PlayedCard[], propertyCards: PlayedCard[]): string {
    let section = `
ARTICLE III - DIVISION OF PROPERTY

`;

    const allPropertyCards = [...assetCards, ...propertyCards];
    
    if (allPropertyCards.length === 0) {
      section += `    The parties have divided all marital property to their mutual satisfaction.\n\n`;
    } else {
      allPropertyCards.forEach((card, index) => {
        section += `    ${index + 1}. ${this.cardToLegalLanguage(card)}\n\n`;
      });
    }

    return section;
  }

  /**
   * Debt division section
   */
  static debtSection(cards: PlayedCard[]): string {
    if (cards.length === 0) {
      return `
ARTICLE IV - DIVISION OF DEBTS

    The parties have no marital debts, or have divided all marital debts to their mutual satisfaction.

`;
    }

    let section = `
ARTICLE IV - DIVISION OF DEBTS

`;

    cards.forEach((card, index) => {
      section += `    ${index + 1}. ${this.cardToLegalLanguage(card)}\n\n`;
    });

    return section;
  }

  /**
   * Future obligations section
   */
  static futureObligationsSection(cards: PlayedCard[]): string {
    if (cards.length === 0) {
      return '';
    }

    let section = `
ARTICLE V - FUTURE OBLIGATIONS

`;

    cards.forEach((card, index) => {
      section += `    ${index + 1}. ${this.cardToLegalLanguage(card)}\n\n`;
    });

    return section;
  }

  /**
   * Special provisions section
   */
  static specialProvisionsSection(cards: PlayedCard[]): string {
    if (cards.length === 0) {
      return '';
    }

    let section = `
ARTICLE VI - SPECIAL PROVISIONS

`;

    cards.forEach((card, index) => {
      section += `    ${index + 1}. ${this.cardToLegalLanguage(card)}\n\n`;
    });

    return section;
  }

  /**
   * Standard boilerplate provisions
   */
  static boilerplate(msa: MaritalSettlementAgreement): string {
    const articleNumber = this.getNextArticleNumber(msa);
    
    return `
ARTICLE ${this.romanNumeral(articleNumber)} - GENERAL PROVISIONS

    1. Mutual Release. Except as specifically provided in this Agreement, each party releases and discharges 
the other from any and all claims, demands, and obligations arising out of the marriage.

    2. Waiver of Inheritance Rights. Each party waives all rights to inherit from the other's estate under 
the laws of intestacy or as a surviving spouse, and agrees to execute any documents necessary to effectuate 
this waiver.

    3. Name Change. ${this.getNameChangeProvision(msa)}

    4. Tax Returns. The parties shall cooperate in the preparation and filing of all tax returns. Each party 
shall be responsible for any taxes, interest, and penalties arising from income attributable to that party.

    5. Disclosure. Each party represents that they have made full and complete disclosure of all assets, 
debts, income, and expenses to the other party.

    6. Voluntary Agreement. Each party enters into this Agreement freely and voluntarily, with full 
understanding of its terms and legal effect.

    7. Legal Advice. Each party acknowledges the opportunity to consult with legal counsel regarding this 
Agreement, or voluntarily waives that right.

    8. Binding Effect. This Agreement shall be binding upon the parties and their respective heirs, 
executors, administrators, and assigns.

    9. Modification. This Agreement may be modified only by a written document signed by both parties, 
except that provisions regarding child custody, placement, and support shall remain subject to court 
jurisdiction and modification as provided by law.

    10. Governing Law. This Agreement shall be governed by and construed in accordance with the laws of 
the State of Wisconsin.

    11. Severability. If any provision of this Agreement is held to be invalid or unenforceable, the 
remaining provisions shall continue in full force and effect.

    12. Entire Agreement. This Agreement constitutes the entire agreement between the parties concerning 
the subject matter hereof and supersedes all prior negotiations, understandings, and agreements.

    13. Incorporation into Judgment. The parties request that this Agreement be incorporated into any 
Judgment of Divorce entered by the Court, and that the Court retain jurisdiction to enforce its terms.

`;
  }

  /**
   * Signature block
   */
  static signatureBlock(msa: MaritalSettlementAgreement): string {
    return `

    IN WITNESS WHEREOF, the parties have executed this Marital Settlement Agreement on the date(s) 
indicated below.


_____________________________                    Date: ______________
${msa.partyAName}
Party A


_____________________________                    Date: ______________
${msa.partyBName}
Party B


ATTORNEY FOR PARTY A:

_____________________________                    Date: ______________
[Attorney Name]
[Attorney Address]
[Bar Number]


ATTORNEY FOR PARTY B:

_____________________________                    Date: ______________
[Attorney Name]
[Attorney Address]
[Bar Number]


---

---

⚖️ LEGAL DISCLAIMER - MUST READ

This is a DRAFT document generated by Settlement Game v${msa.version} on ${this.formatDate(msa.generatedDate)}.

IMPORTANT: This document MUST be reviewed by qualified legal counsel before filing with any court.
Settlement Game provides templates and calculations but does NOT provide legal advice.
Both parties should have independent attorney representation.

Based on Wisconsin law as of January 2026. Laws change - verify current requirements.
The authors assume no liability for any legal consequences resulting from use of this document.

Co-Authored-By: Warp <agent@warp.dev>

For full disclaimer, see: https://github.com/tbcolby/settlement-game/blob/main/DISCLAIMER.md
`;
  }

  /**
   * Convert card to legal language
   */
  private static cardToLegalLanguage(card: PlayedCard): string {
    // In a full implementation, this would use the legalTemplate from each card definition
    // For now, return a placeholder that shows the card name and custom values
    
    const values = card.customValues;
    let text = '';

    // Map card IDs to their legal templates
    switch (card.cardId) {
      case 'keep-house':
        text = `Party ${values.keepingParty || 'A'} shall be awarded the marital residence located at ${values.address || '[ADDRESS]'}, ` +
               `subject to refinancing the existing mortgage within ${values.refinanceTimeline || '[TIMELINE]'} and ` +
               `paying Party ${values.otherParty || 'B'} a buyout amount of $${values.buyoutAmount?.toLocaleString() || '[AMOUNT]'}.`;
        break;

      case 'sell-and-split':
        text = `The marital residence shall be sold within ${values.timeline || '[TIMELINE]'}. Net proceeds shall be ` +
               `divided ${values.partyAPercentage || 50}% to Party A and ${values.partyBPercentage || 50}% to Party B. ` +
               `Parties shall share equally in costs of sale unless otherwise agreed.`;
        break;

      case '50-50-placement':
        text = `The parties shall share placement of the minor child(ren) equally on a 50/50 basis according to ` +
               `the following schedule: ${values.schedule || '[DETAILED SCHEDULE]'}. Holidays shall rotate annually as follows: ${values.holidaySchedule || '[HOLIDAY SCHEDULE]'}.`;
        break;

      case 'joint-legal-custody':
        text = `The parties shall share joint legal custody, making major decisions regarding the child(ren)'s ` +
               `education, health care, and religious upbringing jointly. In the event of disagreement, ${values.tieBreaker || '[TIE-BREAKING MECHANISM]'}.`;
        break;

      case 'child-support-guidelines':
        text = `Party ${values.payor || '[PAYOR]'} shall pay child support to Party ${values.payee || '[PAYEE]'} ` +
               `in the amount of $${values.amount?.toLocaleString() || '[AMOUNT]'} per month, representing ` +
               `${values.percentage || '[X]'}% of income pursuant to Wisconsin Child Support Guidelines §49.22. ` +
               `Payment shall be made via ${values.paymentMethod || '[METHOD]'}. Support shall continue until the ` +
               `child graduates high school or turns 19, whichever occurs first.`;
        break;

      case 'no-spousal-support':
        text = `Neither party shall pay maintenance to the other, now or in the future. Each party waives any ` +
               `right to maintenance from the other permanently.`;
        break;

      case 'split-debt-50-50':
        text = `The ${values.debtDescription || '[DEBT DESCRIPTION]'} with an approximate balance of ` +
               `$${values.amount?.toLocaleString() || '[AMOUNT]'} shall be the joint responsibility of the parties, ` +
               `with each party paying 50%. Each party shall indemnify and hold harmless the other from their respective share.`;
        break;

      case 'personal-property-current':
        text = `Each party shall retain the personal property currently in their possession, free from claims by ` +
               `the other party${values.exceptions ? `, except as follows: ${values.exceptions}` : ''}.`;
        break;

      case 'cooperate-taxes':
        text = `The parties shall cooperate in the preparation and filing of all necessary tax returns. ` +
               `${values.dependentParty ? `Party ${values.dependentParty} shall claim the child(ren) as dependents for tax purposes ${values.conditions || ''}.` : ''} ` +
               `Any tax refunds or liabilities for joint returns shall be divided ${values.split || '50/50'}. ` +
               `Each party shall provide the other access to all necessary tax documents within ${values.timeline || '30 days'} of request.`;
        break;

      case 'health-insurance':
        text = `Party ${values.provider || '[X]'} shall maintain health insurance for the minor child(ren) as long as ` +
               `available through employment at reasonable cost. Uninsured medical, dental, and vision expenses shall be ` +
               `divided ${values.split || '50/50'} between the parties. Each party shall provide receipts to the other within ` +
               `${values.days || '30'} days.`;
        break;

      default:
        // Generic fallback
        text = `${card.name}: ${JSON.stringify(values, null, 2)}`;
    }

    return text;
  }

  /**
   * Helper: Get next article number
   */
  private static getNextArticleNumber(msa: MaritalSettlementAgreement): number {
    let count = 1; // Start with ARTICLE I
    
    if (msa.custodyCards.length > 0 || msa.children.length > 0) count++;
    if (msa.supportCards.length > 0) count++;
    count++; // Property division always present
    count++; // Debt division always present
    if (msa.futureObligationCards.length > 0) count++;
    if (msa.specialCards.length > 0) count++;
    
    return count;
  }

  /**
   * Helper: Get name change provision
   */
  private static getNameChangeProvision(msa: MaritalSettlementAgreement): string {
    // This would be customizable based on played cards
    return `Either party may resume use of their former name. Neither party shall change the child(ren)'s surname without written consent of the other party or court order.`;
  }

  /**
   * Helper: Convert number to Roman numeral
   */
  private static romanNumeral(num: number): string {
    const values = [
      ['X', 10], ['IX', 9], ['V', 5], ['IV', 4], ['I', 1]
    ] as const;
    
    let result = '';
    let remaining = num;
    
    for (const [roman, value] of values) {
      while (remaining >= value) {
        result += roman;
        remaining -= value;
      }
    }
    
    return result;
  }

  /**
   * Helper: Format date
   */
  private static formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
}

// ============================================================================
// DOCUMENT GENERATOR
// ============================================================================

export class DocumentGenerator {
  
  /**
   * Generate complete MSA document
   */
  static generate(msa: MaritalSettlementAgreement): string {
    let document = '';
    
    // Header
    document += DocumentTemplates.header(msa);
    
    // Article I - Custody and Placement
    document += DocumentTemplates.custodySection(msa.custodyCards);
    
    // Article II - Child Support and Maintenance
    document += DocumentTemplates.supportSection(msa.supportCards);
    
    // Article III - Division of Property
    document += DocumentTemplates.propertySection(msa.assetDivisionCards, msa.propertyCards);
    
    // Article IV - Division of Debts
    document += DocumentTemplates.debtSection(msa.debtCards);
    
    // Article V - Future Obligations (if any)
    if (msa.futureObligationCards.length > 0) {
      document += DocumentTemplates.futureObligationsSection(msa.futureObligationCards);
    }
    
    // Article VI - Special Provisions (if any)
    if (msa.specialCards.length > 0) {
      document += DocumentTemplates.specialProvisionsSection(msa.specialCards);
    }
    
    // Final Article - General Provisions (boilerplate)
    document += DocumentTemplates.boilerplate(msa);
    
    // Signature block
    document += DocumentTemplates.signatureBlock(msa);
    
    return document;
  }

  /**
   * Generate summary cover sheet
   */
  static generateSummary(msa: MaritalSettlementAgreement): string {
    const analysis = msa.equityAnalysis;
    
    return `
MARITAL SETTLEMENT AGREEMENT SUMMARY
${msa.partyAName} vs. ${msa.partyBName}
Case No. ${msa.caseNumber || 'TBD'}
Generated: ${DocumentTemplates['formatDate'](msa.generatedDate)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FINANCIAL SUMMARY

Party A Receives:
  • Assets: $${analysis.partyAAssets.toLocaleString()}
  • Debts: $${analysis.partyADebts.toLocaleString()}
  • Net: $${analysis.partyANetWorth.toLocaleString()} (${analysis.partyAPercentage.toFixed(1)}%)

Party B Receives:
  • Assets: $${analysis.partyBAssets.toLocaleString()}
  • Debts: $${analysis.partyBDebts.toLocaleString()}
  • Net: $${analysis.partyBNetWorth.toLocaleString()} (${analysis.partyBPercentage.toFixed(1)}%)

Equity Score: ${analysis.equityScore.toFixed(1)}/100
Wisconsin Compliance: ${analysis.isCompliant ? '✅ COMPLIANT' : '⚠️ ISSUES FOUND'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

KEY TERMS

${msa.custodyCards.length > 0 ? `Custody: ${msa.custodyCards.length} provision(s)` : 'No custody provisions'}
${msa.supportCards.length > 0 ? `Support: ${msa.supportCards.length} provision(s)` : 'No support provisions'}
Property Division: ${msa.assetDivisionCards.length + msa.propertyCards.length} provision(s)
Debt Division: ${msa.debtCards.length} provision(s)
${msa.futureObligationCards.length > 0 ? `Future Obligations: ${msa.futureObligationCards.length} provision(s)` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${analysis.errors.length > 0 ? `
ERRORS REQUIRING ATTENTION:
${analysis.errors.map(e => `  ❌ ${e}`).join('\n')}
` : ''}

${analysis.warnings.length > 0 ? `
WARNINGS:
${analysis.warnings.map(w => `  ⚠️  ${w}`).join('\n')}
` : ''}

${analysis.suggestions.length > 0 ? `
SUGGESTIONS:
${analysis.suggestions.map(s => `  💡 ${s}`).join('\n')}
` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

IMPORTANT NOTICES:

⚖️  This document was generated through Settlement Game, a collaborative
   divorce settlement tool. It MUST be reviewed by qualified legal counsel
   before filing with the court.

📋 Both parties should have independent legal representation review this
   agreement to ensure their rights and interests are protected.

✍️  This is a draft document. Signatures are not valid until reviewed by
   attorneys and properly executed.

🏛️  Filing with ${msa.county} County Circuit Court requires additional
   forms and procedures. Consult with your attorney.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Generated by Settlement Game v${msa.version}
Co-Authored-By: Warp <agent@warp.dev>
IP Rights: 50% Tyler Colby, 50% [Negotiation Pending]
`;
  }

  /**
   * Export to formats
   */
  static exportToText(msa: MaritalSettlementAgreement): string {
    return this.generate(msa);
  }

  static exportToMarkdown(msa: MaritalSettlementAgreement): string {
    // Convert legal document to markdown formatting
    return this.generate(msa)
      .replace(/^([A-Z][A-Z\s]+)$/gm, '## $1')  // Article headers
      .replace(/^    (\d+\. )/gm, '\n**$1**');   // Numbered provisions
  }

  static exportToHTML(msa: MaritalSettlementAgreement): string {
    const text = this.generate(msa);
    
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Marital Settlement Agreement - ${msa.partyAName} vs ${msa.partyBName}</title>
  <style>
    body {
      font-family: 'Times New Roman', serif;
      font-size: 12pt;
      line-height: 1.8;
      max-width: 8.5in;
      margin: 1in auto;
      padding: 0 0.5in;
    }
    h1, h2 {
      font-size: 12pt;
      font-weight: bold;
      text-align: center;
      margin: 1em 0;
    }
    p {
      text-align: justify;
      text-indent: 0.5in;
      margin: 0.5em 0;
    }
    .signature-block {
      margin-top: 2in;
      page-break-inside: avoid;
    }
    .signature-line {
      border-top: 1px solid black;
      width: 3in;
      margin: 1em 0 0.5em 0;
    }
    @media print {
      body {
        margin: 0.5in;
      }
    }
  </style>
</head>
<body>
  <pre>${text.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
</body>
</html>`;
  }
}

// ============================================================================
// EXAMPLE USAGE
// ============================================================================

if (require.main === module) {
  // Example MSA generation
  const exampleMSA: MaritalSettlementAgreement = {
    county: 'Milwaukee',
    caseNumber: '2026FA000123',
    partyAName: 'Tyler Colby',
    partyBName: 'Tiffany [Last Name]',
    marriageDate: new Date('2015-06-15'),
    separationDate: new Date('2024-11-01'),
    children: [
      {
        name: 'Maelee Drew Colby',
        birthdate: new Date('2017-08-22')
      }
    ],
    assetDivisionCards: [
      {
        cardId: 'keep-house',
        category: 'Asset Division',
        name: 'Keep the House',
        customValues: {
          keepingParty: 'A',
          otherParty: 'B',
          address: '123 Main Street, South Milwaukee, WI 53172',
          buyoutAmount: 100000,
          refinanceTimeline: '180 days from date of Judgment'
        },
        playedBy: 'A',
        acceptedBy: 'both',
        timestamp: new Date()
      }
    ],
    custodyCards: [
      {
        cardId: '50-50-placement',
        category: 'Custody',
        name: '50/50 Placement',
        customValues: {
          schedule: 'Week on/week off alternating Mondays at 6:00 PM',
          holidaySchedule: 'Even years - Party A: Thanksgiving, Christmas Eve; Party B: Christmas Day, Spring Break. Odd years alternate.'
        },
        playedBy: 'B',
        acceptedBy: 'both',
        timestamp: new Date()
      },
      {
        cardId: 'joint-legal-custody',
        category: 'Custody',
        name: 'Joint Legal Custody',
        customValues: {
          tieBreaker: 'the parties shall engage in mediation'
        },
        playedBy: 'A',
        acceptedBy: 'both',
        timestamp: new Date()
      }
    ],
    supportCards: [],
    debtCards: [
      {
        cardId: 'split-debt-50-50',
        category: 'Debt Division',
        name: 'Split Debt 50/50',
        customValues: {
          debtDescription: 'Chase credit card ending in 1234',
          amount: 8000
        },
        playedBy: 'A',
        acceptedBy: 'both',
        timestamp: new Date()
      }
    ],
    propertyCards: [
      {
        cardId: 'personal-property-current',
        category: 'Property Rights',
        name: 'Personal Property to Current Possessor',
        customValues: {},
        playedBy: 'B',
        acceptedBy: 'both',
        timestamp: new Date()
      }
    ],
    futureObligationCards: [
      {
        cardId: 'health-insurance',
        category: 'Future Obligation',
        name: 'Health Insurance Responsibility',
        customValues: {
          provider: 'A',
          split: '50/50',
          days: 30
        },
        playedBy: 'A',
        acceptedBy: 'both',
        timestamp: new Date()
      }
    ],
    specialCards: [],
    equityAnalysis: {
      partyAAssets: 290000,
      partyBAssets: 165000,
      partyADebts: 155000,
      partyBDebts: 15000,
      partyANetWorth: 135000,
      partyBNetWorth: 150000,
      partyAPercentage: 47.4,
      partyBPercentage: 52.6,
      equityScore: 94.8,
      deviationFromEqual: 2.6,
      isCompliant: true,
      warnings: [],
      errors: [],
      suggestions: []
    },
    generatedDate: new Date(),
    version: '1.0.0'
  };

  console.log('=== SETTLEMENT AGREEMENT SUMMARY ===\n');
  console.log(DocumentGenerator.generateSummary(exampleMSA));
  
  console.log('\n\n=== FULL SETTLEMENT AGREEMENT ===\n');
  console.log(DocumentGenerator.generate(exampleMSA));
}

export default DocumentGenerator;
