/**
 * Basic Usage Example for MCP Doppler Server
 * 
 * This example shows how to configure and use the MCP Doppler Server
 * with Claude Desktop or other MCP-compatible clients.
 */

// Example 1: Claude Desktop Configuration
// Add this to your claude_desktop_config.json:
const claudeConfig = {
  "mcpServers": {
    "doppler": {
      "command": "mcp-doppler-server",
      "env": {
        "DOPPLER_TOKEN": "dp.ct.your_token_here"
      }
    }
  }
};

console.log("Claude Desktop Configuration:");
console.log(JSON.stringify(claudeConfig, null, 2));

// Example 2: Using with Python Client
console.log("\n\nPython Client Usage:");
console.log(`
from mcp_doppler_client import MCPDopplerClient

# Initialize client
with MCPDopplerClient() as client:
    # List all projects
    projects = client.list_projects()
    print(f"Found {len(projects)} projects")
    
    # Get secrets from a specific project/config
    secrets = client.list_secrets("myapp", "production")
    print(f"Found {len(secrets)} secrets")
    
    # Set a new secret
    client.set_secret("myapp", "development", "API_KEY", "sk-12345")
    print("Secret set successfully")
`);

// Example 3: Common Operations
console.log("\n\nCommon Doppler Operations via MCP:");
console.log(`
1. List Projects:
   - Tool: doppler_list_projects
   - No parameters required

2. Get All Secrets:
   - Tool: doppler_list_secrets
   - Parameters: { project: "myapp", config: "production" }

3. Set a Secret:
   - Tool: doppler_set_secret
   - Parameters: { 
       project: "myapp", 
       config: "development", 
       name: "DATABASE_URL", 
       value: "postgresql://..." 
     }

4. Promote Secrets:
   - Tool: doppler_promote_secrets
   - Parameters: {
       project: "myapp",
       sourceConfig: "staging",
       targetConfig: "production",
       excludeKeys: ["DEBUG", "DEV_MODE"]
     }

5. Create Service Token:
   - Tool: doppler_create_service_token
   - Parameters: {
       project: "myapp",
       config: "production",
       name: "ci-cd-token",
       access: "read"
     }
`);

// Example 4: Environment Setup
console.log("\n\nEnvironment Setup:");
console.log(`
# Set your Doppler token
export DOPPLER_TOKEN=dp.ct.your_token_here

# Or use a .env file
echo "DOPPLER_TOKEN=dp.ct.your_token_here" > .env

# Run the server
mcp-doppler-server
`);