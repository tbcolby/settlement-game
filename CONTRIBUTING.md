# Contributing to Settlement Game

Thank you for your interest in contributing! Settlement Game aims to make divorce settlement negotiations more transparent and collaborative.

## Code of Conduct

This project adheres to the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title** and description
- **Steps to reproduce** the behavior
- **Expected vs actual behavior**
- **Screenshots** if applicable
- **Environment**: OS, Node version, browser
- **Test case** if possible

**⚖️ Legal Bugs**: If you find a legal calculation error or compliance issue, please mark it as `legal` and `high-priority`.

### Suggesting Features

Feature requests are welcome! Please:

- Use a clear, descriptive title
- Provide detailed description of the proposed feature
- Explain why this would be useful
- Consider legal/compliance implications

### Legal Contributions

**IMPORTANT**: If you're contributing legal content (cards, calculations, templates):

1. **Cite sources**: Reference specific statutes
2. **Jurisdiction**: Clearly state which state/jurisdiction
3. **Date**: Note when law was current
4. **Disclaimer**: All legal content must include disclaimers

### Pull Requests

1. **Fork** the repository
2. **Create a branch** from `main`: `git checkout -b feature/your-feature-name`
3. **Make your changes**
4. **Add tests** for new functionality
5. **Update documentation**
6. **Run tests**: `cd web && npm test`
7. **Run linting**: `cd web && npm run lint`
8. **Commit** with clear messages
9. **Push** to your fork
10. **Open a Pull Request**

#### Commit Message Format

```
type: Brief description (50 chars max)

Longer explanation if needed. Wrap at 72 characters.

Co-Authored-By: Warp <agent@warp.dev>
```

Types: `feat`, `fix`, `docs`, `test`, `refactor`, `chore`, `legal`

#### Pull Request Requirements

- [ ] Tests pass (`npm test`)
- [ ] Build succeeds (`npm run build`)
- [ ] Documentation updated
- [ ] Legal compliance checked (if applicable)
- [ ] Co-author attribution included in commits

## Development Setup

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Git

### Setup Steps

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/settlement-game.git
cd settlement-game

# Install dependencies
cd web
npm install

# Run tests
npm test

# Start development server
npm run dev
```

### Project Structure

```
settlement-game/
├── web/                    # Next.js application
│   ├── app/               # Next.js app directory
│   ├── components/        # React components
│   ├── lib/              # Core business logic
│   │   ├── cards.ts      # Card definitions
│   │   ├── financial-engine.ts  # Calculations
│   │   ├── document-generator.ts  # MSA generation
│   │   ├── storage.ts    # Persistence
│   │   └── store.ts      # State management
│   └── lib/__tests__/    # Test suites
├── docs/                  # Documentation
└── README.md
```

### Testing

We use Jest with React Testing Library.

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

**Test coverage requirements**:
- New features must have tests
- Aim for >80% coverage on new code
- Legal calculations require 100% coverage

### Code Style

- TypeScript strict mode
- ESLint configuration (Next.js standard)
- Prettier for formatting (if configured)
- Meaningful variable names
- JSDoc comments for public APIs

## Legal Contribution Agreement

By contributing to this project, you agree that:

1. Your contributions are your own original work
2. You have the right to submit the work under the MIT license
3. You understand this software generates legal documents with significant disclaimers
4. You grant the project maintainers perpetual rights to use your contributions

**Developer Certificate of Origin**: All commits must include:
```
Co-Authored-By: Your Name <your.email@example.com>
```

## Wisconsin Law Specific Contributions

If contributing Wisconsin family law content:

- **Cite statutes**: Wisconsin Statutes §767.XX
- **Reference case law** if applicable
- **Test calculations** against published guidelines
- **Update effective dates**

## Getting Help

- **Questions**: Open a GitHub Discussion
- **Bugs**: File an issue with `question` label
- **Security**: Email tbcolby@pm.me (see SECURITY.md)

## Recognition

Contributors will be:
- Listed in release notes
- Credited in documentation
- Acknowledged in the project README

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for helping make divorce settlements more transparent and collaborative!**
