/**
 * Doppler Intelligence-Powered MCP Tools
 * 
 * Phase 3B (KAYA-21): 10 new intelligence-powered tools for comprehensive
 * Doppler secret management with AI-driven recommendations and automation.
 * 
 * These tools leverage the 1,899+ intelligence patterns extracted from
 * 20 Doppler documentation files to provide context-aware assistance.
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js';

/**
 * 10 New Intelligence-Powered Tools
 * 
 * These tools extend the existing 8 basic CRUD tools with sophisticated
 * intelligence capabilities for security, workflows, troubleshooting, and optimization.
 */
export const INTELLIGENCE_TOOLS: Tool[] = [
  {
    name: 'doppler_get_security_recommendations',
    description: 'Get AI-powered security recommendations based on current configuration and context',
    inputSchema: {
      type: 'object',
      properties: {
        environment: {
          type: 'string',
          enum: ['development', 'staging', 'production'],
          description: 'Target environment for security analysis'
        },
        tokenType: {
          type: 'string',
          enum: ['personal', 'service', 'cli'],
          description: 'Type of token being used'
        },
        integrations: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['github-actions', 'docker', 'kubernetes', 'aws', 'gcp', 'azure']
          },
          description: 'Active integrations to analyze'
        },
        riskLevel: {
          type: 'string',
          enum: ['low', 'medium', 'high', 'critical'],
          description: 'Desired risk assessment level'
        }
      },
      required: ['environment']
    }
  },
  {
    name: 'doppler_validate_configuration',
    description: 'Validate Doppler configuration against best practices with detailed recommendations',
    inputSchema: {
      type: 'object',
      properties: {
        project: {
          type: 'string',
          description: 'Doppler project name to validate'
        },
        config: {
          type: 'string',
          description: 'Configuration/environment to validate'
        },
        checkSecurity: {
          type: 'boolean',
          default: true,
          description: 'Include security validation checks'
        },
        checkCompliance: {
          type: 'boolean',
          default: false,
          description: 'Include compliance validation checks'
        },
        includeOptimizations: {
          type: 'boolean',
          default: true,
          description: 'Include optimization suggestions'
        }
      },
      required: ['project', 'config']
    }
  },
  {
    name: 'doppler_suggest_workflow',
    description: 'Generate workflow recommendations based on team size, environment, and use case',
    inputSchema: {
      type: 'object',
      properties: {
        useCase: {
          type: 'string',
          enum: ['web-app', 'api-service', 'microservices', 'mobile-app', 'data-pipeline', 'ml-model'],
          description: 'Primary application use case'
        },
        teamSize: {
          type: 'number',
          minimum: 1,
          maximum: 1000,
          description: 'Size of development team'
        },
        environments: {
          type: 'array',
          items: {
            type: 'string'
          },
          description: 'List of environments (dev, staging, prod, etc.)'
        },
        currentPractices: {
          type: 'array',
          items: {
            type: 'string'
          },
          description: 'Current secret management practices'
        },
        automationLevel: {
          type: 'string',
          enum: ['manual', 'semi-automated', 'fully-automated'],
          description: 'Desired level of automation'
        }
      },
      required: ['useCase', 'teamSize']
    }
  },
  {
    name: 'doppler_troubleshoot_issue',
    description: 'Intelligent troubleshooting assistant with step-by-step resolution guides',
    inputSchema: {
      type: 'object',
      properties: {
        issue: {
          type: 'string',
          description: 'Description of the issue or error message'
        },
        context: {
          type: 'object',
          properties: {
            operation: { type: 'string', description: 'What operation was attempted' },
            environment: { type: 'string', description: 'Environment where issue occurred' },
            tokenType: { type: 'string', description: 'Type of token being used' },
            integration: { type: 'string', description: 'Integration context (GitHub Actions, Docker, etc.)' }
          },
          description: 'Additional context about the issue'
        },
        urgency: {
          type: 'string',
          enum: ['low', 'medium', 'high', 'critical'],
          default: 'medium',
          description: 'Urgency level of the issue'
        }
      },
      required: ['issue']
    }
  },
  {
    name: 'doppler_generate_setup_guide',
    description: 'Generate customized setup instructions for specific environments and integrations',
    inputSchema: {
      type: 'object',
      properties: {
        targetEnvironment: {
          type: 'string',
          enum: ['local-development', 'github-actions', 'docker', 'kubernetes', 'aws-lambda', 'vercel', 'netlify'],
          description: 'Target deployment environment'
        },
        projectType: {
          type: 'string',
          enum: ['nodejs', 'python', 'java', 'go', 'php', 'ruby', 'dotnet'],
          description: 'Programming language/runtime'
        },
        complexity: {
          type: 'string',
          enum: ['basic', 'intermediate', 'advanced'],
          default: 'intermediate',
          description: 'Complexity level of setup instructions'
        },
        includeTemplates: {
          type: 'boolean',
          default: true,
          description: 'Include configuration templates and examples'
        },
        securityLevel: {
          type: 'string',
          enum: ['standard', 'enhanced', 'enterprise'],
          default: 'standard',
          description: 'Security requirements level'
        }
      },
      required: ['targetEnvironment', 'projectType']
    }
  },
  {
    name: 'doppler_audit_security',
    description: 'Comprehensive security audit with risk assessment and remediation recommendations',
    inputSchema: {
      type: 'object',
      properties: {
        scope: {
          type: 'string',
          enum: ['project', 'workplace', 'token', 'integration'],
          description: 'Scope of security audit'
        },
        project: {
          type: 'string',
          description: 'Project name for project-scope audits'
        },
        auditLevel: {
          type: 'string',
          enum: ['basic', 'comprehensive', 'compliance'],
          default: 'comprehensive',
          description: 'Level of audit detail'
        },
        complianceFramework: {
          type: 'string',
          enum: ['soc2', 'iso27001', 'gdpr', 'hipaa', 'pci-dss'],
          description: 'Compliance framework for validation'
        },
        generateReport: {
          type: 'boolean',
          default: true,
          description: 'Generate formatted audit report'
        }
      },
      required: ['scope']
    }
  },
  {
    name: 'doppler_plan_migration',
    description: 'Create migration plan for transitioning from other secret management solutions',
    inputSchema: {
      type: 'object',
      properties: {
        sourceSystem: {
          type: 'string',
          enum: ['env-files', 'aws-secrets-manager', 'azure-key-vault', 'hashicorp-vault', 'kubernetes-secrets', 'other'],
          description: 'Current secret management system'
        },
        migrationScope: {
          type: 'object',
          properties: {
            secretCount: { type: 'number', description: 'Approximate number of secrets' },
            environments: { type: 'array', items: { type: 'string' }, description: 'Environments to migrate' },
            applications: { type: 'array', items: { type: 'string' }, description: 'Applications affected' }
          },
          description: 'Scope of migration'
        },
        timeline: {
          type: 'string',
          enum: ['immediate', 'weeks', 'months', 'quarters'],
          description: 'Desired migration timeline'
        },
        riskTolerance: {
          type: 'string',
          enum: ['low', 'medium', 'high'],
          default: 'medium',
          description: 'Risk tolerance for migration approach'
        }
      },
      required: ['sourceSystem']
    }
  },
  {
    name: 'doppler_optimize_permissions',
    description: 'Analyze and optimize token permissions and access control settings',
    inputSchema: {
      type: 'object',
      properties: {
        analysisTarget: {
          type: 'string',
          enum: ['all-tokens', 'service-tokens', 'personal-tokens', 'project-access'],
          description: 'Target for permission optimization'
        },
        project: {
          type: 'string',
          description: 'Specific project to analyze (optional)'
        },
        securityLevel: {
          type: 'string',
          enum: ['minimal', 'balanced', 'strict'],
          default: 'balanced',
          description: 'Desired security posture'
        },
        includeRecommendations: {
          type: 'boolean',
          default: true,
          description: 'Include specific permission recommendations'
        },
        generateMatrix: {
          type: 'boolean',
          default: false,
          description: 'Generate permission matrix document'
        }
      },
      required: ['analysisTarget']
    }
  },
  {
    name: 'doppler_create_environment_strategy',
    description: 'Design environment architecture and inheritance strategy for optimal secret management',
    inputSchema: {
      type: 'object',
      properties: {
        organizationType: {
          type: 'string',
          enum: ['startup', 'enterprise', 'agency', 'saas', 'ecommerce'],
          description: 'Type of organization'
        },
        deploymentPattern: {
          type: 'string',
          enum: ['traditional', 'microservices', 'serverless', 'hybrid'],
          description: 'Application deployment pattern'
        },
        environments: {
          type: 'object',
          properties: {
            required: { type: 'array', items: { type: 'string' }, description: 'Required environments' },
            optional: { type: 'array', items: { type: 'string' }, description: 'Optional environments' }
          },
          description: 'Environment requirements'
        },
        complianceRequirements: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['soc2', 'iso27001', 'gdpr', 'hipaa', 'pci-dss']
          },
          description: 'Compliance requirements'
        },
        scalingPlans: {
          type: 'string',
          enum: ['small-team', 'growing-team', 'enterprise-scale'],
          description: 'Expected scaling requirements'
        }
      },
      required: ['organizationType', 'deploymentPattern']
    }
  },
  {
    name: 'doppler_generate_documentation',
    description: 'Auto-generate comprehensive documentation for Doppler setup and workflows',
    inputSchema: {
      type: 'object',
      properties: {
        documentationType: {
          type: 'string',
          enum: ['setup-guide', 'api-docs', 'security-policies', 'troubleshooting', 'team-handbook', 'compliance-report'],
          description: 'Type of documentation to generate'
        },
        project: {
          type: 'string',
          description: 'Project name for project-specific documentation'
        },
        audience: {
          type: 'string',
          enum: ['developers', 'devops', 'security-team', 'management', 'compliance-officers'],
          description: 'Target audience for documentation'
        },
        format: {
          type: 'string',
          enum: ['markdown', 'html', 'pdf', 'confluence'],
          default: 'markdown',
          description: 'Output format for documentation'
        },
        includeExamples: {
          type: 'boolean',
          default: true,
          description: 'Include code examples and templates'
        },
        customSections: {
          type: 'array',
          items: { type: 'string' },
          description: 'Additional custom sections to include'
        }
      },
      required: ['documentationType', 'audience']
    }
  }
];

