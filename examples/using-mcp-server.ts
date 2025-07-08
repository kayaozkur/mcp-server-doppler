#!/usr/bin/env tsx
/**
 * Example: Using the Simplified MCP Doppler Server in TypeScript Applications
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
        project: 'myapp',
        config: 'development',
      },
    });

    const secrets: string[] = JSON.parse(result.content[0].text);
    console.log(`Found ${secrets.length} secrets in myapp/development:`);
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
        project: 'myapp',
        config: 'development',
        name: 'DATABASE_URL',
      },
    });

    const secret: DopplerSecret = JSON.parse(result.content[0].text);
    console.log(`Secret '${secret.name}':`);
    console.log(`  Raw value: ${secret.value?.raw.substring(0, 30)}...`);
  }

  /**
   * Example 4: Error handling
   */
  async example4_errorHandling(): Promise<void> {
    console.log('\n=== Example 4: Error Handling ===');
    
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
    await examples.example4_errorHandling();

    // Disconnect
    await examples.disconnect();

    // Demo application config pattern
    console.log('\n=== Application Config Pattern ===');
    const appConfig = new AppConfigWithMCP('myapp', 'development');
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