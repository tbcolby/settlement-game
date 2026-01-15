# Security Policy

## Overview

Settlement Game handles sensitive personal and financial information related to divorce proceedings. While the application is designed to run locally-first (data stays in the user's browser), security is a top priority.

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Security Considerations

### Data Storage
- **Local-first architecture**: All user data stored in browser localStorage
- **No backend required**: Core functionality works entirely client-side
- **No data transmission**: Unless user explicitly exports documents
- **No analytics or tracking**: Your data stays on your device

### Sensitive Information Handling
This application handles:
- Personal identifiable information (names, addresses)
- Financial data (assets, debts, income)
- Children's information (names, birthdates)
- Legal arrangements (custody, support payments)

**Best practices for users**:
1. Use on private, secure devices only
2. Clear browser data after use on shared computers
3. Export documents to encrypted storage
4. Never share generated documents via unencrypted channels

## Reporting a Vulnerability

### Please DO NOT open public GitHub issues for security vulnerabilities.

Instead, please email security concerns to:

**Tyler Colby**  
📧 tbcolby@pm.me

### What to Include

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)
- Your contact information for follow-up

### Response Timeline

- **Initial response**: Within 48 hours
- **Status update**: Within 7 days
- **Fix timeline**: Depends on severity
  - Critical: 1-7 days
  - High: 7-14 days
  - Medium: 14-30 days
  - Low: 30-90 days

### Disclosure Policy

- Security issues will be addressed privately until patched
- Credit will be given to reporters (unless anonymity requested)
- Details disclosed publicly only after fix is released

## Security Best Practices for Deployment

If you're hosting this application publicly:

1. **HTTPS only**: Always use TLS/SSL encryption
2. **Content Security Policy**: Implement strict CSP headers
3. **CORS**: Restrict cross-origin requests
4. **Rate limiting**: Prevent abuse
5. **Regular updates**: Keep dependencies current
6. **Environment variables**: Never commit secrets to git

## Known Limitations

### Not Suitable For
- ❌ High-conflict divorces
- ❌ Situations with hidden asset concerns
- ❌ Cases involving domestic violence
- ❌ Complex business valuations requiring forensic accounting

### Legal Limitations
- Software generates DRAFT documents only
- Not a substitute for legal advice
- Attorney review required before filing
- Wisconsin-specific calculations (may not apply elsewhere)
- Laws change over time - verify current requirements

## Dependency Security

We regularly update dependencies to patch known vulnerabilities:

```bash
# Check for vulnerabilities
cd web && npm audit

# Fix automatically (when possible)
npm audit fix
```

## Secure Development Practices

Contributors should:
- Never commit sensitive data or secrets
- Use environment variables for configuration
- Follow principle of least privilege
- Sanitize all user inputs
- Validate data before use
- Write tests for security-critical code

## Questions?

For non-security questions, open a GitHub Discussion or issue.

For security concerns, email: tbcolby@pm.me

---

**Remember**: This software handles sensitive divorce information. Handle with care.
