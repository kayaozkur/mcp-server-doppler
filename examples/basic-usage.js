/**
 * Basic Usage Example for MCP Doppler Server
 * 
 * This example shows how to configure and use the simplified MCP Doppler Server
 * with Claude Desktop or other MCP-compatible clients.
 */

// Example 1: Claude Desktop Configuration
// Add this to your claude_desktop_config.json:
const claudeConfig = {
  "mcpServers": {
    "doppler": {
      "command": "npx",
      "args": ["@lepion/mcp-server-doppler"],
      "env": {
        "DOPPLER_TOKEN": "dp.st.your_service_token"
      }
    }
  }
};

console.log("Claude Desktop Configuration:");
console.log(JSON.stringify(claudeConfig, null, 2));

// Example 2: Available Tools
console.log("\n\nAvailable Tools:");
console.log(`
1. List Projects:
   - Tool: doppler_list_projects
   - No parameters required
   - Returns: Array of project objects with id, slug, name, description

2. List Secret Names:
   - Tool: doppler_list_secrets
   - Parameters: { project: "myapp", config: "production" }
   - Returns: Array of secret names (e.g., ["DATABASE_URL", "API_KEY"])

3. Get Secret Value:
   - Tool: doppler_get_secret
   - Parameters: { 
       project: "myapp", 
       config: "production", 
       name: "DATABASE_URL" 
     }
   - Returns: Object with name and value (raw and computed)
`);

// Example 3: Usage Examples in Claude
console.log("\n\nUsage Examples in Claude:");
console.log(`
"List all my Doppler projects"
→ Claude will use doppler_list_projects

"Show me all secrets in the production environment of myapp"
→ Claude will use doppler_list_secrets with project="myapp" and config="production"

"What's the value of DATABASE_URL in staging?"
→ Claude will use doppler_get_secret with the appropriate parameters
`);

// Example 4: Environment Setup
console.log("\n\nEnvironment Setup:");
console.log(`
# Set your Doppler token (use read-only service tokens for security)
export DOPPLER_TOKEN=dp.st.your_service_token

# Optional: Set log level for debugging
export LOG_LEVEL=debug

# Or use a .env file
echo "DOPPLER_TOKEN=dp.st.your_service_token" > .env

# Run the server directly
npx @lepion/mcp-server-doppler

# Or install globally and run
npm install -g @lepion/mcp-server-doppler
mcp-server-doppler
`);