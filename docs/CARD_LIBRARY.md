# Settlement Game - Card Library
## A Dominion-Style Marital Settlement Agreement Generator

**Version**: 1.0.0  
**Created**: January 14, 2026  
**Based on**: Nomically Universe card mechanics  
**Purpose**: Generate valid Wisconsin marital settlement agreements through collaborative gameplay

---

## Core Philosophy

This game transforms adversarial divorce proceedings into collaborative problem-solving. Players (divorcing parties) play cards that represent settlement terms. Each card contributes to a legally valid marital settlement agreement. The game ends when both parties accept the proposed agreement.

**Key Principles**:
1. **Transparency**: All financial calculations visible in real-time
2. **Equity**: Built-in fairness validator ensures Wisconsin law compliance
3. **Customization**: Every card can be modified with specific values
4. **Collaboration**: Both parties must agree to end the game
5. **Legal Validity**: Output is a properly formatted settlement agreement

---

## Resource Types

Following Nomically resource model:

- 💰 **Money** - Cash, liquid assets
- 🏠 **Property** - Real estate, physical assets
- 📈 **Investments** - Stocks, retirement accounts, business interests
- 👶 **Parenting Time** - Custody percentage, decision-making authority
- 💳 **Obligations** - Child support, spousal support, debt
- ⚖️ **Equity Points** - Measure of settlement fairness (0-100%)
- 🤝 **Agreement Points** - Both parties must reach 100% to finalize

---

## Card Categories

### 1. Asset Division Cards (🏠 💰 📈)

#### Primary Residence Cards

**Card: "Keep the House"**
- **Type**: Asset Division
- **Cost**: 🏠 100% + 💰 (buyout amount)
- **Effect**: One party retains primary residence
- **Customization**:
  - Buyout amount (calculated from equity)
  - Refinance timeline
  - Responsibility for mortgage/taxes
- **Legal Output**: "Party A shall be awarded the marital residence located at [ADDRESS], subject to refinancing the existing mortgage within [TIMELINE] and paying Party B a buyout amount of $[AMOUNT]."

**Card: "Sell and Split"**
- **Type**: Asset Division
- **Cost**: 🏠 100%
- **Effect**: House sold, proceeds divided
- **Customization**:
  - Split percentage (default 50/50)
  - Timeline for sale
  - Responsibility for costs
- **Legal Output**: "The marital residence shall be sold within [TIMELINE]. Net proceeds shall be divided [X]% to Party A and [Y]% to Party B. Parties shall share equally in costs of sale unless otherwise agreed."

**Card: "Defer Sale Until..."**
- **Type**: Asset Division (Conditional)
- **Cost**: 🏠 100% + 💳 (maintenance split)
- **Effect**: Delay sale until trigger event
- **Customization**:
  - Trigger event (child graduates, specific date, market conditions)
  - Occupancy arrangement
  - Expense sharing
- **Legal Output**: "The marital residence shall remain jointly owned until [TRIGGER]. During this period, [PARTY] shall occupy the residence and parties shall share expenses as follows: [BREAKDOWN]."

#### Vehicle Cards

**Card: "Vehicle to Party A"**
- **Type**: Asset Division
- **Cost**: 💰 (fair market value)
- **Effect**: Party A receives vehicle
- **Customization**:
  - Vehicle description (year, make, model, VIN)
  - Debt responsibility
  - Title transfer timeline
- **Legal Output**: "Party A shall be awarded the [YEAR MAKE MODEL, VIN: XXXXX] free and clear of claims by Party B. Party A shall be solely responsible for any outstanding loan."

#### Bank Account Cards

**Card: "Split Account 50/50"**
- **Type**: Asset Division
- **Cost**: 💰 (account balance)
- **Effect**: Account divided equally
- **Customization**:
  - Account institution and numbers (last 4 digits)
  - Distribution timeline
- **Legal Output**: "The [INSTITUTION] account ending in [XXXX] with an approximate balance of $[AMOUNT] shall be divided equally between parties within [TIMELINE]."

**Card: "Entire Account to Party B"**
- **Type**: Asset Division
- **Cost**: 💰 100% + ⚖️ (equity adjustment)
- **Effect**: Party B receives full account
- **Customization**:
  - Offset in other assets
  - Account details
- **Legal Output**: "Party B shall be awarded the entire balance of [INSTITUTION] account ending in [XXXX], valued at approximately $[AMOUNT]. This award is offset by [OTHER ASSET] to Party A."

#### Retirement Account Cards

