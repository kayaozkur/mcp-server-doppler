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
];