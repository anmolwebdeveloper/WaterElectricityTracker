# WattsFlow - Security Guidelines

This document outlines security best practices for the WattsFlow application.

## Environment Variables

### ✅ What Should Be in Environment Variables

- Database credentials and connection strings
- JWT secrets and tokens
- API keys (Google, Twilio, etc.)
- OAuth secrets and tokens
- Any sensitive configuration

### ❌ What Should NEVER Be Hardcoded

- Passwords or API keys
- Connection strings with credentials
- JWT secrets
- OAuth secrets
- Authentication tokens
- Third-party service credentials

## .gitignore Critical Entries

Ensure your `.gitignore` always includes:
```
.env
.env.local
.env.*.local
.env.production.local
backend/.env
frontend/.env
node_modules/
```

## Before Deployment

- [ ] All environment variables are externalized
- [ ] `.env` files are NOT committed to git
- [ ] `.gitignore` properly blocks sensitive files
- [ ] npm audit shows no critical vulnerabilities
- [ ] No console.log statements logging sensitive data
- [ ] CORS is properly configured for allowed origins only
- [ ] HTTPS is enforced (Render provides this automatically)

## JWT Security

### Best Practices

1. **Use a Strong Secret**
   ```bash
   # Generate a secure secret
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Rotate Secrets Periodically**
   - Update JWT_SECRET in environment variables
   - Users will need to re-authenticate

3. **Set Appropriate Expiry**
   - Access tokens: Short-lived (7 days)
   - Consider refresh tokens for longer sessions

## Database Security

### MongoDB Atlas Best Practices

1. **IP Whitelist**
   - For development: Use your local IP
   - For production: Whitelist Render IPs or use "0.0.0.0/0" with strong auth

2. **Strong Passwords**
   - Use complex passwords (20+ characters)
   - Store securely in environment variables

3. **Network Access**
   - Use VPC Peering for additional security (paid tier)
   - Monitor connection logs

## API Security

### CORS Configuration

Only allow requests from trusted origins:

```javascript
// Development
['http://localhost:5173', 'http://localhost:5000']

// Production
['https://yourdomain.com']
```

### Rate Limiting

The application uses `express-rate-limit`. Ensure it's:
- Enabled in all routes
- Configured appropriately for your API usage

### Input Validation

- Use `express-validator` for all inputs
- Validate data types and formats
- Sanitize all user inputs
- Check maximum lengths

## Authentication Security

### Password Storage

- Passwords are hashed with bcryptjs
- Never store plain text passwords
- Use salt rounds: 10+

### OAuth Integration

- Store client secrets securely
- Verify callback URLs match configured domain
- Keep credentials updated in environment variables

## Monitoring & Logging

### What to Log

- Authentication attempts (successes and failures)
- Unusual API access patterns
- Database errors
- Security-related events

### What NOT to Log

- User passwords
- API keys or secrets
- Sensitive user data (beyond necessary context)
- Full request/response bodies with sensitive data

## Dependency Security

### Regular Updates

```bash
# Check for vulnerabilities
npm audit

# Update packages safely
npm update

# Update to latest (with caution)
npm upgrade
```

### Vulnerable Packages

- Remove unused dependencies
- Evaluate new dependencies for security
- Use established, well-maintained packages

## Render-Specific Security

### Environment Variables on Render

1. Add environment variables in Service Settings
2. Mark sensitive ones as "Secret" if available
3. Never log environment variables
4. Re-deploy after changing critical variables

### Health Check Endpoint

- `/api/health` is public and doesn't require authentication
- Good for monitoring and load balancing
- Doesn't expose sensitive information

## Incident Response

### If You Suspect a Compromise

1. **Immediately:**
   - Rotate all secrets (JWT_SECRET, API keys)
   - Reset database passwords
   - Revoke OAuth tokens

2. **Short Term:**
   - Review access logs
   - Check for unauthorized changes
   - Audit user accounts

3. **Long Term:**
   - Implement additional monitoring
   - Add more logging
   - Review security practices

## Regular Security Checklist

- [ ] Weekly: Review access logs
- [ ] Monthly: Check for npm vulnerabilities
- [ ] Quarterly: Rotate JWT secret
- [ ] Quarterly: Update dependencies
- [ ] Annually: Security audit and penetration testing

## Reporting Security Issues

If you discover a security vulnerability:
1. Do NOT create a public issue
2. Contact the maintainers privately
3. Provide details and proof of concept
4. Allow time for fixes before disclosure

## Additional Resources

- OWASP Top 10: https://owasp.org/www-project-top-ten/
- Node.js Security Best Practices: https://nodejs.org/en/docs/guides/security/
- Express.js Security: https://expressjs.com/en/advanced/best-practice-security.html
- MongoDB Security: https://docs.mongodb.com/manual/security/

## Compliance Considerations

### Data Protection

- GDPR: Ensure proper data handling and privacy
- CCPA: California Consumer Privacy Act compliance
- Local regulations: Check your jurisdiction

### Data Retention

- Implement data retention policies
- Log deletion procedures
- User data deletion on request

---

**Last Updated:** 2024
**Next Review:** Quarterly