**Card: "QDRO Split"**
- **Type**: Asset Division (Complex)
- **Cost**: 📈 (retirement account value) + 💰 (QDRO preparation cost)
- **Effect**: Retirement account divided via QDRO
- **Customization**:
  - Account type (401k, IRA, pension)
  - Split percentage
  - QDRO preparation responsibility
- **Legal Output**: "Party B shall be awarded [X]% of Party A's [ACCOUNT TYPE] with [INSTITUTION], valued at approximately $[AMOUNT] as of [DATE]. Parties shall cooperate in preparing a Qualified Domestic Relations Order. [PARTY] shall be responsible for QDRO preparation costs."

**Card: "Keep Retirement Separate"**
- **Type**: Asset Division (Waiver)
- **Cost**: ⚖️ (fairness adjustment)
- **Effect**: Each party retains own retirement
- **Customization**:
  - Rationale for separate retention
  - Offset in other assets
- **Legal Output**: "Each party shall retain their respective retirement accounts free from claims by the other party. Party A retains [ACCOUNTS] valued at approximately $[AMOUNT]. Party B retains [ACCOUNTS] valued at approximately $[AMOUNT]."

### 2. Custody & Parenting Time Cards (👶)

**Card: "50/50 Placement"**
- **Type**: Custody
- **Cost**: 👶 50% each party
- **Effect**: Equal shared placement
- **Customization**:
  - Week-by-week schedule
  - Holiday rotation
  - Summer arrangements
  - Exchange logistics
- **Legal Output**: "The parties shall share placement of the minor child(ren) equally on a 50/50 basis according to the following schedule: [DETAILED SCHEDULE]. Holidays shall rotate annually as follows: [HOLIDAY SCHEDULE]."

**Card: "Primary Placement with Party A"**
- **Type**: Custody
- **Cost**: 👶 (primary %) + 💳 (child support calculation)
- **Effect**: Party A has majority placement
- **Customization**:
  - Percentage split (e.g., 65/35, 70/30)
  - Party B visitation schedule
  - Child support amount (calculated by formula)
- **Legal Output**: "Party A shall have primary placement with [X]% of the time. Party B shall have placement according to the following schedule: [SCHEDULE]. Party B shall pay child support of $[AMOUNT] per month in accordance with Wisconsin Child Support Guidelines."

**Card: "Joint Legal Custody"**
- **Type**: Custody (Decision-making)
- **Cost**: Free (default)
- **Effect**: Both parties share major decisions
- **Customization**:
  - Decision categories (education, medical, religious)
  - Tie-breaking mechanism
- **Legal Output**: "The parties shall share joint legal custody, making major decisions regarding the child(ren)'s education, health care, and religious upbringing jointly. In the event of disagreement, [TIE-BREAKING MECHANISM]."

**Card: "Final Decision Authority"**
- **Type**: Custody (Decision-making)
- **Cost**: ⚖️ (fairness cost - rarely appropriate)
- **Effect**: One party has decision-making authority in specific areas
- **Customization**:
  - Which areas (education, medical, etc.)
  - Which party has authority
- **Legal Output**: "Party [X] shall have final decision-making authority regarding the child(ren)'s [SPECIFIC AREAS], with the other party retaining equal access to information and the right to be consulted."

### 3. Support Cards (💳)

**Card: "Child Support Per Guidelines"**
- **Type**: Financial Obligation
- **Cost**: 💳 (calculated monthly amount)
- **Effect**: Paying party pays guideline child support
- **Customization**:
  - Income verification
  - Shared placement credit
  - Healthcare/childcare add-ons
  - Payment method
- **Legal Output**: "Party [PAYOR] shall pay child support to Party [PAYEE] in the amount of $[AMOUNT] per month, representing [X]% of income pursuant to Wisconsin Child Support Guidelines §49.22. Payment shall be made via [METHOD]. Support shall continue until the child graduates high school or turns 19, whichever occurs first."

**Card: "Deviate from Guidelines"**
- **Type**: Financial Obligation (Deviation)
- **Cost**: 💳 (agreed amount) + ⚖️ (requires justification)
- **Effect**: Non-standard child support amount
- **Customization**:
  - Specific amount
  - Reason for deviation
  - Review timeline
- **Legal Output**: "The parties agree to deviate from the Wisconsin Child Support Guidelines. Party [PAYOR] shall pay $[AMOUNT] per month in child support. This deviation is appropriate because [JUSTIFICATION]. Support shall be reviewed [TIMELINE]."

**Card: "Spousal Support/Maintenance"**
- **Type**: Financial Obligation
- **Cost**: 💳 (monthly amount × duration)
- **Effect**: One party pays maintenance to the other
- **Customization**:
  - Amount
  - Duration (temporary, indefinite, until remarriage)
  - Tax treatment (if pre-2019)
  - Modification terms