/**
 * Enhanced versions of existing tools with intelligence integration
 * These add intelligence context to the existing 8 basic tools
 */
export const ENHANCED_TOOL_SCHEMAS = {
  doppler_list_projects: {
    name: 'doppler_list_projects',
    description: 'List all Doppler projects with intelligence insights and recommendations',
    inputSchema: {
      type: 'object',
      properties: {
        includeInsights: {
          type: 'boolean',
          default: false,
          description: 'Include intelligence insights about project organization'
        },
        analysisLevel: {
          type: 'string',
          enum: ['basic', 'detailed'],
          default: 'basic',
          description: 'Level of analysis to include'
        }
      }
    }
  },
  doppler_list_secrets: {
    name: 'doppler_list_secrets',
    description: 'List secrets with security analysis and naming convention validation',
    inputSchema: {
      type: 'object',
      properties: {
        project: { type: 'string', description: 'The Doppler project name' },
        config: { type: 'string', description: 'The config/environment name' },
        includeAnalysis: {
          type: 'boolean',
          default: false,
          description: 'Include security and naming analysis'
        },
        validateNaming: {
          type: 'boolean',
          default: false,
          description: 'Validate secret names against best practices'
        }
      },
      required: ['project', 'config']
    }
  },
  doppler_get_secret: {
    name: 'doppler_get_secret',
    description: 'Get secret with security context and usage recommendations',
    inputSchema: {
      type: 'object',
      properties: {
        project: { type: 'string', description: 'The Doppler project name' },
        config: { type: 'string', description: 'The config/environment name' },
        name: { type: 'string', description: 'The secret name to retrieve' },
        includeContext: {
          type: 'boolean',
          default: false,
          description: 'Include usage context and security recommendations'
        }
      },
      required: ['project', 'config', 'name']
    }
  },
  doppler_set_secret: {
    name: 'doppler_set_secret',
    description: 'Set secret with validation and security recommendations',
    inputSchema: {
      type: 'object',
      properties: {
        project: { type: 'string', description: 'The Doppler project name' },
        config: { type: 'string', description: 'The config/environment name' },
        name: { type: 'string', description: 'The secret name' },
        value: { type: 'string', description: 'The secret value' },
        validateSecurity: {
          type: 'boolean',
          default: false,
          description: 'Validate secret against security patterns'
        },
        checkNaming: {
          type: 'boolean',
          default: false,
          description: 'Check naming conventions'
        }
      },
      required: ['project', 'config', 'name', 'value']
    }
  },
  doppler_promote_secrets: {
    name: 'doppler_promote_secrets',
    description: 'Promote secrets with intelligent exclusion recommendations and safety checks',
    inputSchema: {
      type: 'object',
      properties: {
        project: { type: 'string', description: 'The Doppler project name' },
        sourceConfig: { type: 'string', description: 'Source config/environment' },
        targetConfig: { type: 'string', description: 'Target config/environment' },
        excludeKeys: {
          type: 'array',
          items: { type: 'string' },
          description: 'Keys to exclude from promotion'
        },
        autoExclude: {
          type: 'boolean',
          default: false,
          description: 'Automatically exclude environment-specific secrets'
        },
        dryRun: {
          type: 'boolean',
          default: false,
          description: 'Preview promotion without executing'
        },
        includeValidation: {
          type: 'boolean',
          default: true,
          description: 'Include pre-promotion validation checks'
        }
      },
      required: ['project', 'sourceConfig', 'targetConfig']
    }
  }
};

