# MCP Doppler Server

[![npm version](https://img.shields.io/npm/v/mcp-doppler-server.svg)](https://www.npmjs.com/package/mcp-doppler-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![MCP](https://img.shields.io/badge/MCP-Compatible-green.svg)](https://modelcontextprotocol.io)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org/)

A Model Context Protocol (MCP) server that provides secure access to Doppler's secret management platform. This server allows AI assistants like Claude to manage secrets, environment variables, and configurations through Doppler's API.

---

## Features

- 🔐 **Secure Secret Management**: Read, write, and delete secrets through MCP
- 📁 **Project Organization**: List and manage Doppler projects and configurations
- 🚀 **Environment Promotion**: Promote secrets between environments (dev → staging → production)
- 🔑 **Service Token Management**: Create service tokens for CI/CD and applications
- 📊 **Audit Logging**: Access activity logs for compliance and monitoring
- 🛡️ **Security First**: All operations respect Doppler's access controls

## Installation

```bash
# Install from npm (recommended)
npm install -g mcp-doppler-server

# Or clone the repository for development
git clone https://github.com/kayaozkur/mcp-doppler-server.git
cd mcp-doppler-server

# Install dependencies
npm install

# Build the TypeScript code
npm run build
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Required: Your Doppler API token
DOPPLER_TOKEN=dp.st.xxxx

# Optional: Log level (debug, info, warn, error)
LOG_LEVEL=info
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
      "command": "mcp-doppler-server",
      "env": {
        "DOPPLER_TOKEN": "your-doppler-token"
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
      "args": ["/path/to/mcp-doppler-server/dist/index.js"],
      "env": {
        "DOPPLER_TOKEN": "your-doppler-token"
      }
    }
  }
}
```

## Available Tools

### 1. `doppler_list_projects`
List all available Doppler projects.

```typescript
// No parameters required
```

### 2. `doppler_list_secrets`
List all secret names in a specific project/config.

```typescript
{
  project: "my-app",
  config: "production"
}
```

### 3. `doppler_get_secret`
Retrieve a specific secret value.

```typescript
{
  project: "my-app",
  config: "production",
  name: "DATABASE_URL"
}
```

### 4. `doppler_set_secret`
Create or update a secret.

```typescript
{
  project: "my-app",
  config: "development",
  name: "API_KEY",
  value: "sk-1234567890"
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
{
  project: "my-app",
  sourceConfig: "staging",
  targetConfig: "production",
  excludeKeys: ["DEBUG", "DEV_MODE"]  // optional
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

## Resources

The server also exposes Doppler projects as MCP resources:

- **URI Format**: `doppler://project/{project-slug}`
- **Content**: JSON representation of project configurations

Example:
```
doppler://project/my-app
doppler://project/my-app/config/production
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
mcp-doppler-server/
├── src/
│   ├── index.ts          # Main server entry point
│   ├── doppler-client.ts # Doppler API client
│   └── logger.ts         # Winston logger configuration
├── dist/                 # Compiled JavaScript
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

See the [Lepion project](https://github.com/kayaozkur/lepion) for a complete Python integration example.

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

- "List all my Doppler projects"
- "Show me the secrets in the production environment"
- "Update the DATABASE_URL in staging"
- "Create a read-only service token for the API"
- "Promote all secrets from development to staging, excluding DEBUG keys"
- "Show me the activity logs for the last hour"
- "Delete the OLD_API_KEY from all environments"

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

- [Lepion](https://github.com/kayaozkur/lepion) - Comprehensive secret management system with MCP integration
- [Doppler CLI](https://docs.doppler.com/docs/cli) - Official Doppler command-line tool
- [Model Context Protocol](https://modelcontextprotocol.io) - MCP specification and documentation

## Support

- 📧 Email: kayaozkur@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/kayaozkur/mcp-doppler-server/issues)
- 📖 Doppler Docs: [docs.doppler.com](https://docs.doppler.com)
- 🤖 MCP Docs: [modelcontextprotocol.io](https://modelcontextprotocol.io)