- **Legal Output**: "Party [PAYOR] shall pay maintenance to Party [PAYEE] in the amount of $[AMOUNT] per month for a period of [DURATION]. Maintenance shall [terminate/be modifiable] upon [CONDITIONS]. Payments shall be made via [METHOD]."

**Card: "No Spousal Support"**
- **Type**: Financial Obligation (Waiver)
- **Cost**: ⚖️ (fairness review)
- **Effect**: Neither party pays maintenance
- **Customization**:
  - Waiver language
  - Reservation of rights (if applicable)
- **Legal Output**: "Neither party shall pay maintenance to the other, now or in the future. Each party waives any right to maintenance from the other permanently."

### 4. Debt Allocation Cards (💳)

**Card: "Split Debt 50/50"**
- **Type**: Debt Division
- **Cost**: 💳 (debt amount)
- **Effect**: Debt divided equally
- **Customization**:
  - Specific debt description
  - Payment responsibility
  - Indemnification
- **Legal Output**: "The [DEBT DESCRIPTION] with an approximate balance of $[AMOUNT] shall be the joint responsibility of the parties, with each party paying 50%. Each party shall indemnify and hold harmless the other from their respective share."

**Card: "Debt to Party Who Incurred It"**
- **Type**: Debt Division
- **Cost**: 💳 (debt amount to assigning party)
- **Effect**: Party responsible for debt they created
- **Customization**:
  - Debt identification
  - Rationale (if contested)
- **Legal Output**: "Party [X] shall be solely responsible for [DEBT], which was incurred by that party. Party [X] shall indemnify and hold harmless Party [Y] from any claims related to this debt."

**Card: "Pay Off Joint Debt from Asset Sale"**
- **Type**: Debt Division (Strategic)
- **Cost**: 💳 (debt) paid from 💰 or 🏠 (asset proceeds)
- **Effect**: Debt eliminated before division
- **Customization**:
  - Which debt
  - Which asset funds it
  - Impact on split
- **Legal Output**: "The [DEBT] shall be paid in full from the proceeds of [ASSET] prior to any distribution to the parties. The net amount available for distribution shall be divided [SPLIT]."

### 5. Property Rights Cards (🏠)

**Card: "Personal Property to Current Possessor"**
- **Type**: Property Division (Simple)
- **Cost**: Free (simplicity benefit)
- **Effect**: Each keeps what they currently have
- **Customization**:
  - Exceptions for high-value items
- **Legal Output**: "Each party shall retain the personal property currently in their possession, free from claims by the other party, except as specifically provided herein."

**Card: "Specific Item to Party B"**
- **Type**: Property Division
- **Cost**: 💰 (item value) + ⚖️ (equity adjustment)
- **Effect**: Designated item goes to Party B
- **Customization**:
  - Item description
  - Appraised value
  - Sentimental justification
- **Legal Output**: "Party B shall be awarded [ITEM DESCRIPTION], valued at approximately $[AMOUNT]. This award is offset by [COMPENSATION]."

**Card: "Items to Be Divided by Agreement"**
- **Type**: Property Division (Deferred)
- **Cost**: 🤝 (requires future agreement)
- **Effect**: Parties will divide specific items later
- **Customization**:
  - Category of items
  - Timeline for division
  - Dispute resolution mechanism
- **Legal Output**: "The parties shall divide [CATEGORY OF ITEMS] by mutual agreement within [TIMELINE]. If the parties cannot agree, [DISPUTE RESOLUTION MECHANISM]."

### 6. Future Obligation Cards

**Card: "Cooperate on Taxes"**
- **Type**: Future Obligation
- **Cost**: 🤝 (ongoing cooperation)
- **Effect**: Parties agree to cooperation for tax purposes
- **Customization**:
  - How refunds/liabilities split
  - Who claims children as dependents
  - Access to tax documents
- **Legal Output**: "The parties shall cooperate in the preparation and filing of all necessary tax returns. [PARTY] shall claim the child(ren) as dependents for tax purposes [CONDITIONS]. Any tax refunds or liabilities for joint returns shall be divided [SPLIT]. Each party shall provide the other access to all necessary tax documents within [TIMELINE] of request."

**Card: "College Expenses"**
- **Type**: Future Obligation
- **Cost**: 💳 (future % of expenses)
- **Effect**: Parties agree to contribute to college costs
- **Customization**:
  - Percentage split
  - Type of expenses covered
  - Caps/limitations
  - Which schools qualify
