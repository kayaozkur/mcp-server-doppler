#!/usr/bin/env node
/**
 * Simplified Doppler MCP Server
 * Provides read-only access to Doppler secrets
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { DopplerClient } from './doppler-client.js';
import { logger } from './logger.js';
import { TOOLS } from './tools.js';
import { z } from 'zod';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Tool schemas
const ListSecretsSchema = z.object({
  project: z.string().describe('The Doppler project name'),
  config: z.string().describe('The config/environment name (e.g., dev, staging, production)'),
});

const GetSecretSchema = z.object({
  project: z.string().describe('The Doppler project name'),
  config: z.string().describe('The config/environment name'),
  name: z.string().describe('The secret name to retrieve'),
});

export class DopplerMCPServer {
  private server: Server;
  private dopplerClient: DopplerClient;

  constructor() {
    this.server = new Server(
      {
        name: 'mcp-doppler-server',
        version: '0.3.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // Initialize Doppler client with token from environment
    const token = process.env.DOPPLER_TOKEN;
    if (!token) {
      logger.error('DOPPLER_TOKEN environment variable is required');
      process.exit(1);
    }

    this.dopplerClient = new DopplerClient(token);
    this.setupHandlers();
    
    logger.info('Doppler MCP Server started');
  }

  private setupHandlers() {
    // Handle tool listing
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: TOOLS,
    }));

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'doppler_list_projects': {
            const projects = await this.dopplerClient.listProjects();
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(projects, null, 2),
                },
              ],
            };
          }

          case 'doppler_list_secrets': {
            const { project, config } = ListSecretsSchema.parse(args);
            const secrets = await this.dopplerClient.listSecrets(project, config);
            
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(secrets, null, 2),
                },
              ],
            };
          }

          case 'doppler_get_secret': {
            const { project, config, name: secretName } = GetSecretSchema.parse(args);
            const secret = await this.dopplerClient.getSecret(project, config, secretName);
            
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(secret, null, 2),
                },
              ],
            };
          }

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        logger.error(`Tool execution failed: ${name}`, error);
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    });
  }

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    logger.info('Doppler MCP server connected');
  }
}

// Start the server
const server = new DopplerMCPServer();
server.start().catch((error) => {
  logger.error('Failed to start server', error);
  process.exit(1);
});