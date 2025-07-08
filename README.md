# Doppler MCP Server

A simplified Model Context Protocol (MCP) server for read-only access to Doppler secrets management platform.

## Features

This MCP server provides three essential tools for accessing Doppler secrets:

- **doppler_list_projects** - List all Doppler projects accessible to your token
- **doppler_list_secrets** - List all secret names in a specific project/config
- **doppler_get_secret** - Get the value of a specific secret

## Installation

```bash
npm install @lepion/mcp-server-doppler
```

## Configuration

Set up your environment variables:

```bash
# Required
DOPPLER_TOKEN=your_doppler_token  # Service token, personal token, or CLI token

# Optional
LOG_LEVEL=info                     # debug, info, warn, error (default: info)
```

## Usage

### With Claude Desktop

Add to your Claude Desktop configuration (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "doppler": {
      "command": "npx",
      "args": ["@lepion/mcp-server-doppler"],
      "env": {
        "DOPPLER_TOKEN": "dp.st.your_service_token"
      }
    }
  }
}
```

### Available Tools

#### 1. doppler_list_projects
Lists all Doppler projects accessible by the token.

**Parameters:** None

**Example:**
```javascript
// Response
[
  {
    "id": "proj_123",
    "slug": "my-project",
    "name": "My Project",
    "description": "Production application",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
]
```

#### 2. doppler_list_secrets
Lists all secret names in a specific project and config.

**Parameters:**
- `project` (string, required) - The Doppler project name
- `config` (string, required) - The config/environment name (e.g., dev, staging, production)

**Example:**
```javascript
// Request
{
  "project": "my-project",
  "config": "production"
}

// Response
["DATABASE_URL", "API_KEY", "REDIS_URL", "JWT_SECRET"]
```

#### 3. doppler_get_secret
Retrieves a specific secret value.

**Parameters:**
- `project` (string, required) - The Doppler project name
- `config` (string, required) - The config/environment name
- `name` (string, required) - The secret name to retrieve

**Example:**
```javascript
// Request
{
  "project": "my-project",
  "config": "production",
  "name": "DATABASE_URL"
}

// Response
{
  "name": "DATABASE_URL",
  "value": {
    "raw": "postgres://user:pass@host:5432/db",
    "computed": "postgres://user:pass@host:5432/db"
  }
}
```

## Security Best Practices

1. **Use Service Tokens**: Always use scoped service tokens instead of personal tokens for production use
2. **Limit Token Scope**: Create tokens with read-only access and scope them to specific projects/configs
3. **Rotate Tokens**: Regularly rotate your Doppler tokens
4. **Never Commit Tokens**: Never commit Doppler tokens to version control

## Development

```bash
# Clone the repository
git clone https://github.com/kayaozkur/mcp-server-doppler.git
cd mcp-server-doppler

# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## Requirements

- Node.js 18 or higher
- Valid Doppler account and API token

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.