- **Legal Output**: "The parties shall contribute to the child(ren)'s post-secondary education expenses as follows: [PARTY A: X%, PARTY B: Y%]. Covered expenses include tuition, room, board, books, and mandatory fees for up to [X] years of undergraduate education. Contributions shall not exceed $[AMOUNT] per year per child. The child must maintain [GPA] and provide grades each semester."

**Card: "Health Insurance Responsibility"**
- **Type**: Future Obligation
- **Cost**: 💳 (insurance premiums + % of uncovered)
- **Effect**: Designates who provides insurance and splits uncovered costs
- **Customization**:
  - Who provides insurance
  - How uncovered costs split
  - Notice requirements
- **Legal Output**: "Party [X] shall maintain health insurance for the minor child(ren) as long as available through employment at reasonable cost. Uninsured medical, dental, and vision expenses shall be divided [SPLIT] between the parties. Each party shall provide receipts to the other within [DAYS] days."

**Card: "Extracurricular Activities"**
- **Type**: Future Obligation
- **Cost**: 💳 (% of activity costs)
- **Effect**: How activity costs are shared
- **Customization**:
  - Split percentage
  - Decision-making process
  - Caps/limitations
- **Legal Output**: "The parties shall share the cost of the child(ren)'s extracurricular activities [SPLIT]. Both parties must agree in advance to activities costing more than $[AMOUNT]. Each party shall provide receipts to the other within [DAYS] days."

### 7. Special Circumstance Cards

**Card: "Name Change Provision"**
- **Type**: Administrative
- **Cost**: Free
- **Effect**: Specifies name change rights/restrictions
- **Customization**:
  - Who can change name
  - Child name change provisions
- **Legal Output**: "[PARTY] shall have the right to resume use of their former name: [NAME]. Neither party shall change the child(ren)'s surname without written consent of the other party or court order."

**Card: "Business Interest Division"**
- **Type**: Asset Division (Complex)
- **Cost**: 📈 (business value) + 💰 (valuation/buyout costs)
- **Effect**: Handles business ownership
- **Customization**:
  - Buyout vs. continued co-ownership
  - Valuation method
  - Payment terms
- **Legal Output**: "[PARTY] shall retain sole ownership of [BUSINESS NAME]. [PARTY] shall pay the other party $[AMOUNT] representing [X]% of the business value as determined by [VALUATION METHOD], payable [PAYMENT TERMS]."

**Card: "Life Insurance Requirement"**
- **Type**: Future Obligation (Protection)
- **Cost**: 💳 (ongoing premiums)
- **Effect**: Obligor must maintain life insurance
- **Customization**:
  - Amount
  - Duration
  - Beneficiary designation
  - Proof requirements
- **Legal Output**: "Party [OBLIGOR] shall maintain life insurance in the amount of $[AMOUNT] with [BENEFICIARY] as irrevocable beneficiary until [DURATION/TRIGGER]. Party [OBLIGOR] shall provide proof of coverage annually by [DATE]."

### 8. Meta-Cards (Game Mechanics)

**Card: "Request Financial Disclosure"**
- **Type**: Information
- **Cost**: Free
- **Effect**: Opponent must provide financial information
- **Customization**:
  - Specific documents requested
  - Timeline for production
- **Game Effect**: Opponent must upload/share specified documents before next turn
- **Legal Output**: (No direct output - ensures informed decision-making)

**Card: "Propose Modification"**
- **Type**: Negotiation
- **Cost**: 🤝 (agreement points)
- **Effect**: Suggest changes to already-played card
- **Customization**:
  - Which card to modify
  - Proposed changes
- **Game Effect**: Opponent can accept, reject, or counter-propose

**Card: "Equity Check"**
- **Type**: Analysis
- **Cost**: Free (unlimited use)
- **Effect**: Shows current equity score and imbalances
- **Game Effect**: Displays:
  - Overall asset split percentage
  - Fairness score (0-100%)
  - Potential legal issues
  - Suggestions for balance

**Card: "Finalize Agreement"**
- **Type**: Game End
- **Cost**: 100 🤝 Agreement Points (both parties)
- **Effect**: Ends game, generates settlement document
- **Requirement**: Both parties must play this card simultaneously
- **Game Effect**: 
  - Locks all played cards
  - Generates complete MSA document
  - Produces signature-ready PDF

---

## Game Flow

### Setup Phase
1. Both parties create accounts (anonymous or identified)
2. Enter basic information:
   - Marriage date
   - Children (names, birthdates)
   - Major assets (house, vehicles, accounts)
   - Major debts
   - Current incomes
3. Game generates starter deck with relevant cards

### Play Phase
1. **Turn Structure**:
   - Players alternate proposing cards
   - Opponent can: Accept, Reject, Modify, or Counter-propose
   - Accepted cards lock into the agreement
   