/**
 * Combined tool definitions for the enhanced MCP server
 * Includes both new intelligence tools and enhanced existing tools
 */
export const ALL_ENHANCED_TOOLS: Tool[] = [
  ...INTELLIGENCE_TOOLS,
  // Enhanced versions of existing tools
  ENHANCED_TOOL_SCHEMAS.doppler_list_projects as Tool,
  ENHANCED_TOOL_SCHEMAS.doppler_list_secrets as Tool,
  ENHANCED_TOOL_SCHEMAS.doppler_get_secret as Tool,
  ENHANCED_TOOL_SCHEMAS.doppler_set_secret as Tool,
  ENHANCED_TOOL_SCHEMAS.doppler_promote_secrets as Tool,
  // Keep existing tools for backward compatibility
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
          description: 'Array of secret names to delete'
        }
      },
      required: ['project', 'config', 'secrets']
    }
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
          description: 'Token access level'
        }
      },
      required: ['project', 'config', 'name']
    }
  },
  {
    name: 'doppler_get_activity_logs',
    description: 'Get activity logs for auditing',
    inputSchema: {
      type: 'object',
      properties: {
        project: { type: 'string', description: 'Filter by project' },
        page: { type: 'number', description: 'Page number' },
        perPage: { type: 'number', description: 'Items per page' }
      }
    }
  }
];

/**
 * Tool categories for better organization
 */
export const TOOL_CATEGORIES = {
  BASIC_OPERATIONS: ['doppler_list_projects', 'doppler_list_secrets', 'doppler_get_secret', 'doppler_set_secret', 'doppler_delete_secrets'],
  MANAGEMENT: ['doppler_promote_secrets', 'doppler_create_service_token', 'doppler_get_activity_logs'],
  INTELLIGENCE: ['doppler_get_security_recommendations', 'doppler_validate_configuration', 'doppler_suggest_workflow'],
  TROUBLESHOOTING: ['doppler_troubleshoot_issue', 'doppler_audit_security'],
  AUTOMATION: ['doppler_generate_setup_guide', 'doppler_plan_migration', 'doppler_optimize_permissions'],
  ORGANIZATION: ['doppler_create_environment_strategy', 'doppler_generate_documentation']
} as const;