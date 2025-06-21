import { Tool } from '@modelcontextprotocol/sdk/types.js';

// Define available tools
export const TOOLS: Tool[] = [
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