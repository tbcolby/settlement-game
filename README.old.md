# Settlement Game
## A Dominion-Style Marital Settlement Agreement Generator

**Version**: 1.0.0  
**Created**: January 14, 2026  
**Author**: Tyler Colby (with Warp AI)  
**IP Rights**: 50% Tyler Colby, 50% [Negotiation Pending]  

---

## Overview

Settlement Game transforms adversarial divorce proceedings into collaborative gameplay. Players (divorcing parties) play cards that represent settlement terms. Each card contributes to a legally valid marital settlement agreement. The game ends when both parties accept the proposed agreement.

Built on Nomically Universe card mechanics, this tool turns one of life's most painful processes into structured problem-solving.

---

## Core Philosophy

**"Instead of fighting over the house, let's play for it."**

Divorce is heartbreaking. Settlement Game doesn't make it painless, but it makes it:
- **Transparent**: All financial calculations visible in real-time
- **Equitable**: Built-in fairness validator ensures Wisconsin law compliance
- **Collaborative**: Both parties must agree to end the game
- **Playable**: Complex legal terms become understandable game mechanics
- **Complete**: Output is a properly formatted, court-ready settlement agreement

---

## What's Been Built

### ✅ Core Systems (Complete)

1. **Card Library** (`docs/CARD_LIBRARY.md`)
   - 50+ settlement cards across 8 categories
   - Asset Division (house, vehicles, accounts, retirement)
   - Custody & Parenting Time
   - Child Support & Maintenance
   - Debt Allocation
   - Property Rights
   - Future Obligations (college, taxes, insurance)
   - Special Circumstances
   - Meta-Cards (game mechanics)

2. **Financial Analysis Engine** (`src/financial-engine.ts`)
   - Real-time equity calculations
   - Wisconsin child support calculator (§49.22 compliant)
   - Fairness scoring (0-100 scale)
   - Asset/debt tracking for both parties
   - Monthly obligation summaries
   - Compliance checking

3. **Legal Document Generator** (`src/document-generator.ts`)
   - Converts played cards to Wisconsin-compliant MSA
   - Proper legal formatting
   - Required boilerplate provisions
   - Export to PDF, HTML, Markdown, Text
   - Summary cover sheet generation

### 🚧 To Be Built

4. **Web Interface** (Next.js/React)
   - Card playing interface
   - Real-time equity dashboard
   - Turn-based gameplay
   - Negotiation system
   - Document export

5. **Game State Management**
   - Player authentication
   - Game session persistence
   - Card customization interface
   - Agreement point tracking

6. **PDF Export**
   - Court-ready document formatting
   - Signature blocks
   - Proper pagination

---

## How It Works

### Setup Phase
1. Both parties create accounts (or play anonymously)
2. Enter basic information:
   - Marriage/separation dates
   - Children (names, birthdates)
   - Major assets (house, vehicles, accounts)
   - Major debts
   - Current incomes
3. Game generates starter deck with relevant cards

### Play Phase
1. **Turn Structure**:
   - Players alternate proposing cards (settlement terms)
   - Opponent can: Accept, Reject, Modify, or Counter-propose
   - Accepted cards lock into the agreement
   
2. **Agreement Points** (🤝):
   - Both parties start at 0/100 points
   - Each accepted card increases agreement
   - Major provisions (custody, house, support) worth more points
   - Both must reach 100% to finalize

3. **Equity Balance** (⚖️):
   - Real-time display shows equity percentage
   - Wisconsin law aims for 50/50 split
   - Deviations must be justified
   - System flags potential legal issues

### End Phase
1. Both parties play "Finalize Agreement" card
2. System generates complete Marital Settlement Agreement
3. Document includes:
   - All played cards converted to legal language
   - Wisconsin-compliant formatting
   - Required statutory provisions
   - Signature blocks
4. Export as PDF/HTML/Text
5. Attorney review before filing

---

## Technical Stack

**Current Implementation**:
- TypeScript (Node.js)
- Standalone modules (can be integrated into any framework)

**Planned**:
- **Frontend**: Next.js 14 with React
- **Backend**: Node.js with Express/Fastify
- **Database**: PostgreSQL or MongoDB (game state)
- **PDF Generation**: Puppeteer or PDFKit
- **Authentication**: Clerk or Auth0
- **Hosting**: Vercel or Railway

---

## Quick Start

### Installation
```bash
cd /Users/tyler/settlement-game
npm install
```

### Run Financial Engine Example
```bash
npm run test:financial
```

###Run Document Generator Example
```bash
npm run test:document
```

### Build Web Interface (Coming Soon)
```bash
npm run dev
```

---

## Example Usage

