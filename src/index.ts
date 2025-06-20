#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
  Tool,
  Resource,
} from '@modelcontextprotocol/sdk/types.js';
import { DopplerClient } from './doppler-client.js';
import { logger } from './logger.js';
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

const SetSecretSchema = z.object({
  project: z.string().describe('The Doppler project name'),
  config: z.string().describe('The config/environment name'),
  name: z.string().describe('The secret name'),
  value: z.string().describe('The secret value'),
});

const DeleteSecretSchema = z.object({
  project: z.string().describe('The Doppler project name'),
  config: z.string().describe('The config/environment name'),
  secrets: z.array(z.string()).describe('Array of secret names to delete'),
});

const PromoteSecretsSchema = z.object({
  project: z.string().describe('The Doppler project name'),
  sourceConfig: z.string().describe('Source config/environment'),
  targetConfig: z.string().describe('Target config/environment'),
  excludeKeys: z.array(z.string()).optional().describe('Keys to exclude from promotion'),
});

const CreateServiceTokenSchema = z.object({
  project: z.string().describe('The Doppler project name'),
  config: z.string().describe('The config/environment name'),
  name: z.string().describe('Token name'),
  access: z.enum(['read', 'read/write']).optional().default('read').describe('Token access level'),
});

const GetActivityLogsSchema = z.object({
  project: z.string().optional().describe('Filter by project'),
  page: z.number().optional().default(1).describe('Page number'),
  perPage: z.number().optional().default(20).describe('Items per page'),
});

// Define available tools
const TOOLS: Tool[] = [
  {
    name: 'doppler_list_projects',
    description: 'List all Doppler projects',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'doppler_list_secrets',
    description: 'List all secret names in a project/config',
    inputSchema: {
      type: 'object',
      properties: {
        project: { type: 'string', description: 'The Doppler project name' },
        config: { type: 'string', description: 'The config/environment name' },
      },
      required: ['project', 'config'],
    },
  },
  {
    name: 'doppler_get_secret',
    description: 'Get a specific secret value',
    inputSchema: {
      type: 'object',
      properties: {
        project: { type: 'string', description: 'The Doppler project name' },
        config: { type: 'string', description: 'The config/environment name' },
        name: { type: 'string', description: 'The secret name to retrieve' },
      },
      required: ['project', 'config', 'name'],
    },
  },
  {
    name: 'doppler_set_secret',
    description: 'Set or update a secret value',
    inputSchema: {
      type: 'object',
      properties: {
        project: { type: 'string', description: 'The Doppler project name' },
        config: { type: 'string', description: 'The config/environment name' },
        name: { type: 'string', description: 'The secret name' },
        value: { type: 'string', description: 'The secret value' },
      },
      required: ['project', 'config', 'name', 'value'],
    },
  },
  {
    name: 'doppler_delete_secrets',
    description: 'Delete one or more secrets',
    inputSchema: {
      type: 'object',
      properties: {
        project: { type: 'string', description: 'The Doppler project name' },
        config: { type: 'string', description: 'The config/environment name' },
        secrets: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of secret names to delete',
        },
      },
      required: ['project', 'config', 'secrets'],
    },
  },
  {
    name: 'doppler_promote_secrets',
    description: 'Promote secrets from one environment to another',
    inputSchema: {
      type: 'object',
      properties: {
        project: { type: 'string', description: 'The Doppler project name' },
        sourceConfig: { type: 'string', description: 'Source config/environment' },
        targetConfig: { type: 'string', description: 'Target config/environment' },
        excludeKeys: {
          type: 'array',
          items: { type: 'string' },
          description: 'Keys to exclude from promotion',
        },
      },
      required: ['project', 'sourceConfig', 'targetConfig'],
    },
  },
  {
    name: 'doppler_create_service_token',
    description: 'Create a service token for a project/config',
    inputSchema: {
      type: 'object',
      properties: {
        project: { type: 'string', description: 'The Doppler project name' },
        config: { type: 'string', description: 'The config/environment name' },
        name: { type: 'string', description: 'Token name' },
        access: {
          type: 'string',
          enum: ['read', 'read/write'],
          description: 'Token access level',
        },
      },
      required: ['project', 'config', 'name'],
    },
  },
  {
    name: 'doppler_get_activity_logs',
    description: 'Get activity logs for auditing',
    inputSchema: {
      type: 'object',
      properties: {
        project: { type: 'string', description: 'Filter by project' },
        page: { type: 'number', description: 'Page number' },
        perPage: { type: 'number', description: 'Items per page' },
      },
    },
  },
];

