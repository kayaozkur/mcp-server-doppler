#!/usr/bin/env node
/**
 * Enhanced Doppler MCP Server with Intelligence Integration
 * 
 * Phase 3 (KAYA-21): Doppler Integration Intelligence
 * - Extends existing 8 tools with intelligence capabilities
 * - Adds 10 new intelligence-powered tools
 * - Leverages 1,899+ patterns from 20 documentation files
 * - Maintains full backward compatibility
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
  Resource,
} from '@modelcontextprotocol/sdk/types.js';
import { DopplerClient } from './doppler-client.js';
import { logger } from './logger.js';
import { ALL_ENHANCED_TOOLS, TOOL_CATEGORIES } from './intelligence-tools.js';
import { dopplerIntelligence } from './intelligence-client.js';
import { z } from 'zod';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Enhanced tool schemas with intelligence integration
const EnhancedListProjectsSchema = z.object({
  includeInsights: z.boolean().optional().default(false),
  analysisLevel: z.enum(['basic', 'detailed']).optional().default('basic')
});

const EnhancedListSecretsSchema = z.object({
  project: z.string().describe('The Doppler project name'),
  config: z.string().describe('The config/environment name'),
  includeAnalysis: z.boolean().optional().default(false),
  validateNaming: z.boolean().optional().default(false)
});

const EnhancedGetSecretSchema = z.object({
  project: z.string().describe('The Doppler project name'),
  config: z.string().describe('The config/environment name'),
  name: z.string().describe('The secret name to retrieve'),
  includeContext: z.boolean().optional().default(false)
});

const EnhancedSetSecretSchema = z.object({
  project: z.string().describe('The Doppler project name'),
  config: z.string().describe('The config/environment name'),
  name: z.string().describe('The secret name'),
  value: z.string().describe('The secret value'),
  validateSecurity: z.boolean().optional().default(false),
  checkNaming: z.boolean().optional().default(false)
});

const EnhancedPromoteSecretsSchema = z.object({
  project: z.string().describe('The Doppler project name'),
  sourceConfig: z.string().describe('Source config/environment'),
  targetConfig: z.string().describe('Target config/environment'),
  excludeKeys: z.array(z.string()).optional().describe('Keys to exclude from promotion'),
  autoExclude: z.boolean().optional().default(false),
  dryRun: z.boolean().optional().default(false),
  includeValidation: z.boolean().optional().default(true)
});

// Intelligence tool schemas
const SecurityRecommendationsSchema = z.object({
  environment: z.enum(['development', 'staging', 'production']),
  tokenType: z.enum(['personal', 'service', 'cli']).optional(),
  integrations: z.array(z.enum(['github-actions', 'docker', 'kubernetes', 'aws', 'gcp', 'azure'])).optional(),
  riskLevel: z.enum(['low', 'medium', 'high', 'critical']).optional()
});

const ValidateConfigurationSchema = z.object({
  project: z.string(),
  config: z.string(),
  checkSecurity: z.boolean().optional().default(true),
  checkCompliance: z.boolean().optional().default(false),
  includeOptimizations: z.boolean().optional().default(true)
});

const SuggestWorkflowSchema = z.object({
  useCase: z.enum(['web-app', 'api-service', 'microservices', 'mobile-app', 'data-pipeline', 'ml-model']),
  teamSize: z.number().min(1).max(1000),
  environments: z.array(z.string()).optional(),
  currentPractices: z.array(z.string()).optional(),
  automationLevel: z.enum(['manual', 'semi-automated', 'fully-automated']).optional()
});

const TroubleshootIssueSchema = z.object({
  issue: z.string(),
  context: z.object({
    operation: z.string().optional(),
    environment: z.string().optional(),
    tokenType: z.string().optional(),
    integration: z.string().optional()
  }).optional(),
  urgency: z.enum(['low', 'medium', 'high', 'critical']).optional().default('medium')
});

const GenerateSetupGuideSchema = z.object({
  targetEnvironment: z.enum(['local-development', 'github-actions', 'docker', 'kubernetes', 'aws-lambda', 'vercel', 'netlify']),
  projectType: z.enum(['nodejs', 'python', 'java', 'go', 'php', 'ruby', 'dotnet']),
  complexity: z.enum(['basic', 'intermediate', 'advanced']).optional().default('intermediate'),
  includeTemplates: z.boolean().optional().default(true),
  securityLevel: z.enum(['standard', 'enhanced', 'enterprise']).optional().default('standard')
});

const AuditSecuritySchema = z.object({
  scope: z.enum(['project', 'workplace', 'token', 'integration']),
  project: z.string().optional(),
  auditLevel: z.enum(['basic', 'comprehensive', 'compliance']).optional().default('comprehensive'),
  complianceFramework: z.enum(['soc2', 'iso27001', 'gdpr', 'hipaa', 'pci-dss']).optional(),
  generateReport: z.boolean().optional().default(true)
});

const PlanMigrationSchema = z.object({
  sourceSystem: z.enum(['env-files', 'aws-secrets-manager', 'azure-key-vault', 'hashicorp-vault', 'kubernetes-secrets', 'other']),
  migrationScope: z.object({
    secretCount: z.number().optional(),
    environments: z.array(z.string()).optional(),
    applications: z.array(z.string()).optional()
  }).optional(),
  timeline: z.enum(['immediate', 'weeks', 'months', 'quarters']).optional(),
  riskTolerance: z.enum(['low', 'medium', 'high']).optional().default('medium')
});

const OptimizePermissionsSchema = z.object({
  analysisTarget: z.enum(['all-tokens', 'service-tokens', 'personal-tokens', 'project-access']),
  project: z.string().optional(),
  securityLevel: z.enum(['minimal', 'balanced', 'strict']).optional().default('balanced'),
  includeRecommendations: z.boolean().optional().default(true),
  generateMatrix: z.boolean().optional().default(false)
});

const CreateEnvironmentStrategySchema = z.object({
  organizationType: z.enum(['startup', 'enterprise', 'agency', 'saas', 'ecommerce']),
  deploymentPattern: z.enum(['traditional', 'microservices', 'serverless', 'hybrid']),
  environments: z.object({
    required: z.array(z.string()).optional(),
    optional: z.array(z.string()).optional()
  }).optional(),
  complianceRequirements: z.array(z.enum(['soc2', 'iso27001', 'gdpr', 'hipaa', 'pci-dss'])).optional(),
  scalingPlans: z.enum(['small-team', 'growing-team', 'enterprise-scale']).optional()
});

const GenerateDocumentationSchema = z.object({
  documentationType: z.enum(['setup-guide', 'api-docs', 'security-policies', 'troubleshooting', 'team-handbook', 'compliance-report']),
  project: z.string().optional(),
  audience: z.enum(['developers', 'devops', 'security-team', 'management', 'compliance-officers']),
  format: z.enum(['markdown', 'html', 'pdf', 'confluence']).optional().default('markdown'),
  includeExamples: z.boolean().optional().default(true),
  customSections: z.array(z.string()).optional()
});

// Legacy schemas for backward compatibility
const DeleteSecretSchema = z.object({
  project: z.string().describe('The Doppler project name'),
  config: z.string().describe('The config/environment name'),
  secrets: z.array(z.string()).describe('Array of secret names to delete'),
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

export class EnhancedDopplerMCPServer {
  private server: Server;
  private dopplerClient: DopplerClient;

  constructor() {
    this.server = new Server(
      {
        name: 'doppler-intelligence-server',
        version: '1.0.0',
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
    
    logger.info('Enhanced Doppler MCP Server with Intelligence initialized');
    logger.info(`Available tools: ${ALL_ENHANCED_TOOLS.length} (${TOOL_CATEGORIES.INTELLIGENCE.length} intelligence tools)`);
  }

  private setupHandlers() {
    // Handle tool listing
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: ALL_ENHANCED_TOOLS,
    }));

    // Handle resource listing (unchanged from original)
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

    // Handle resource reading (unchanged from original)
    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const uri = request.params.uri;
      const match = uri.match(/^doppler:\/\/project\/([^\/]+)(?:\/config\/([^\/]+))?$/);

      if (!match) {
        throw new Error('Invalid resource URI format');
      }

      const [, projectSlug, configName] = match;

      try {
        if (configName) {
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

    // Handle tool calls with intelligence integration
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          // Enhanced existing tools
          case 'doppler_list_projects':
            return await this.handleEnhancedListProjects(args);
          case 'doppler_list_secrets':
            return await this.handleEnhancedListSecrets(args);
          case 'doppler_get_secret':
            return await this.handleEnhancedGetSecret(args);
          case 'doppler_set_secret':
            return await this.handleEnhancedSetSecret(args);
          case 'doppler_promote_secrets':
            return await this.handleEnhancedPromoteSecrets(args);

          // New intelligence tools
          case 'doppler_get_security_recommendations':
            return await this.handleGetSecurityRecommendations(args);
          case 'doppler_validate_configuration':
            return await this.handleValidateConfiguration(args);
          case 'doppler_suggest_workflow':
            return await this.handleSuggestWorkflow(args);
          case 'doppler_troubleshoot_issue':
            return await this.handleTroubleshootIssue(args);
          case 'doppler_generate_setup_guide':
            return await this.handleGenerateSetupGuide(args);
          case 'doppler_audit_security':
            return await this.handleAuditSecurity(args);
          case 'doppler_plan_migration':
            return await this.handlePlanMigration(args);
          case 'doppler_optimize_permissions':
            return await this.handleOptimizePermissions(args);
          case 'doppler_create_environment_strategy':
            return await this.handleCreateEnvironmentStrategy(args);
          case 'doppler_generate_documentation':
            return await this.handleGenerateDocumentation(args);

          // Legacy tools (unchanged for backward compatibility)
          case 'doppler_delete_secrets':
            return await this.handleDeleteSecrets(args);
          case 'doppler_create_service_token':
            return await this.handleCreateServiceToken(args);
          case 'doppler_get_activity_logs':
            return await this.handleGetActivityLogs(args);

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

  // Enhanced existing tool handlers
  private async handleEnhancedListProjects(args: any) {
    const { includeInsights, analysisLevel } = EnhancedListProjectsSchema.parse(args);
    const projects = await this.dopplerClient.listProjects();
    
    if (!includeInsights) {
      return {
        content: [{ type: 'text', text: JSON.stringify(projects, null, 2) }]
      };
    }

    // Add intelligence insights
    const insights = dopplerIntelligence.analyzeConfiguration({
      projects: projects.map(p => p.slug)
    });

    const response = {
      projects,
      intelligence_insights: {
        project_count: projects.length,
        organization_recommendations: insights.recommendations,
        optimization_suggestions: insights.optimizations,
        analysis_level: analysisLevel
      }
    };

    return {
      content: [{ type: 'text', text: JSON.stringify(response, null, 2) }]
    };
  }

  private async handleEnhancedListSecrets(args: any) {
    const { project, config, includeAnalysis, validateNaming } = EnhancedListSecretsSchema.parse(args);
    const secrets = await this.dopplerClient.listSecrets(project, config);
    
    if (!includeAnalysis && !validateNaming) {
      return {
        content: [{ type: 'text', text: JSON.stringify(secrets, null, 2) }]
      };
    }

    const response: any = { secrets };

    if (includeAnalysis) {
      const securityPatterns = dopplerIntelligence.getPatternsByCategory('security');
      response.security_analysis = {
        total_secrets: Object.keys(secrets).length,
        potential_risks: securityPatterns.slice(0, 3).map(p => p.description)
      };
    }

    if (validateNaming) {
      const namingPatterns = dopplerIntelligence.searchIntelligence('naming', { category: 'best_practices' });
      const secretNames = Object.keys(secrets);
      response.naming_validation = {
        compliant_names: secretNames.filter(name => /^[A-Z][A-Z0-9_]*$/.test(name)),
        non_compliant_names: secretNames.filter(name => !/^[A-Z][A-Z0-9_]*$/.test(name)),
        recommendations: namingPatterns.slice(0, 2).map(p => p.usage)
      };
    }

    return {
      content: [{ type: 'text', text: JSON.stringify(response, null, 2) }]
    };
  }

  private async handleEnhancedGetSecret(args: any) {
    const { project, config, name, includeContext } = EnhancedGetSecretSchema.parse(args);
    const secret = await this.dopplerClient.getSecret(project, config, name);
    
    if (!includeContext) {
      return {
        content: [{ type: 'text', text: JSON.stringify(secret, null, 2) }]
      };
    }

    // Add contextual information
    const contextualHelp = dopplerIntelligence.getContextualHelp(`secret access for ${name}`);
    
    const response = {
      secret,
      context: {
        usage_recommendations: contextualHelp.steps,
        security_warnings: contextualHelp.warnings,
        related_patterns: contextualHelp.relatedPatterns.slice(0, 2)
      }
    };

    return {
      content: [{ type: 'text', text: JSON.stringify(response, null, 2) }]
    };
  }

  private async handleEnhancedSetSecret(args: any) {
    const { project, config, name, value, validateSecurity, checkNaming } = EnhancedSetSecretSchema.parse(args);
    
    const validationResults: any = {};

    if (validateSecurity) {
      // Basic security validation
      const securityIssues = [];
      if (value.length < 8) securityIssues.push('Secret value appears to be too short');
      if (/^(test|demo|example|password|123)/i.test(value)) securityIssues.push('Secret value appears to be a test/demo value');
      
      validationResults.security_validation = {
        passed: securityIssues.length === 0,
        issues: securityIssues
      };
    }

    if (checkNaming) {
      const namingValid = /^[A-Z][A-Z0-9_]*$/.test(name);
      validationResults.naming_validation = {
        compliant: namingValid,
        recommendation: namingValid ? 'Name follows conventions' : 'Use ALL_CAPS with underscores'
      };
    }

    // Set the secret
    const result = await this.dopplerClient.setSecret(project, config, name, value);
    
    const response = {
      result: `Secret '${name}' has been ${result.created ? 'created' : 'updated'} successfully in ${project}/${config}`,
      validation: validationResults
    };

    return {
      content: [{ type: 'text', text: JSON.stringify(response, null, 2) }]
    };
  }

  private async handleEnhancedPromoteSecrets(args: any) {
    const { project, sourceConfig, targetConfig, excludeKeys, autoExclude, dryRun, includeValidation } = EnhancedPromoteSecretsSchema.parse(args);
    
    let finalExcludeKeys = excludeKeys || [];
    
    if (autoExclude) {
      // Auto-exclude environment-specific secrets
      const envSpecificKeys = ['DATABASE_URL', 'API_URL', 'REDIS_URL', 'MONGO_URL', 'ELASTICSEARCH_URL'];
      finalExcludeKeys = [...finalExcludeKeys, ...envSpecificKeys];
    }

    if (dryRun) {
      const sourceSecrets = await this.dopplerClient.listSecrets(project, sourceConfig);
      const secretsToPromote = Object.keys(sourceSecrets).filter(key => !finalExcludeKeys.includes(key));
      
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            dry_run: true,
            secrets_to_promote: secretsToPromote,
            excluded_secrets: finalExcludeKeys,
            total_count: secretsToPromote.length
          }, null, 2)
        }]
      };
    }

    if (includeValidation) {
      const recommendations = dopplerIntelligence.generateWorkflowSuggestions({
        environments: [sourceConfig, targetConfig]
      });
      
      logger.info(`Promoting secrets with validation. Recommendations: ${recommendations.length}`);
    }

    const result = await this.dopplerClient.promoteSecrets(project, sourceConfig, targetConfig, finalExcludeKeys);
    
    return {
      content: [{
        type: 'text',
        text: `Successfully promoted ${result.count} secrets from ${project}/${sourceConfig} to ${project}/${targetConfig}. Excluded: ${finalExcludeKeys.length} keys.`
      }]
    };
  }

  // New intelligence tool handlers
  private async handleGetSecurityRecommendations(args: any) {
    const { environment, tokenType, integrations, riskLevel } = SecurityRecommendationsSchema.parse(args);
    
    const recommendations = dopplerIntelligence.generateSecurityRecommendations({
      environment,
      tokenType,
      integrations,
      riskLevel
    });

    return {
      content: [{ type: 'text', text: JSON.stringify(recommendations, null, 2) }]
    };
  }

  private async handleValidateConfiguration(args: any) {
    const { project, config, checkSecurity, checkCompliance, includeOptimizations } = ValidateConfigurationSchema.parse(args);
    
    const analysis = dopplerIntelligence.analyzeConfiguration({
      projects: [project],
      environments: [config]
    });

    const validation = {
      project,
      config,
      analysis_score: analysis.score,
      security_checks: checkSecurity ? analysis.securityIssues : [],
      optimization_suggestions: includeOptimizations ? analysis.optimizations : [],
      compliance_status: checkCompliance ? 'Not implemented yet' : 'Skipped',
      related_patterns: analysis.patterns.slice(0, 5)
    };

    return {
      content: [{ type: 'text', text: JSON.stringify(validation, null, 2) }]
    };
  }

  private async handleSuggestWorkflow(args: any) {
    const { useCase, teamSize, environments, currentPractices, automationLevel } = SuggestWorkflowSchema.parse(args);
    
    const suggestions = dopplerIntelligence.generateWorkflowSuggestions({
      useCase,
      teamSize,
      environments,
      currentPractices
    });

    const response = {
      use_case: useCase,
      team_size: teamSize,
      automation_level: automationLevel,
      workflow_suggestions: suggestions
    };

    return {
      content: [{ type: 'text', text: JSON.stringify(response, null, 2) }]
    };
  }

  private async handleTroubleshootIssue(args: any) {
    const { issue, context, urgency } = TroubleshootIssueSchema.parse(args);
    
    const guide = dopplerIntelligence.generateTroubleshootingGuide(issue);
    
    if (!guide) {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            issue,
            status: 'No specific troubleshooting guide found',
            general_help: 'Check Doppler documentation or contact support'
          }, null, 2)
        }]
      };
    }

    const response = {
      issue,
      urgency,
      context,
      troubleshooting_guide: guide
    };

    return {
      content: [{ type: 'text', text: JSON.stringify(response, null, 2) }]
    };
  }

  private async handleGenerateSetupGuide(args: any) {
    const { targetEnvironment, projectType, complexity, includeTemplates, securityLevel } = GenerateSetupGuideSchema.parse(args);
    
    const template = dopplerIntelligence.generateConfigurationTemplate(targetEnvironment);
    const contextualHelp = dopplerIntelligence.getContextualHelp(`${targetEnvironment} setup`);
    
    const guide = {
      target_environment: targetEnvironment,
      project_type: projectType,
      complexity_level: complexity,
      security_level: securityLevel,
      setup_steps: contextualHelp.steps,
      configuration_template: includeTemplates ? template : null,
      examples: contextualHelp.examples,
      warnings: contextualHelp.warnings
    };

    return {
      content: [{ type: 'text', text: JSON.stringify(guide, null, 2) }]
    };
  }

  private async handleAuditSecurity(args: any) {
    const { scope, project, auditLevel, complianceFramework, generateReport } = AuditSecuritySchema.parse(args);
    
    const securityPatterns = dopplerIntelligence.getPatternsByCategory('security');
    const recommendations = dopplerIntelligence.generateSecurityRecommendations({
      environment: 'production' // Default to production for audit
    });

    const audit = {
      scope,
      project,
      audit_level: auditLevel,
      compliance_framework: complianceFramework,
      security_recommendations: recommendations,
      critical_patterns: securityPatterns.filter(p => p.safety === 'critical').slice(0, 5),
      report_generated: generateReport,
      timestamp: new Date().toISOString()
    };

    return {
      content: [{ type: 'text', text: JSON.stringify(audit, null, 2) }]
    };
  }

  private async handlePlanMigration(args: any) {
    const { sourceSystem, migrationScope, timeline, riskTolerance } = PlanMigrationSchema.parse(args);
    
    const migrationPatterns = dopplerIntelligence.searchIntelligence('migration', { maxResults: 5 });
    
    const plan = {
      source_system: sourceSystem,
      migration_scope: migrationScope,
      timeline,
      risk_tolerance: riskTolerance,
      migration_steps: [
        '1. Audit current secret inventory',
        '2. Set up Doppler project structure',
        '3. Create staging environment for testing',
        '4. Migrate non-production secrets first',
        '5. Update applications to use Doppler',
        '6. Migrate production secrets',
        '7. Decommission old system'
      ],
      related_patterns: migrationPatterns,
      estimated_complexity: migrationScope?.secretCount ? 
        (migrationScope.secretCount > 100 ? 'high' : migrationScope.secretCount > 20 ? 'medium' : 'low') : 'unknown'
    };

    return {
      content: [{ type: 'text', text: JSON.stringify(plan, null, 2) }]
    };
  }

  private async handleOptimizePermissions(args: any) {
    const { analysisTarget, project, securityLevel, includeRecommendations, generateMatrix } = OptimizePermissionsSchema.parse(args);
    
    const permissionPatterns = dopplerIntelligence.searchIntelligence('permission', { category: 'security' });
    
    const optimization = {
      analysis_target: analysisTarget,
      project,
      security_level: securityLevel,
      recommendations: includeRecommendations ? [
        'Use principle of least privilege',
        'Regular permission audits',
        'Service tokens for production',
        'Personal tokens for development only'
      ] : [],
      permission_matrix: generateMatrix ? {
        service_tokens: { read: true, write: false, delete: false },
        personal_tokens: { read: true, write: true, delete: true },
        cli_tokens: { read: true, write: true, delete: false }
      } : null,
      related_patterns: permissionPatterns.slice(0, 3)
    };

    return {
      content: [{ type: 'text', text: JSON.stringify(optimization, null, 2) }]
    };
  }

  private async handleCreateEnvironmentStrategy(args: any) {
    const { organizationType, deploymentPattern, environments, complianceRequirements, scalingPlans } = CreateEnvironmentStrategySchema.parse(args);
    
    const configPatterns = dopplerIntelligence.getPatternsByCategory('configuration');
    
    const strategy = {
      organization_type: organizationType,
      deployment_pattern: deploymentPattern,
      recommended_environments: environments || {
        required: ['development', 'staging', 'production'],
        optional: ['testing', 'preview']
      },
      inheritance_strategy: {
        root: 'production',
        staging: 'inherits from production, overrides environment-specific',
        development: 'inherits from staging, overrides for local development'
      },
      compliance_requirements: complianceRequirements,
      scaling_considerations: scalingPlans,
      configuration_patterns: configPatterns.slice(0, 5)
    };

    return {
      content: [{ type: 'text', text: JSON.stringify(strategy, null, 2) }]
    };
  }

  private async handleGenerateDocumentation(args: any) {
    const { documentationType, project, audience, format, includeExamples, customSections } = GenerateDocumentationSchema.parse(args);
    
    const relevantPatterns = dopplerIntelligence.searchIntelligence(documentationType.replace('-', ' '));
    
    const documentation = {
      type: documentationType,
      project,
      audience,
      format,
      sections: [
        '# Doppler Integration Guide',
        '## Overview',
        '## Prerequisites',
        '## Installation',
        '## Configuration',
        '## Usage Examples',
        '## Security Considerations',
        '## Troubleshooting',
        '## Best Practices'
      ],
      custom_sections: customSections,
      examples: includeExamples ? relevantPatterns.slice(0, 3).map(p => p.examples).flat() : [],
      related_patterns: relevantPatterns.slice(0, 5),
      generated_at: new Date().toISOString()
    };

    return {
      content: [{ type: 'text', text: JSON.stringify(documentation, null, 2) }]
    };
  }

  // Legacy tool handlers (unchanged for backward compatibility)
  private async handleDeleteSecrets(args: any) {
    const { project, config, secrets } = DeleteSecretSchema.parse(args);
    await this.dopplerClient.deleteSecrets(project, config, secrets);
    return {
      content: [{
        type: 'text',
        text: `Successfully deleted ${secrets.length} secret(s) from ${project}/${config}`,
      }],
    };
  }

  private async handleCreateServiceToken(args: any) {
    const { project, config, name: tokenName, access } = CreateServiceTokenSchema.parse(args);
    const token = await this.dopplerClient.createServiceToken(project, config, tokenName, access);
    return {
      content: [{
        type: 'text',
        text: `Service token created successfully:\nToken: ${token.key}\nAccess: ${token.access}\n\nIMPORTANT: Save this token securely, it won't be shown again!`,
      }],
    };
  }

  private async handleGetActivityLogs(args: any) {
    const { project, page, perPage } = GetActivityLogsSchema.parse(args);
    const logs = await this.dopplerClient.getActivityLogs(project, page, perPage);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(logs, null, 2),
      }],
    };
  }

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    
    const stats = dopplerIntelligence.getDatabaseStats();
    logger.info(`Enhanced Doppler MCP Server started with ${(stats as any).totalPatterns} intelligence patterns`);
  }
}

// Start the enhanced server
const server = new EnhancedDopplerMCPServer();
server.start().catch((error) => {
  logger.error('Failed to start enhanced server', error);
  process.exit(1);
});