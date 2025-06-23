# @lepion/mcp-server-doppler

[![npm version](https://img.shields.io/npm/v/@lepion/mcp-server-doppler.svg)](https://www.npmjs.com/package/@lepion/mcp-server-doppler)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![MCP](https://img.shields.io/badge/MCP-Compatible-green.svg)](https://modelcontextprotocol.io)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org/)

A unified Model Context Protocol (MCP) server that provides secure access to Doppler's secret management platform. This server allows AI assistants like Claude to manage secrets, environment variables, and configurations through Doppler's API.

**Version 0.2.0** combines the original mcp-doppler-server functionality with optional AI-powered intelligence features for enhanced secret management capabilities.

---

## Features

### Core Features (Always Available)
- 🔐 **Secure Secret Management**: Read, write, and delete secrets through MCP
- 📁 **Project Organization**: List and manage Doppler projects and configurations
- 🚀 **Environment Promotion**: Promote secrets between environments (dev → staging → production)
- 🔑 **Service Token Management**: Create service tokens for CI/CD and applications
- 📊 **Audit Logging**: Access activity logs for compliance and monitoring
- 🛡️ **Security First**: All operations respect Doppler's access controls

### Intelligence Features (Optional - Enable with `DOPPLER_ENABLE_INTELLIGENCE=true`)
- 🤖 **AI-Powered Analysis**: Security recommendations and best practices
- 🔍 **Configuration Validation**: Automated checks against security standards
- 🛠️ **Intelligent Troubleshooting**: AI assistance for common issues
- 📈 **Enhanced Tool Parameters**: Additional analysis options on existing tools

## Installation

```bash
# Install from npm (recommended)
npm install -g @lepion/mcp-server-doppler

# Or clone the repository for development
git clone https://github.com/lepion/mcp-server-doppler.git
cd mcp-server-doppler

# Install dependencies
npm install

# Build the TypeScript code
npm run build
```

## What's New in v0.2.0

The unified implementation brings together the best of both worlds:

### 🚀 Key Benefits
- **Single Package**: One installation for all features
- **Opt-in Intelligence**: Enable AI features only when needed
- **Zero Breaking Changes**: Existing integrations work without modification
- **Progressive Enhancement**: Use basic features now, add intelligence later
- **Smaller Footprint**: Intelligence code only loaded when enabled

### 📦 Upgrading from v0.1.x

Version 0.2.0 maintains full backward compatibility:

- All existing tools work exactly as before
- No configuration changes required for basic functionality
- Intelligence features are opt-in via `DOPPLER_ENABLE_INTELLIGENCE=true`
- Enhanced parameters on existing tools are optional and backward compatible

To upgrade:
```bash
npm update @lepion/mcp-server-doppler
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Required: Your Doppler API token
DOPPLER_TOKEN=dp.st.xxxx

# Optional: Log level (debug, info, warn, error)
LOG_LEVEL=info

# Optional: Enable AI-powered intelligence features (default: false)
DOPPLER_ENABLE_INTELLIGENCE=true
```

### Getting a Doppler Token

1. **Personal Token** (for development):
   - Go to [Doppler Dashboard](https://dashboard.doppler.com)
   - Navigate to Settings → API → Personal Tokens
   - Create a new token with appropriate permissions

2. **Service Account Token** (for production):
   - Go to Settings → Service Accounts
   - Create a service account with specific project access
   - Generate a token for the service account

## Usage

### Running the Server

```bash
# Development mode (with hot reload)
npm run dev

# Production mode
npm start
```

### Integration with Claude Desktop

Add the following to your Claude Desktop configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "doppler": {
      "command": "npx",
      "args": ["@lepion/mcp-server-doppler"],
      "env": {
        "DOPPLER_TOKEN": "your-doppler-token",
        "DOPPLER_ENABLE_INTELLIGENCE": "true"  // Optional: enable AI features
      }
    }
  }
}
```

Or if installed locally:

```json
{
  "mcpServers": {
    "doppler": {
      "command": "node",
      "args": ["/path/to/mcp-server-doppler/dist/index.js"],
      "env": {
        "DOPPLER_TOKEN": "your-doppler-token"
      }
    }
  }
}
```

## Available Tools

The server provides 8 core tools plus 3 optional intelligence tools when `DOPPLER_ENABLE_INTELLIGENCE=true`.

### Core Tools (Always Available)

All core tools maintain full backward compatibility. When intelligence features are enabled, they support additional optional parameters:

### 1. `doppler_list_projects`
List all available Doppler projects.

```typescript
// Basic usage (always available)
{}

// With intelligence enabled, you can also use:
{
  includeAnalysis?: boolean  // Include project health and security analysis
}
```

### 2. `doppler_list_secrets`
List all secret names in a specific project/config.

```typescript
// Basic usage (always available)
{
  project: "my-app",
  config: "production"
}

// With intelligence enabled, you can also use:
{
  project: "my-app",
  config: "production",
  includeAnalysis?: boolean    // Include security analysis of secrets
  validateNaming?: boolean     // Check against naming conventions
}
```

### 3. `doppler_get_secret`
Retrieve a specific secret value.

```typescript
// Basic usage (always available)
{
  project: "my-app",
  config: "production",
  name: "DATABASE_URL"
}

// With intelligence enabled, you can also use:
{
  project: "my-app",
  config: "production",
  name: "DATABASE_URL",
  includeContext?: boolean     // Include usage context and recommendations
}
```

### 4. `doppler_set_secret`
Create or update a secret.

```typescript
// Basic usage (always available)
{
  project: "my-app",
  config: "development",
  name: "API_KEY",
  value: "sk-1234567890"
}

// With intelligence enabled, you can also use:
{
  project: "my-app",
  config: "development",
  name: "API_KEY",
  value: "sk-1234567890",
  validateSecurity?: boolean   // Basic security validation
  checkNaming?: boolean        // Validate naming conventions
}
```

### 5. `doppler_delete_secrets`
Delete one or more secrets.

```typescript
{
  project: "my-app",
  config: "development",
  secrets: ["OLD_API_KEY", "UNUSED_TOKEN"]
}
```

### 6. `doppler_promote_secrets`
Promote secrets from one environment to another.

```typescript
// Basic usage (always available)
{
  project: "my-app",
  sourceConfig: "staging",
  targetConfig: "production",
  excludeKeys: ["DEBUG", "DEV_MODE"]  // optional
}

// With intelligence enabled, you can also use:
{
  project: "my-app",
  sourceConfig: "staging",
  targetConfig: "production",
  excludeKeys: ["DEBUG", "DEV_MODE"],  // optional
  autoExclude?: boolean,               // Auto-exclude environment-specific secrets
  dryRun?: boolean                     // Preview changes without applying
}
```

### 7. `doppler_create_service_token`
Create a service token for CI/CD or application access.

```typescript
{
  project: "my-app",
  config: "production",
  name: "ci-cd-token",
  access: "read"  // or "read/write"
}
```

### 8. `doppler_get_activity_logs`
Retrieve audit logs for compliance and monitoring.

```typescript
{
  project: "my-app",  // optional
  page: 1,
  perPage: 20
}
```

### Intelligence Tools (Available When `DOPPLER_ENABLE_INTELLIGENCE=true`)

These additional tools provide AI-powered assistance for secret management:

### 9. `doppler_get_security_recommendations`
Get AI-powered security recommendations based on environment and token type.

```typescript
{
  environment: "development" | "staging" | "production",  // Required
  tokenType?: "personal" | "service" | "cli"             // Optional
}
```

Example response includes:
- Environment-specific best practices
- Token type recommendations
- Security hardening suggestions
- Compliance considerations

### 10. `doppler_validate_configuration`
Validate your project configuration against security standards.

```typescript
{
  project: "my-app",           // Required
  config: "production",        // Required
  checkSecurity?: boolean      // Optional, defaults to true
}
```

Validates:
- Secret naming conventions
- Environment-appropriate configurations
- Security policy compliance
- Configuration completeness

### 11. `doppler_troubleshoot_issue`
Get AI assistance for troubleshooting Doppler-related issues.

```typescript
{
  issue: "Database connection failing with timeout",  // Required
  context?: {                                        // Optional
    operation?: string,     // e.g., "secret retrieval"
    environment?: string    // e.g., "production"
  }
}
```

Provides:
- Root cause analysis
- Step-by-step resolution guidance
- Common pitfalls and solutions
- Best practice recommendations

## Resources

The server also exposes Doppler projects as MCP resources:

- **URI Format**: `doppler://project/{project-slug}`
- **Content**: JSON representation of project configurations

Example:
```
doppler://project/my-app
doppler://project/my-app/config/production
```

## Examples

See the [examples directory](./examples/) for complete usage examples:

- **[TypeScript Example](./examples/using-mcp-server.ts)**: Shows how to use the MCP server from a TypeScript application
- **[Examples README](./examples/README.md)**: Detailed documentation of all examples

Quick example:
```typescript
import { Client } from '@modelcontextprotocol/sdk/client/index.js';

const result = await client.callTool({
  name: 'doppler_list_projects',
  arguments: {},
});
```

## Security Best Practices

1. **Token Security**:
   - Never commit tokens to version control
   - Use service account tokens for production
   - Rotate tokens regularly

2. **Access Control**:
   - Use read-only tokens where write access isn't needed
   - Scope tokens to specific projects/configs
   - Enable audit logging for compliance

3. **Environment Isolation**:
   - Separate tokens for different environments
   - Use environment-specific service accounts
   - Implement proper secret rotation

## Development

### Project Structure

```
mcp-server-doppler/
├── src/
│   ├── index.ts              # Unified server entry point
│   ├── doppler-client.ts     # Doppler API client
│   ├── tools.ts              # Core tool definitions
│   ├── intelligence-tools.ts # Optional AI-powered tools
│   ├── enhanced-index.ts     # Legacy enhanced entry point
│   └── logger.ts             # Winston logger configuration
├── dist/                     # Compiled JavaScript
├── examples/                 # Usage examples
├── package.json
├── tsconfig.json
└── README.md
```

### Scripts

- `npm run build` - Compile TypeScript
- `npm run dev` - Run in development mode
- `npm start` - Run production server
- `npm test` - Run tests
- `npm run lint` - Lint code
- `npm run format` - Format code with Prettier

## Error Handling

The server includes comprehensive error handling:

- API rate limit detection and backoff
- Network error recovery
- Invalid token detection
- Detailed error messages for debugging

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Changelog

### v0.2.0 (2025-06-23)
- 🎉 **Unified Implementation**: Combined original and enhanced features into single codebase
- 🤖 **Optional Intelligence**: Added 3 AI-powered tools (disabled by default)
- 📈 **Enhanced Parameters**: Core tools now support optional analysis parameters
- 🔄 **Full Backward Compatibility**: All existing integrations continue to work unchanged
- 📦 **Package Rename**: Now published as `@lepion/mcp-server-doppler`
- 🛠️ **Improved Error Handling**: Better error messages and recovery

### v0.1.0
- Initial release with 8 core Doppler management tools
- Basic MCP server implementation
- Support for all major Doppler operations

## License

MIT License - see LICENSE file for details

## Python Client Integration

For Python applications, you can use the MCP client to interact with the server:

```python
from mcp_doppler_client import MCPDopplerClient

with MCPDopplerClient() as client:
    # List all projects
    projects = client.list_projects()
    
    # Get secrets from a project/config
    secrets = client.list_secrets("myapp", "production")
    
    # Set a secret
    client.set_secret("myapp", "development", "API_KEY", "sk-12345")
```

See the examples directory for complete integration examples.

## Token Types

Doppler supports several token types:

- **CLI Tokens** (`dp.ct.*`) - Full read/write access based on user permissions
- **Personal Tokens** (`dp.pt.*`) - User-specific API access
- **Service Tokens** (`dp.st.*`) - Typically read-only for production
- **Service Account Tokens** (`dp.sa.*`) - Read/write for automation

For AI assistants, we recommend:
- CLI tokens for development (full access)
- Service tokens for production (read-only)

## Example Use Cases

Once configured, you can ask Claude to:

### Basic Operations (Always Available)
- "List all my Doppler projects"
- "Show me the secrets in the production environment"
- "Update the DATABASE_URL in staging"
- "Create a read-only service token for the API"
- "Promote all secrets from development to staging, excluding DEBUG keys"
- "Show me the activity logs for the last hour"
- "Delete the OLD_API_KEY from all environments"

### With Intelligence Features Enabled
- "Get security recommendations for my production environment"
- "Validate my production configuration against best practices"
- "Help troubleshoot why my database connection is failing"
- "Analyze the security of my API secrets"
- "Check if my secret naming follows conventions"
- "Preview what would be promoted from staging to production"

## Troubleshooting

### Common Issues

1. **"DOPPLER_TOKEN not found"**
   - Ensure the token is set in your Claude Desktop config
   - Verify the token is valid and has appropriate permissions

2. **"Failed to list secrets"**
   - Check that the project and config names are correct
   - Verify the token has access to the specified project

3. **"Rate limit exceeded"**
   - The server implements automatic retry with backoff
   - Consider using a service account token for higher limits

## Related Projects

- [Doppler CLI](https://docs.doppler.com/docs/cli) - Official Doppler command-line tool
- [Model Context Protocol](https://modelcontextprotocol.io) - MCP specification and documentation

## Support

- 📧 Email: support@lepion.io
- 🐛 Issues: [GitHub Issues](https://github.com/lepion/mcp-server-doppler/issues)
- 📖 Doppler Docs: [docs.doppler.com](https://docs.doppler.com)
- 🤖 MCP Docs: [modelcontextprotocol.io](https://modelcontextprotocol.io)
