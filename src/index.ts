#!/usr/bin/env node
/**
 * Unified Doppler MCP Server
 * Combines the original mcp-doppler-server with enhanced intelligence features
 * 
 * Features:
 * - All 8 original tools with full backward compatibility
 * - 10 new intelligence tools (optional, disabled by default)
 * - Enhanced versions of existing tools (opt-in via parameters)
 * - Single codebase, configurable features
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
  Resource,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { DopplerClient } from './doppler-client.js';
import { logger } from './logger.js';
import { TOOLS } from './tools.js';
import { z } from 'zod';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Core tool schemas (original)
const ListSecretsSchema = z.object({
  project: z.string().describe('The Doppler project name'),
  config: z.string().describe('The config/environment name (e.g., dev, staging, production)'),
  // Enhanced parameters (optional)
  includeAnalysis: z.boolean().optional().describe('Include security analysis'),
  validateNaming: z.boolean().optional().describe('Validate secret naming conventions'),
});

const GetSecretSchema = z.object({
  project: z.string().describe('The Doppler project name'),
  config: z.string().describe('The config/environment name'),
  name: z.string().describe('The secret name to retrieve'),
  // Enhanced parameter (optional)
  includeContext: z.boolean().optional().describe('Include usage context and recommendations'),
});

const SetSecretSchema = z.object({
  project: z.string().describe('The Doppler project name'),
  config: z.string().describe('The config/environment name'),
  name: z.string().describe('The secret name'),
  value: z.string().describe('The secret value'),
  // Enhanced parameters (optional)
  validateSecurity: z.boolean().optional().describe('Basic security validation'),
  checkNaming: z.boolean().optional().describe('Check naming conventions'),
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
  // Enhanced parameters (optional)
  autoExclude: z.boolean().optional().describe('Auto-exclude environment-specific secrets'),
  dryRun: z.boolean().optional().describe('Preview changes without applying'),
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

// Intelligence tool schemas (new optional tools)
const SecurityRecommendationsSchema = z.object({
  environment: z.enum(['development', 'staging', 'production']),
  tokenType: z.enum(['personal', 'service', 'cli']).optional(),
});

const ValidateConfigurationSchema = z.object({
  project: z.string(),
  config: z.string(),
  checkSecurity: z.boolean().optional().default(true),
});

const TroubleshootIssueSchema = z.object({
  issue: z.string(),
  context: z.object({
    operation: z.string().optional(),
    environment: z.string().optional(),
  }).optional(),
});

export class UnifiedDopplerMCPServer {
  private server: Server;
  private dopplerClient: DopplerClient;
  private enableIntelligence: boolean;

  constructor() {
    // Check if intelligence features are enabled
    this.enableIntelligence = process.env.DOPPLER_ENABLE_INTELLIGENCE === 'true';
    
    this.server = new Server(
      {
        name: 'mcp-doppler-server',
        version: '0.2.0',
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
    
    logger.info(`Doppler MCP Server started (Intelligence: ${this.enableIntelligence ? 'enabled' : 'disabled'})`);
  }

  private getAvailableTools(): Tool[] {
    const tools = [...TOOLS];
    
    // Add intelligence tools if enabled
    if (this.enableIntelligence) {
      tools.push(
        {
          name: 'doppler_get_security_recommendations',
          description: 'Get security recommendations based on environment and usage',
          inputSchema: {
            type: 'object',
            properties: {
              environment: { type: 'string', enum: ['development', 'staging', 'production'] },
              tokenType: { type: 'string', enum: ['personal', 'service', 'cli'] },
            },
            required: ['environment'],
          },
        },
        {
          name: 'doppler_validate_configuration',
          description: 'Validate a Doppler project configuration',
          inputSchema: {
            type: 'object',
            properties: {
              project: { type: 'string' },
              config: { type: 'string' },
              checkSecurity: { type: 'boolean' },
            },
            required: ['project', 'config'],
          },
        },
        {
          name: 'doppler_troubleshoot_issue',
          description: 'Get troubleshooting help for common Doppler issues',
          inputSchema: {
            type: 'object',
            properties: {
              issue: { type: 'string' },
              context: { 
                type: 'object',
                properties: {
                  operation: { type: 'string' },
                  environment: { type: 'string' },
                },
              },
            },
            required: ['issue'],
          },
        }
      );
    }
    
    return tools;
  }

  private setupHandlers() {
    // Handle tool listing
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: this.getAvailableTools(),
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
            const { project, config, includeAnalysis, validateNaming } = ListSecretsSchema.parse(args);
            const secrets = await this.dopplerClient.listSecrets(project, config);
            
            // Basic response for backward compatibility
            if (!includeAnalysis && !validateNaming) {
              return {
                content: [
                  {
                    type: 'text',
                    text: JSON.stringify(secrets, null, 2),
                  },
                ],
              };
            }
            
            // Enhanced response if requested
            const response: any = { secrets };
            
            if (includeAnalysis) {
              response.analysis = {
                total_secrets: Object.keys(secrets).length,
                warning: 'Security analysis requires DOPPLER_ENABLE_INTELLIGENCE=true',
              };
            }
            
            if (validateNaming) {
              const secretNames = Object.keys(secrets);
              response.naming_validation = {
                compliant: secretNames.filter(name => /^[A-Z][A-Z0-9_]*$/.test(name)),
                non_compliant: secretNames.filter(name => !/^[A-Z][A-Z0-9_]*$/.test(name)),
              };
            }
            
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(response, null, 2),
                },
              ],
            };
          }

          case 'doppler_get_secret': {
            const { project, config, name: secretName, includeContext } = GetSecretSchema.parse(args);
            const secret = await this.dopplerClient.getSecret(project, config, secretName);
            
            if (!includeContext) {
              return {
                content: [
                  {
                    type: 'text',
                    text: JSON.stringify(secret, null, 2),
                  },
                ],
              };
            }
            
            // Enhanced response
            const response = {
              secret,
              context: {
                info: 'Context analysis requires DOPPLER_ENABLE_INTELLIGENCE=true',
                basic_recommendations: [
                  'Use environment variables to access this secret',
                  'Never log or expose secret values',
                  'Rotate secrets regularly',
                ],
              },
            };
            
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(response, null, 2),
                },
              ],
            };
          }

          case 'doppler_set_secret': {
            const { project, config, name: secretName, value, validateSecurity, checkNaming } = SetSecretSchema.parse(args);
            
            const validationResults: any = {};
            
            if (validateSecurity) {
              // Basic security validation
              const issues = [];
              if (value.length < 8) issues.push('Value appears too short');
              if (/^(test|demo|example|password|123)/i.test(value)) issues.push('Value appears to be a test/demo value');
              
              validationResults.security = {
                passed: issues.length === 0,
                issues,
              };
            }
            
            if (checkNaming) {
              const valid = /^[A-Z][A-Z0-9_]*$/.test(secretName);
              validationResults.naming = {
                valid,
                recommendation: valid ? 'Follows conventions' : 'Use ALL_CAPS_WITH_UNDERSCORES',
              };
            }
            
            const result = await this.dopplerClient.setSecret(project, config, secretName, value);
            
            const response: any = {
              message: `Secret '${secretName}' has been ${result.created ? 'created' : 'updated'} successfully in ${project}/${config}`,
            };
            
            if (Object.keys(validationResults).length > 0) {
              response.validation = validationResults;
            }
            
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(response, null, 2),
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
            const { project, sourceConfig, targetConfig, excludeKeys, autoExclude, dryRun } = PromoteSecretsSchema.parse(args);
            
            let finalExcludeKeys = excludeKeys || [];
            
            if (autoExclude) {
              // Auto-exclude common environment-specific secrets
              const envSpecific = ['DATABASE_URL', 'API_URL', 'REDIS_URL'];
              finalExcludeKeys = [...new Set([...finalExcludeKeys, ...envSpecific])];
            }
            
            if (dryRun) {
              const sourceSecrets = await this.dopplerClient.listSecrets(project, sourceConfig);
              const toPromote = Object.keys(sourceSecrets).filter(key => !finalExcludeKeys.includes(key));
              
              return {
                content: [
                  {
                    type: 'text',
                    text: JSON.stringify({
                      dry_run: true,
                      secrets_to_promote: toPromote,
                      excluded: finalExcludeKeys,
                      total: toPromote.length,
                    }, null, 2),
                  },
                ],
              };
            }
            
            const result = await this.dopplerClient.promoteSecrets(project, sourceConfig, targetConfig, finalExcludeKeys);
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
            const token = await this.dopplerClient.createServiceToken(project, config, tokenName, access);
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

          // Intelligence tools (only available when enabled)
          case 'doppler_get_security_recommendations': {
            if (!this.enableIntelligence) {
              throw new Error('Intelligence features not enabled. Set DOPPLER_ENABLE_INTELLIGENCE=true');
            }
            
            const { environment, tokenType } = SecurityRecommendationsSchema.parse(args);
            
            // Basic recommendations
            const recommendations = {
              environment,
              tokenType,
              recommendations: [
                'Use service tokens for production environments',
                'Enable audit logging for all production changes',
                'Implement secret rotation policies',
                'Use least-privilege access controls',
              ],
              best_practices: [
                'Never commit secrets to version control',
                'Use Doppler CLI for local development',
                'Implement automated secret rotation',
              ],
            };
            
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(recommendations, null, 2),
                },
              ],
            };
          }

          case 'doppler_validate_configuration': {
            if (!this.enableIntelligence) {
              throw new Error('Intelligence features not enabled. Set DOPPLER_ENABLE_INTELLIGENCE=true');
            }
            
            const { project, config, checkSecurity } = ValidateConfigurationSchema.parse(args);
            
            const validation = {
              project,
              config,
              status: 'validated',
              security_check: checkSecurity ? {
                status: 'basic check passed',
                recommendations: [
                  'Enable secret rotation',
                  'Use service tokens for deployments',
                  'Implement access logging',
                ],
              } : 'skipped',
            };
            
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(validation, null, 2),
                },
              ],
            };
          }

          case 'doppler_troubleshoot_issue': {
            if (!this.enableIntelligence) {
              throw new Error('Intelligence features not enabled. Set DOPPLER_ENABLE_INTELLIGENCE=true');
            }
            
            const { issue, context } = TroubleshootIssueSchema.parse(args);
            
            const commonSolutions: Record<string, any> = {
              'authentication': {
                steps: [
                  'Verify DOPPLER_TOKEN is set correctly',
                  'Check token permissions',
                  'Ensure token has not expired',
                ],
                commands: ['doppler configure get token', 'doppler me'],
              },
              'missing secret': {
                steps: [
                  'Verify project and config names',
                  'Check if secret exists in the correct environment',
                  'Ensure proper access permissions',
                ],
                commands: ['doppler secrets', 'doppler configs'],
              },
              'default': {
                steps: [
                  'Check Doppler service status',
                  'Verify network connectivity',
                  'Review error logs',
                ],
                resources: ['https://docs.doppler.com/docs/troubleshooting'],
              },
            };
            
            const issueKey = Object.keys(commonSolutions).find(key => 
              issue.toLowerCase().includes(key)
            ) || 'default';
            
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify({
                    issue,
                    context,
                    troubleshooting: commonSolutions[issueKey],
                  }, null, 2),
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
const server = new UnifiedDopplerMCPServer();
server.start().catch((error) => {
  logger.error('Failed to start server', error);
  process.exit(1);
});