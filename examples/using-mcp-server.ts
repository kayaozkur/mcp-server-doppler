#!/usr/bin/env tsx
/**
 * Example: Using the MCP Doppler Server in TypeScript Applications
 * 
 * This example demonstrates how to interact with the MCP Doppler Server
 * using the Model Context Protocol SDK.
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { spawn } from 'child_process';
import * as path from 'path';

// Types for better TypeScript support
interface DopplerProject {
  id: string;
  slug: string;
  name: string;
  description?: string;
  created_at: string;
}

interface DopplerSecret {
  name: string;
  value?: {
    raw: string;
    computed: string;
  };
}

class MCPDopplerExample {
  private client: Client;
  private transport: StdioClientTransport;

  constructor() {
    this.client = new Client({
      name: 'doppler-example-client',
      version: '1.0.0',
    }, {
      capabilities: {}
    });
  }

  /**
   * Connect to the MCP Doppler Server
   */
  async connect(): Promise<void> {
    // Spawn the MCP server process
    const serverPath = path.join(__dirname, '..', 'dist', 'index.js');
    const serverProcess = spawn('node', [serverPath], {
      env: {
        ...process.env,
        DOPPLER_TOKEN: process.env.DOPPLER_TOKEN || '',
      },
    });

    // Create transport
    this.transport = new StdioClientTransport({
      command: 'node',
      args: [serverPath],
      env: {
        ...process.env,
        DOPPLER_TOKEN: process.env.DOPPLER_TOKEN || '',
      },
    });

    // Connect
    await this.client.connect(this.transport);
    console.log('✓ Connected to MCP Doppler Server');
  }

  /**
   * Disconnect from the server
   */
  async disconnect(): Promise<void> {
    await this.client.close();
    console.log('✓ Disconnected from MCP Doppler Server');
  }

  /**
   * Example 1: List all projects
   */
  async example1_listProjects(): Promise<void> {
    console.log('\n=== Example 1: List Projects ===');
    
    const result = await this.client.callTool({
      name: 'doppler_list_projects',
      arguments: {},
    });

    const projects: DopplerProject[] = JSON.parse(result.content[0].text);
    console.log(`Found ${projects.length} projects:`);
    projects.forEach(project => {
      console.log(`  - ${project.slug}: ${project.name}`);
    });
  }

  /**
   * Example 2: List secrets in a specific project/config
   */
  async example2_listSecrets(): Promise<void> {
    console.log('\n=== Example 2: List Secrets ===');
    
    const result = await this.client.callTool({
      name: 'doppler_list_secrets',
      arguments: {
        project: 'lepion',
        config: 'development',
      },
    });

    const secrets: string[] = JSON.parse(result.content[0].text);
    console.log(`Found ${secrets.length} secrets in lepion/development:`);
    secrets.slice(0, 5).forEach(secret => {
      console.log(`  - ${secret}`);
    });
    if (secrets.length > 5) {
      console.log(`  ... and ${secrets.length - 5} more`);
    }
  }

  /**
   * Example 3: Get a specific secret
   */
  async example3_getSecret(): Promise<void> {
    console.log('\n=== Example 3: Get Specific Secret ===');
    
    const result = await this.client.callTool({
      name: 'doppler_get_secret',
      arguments: {
        project: 'lepion',
        config: 'development',
        name: 'DATABASE_URL',
      },
    });

    const secret: DopplerSecret = JSON.parse(result.content[0].text);
    console.log(`Secret '${secret.name}':`);
    console.log(`  Raw value: ${secret.value?.raw.substring(0, 30)}...`);
  }

  /**
   * Example 4: Set and update secrets
   */
  async example4_setSecret(): Promise<void> {
    console.log('\n=== Example 4: Set/Update Secret ===');
    
    // Set a new secret
    console.log('Setting new secret...');
    const setResult = await this.client.callTool({
      name: 'doppler_set_secret',
      arguments: {
        project: 'lepion',
        config: 'development',
        name: 'EXAMPLE_TS_KEY',
        value: 'example-value-123',
      },
    });
    console.log(setResult.content[0].text);

    // Update the secret
    console.log('Updating secret...');
    const updateResult = await this.client.callTool({
      name: 'doppler_set_secret',
      arguments: {
        project: 'lepion',
        config: 'development',
        name: 'EXAMPLE_TS_KEY',
        value: 'updated-value-456',
      },
    });
    console.log(updateResult.content[0].text);
  }

  /**
   * Example 5: Delete secrets
   */
  async example5_deleteSecret(): Promise<void> {
    console.log('\n=== Example 5: Delete Secret ===');
    
    const result = await this.client.callTool({
      name: 'doppler_delete_secrets',
      arguments: {
        project: 'lepion',
        config: 'development',
        secrets: ['EXAMPLE_TS_KEY'],
      },
    });
    console.log(result.content[0].text);
  }

  /**
   * Example 6: Promote secrets between environments
   */
  async example6_promoteSecrets(): Promise<void> {
    console.log('\n=== Example 6: Promote Secrets ===');
    
    const result = await this.client.callTool({
      name: 'doppler_promote_secrets',
      arguments: {
        project: 'lepion',
        sourceConfig: 'development',
        targetConfig: 'staging',
        excludeKeys: ['DEBUG', 'LOCAL_ONLY'],
      },
    });
    console.log(result.content[0].text);
  }

  /**
   * Example 7: Create service token
   */
  async example7_createServiceToken(): Promise<void> {
    console.log('\n=== Example 7: Create Service Token ===');
    
    const result = await this.client.callTool({
      name: 'doppler_create_service_token',
      arguments: {
        project: 'lepion',
        config: 'production',
        name: 'example-readonly-token',
        access: 'read',
      },
    });
    console.log(result.content[0].text);
    console.log('\n⚠️  Save the token securely - it won\'t be shown again!');
  }

  /**
   * Example 8: View activity logs
   */
  async example8_activityLogs(): Promise<void> {
    console.log('\n=== Example 8: Activity Logs ===');
    
    const result = await this.client.callTool({
      name: 'doppler_get_activity_logs',
      arguments: {
        page: 1,
        perPage: 5,
      },
    });

    const response = JSON.parse(result.content[0].text);
    console.log('Recent activities:');
    response.logs?.forEach((log: any) => {
      console.log(`  - ${log.created_at}: ${log.text}`);
    });
  }

  /**
   * Example 9: Using resources to browse projects
   */
  async example9_useResources(): Promise<void> {
    console.log('\n=== Example 9: Browse Resources ===');
    
    // List available resources (projects)
    const resources = await this.client.listResources();
    console.log(`Available resources: ${resources.resources.length}`);
    resources.resources.slice(0, 3).forEach(resource => {
      console.log(`  - ${resource.uri}: ${resource.name}`);
    });

    // Read a specific project's configs
    if (resources.resources.length > 0) {
      const projectUri = resources.resources[0].uri;
      console.log(`\nReading configs for ${projectUri}...`);
      
      const projectData = await this.client.readResource({
        uri: projectUri,
      });
      
      const configs = JSON.parse(projectData.contents[0].text);
      console.log(`Found ${configs.length} configs`);
    }
  }

  /**
   * Example 10: Error handling
   */
  async example10_errorHandling(): Promise<void> {
    console.log('\n=== Example 10: Error Handling ===');
    
    try {
      await this.client.callTool({
        name: 'doppler_get_secret',
        arguments: {
          project: 'non-existent-project',
          config: 'development',
          name: 'SOME_KEY',
        },
      });
    } catch (error) {
      console.log('Expected error caught:', error.message);
    }
  }
}

