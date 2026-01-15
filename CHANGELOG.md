# Changelog

All notable changes to Settlement Game will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-15

### Added - Initial Release

#### Core Features
- Complete card-based settlement system with 30+ settlement cards
- Comprehensive test suite (82 tests, all passing)
- Wisconsin child support calculator (§49.22 compliant)
- Real-time equity analysis and fairness scoring
- Legal document generator (MSA with proper formatting)
- Financial analysis engine with multi-party support
- Next.js web interface with React 19
- Type-safe TypeScript throughout
- Local-first data storage (no backend required)

#### Legal & Compliance
- MIT License with custom legal preamble
- Comprehensive disclaimer system (multi-layer)
- Wisconsin family law compliance checks
- Attorney review requirements built-in
- Security policy for sensitive data

#### Card Categories
- Asset Division (house, vehicles, accounts, retirement)
- Custody & Parenting Time (50/50, primary placement, joint legal)
- Child Support & Spousal Maintenance
- Debt Allocation
- Property Rights
- Future Obligations (college, taxes, insurance, healthcare)
- Special Circumstances (name change, life insurance)
- Meta-cards (game mechanics)

#### Documentation
- Comprehensive README with examples
- Contributing guidelines (CODE_OF_CONDUCT.md)
- Security policy (SECURITY.md)
- Legal disclaimer (DISCLAIMER.md)
- Testing documentation (TESTING.md)
- Card library reference (docs/CARD_LIBRARY.md)

#### Technical Stack
- Next.js 16.1.1 (App Router)
- React 19.2.3 with React Compiler
- TypeScript 5.x (strict mode)
- Tailwind CSS 4.x
- Zustand 5.x (state management)
- Jest 30.x + React Testing Library
- date-fns, recharts, lucide-react

### Security
- Local-first architecture (data stays in browser)
- No analytics or tracking
- No backend required for core functionality
- Comprehensive security documentation

### Developer Experience
- Full test coverage on core modules
- Type safety throughout
- Hot module replacement in development
- ESLint configuration
- Clear project structure
- Detailed contribution guidelines

### Legal Disclaimers
- Prominent disclaimers in:
  - UI (modal on first use)
  - Generated documents
  - Package.json
  - README
  - LICENSE
  - Standalone DISCLAIMER.md
- Multi-layer defense against liability
- Clear "not legal advice" messaging

### Known Limitations
- Wisconsin law only (as of January 2026)
- Requires attorney review before filing
- Not suitable for high-conflict cases
- Does not handle complex business valuations
- No domestic violence screening

## [Unreleased]

### Planned Features
- Multi-state support (other jurisdictions)
- PDF export with proper formatting
- Attorney review portal
- Mediator facilitation mode
- Mobile responsive improvements
- Additional card types
- Real-time collaboration
- Document version control
- Integration with legal APIs

---

## Version History

- **1.0.0** (2026-01-15): Initial public release

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development info and how to propose changes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Co-Authored-By**: Warp <agent@warp.dev>
