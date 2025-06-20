<div align="center">
  <img src="https://github.com/kayaozkur/mcp-doppler-server/raw/main/docs/logo.png" alt="Doppler MCP Server Logo" width="200"/>
  
  # Doppler MCP Server
  
  **A Model Context Protocol (MCP) server for Doppler secret management**
  
  [![npm version](https://badge.fury.io/js/mcp-doppler-server.svg)](https://badge.fury.io/js/mcp-doppler-server)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Node.js Version](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org/)
  
  *Enabling AI models to securely interact with Doppler secrets and configurations*
  
  [Installation](#installation) • [Configuration](#configuration) • [Usage](#usage) • [API Reference](#available-tools) • [Contributing](#contributing)
  
</div>

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

## Support

- **Doppler Documentation**: https://docs.doppler.com
- **MCP Documentation**: https://modelcontextprotocol.io
- **Issues**: https://github.com/kayaozkur/mcp-doppler-server/issues