/**
 * Application configuration pattern using MCP
 */
class AppConfigWithMCP {
  private secrets: Record<string, string> = {};
  private mcpClient: MCPDopplerExample;

  constructor(
    private project: string,
    private environment: string
  ) {
    this.mcpClient = new MCPDopplerExample();
  }

  async initialize(): Promise<void> {
    try {
      await this.mcpClient.connect();
      
      // Load all secrets
      const client = (this.mcpClient as any).client; // Access private client
      const result = await client.callTool({
        name: 'doppler_list_secrets',
        arguments: {
          project: this.project,
          config: this.environment,
        },
      });

      const secretNames: string[] = JSON.parse(result.content[0].text);
      console.log(`✓ Loaded ${secretNames.length} secret names from Doppler`);
      
      // In a real app, you'd fetch actual values as needed
      // For demo, we'll just store the names
      secretNames.forEach(name => {
        this.secrets[name] = `<value-of-${name}>`;
      });
      
      await this.mcpClient.disconnect();
    } catch (error) {
      console.log('⚠️  Failed to load from Doppler:', error.message);
      console.log('   Falling back to environment variables');
      this.secrets = process.env as any;
    }
  }

  get(key: string, defaultValue?: string): string | undefined {
    return this.secrets[key] || defaultValue;
  }

  get databaseUrl(): string {
    return this.get('DATABASE_URL', 'sqlite:///local.db');
  }

  get apiKey(): string | undefined {
    return this.get('API_KEY');
  }

  get debug(): boolean {
    return this.get('DEBUG', 'false').toLowerCase() === 'true';
  }
}

/**
 * Main function to run all examples
 */
async function main() {
  console.log('MCP Doppler Server TypeScript Examples');
  console.log('=' .repeat(50));

  // Check for token
  if (!process.env.DOPPLER_TOKEN) {
    console.error('Error: DOPPLER_TOKEN not set');
    console.error('Please set: export DOPPLER_TOKEN=your_token_here');
    process.exit(1);
  }

  const examples = new MCPDopplerExample();

  try {
    // Connect to server
    await examples.connect();

    // Run examples
    await examples.example1_listProjects();
    await examples.example2_listSecrets();
    await examples.example3_getSecret();
    await examples.example4_setSecret();
    await examples.example5_deleteSecret();
    await examples.example6_promoteSecrets();
    await examples.example7_createServiceToken();
    await examples.example8_activityLogs();
    await examples.example9_useResources();
    await examples.example10_errorHandling();

    // Disconnect
    await examples.disconnect();

    // Demo application config pattern
    console.log('\n=== Application Config Pattern ===');
    const appConfig = new AppConfigWithMCP('lepion', 'development');
    await appConfig.initialize();
    console.log(`Database URL: ${appConfig.databaseUrl}`);
    console.log(`Debug mode: ${appConfig.debug}`);

  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main().catch(console.error);
}

export { MCPDopplerExample, AppConfigWithMCP };