class DopplerMCPServer {
  private server: Server;
  private dopplerClient: DopplerClient;

  constructor() {
    this.server = new Server(
      {
        name: 'doppler-mcp-server',
        version: '0.1.0',
      },
      {
        capabilities: {
          resources: {},
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
  }

  private setupHandlers() {
    // Handle tool listing
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: TOOLS,
    }));

    // Handle resource listing
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      try {
        const projects = await this.dopplerClient.listProjects();
        const resources: Resource[] = projects.map((project) => ({
          uri: `doppler://project/${project.slug}`,
          name: project.name,
          description: project.description || `Doppler project: ${project.name}`,
          mimeType: 'application/json',
        }));

        return { resources };
      } catch (error) {
        logger.error('Failed to list resources', error);
        return { resources: [] };
      }
    });

    // Handle resource reading
    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const uri = request.params.uri;
      const match = uri.match(/^doppler:\/\/project\/([^\/]+)(?:\/config\/([^\/]+))?$/);

      if (!match) {
        throw new Error('Invalid resource URI format');
      }

      const [, projectSlug, configName] = match;

      try {
        if (configName) {
          // Get secrets for specific config
          const secrets = await this.dopplerClient.listSecrets(projectSlug, configName);
          return {
            contents: [
              {
                uri,
                mimeType: 'application/json',
                text: JSON.stringify(secrets, null, 2),
              },
            ],
          };
        } else {
          // Get project configs
          const configs = await this.dopplerClient.listConfigs(projectSlug);
          return {
            contents: [
              {
                uri,
                mimeType: 'application/json',
                text: JSON.stringify(configs, null, 2),
              },
            ],
          };
        }
      } catch (error) {
        logger.error('Failed to read resource', { uri, error });
        throw error;
      }
    });

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

          case 'doppler_set_secret': {
            const { project, config, name: secretName, value } = SetSecretSchema.parse(args);
            const result = await this.dopplerClient.setSecret(project, config, secretName, value);
            return {
              content: [
                {
                  type: 'text',
                  text: `Secret '${secretName}' has been ${result.created ? 'created' : 'updated'} successfully in ${project}/${config}`,
                },
              ],
            };
          }

          case 'doppler_delete_secrets': {
            const { project, config, secrets } = DeleteSecretSchema.parse(args);
            await this.dopplerClient.deleteSecrets(project, config, secrets);
            return {
              content: [
                {
                  type: 'text',
                  text: `Successfully deleted ${secrets.length} secret(s) from ${project}/${config}`,
                },
              ],
            };
          }

          case 'doppler_promote_secrets': {
            const { project, sourceConfig, targetConfig, excludeKeys } = PromoteSecretsSchema.parse(args);
            const result = await this.dopplerClient.promoteSecrets(
              project,
              sourceConfig,
              targetConfig,
              excludeKeys
            );
            return {
              content: [
                {
                  type: 'text',
                  text: `Successfully promoted ${result.count} secrets from ${project}/${sourceConfig} to ${project}/${targetConfig}`,
                },
              ],
            };
          }

          case 'doppler_create_service_token': {
            const { project, config, name: tokenName, access } = CreateServiceTokenSchema.parse(args);
            const token = await this.dopplerClient.createServiceToken(
              project,
              config,
              tokenName,
              access
            );
            return {
              content: [
                {
                  type: 'text',
                  text: `Service token created successfully:\nToken: ${token.key}\nAccess: ${token.access}\n\nIMPORTANT: Save this token securely, it won't be shown again!`,
                },
              ],
            };
          }

          case 'doppler_get_activity_logs': {
            const { project, page, perPage } = GetActivityLogsSchema.parse(args);
            const logs = await this.dopplerClient.getActivityLogs(project, page, perPage);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(logs, null, 2),
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
    logger.info('Doppler MCP server started');
  }
}

// Start the server
const server = new DopplerMCPServer();
server.start().catch((error) => {
  logger.error('Failed to start server', error);
  process.exit(1);
});