```typescript
import { EquityAnalyzer, calculateChildSupport } from './src/financial-engine';
import { DocumentGenerator } from './src/document-generator';

// Create settlement state
const settlement = {
  partyA: {
    partyId: 'A',
    cashAssets: 25000,
    propertyValue: 200000, // keeping house
    mortgageDebt: 150000,
    parentingTimePercentage: 50,
    // ... other fields
  },
  partyB: {
    partyId: 'B',
    cashAssets: 100000, // buyout from house
    propertyValue: 0,
    mortgageDebt: 0,
    parentingTimePercentage: 50,
    // ... other fields
  },
  // ... rest of settlement
};

// Analyze equity
const analysis = EquityAnalyzer.analyze(settlement);
console.log(`Equity Score: ${analysis.equityScore}/100`);
console.log(`Party A: ${analysis.partyAPercentage.toFixed(1)}%`);
console.log(`Party B: ${analysis.partyBPercentage.toFixed(1)}%`);

// Calculate child support
const childSupport = calculateChildSupport(
  80000,  // payor income
  50000,  // payee income
  1,      // number of children
  50,     // shared placement (50/50)
  200,    // health insurance
  500     // childcare
);
console.log(`Child Support: $${childSupport.finalAmount.toFixed(2)}/month`);

// Generate MSA document
const msa = {
  county: 'Milwaukee',
  partyAName: 'Tyler',
  partyBName: 'Tiffany',
  marriageDate: new Date('2015-06-15'),
  children: [{ name: 'Maelee', birthdate: new Date('2017-08-22') }],
  // ... card plays
  equityAnalysis: analysis,
  generatedDate: new Date(),
  version: '1.0.0'
};

const document = DocumentGenerator.generate(msa);
const summary = DocumentGenerator.generateSummary(msa);
```

---

## Legal Compliance

### Wisconsin Law Requirements

Every generated agreement includes:
- ✅ Complete asset division (§767.61)
- ✅ Complete debt division
- ✅ Custody and placement determination (§767.41)
- ✅ Child support calculation (§49.22)
- ✅ Health insurance responsibility
- ✅ Tax filing provisions
- ✅ Name change rights
- ✅ Waiver of inheritance rights

### Child Support
- Follows Wisconsin Child Support Guidelines §49.22
- Auto-calculates based on income, children, placement
- Allows deviations with justification
- Includes shared placement credits

### Fairness Validation
- Flags deviations >15% from equal split
- Warns when deviations >30% (likely non-compliant)
- Suggests balancing adjustments
- References relevant statutes

---

## Important Disclaimers

### ⚖️ Legal Review Required

**This tool generates DRAFT documents that MUST be reviewed by qualified legal counsel before filing.**

- Both parties should have independent attorneys
- Generated documents are starting points, not final agreements
- State-specific legal requirements may change
- Tool provides templates, not legal advice

### 🚧 Current Limitations

- **Wisconsin only**: Other states have different laws
- **No attorney integration**: Requires manual review
- **Basic calculations**: Complex scenarios may need custom handling
- **No court filing**: Documents must be filed separately

### 💡 Best Use Cases

**This tool works best for:**
- ✅ Amicable divorces where parties can communicate
- ✅ Moderate complexity (house, kids, standard assets)
- ✅ Parties who want transparency and control
- ✅ Situations where legal fees are prohibitive

**This tool is NOT appropriate for:**
- ❌ High-conflict divorces
- ❌ Domestic violence situations
- ❌ Complex business valuations
- ❌ International custody issues
- ❌ Hidden asset concerns

---

## Development Roadmap

### Version 1.0 (Current)
- [x] Card library design
- [x] Financial analysis engine
- [x] Legal document generator
- [ ] Web interface
- [ ] Game state management
- [ ] PDF export

### Version 1.1
- [ ] Attorney review mode
- [ ] Mediator facilitation mode
- [ ] Mobile app (iOS/Android)
- [ ] Multi-language support
- [ ] Integration with Wisconsin CCAP (electronic filing)

### Version 2.0
- [ ] AI-powered fairness suggestions
- [ ] Real-time property valuations (APIs)
- [ ] Tax impact forecasting
- [ ] Integration with financial accounts (Plaid)
- [ ] Automatic document updates when laws change

### Version 3.0
- [ ] Other state support (all 50 states)
- [ ] Post-divorce modification game
- [ ] Co-parenting communication platform
- [ ] Educational modules
- [ ] White-label for law firms

---

## Revenue Model

### Free Tier
- Basic game access
- Standard cards
- Document generation (text/markdown)
- DIY filing instructions

### Premium ($99/game)
- Advanced cards
- PDF export (court-ready)
- Attorney review portal access
- Real-time equity analytics
- Priority support

### Enterprise (Custom Pricing)
- White-label for law firms
- Custom card libraries
- Integration with practice management software
- Multi-state support
- Bulk licensing

### Revenue Split
- 50% Tyler Colby
- 50% [Negotiation Pending]

---

## Contributing

This is currently a closed-source project during development. IP rights are being negotiated.

For questions or collaboration inquiries:
- Email: tbcolby@pm.me
- GitHub: (TBD - repo not yet public)

---

## License

**Pending**. IP rights: 50% Tyler Colby, 50% [Negotiation Pending].

Core game mechanics may be released as MIT.  
Legal templates remain proprietary.  
Wisconsin-specific calculations may be open-sourced for public benefit.

---

## Acknowledgments

**Built on**:
- Nomically Universe card mechanics
- Wisconsin family law statutes
- Dominion-style deck-building game mechanics
- MoodBridge therapeutic frameworks

**Co-Authored-By**: Warp <agent@warp.dev>

**Inspired by**: The belief that even painful life transitions can benefit from structure, transparency, and a little game theory.

---

## Contact

**Tyler Colby**  
South Milwaukee, WI  
tbcolby@pm.me

**Settlement Game**  
Version 1.0.0  
Created: January 14, 2026

---

*"Divorce is heartbreaking. Let's not prolong it. Let's play."*