2. **Agreement Points**:
   - Both parties start at 0/100 🤝 points
   - Each accepted card increases agreement
   - Major provisions (custody, house, support) worth more points
   - Both must reach 100% to finalize

3. **Equity Balance**:
   - Real-time display shows ⚖️ equity percentage
   - Wisconsin law generally aims for 50/50 split
   - Deviations must be justified
   - System flags potential legal issues

### End Phase
1. Both parties play "Finalize Agreement" card
2. System generates complete Marital Settlement Agreement
3. Document includes:
   - All played cards converted to legal language
   - Wisconsin-compliant formatting
   - Required statutory provisions
   - Signature blocks for parties and attorneys
4. Export as PDF and/or DocX
5. Optional: Submit to court electronically (if integrated)

---

## Wisconsin Law Requirements

Every generated agreement must include:

### Required Provisions
- ✅ Complete asset division
- ✅ Complete debt division  
- ✅ Custody and placement determination
- ✅ Child support calculation (if applicable)
- ✅ Health insurance responsibility
- ✅ Tax filing provisions
- ✅ Name change rights
- ✅ Waiver of inheritance rights

### Child Support
- Must follow Wisconsin Child Support Guidelines §49.22
- System auto-calculates based on:
  - Both parties' gross income
  - Number of children
  - Placement percentage
  - Healthcare costs
  - Childcare costs
- Allows deviations with justification

### Maintenance/Spousal Support
- Must consider Wisconsin factors (§767.56):
  - Length of marriage
  - Age and health
  - Division of property
  - Educational level
  - Earning capacity
  - Contribution to education/career of other party
  - Tax consequences
  - Agreements between parties
  - Other relevant factors
- System flags when maintenance is likely appropriate

---

## Technical Implementation Notes

### Card Data Structure
```javascript
{
  cardId: "keep-house-001",
  category: "Asset Division",
  name: "Keep the House",
  resourceCosts: {
    property: 100,
    money: 0 // calculated dynamically
  },
  customizationFields: [
    {
      fieldId: "buyout-amount",
      label: "Buyout Amount",
      type: "currency",
      required: true,
      calculation: "homeValue * otherPartyEquity"
    },
    {
      fieldId: "refinance-timeline",
      label: "Refinance Deadline",
      type: "date",
      required: true
    }
  ],
  legalTemplate: "Party {keepingParty} shall be awarded the marital residence located at {address}, subject to refinancing the existing mortgage within {refinanceTimeline} and paying Party {otherParty} a buyout amount of ${buyoutAmount}.",
  equityImpact: (values) => {
    // Calculate how this affects overall equity split
    return calculateEquityDelta(values);
  }
}
```

### Financial Calculation Engine
- Real-time updates as cards played
- Tracks:
  - Total assets to Party A
  - Total assets to Party B
  - Total debts to Party A
  - Total debts to Party B
  - Net worth change for each party
  - Support obligations (monthly)
  - Tax implications (if calculable)

### Legal Document Generator
- Templates for each card type
- Merge played cards into complete MSA
- Add required boilerplate
- Format per Wisconsin court requirements
- Generate table of contents
- Add signature blocks

---

## Future Enhancements

### Version 1.1
- [ ] Integration with Wisconsin CCAP for electronic filing
- [ ] Attorney review mode (lawyer can review before finalize)
- [ ] Mediator facilitation mode (third party guides process)
- [ ] Multi-language support
- [ ] Mobile app version

### Version 2.0
- [ ] AI-powered fairness suggestions
- [ ] Integration with actual financial accounts (with permission)
- [ ] Real-time property valuations via APIs
- [ ] Automatic child support calculator integration
- [ ] Tax impact forecasting

### Version 3.0
- [ ] Other state support (currently Wisconsin only)
- [ ] Post-divorce modification game (when circumstances change)
- [ ] Co-parenting communication integration
- [ ] Educational modules about divorce process

---

## Licensing & IP

**IP Rights**: 50% Tyler Colby, 50% [PRIVATE PARTY - pending negotiation]

**License Strategy**:
- Core game: Open source (MIT or similar)
- Legal templates: Proprietary (requires attorney review per jurisdiction)
- SaaS platform: Subscription revenue split 50/50

**Revenue Model**:
- Free: Basic game, standard cards, document generation
- Premium: Attorney review, mediation mode, advanced analytics
- Enterprise: Law firms can white-label for clients

---

**End of Card Library v1.0**

*Built on Nomically Universe mechanics*  
*Created: January 14, 2026, 5:48 AM*  
*Status: Initial design complete, implementation pending*
