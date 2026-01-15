# Testing Documentation

## Overview

Comprehensive test suite for the Settlement Game application using Jest and React Testing Library.

## Test Coverage

### Current Status (82 tests passing)

- **Cards Library**: 100% coverage
  - Card data structure validation
  - Card lookup and filtering
  - Field validation
  
- **Financial Engine**: 75.36% coverage
  - Wisconsin child support calculations
  - Equity analysis
  - Compliance checking
  - Monthly obligation calculations
  
- **Document Generator**: 66.66% coverage
  - MSA document generation
  - Multiple export formats (text, HTML, markdown)
  - Summary generation
  - Card-to-legal-language conversion
  
- **Storage Module**: 57.89% coverage
  - localStorage persistence
  - Date serialization/deserialization
  - Version compatibility
  - Error handling

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (during development)
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Test Structure

```
lib/__tests__/
├── cards.test.ts              # Card library tests
├── financial-engine.test.ts   # Financial calculations & equity analysis
├── document-generator.test.ts # Legal document generation
└── storage.test.ts            # Data persistence
```

## Key Test Scenarios

### Financial Engine
- Child support calculations per Wisconsin §49.22
- Shared placement credits
- Healthcare and childcare add-ons
- Equity analysis (50/50 splits, deviations)
- Wisconsin law compliance checks
- Monthly obligation calculations

### Document Generator
- Complete MSA generation
- Case header formatting
- Multiple card types (custody, support, assets, debts)
- Export formats (text, HTML, markdown)
- Edge cases (no children, missing data)

### Storage
- Save/load round-trips
- Date serialization
- Corrupted data handling
- Version migration
- Complex session data

### Cards Library
- Unique card IDs
- Valid card structure
- Field type validation
- Category filtering
- Required field checking

## Adding New Tests

1. Create test file in `lib/__tests__/` matching the module name
2. Import the module and necessary types
3. Use `describe` blocks to organize test suites
4. Write focused tests with clear assertions
5. Run `npm test` to verify

Example:
```typescript
import { myFunction } from '../my-module';

describe('My Module', () => {
  it('should do something', () => {
    const result = myFunction('input');
    expect(result).toBe('expected');
  });
});
```

## Test Best Practices

- **Isolation**: Each test should be independent
- **Clarity**: Test names describe what is being tested
- **Coverage**: Aim for edge cases and error conditions
- **Speed**: Tests should run quickly (< 1s each)
- **Maintainability**: Keep tests simple and readable

## Continuous Integration

Tests automatically run:
- Before builds (`npm run build` checks types)
- On code changes (use `npm run test:watch`)
- Can be integrated with CI/CD pipelines

## Next Steps

To increase coverage:
1. Add component tests for React components
2. Test store (Zustand) state management
3. Add integration tests for full workflows
4. Test UI interactions with user-event
5. Add E2E tests with Playwright or Cypress

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
