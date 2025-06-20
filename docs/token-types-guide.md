# Doppler Token Types Guide

## Overview

Doppler uses different token types for various authentication scenarios. Understanding these token types is crucial for proper security and access control.

## Token Types and Their Access Levels

### 1. CLI Tokens (dp.ct.*)
- **Access Level**: Full read/write access based on user permissions
- **Usage**: Interactive CLI usage and development
- **Created via**: `doppler login`
- **Characteristics**:
  - ✅ Full access to all user-accessible projects
  - ✅ Can read AND write secrets
  - ✅ Interactive authentication flow
  - ✅ Scoped to specific directories
  - ❌ Not recommended for production automation

### 2. Service Tokens (dp.st.*)
- **Access Level**: Usually read-only (but can be configured)
- **Usage**: Production applications and CI/CD
- **Created via**: Dashboard → Project → Config → Access → Service Tokens
- **Characteristics**:
  - ✅ Scoped to specific project/config
  - ✅ Ideal for production applications
  - ✅ Can be read-only or read/write
  - ✅ No user dependency
  - ✅ Best practice for production

### 3. Personal Tokens (dp.pt.*)
- **Access Level**: Full access via API
- **Usage**: Personal automation scripts and API access
- **Created via**: Dashboard → Settings → API → Personal Tokens
- **Characteristics**:
  - ✅ Full access to all user permissions
  - ✅ Suitable for personal automation
  - ✅ Long-lived tokens
  - ❌ Tied to user account (risk if user leaves)

### 4. Service Account Tokens (dp.sa.*)
- **Access Level**: Configurable read/write access
- **Usage**: Automated systems requiring write access
- **Created via**: Dashboard → Settings → Service Accounts
- **Characteristics**:
  - ✅ Read/write access across multiple projects
  - ✅ Not tied to individual users
  - ✅ Programmatic access for automation
  - ✅ Configurable permissions per project

### 5. Service Account Identity Tokens
- **Access Level**: Based on cloud provider IAM
- **Usage**: Cloud-native identity-based authentication
- **Characteristics**:
  - ✅ No stored tokens - uses cloud provider identity
  - ✅ Automatic credential management
  - ✅ Enhanced security through IAM integration
  - ✅ Audit trail through cloud provider logs

### 6. SCIM Tokens (dp.scim.*)
- **Access Level**: User provisioning only
- **Usage**: Directory synchronization with identity providers
- **Characteristics**:
  - ✅ User management operations only
  - ✅ Integrates with Okta, Azure AD, etc.
  - ✅ Automated user lifecycle management

### 7. Audit Tokens (dp.audit.*)
- **Access Level**: Read-only access to audit logs
- **Usage**: Compliance and monitoring systems
- **Characteristics**:
  - ✅ Read-only access to audit logs
  - ✅ Compliance reporting
  - ✅ Security monitoring integration

## Common Misconceptions

### ❌ Myth: CLI tokens are read-only
**✅ Reality**: CLI tokens (dp.ct.*) have full read/write access based on the user's permissions. They are NOT limited to read-only operations.

### ❌ Myth: Service tokens can only read
**✅ Reality**: Service tokens can be configured with either read-only or read/write access when created.

## Best Practices by Use Case

### Local Development
- Use CLI tokens (dp.ct.*) for full access during development
- These tokens are created automatically when you run `doppler login`

### Production Applications
- Use Service tokens (dp.st.*) with read-only access
- Minimizes risk if token is compromised

### CI/CD Pipelines
- Service tokens for reading secrets during build/deploy
- Service Account tokens if you need to update secrets

### Automation Scripts
- Service Account tokens (dp.sa.*) for cross-project automation
- Personal tokens (dp.pt.*) for user-specific scripts

### MCP Server Integration
- CLI tokens work well for development and testing
- Consider Service Account tokens for production MCP deployments

## Security Recommendations

1. **Principle of Least Privilege**: Use the most restrictive token type that meets your needs
2. **Token Rotation**: Regularly rotate tokens, especially for production
3. **Environment Isolation**: Use different tokens for different environments
4. **Audit Logging**: Monitor token usage through Doppler's audit logs
5. **Never Commit Tokens**: Use environment variables or secure secret storage

## Token Creation Examples

### Create a Read-Only Service Token
```bash
doppler configs tokens create \
  --project "my-app" \
  --config "production" \
  --name "prod-reader" \
  --access "read"
```

### Create a Read/Write Service Token
```bash
doppler configs tokens create \
  --project "my-app" \
  --config "staging" \
  --name "staging-writer" \
  --access "read/write"
```

### Create a Service Account
```bash
# This must be done through the Doppler Dashboard
# Navigate to: Settings → Service Accounts → Create Service Account
```

## MCP Server Token Configuration

For the Doppler MCP server, you can use different token types based on your needs:

### Development (Full Access)
```json
{
  "env": {
    "DOPPLER_TOKEN": "dp.ct.xxxxx"  // CLI token with full read/write
  }
}
```

### Production (Read-Only)
```json
{
  "env": {
    "DOPPLER_TOKEN": "dp.st.xxxxx"  // Service token with read access
  }
}
```

### Automation (Configurable)
```json
{
  "env": {
    "DOPPLER_TOKEN": "dp.sa.xxxxx"  // Service Account token
  }
}
```

Remember: The token type determines not just what operations are allowed, but also the security model and audit trail for your secret management system.