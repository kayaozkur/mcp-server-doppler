# MCP Doppler Server Examples

This directory contains example code demonstrating how to use the MCP Doppler Server.

## TypeScript Example

The [`using-mcp-server.ts`](./using-mcp-server.ts) file demonstrates:

### Core Features
- **Connecting to MCP Server**: How to spawn and connect to the server
- **Listing Projects**: Retrieve all accessible Doppler projects
- **Managing Secrets**: List, get, set, and delete secrets
- **Environment Promotion**: Promote secrets between configs
- **Service Tokens**: Create read-only tokens for production
- **Activity Logs**: View audit trail
- **Resource Browsing**: Use MCP resources to explore projects
- **Error Handling**: Properly handle API errors

### Running the TypeScript Example

```bash
# Build the MCP server first
npm run build

# Set your Doppler token
export DOPPLER_TOKEN=dp.st.your_token_here

# Run the example
npx tsx examples/using-mcp-server.ts
```

## Integration Patterns

### Direct Client Usage

```typescript
import { Client } from '@modelcontextprotocol/sdk/client/index.js';

const client = new Client({
  name: 'my-app',
  version: '1.0.0',
});

// Connect and call tools
await client.connect(transport);
const result = await client.callTool({
  name: 'doppler_list_projects',
  arguments: {},
});
```

### Application Config Pattern

```typescript
class AppConfig {
  private secrets: Record<string, string> = {};
  
  async loadFromDoppler(project: string, env: string) {
    // Connect to MCP server
    // Load secrets
    // Cache for application use
  }
  
  get databaseUrl(): string {
    return this.secrets.DATABASE_URL || 'sqlite:///local.db';
  }
}
```

## Python Client Example

For Python usage examples, see the Lepion documentation:
[lepion/docs/examples/](../../docs/examples/)

## MCP Protocol Details

The MCP Doppler Server implements the following tools:

| Tool | Description | Arguments |
|------|-------------|-----------|
| `doppler_list_projects` | List all projects | None |
| `doppler_list_secrets` | List secret names | `project`, `config` |
| `doppler_get_secret` | Get secret value | `project`, `config`, `name` |
| `doppler_set_secret` | Create/update secret | `project`, `config`, `name`, `value` |
| `doppler_delete_secrets` | Delete secrets | `project`, `config`, `secrets[]` |
| `doppler_promote_secrets` | Promote between envs | `project`, `sourceConfig`, `targetConfig`, `excludeKeys?` |
| `doppler_create_service_token` | Create token | `project`, `config`, `name`, `access?` |
| `doppler_get_activity_logs` | Get audit logs | `project?`, `page?`, `perPage?` |

## Resources

The server also exposes Doppler projects as MCP resources:
- URI format: `doppler://project/{slug}`
- Reading a project resource returns its configurations
- Reading a config resource returns its secrets

## More Information

- [MCP Doppler Server README](../README.md)
- [API Documentation](../docs/api/)
- [Development Guide](../docs/DEVELOPMENT.md)