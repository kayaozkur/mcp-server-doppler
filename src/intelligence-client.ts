/**
 * Doppler Intelligence Client
 * 
 * Phase 3B (KAYA-21): Comprehensive intelligence system for Doppler secret management.
 * Provides sophisticated pattern matching, recommendation generation, and context-aware advice.
 * 
 * Features:
 * - 1,899+ intelligence patterns from 20 documentation files
 * - 10 categories: security, integration, best practices, troubleshooting, etc.
 * - Advanced search with fuzzy matching and contextual relevance
 * - Security analysis and recommendation generation
 * - Workflow optimization suggestions
 * - Real-time pattern monitoring and updates
 */

import {
  DOPPLER_INTELLIGENCE_PATTERNS,
  DopplerIntelligencePattern,
  INTELLIGENCE_CATEGORIES,
  COMPLEXITY_LEVELS,
  SAFETY_LEVELS,
  INTELLIGENCE_STATS,
  getPatternsByCategory,
  getPatternsByComplexity,
  getPatternsBySafety,
  searchPatterns
} from './generated-doppler-intelligence.js';
import { logger } from './logger.js';

export interface SecurityRecommendation {
  level: 'info' | 'warning' | 'critical';
  category: string;
  message: string;
  action: string;
  patterns: DopplerIntelligencePattern[];
}

export interface WorkflowSuggestion {
  type: 'optimization' | 'best_practice' | 'automation';
  description: string;
  implementation: string[];
  complexity: string;
  benefits: string[];
  patterns: DopplerIntelligencePattern[];
}

export interface TroubleshootingGuide {
  issue: string;
  diagnosis: string[];
  solutions: string[];
  prevention: string[];
  relatedPatterns: DopplerIntelligencePattern[];
}

export interface ConfigurationTemplate {
  name: string;
  description: string;
  useCase: string;
  template: string;
  variables: string[];
  instructions: string[];
  patterns: DopplerIntelligencePattern[];
}

export class DopplerIntelligenceClient {
  private patterns: Map<string, DopplerIntelligencePattern>;
  private categoryIndex: Map<string, DopplerIntelligencePattern[]>;
  private complexityIndex: Map<string, DopplerIntelligencePattern[]>;
  private safetyIndex: Map<string, DopplerIntelligencePattern[]>;
  private typeIndex: Map<string, DopplerIntelligencePattern[]>;
  private fileIndex: Map<string, DopplerIntelligencePattern[]>;
  private lastUpdate: Date;

  constructor() {
    this.patterns = new Map();
    this.categoryIndex = new Map();
    this.complexityIndex = new Map();
    this.safetyIndex = new Map();
    this.typeIndex = new Map();
    this.fileIndex = new Map();
    this.lastUpdate = new Date();
    
    this.initializeDatabase();
    logger.info(`Doppler Intelligence Client initialized with ${this.patterns.size} patterns from ${INTELLIGENCE_STATS.filesProcessed} files`);
  }

  /**
   * Initialize the intelligence database and build search indices
   */
  private initializeDatabase(): void {
    // Build main patterns map with unique keys
    DOPPLER_INTELLIGENCE_PATTERNS.forEach((pattern, index) => {
      // Create unique key: name + filename + line number to avoid collisions
      const uniqueKey = `${pattern.name}_${pattern.filename}_${pattern.lineNumber}_${index}`;
      this.patterns.set(uniqueKey, pattern);
    });

    // Build category index
    Object.values(INTELLIGENCE_CATEGORIES).forEach(category => {
      this.categoryIndex.set(category, getPatternsByCategory(category));
    });

    // Build complexity index
    Object.values(COMPLEXITY_LEVELS).forEach(complexity => {
      this.complexityIndex.set(complexity, getPatternsByComplexity(complexity));
    });

    // Build safety index
    Object.values(SAFETY_LEVELS).forEach(safety => {
      this.safetyIndex.set(safety, getPatternsBySafety(safety));
    });

    // Build type index
    const types = new Set(DOPPLER_INTELLIGENCE_PATTERNS.map(p => p.type));
    types.forEach(type => {
      this.typeIndex.set(type, DOPPLER_INTELLIGENCE_PATTERNS.filter(p => p.type === type));
    });

    // Build file index
    const files = new Set(DOPPLER_INTELLIGENCE_PATTERNS.map(p => p.filename));
    files.forEach(file => {
      this.fileIndex.set(file, DOPPLER_INTELLIGENCE_PATTERNS.filter(p => p.filename === file));
    });

    logger.info('Intelligence database indices built successfully');
  }

  /**
   * Get comprehensive database statistics
   */
  getDatabaseStats(): object {
    return {
      totalPatterns: this.patterns.size,
      categories: Array.from(this.categoryIndex.keys()),
      complexityLevels: Array.from(this.complexityIndex.keys()),
      safetyLevels: Array.from(this.safetyIndex.keys()),
      types: Array.from(this.typeIndex.keys()),
      files: Array.from(this.fileIndex.keys()),
      lastUpdate: this.lastUpdate.toISOString(),
      stats: INTELLIGENCE_STATS
    };
  }

  /**
   * Search for intelligence patterns with advanced filtering
   */
  searchIntelligence(
    query: string,
    options: {
      category?: string;
      complexity?: string;
      safety?: string;
      type?: string;
      maxResults?: number;
      includeExamples?: boolean;
    } = {}
  ): DopplerIntelligencePattern[] {
    let results = searchPatterns(query);

    // Apply filters
    if (options.category) {
      results = results.filter(p => p.category === options.category);
    }
    if (options.complexity) {
      results = results.filter(p => p.complexity === options.complexity);
    }
    if (options.safety) {
      results = results.filter(p => p.safety === options.safety);
    }
    if (options.type) {
      results = results.filter(p => p.type === options.type);
    }

    // Limit results
    const maxResults = options.maxResults || 50;
    results = results.slice(0, maxResults);

    // Optionally filter out examples for summary view
    if (!options.includeExamples) {
      results = results.map(p => ({
        ...p,
        examples: p.examples.slice(0, 2) // Keep only first 2 examples
      }));
    }

    return results;
  }

  /**
   * Get specific pattern by name (searches for first match)
   */
  getPattern(name: string): DopplerIntelligencePattern | null {
    // Try exact unique key match first
    const exactMatch = this.patterns.get(name);
    if (exactMatch) {
      return exactMatch;
    }
    
    // Search for pattern by original name
    for (const [, pattern] of this.patterns) {
      if (pattern.name === name) {
        return pattern;
      }
    }
    
    return null;
  }

  /**
   * Get all patterns matching a specific name
   */
  getPatternsByName(name: string): DopplerIntelligencePattern[] {
    const matches: DopplerIntelligencePattern[] = [];
    for (const [, pattern] of this.patterns) {
      if (pattern.name === name) {
        matches.push(pattern);
      }
    }
    return matches;
  }

  /**
   * Get patterns by category with relevance scoring
   */
  getPatternsByCategory(category: string, limit: number = 100): DopplerIntelligencePattern[] {
    const patterns = this.categoryIndex.get(category) || [];
    return patterns.slice(0, limit);
  }

  /**
   * Generate security recommendations based on context
   */
  generateSecurityRecommendations(context: {
    environment?: string;
    tokenType?: string;
    integrations?: string[];
    riskLevel?: string;
  }): SecurityRecommendation[] {
    const recommendations: SecurityRecommendation[] = [];
    const securityPatterns = this.categoryIndex.get(INTELLIGENCE_CATEGORIES.SECURITY) || [];

    // Token-specific recommendations
    if (context.tokenType === 'service') {
      const tokenPatterns = securityPatterns.filter(p => 
        p.name.includes('service_token') || p.pattern.toLowerCase().includes('service token')
      );
      
      recommendations.push({
        level: 'warning',
        category: 'Token Security',
        message: 'Service tokens should use read-only access in production',
        action: 'Review token permissions and use read-only access where possible',
        patterns: tokenPatterns.slice(0, 3)
      });
    }

    // Environment-specific recommendations
    if (context.environment === 'production') {
      const prodPatterns = securityPatterns.filter(p => 
        p.safety === 'critical' || p.pattern.toLowerCase().includes('production')
      );
      
      recommendations.push({
        level: 'critical',
        category: 'Production Security',
        message: 'Production environments require enhanced security measures',
        action: 'Enable IP allowlisting, audit logging, and use dedicated service tokens',
        patterns: prodPatterns.slice(0, 5)
      });
    }

    // Integration-specific recommendations
    if (context.integrations?.includes('github-actions')) {
      const githubPatterns = this.searchIntelligence('github actions', { category: 'integration' });
      
      recommendations.push({
        level: 'info',
        category: 'CI/CD Integration',
        message: 'Use GitHub Actions integration for secure secret injection',
        action: 'Implement dopplerhq/secrets-fetch-action for CI/CD workflows',
        patterns: githubPatterns.slice(0, 3)
      });
    }

    return recommendations;
  }

  /**
   * Generate workflow optimization suggestions
   */
  generateWorkflowSuggestions(scenario: {
    useCase?: string;
    teamSize?: number;
    environments?: string[];
    currentPractices?: string[];
  }): WorkflowSuggestion[] {
    const suggestions: WorkflowSuggestion[] = [];
    const workflowPatterns = this.categoryIndex.get(INTELLIGENCE_CATEGORIES.WORKFLOWS) || [];
    const bestPracticePatterns = this.categoryIndex.get(INTELLIGENCE_CATEGORIES.BEST_PRACTICES) || [];

    // Environment promotion suggestions
    if (scenario.environments && scenario.environments.length > 1) {
      const promotionPatterns = bestPracticePatterns.filter(p => 
        p.name.includes('promotion') || p.pattern.toLowerCase().includes('promote')
      );
      
      suggestions.push({
        type: 'best_practice',
        description: 'Implement systematic environment promotion workflow',
        implementation: [
          'Use doppler secrets download --no-file -c dev | doppler secrets upload -c staging',
          'Exclude environment-specific secrets (DATABASE_URL, etc.)',
          'Test in staging before promoting to production',
          'Document promotion checklist and automation'
        ],
        complexity: 'moderate',
        benefits: [
          'Consistent secret promotion',
          'Reduced manual errors',
          'Improved deployment reliability'
        ],
        patterns: promotionPatterns.slice(0, 3)
      });
    }

    // Team collaboration suggestions
    if (scenario.teamSize && scenario.teamSize > 5) {
      const orgPatterns = this.searchIntelligence('organization', { category: 'configuration' });
      
      suggestions.push({
        type: 'optimization',
        description: 'Optimize team collaboration and access management',
        implementation: [
          'Implement workplace and project structure',
          'Use role-based access control',
          'Create shared service accounts for automation',
          'Establish secret naming conventions'
        ],
        complexity: 'high',
        benefits: [
          'Better access control',
          'Clearer responsibility boundaries',
          'Improved audit trails'
        ],
        patterns: orgPatterns.slice(0, 4)
      });
    }

    // Automation suggestions
    const automationPatterns = workflowPatterns.filter(p => 
      p.type === 'deployment_process' || p.pattern.toLowerCase().includes('automation')
    );
    
    if (automationPatterns.length > 0) {
      suggestions.push({
        type: 'automation',
        description: 'Automate secret management in deployment pipelines',
        implementation: [
          'Integrate Doppler with CI/CD pipelines',
          'Use doppler run -- for local development',
          'Implement pre-deployment secret validation',
          'Set up automated secret rotation where applicable'
        ],
        complexity: 'moderate',
        benefits: [
          'Reduced manual intervention',
          'Consistent deployment processes',
          'Better security compliance'
        ],
        patterns: automationPatterns.slice(0, 3)
      });
    }

    return suggestions;
  }

  /**
   * Generate troubleshooting guide for specific issues
   */
  generateTroubleshootingGuide(issue: string): TroubleshootingGuide | null {
    const relatedPatterns = this.searchIntelligence(issue, { category: 'troubleshooting' });

    if (relatedPatterns.length === 0) {
      return null;
    }

    // Common troubleshooting scenarios
    const scenarios: { [key: string]: Partial<TroubleshootingGuide> } = {
      'token': {
        issue: 'Token authentication issues',
        diagnosis: [
          'Check token format (dp.st. for service, dp.pt. for personal)',
          'Verify token expiration status',
          'Confirm token permissions for project/config',
          'Check workplace access'
        ],
        solutions: [
          'Regenerate token if expired',
          'Verify token scope and permissions',
          'Use doppler me to test token validity',
          'Check IP allowlist if configured'
        ],
        prevention: [
          'Set up token expiration monitoring',
          'Use service tokens for production',
          'Implement proper token rotation',
          'Document token usage and scope'
        ]
      },
      'permission': {
        issue: 'Permission and access control issues',
        diagnosis: [
          'Check user role and permissions',
          'Verify project access in workplace',
          'Confirm config-level permissions',
          'Review IP allowlist configuration'
        ],
        solutions: [
          'Request appropriate permissions from admin',
          'Use correct token type for operation',
          'Check workplace membership',
          'Verify IP address is allowlisted'
        ],
        prevention: [
          'Follow principle of least privilege',
          'Regular permission audits',
          'Clear documentation of access levels',
          'Use role-based access control'
        ]
      }
    };

    // Find matching scenario
    const scenarioKey = Object.keys(scenarios).find(key => 
      issue.toLowerCase().includes(key)
    );

    const baseGuide = scenarioKey ? scenarios[scenarioKey] : {
      issue: `Issues related to: ${issue}`,
      diagnosis: ['Analyze error messages and context', 'Check configuration and permissions'],
      solutions: ['Follow error-specific resolution steps', 'Consult documentation'],
      prevention: ['Implement best practices', 'Regular monitoring and validation']
    };

    return {
      ...baseGuide,
      relatedPatterns
    } as TroubleshootingGuide;
  }

  /**
   * Generate configuration templates for common scenarios
   */
  generateConfigurationTemplate(scenario: string): ConfigurationTemplate | null {
    const relatedPatterns = [
      ...this.searchIntelligence(scenario, { category: 'templates' }),
      ...this.searchIntelligence(scenario, { category: 'configuration' })
    ].slice(0, 5);

    // Template definitions for common scenarios
    const templates: { [key: string]: Omit<ConfigurationTemplate, 'patterns'> } = {
      'github-actions': {
        name: 'GitHub Actions Integration',
        description: 'Complete GitHub Actions workflow with Doppler secret injection',
        useCase: 'CI/CD pipeline with secure secret management',
        template: `name: Deploy with Doppler Secrets
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: dopplerhq/secrets-fetch-action@v1.1.0
        with:
          doppler-token: \${{ secrets.DOPPLER_TOKEN }}
          inject: true
      - name: Deploy Application
        run: |
          # Your deployment commands here
          # All Doppler secrets are now available as environment variables`,
        variables: ['DOPPLER_TOKEN (GitHub Secret)', 'PROJECT_NAME', 'CONFIG_NAME'],
        instructions: [
          'Add DOPPLER_TOKEN to GitHub repository secrets',
          'Configure Doppler project and config names',
          'Test workflow in staging environment first',
          'Monitor deployment logs for secret injection'
        ]
      },
      'docker': {
        name: 'Docker Container Integration',
        description: 'Docker configuration with Doppler CLI for secret injection',
        useCase: 'Containerized application with runtime secret injection',
        template: `# Dockerfile
FROM node:18-alpine
RUN apk add --no-cache curl && \\
    curl -Ls https://cli.doppler.com/install.sh | sh
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["doppler", "run", "--", "npm", "start"]

# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    environment:
      - DOPPLER_TOKEN=\${DOPPLER_TOKEN}
    ports:
      - "3000:3000"`,
        variables: ['DOPPLER_TOKEN', 'PROJECT', 'CONFIG'],
        instructions: [
          'Install Doppler CLI in container',
          'Set DOPPLER_TOKEN environment variable',
          'Use doppler run -- to inject secrets',
          'Never bake secrets into container images'
        ]
      },
      'kubernetes': {
        name: 'Kubernetes Deployment',
        description: 'Kubernetes deployment with Doppler operator or sidecar pattern',
        useCase: 'Kubernetes orchestrated applications with secret management',
        template: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
      - name: app
        image: myapp:latest
        env:
        - name: DOPPLER_TOKEN
          valueFrom:
            secretKeyRef:
              name: doppler-token
              key: token
        command: ["doppler", "run", "--", "./start.sh"]
---
apiVersion: v1
kind: Secret
metadata:
  name: doppler-token
type: Opaque
data:
  token: <base64-encoded-doppler-token>`,
        variables: ['DOPPLER_TOKEN', 'APP_IMAGE', 'REPLICAS'],
        instructions: [
          'Create Kubernetes secret with Doppler token',
          'Install Doppler CLI in container',
          'Use appropriate RBAC policies',
          'Consider using Doppler Kubernetes operator'
        ]
      }
    };

    const template = templates[scenario.toLowerCase()];
    if (!template) {
      return null;
    }

    return {
      ...template,
      patterns: relatedPatterns
    };
  }

  /**
   * Analyze configuration for optimization opportunities
   */
  analyzeConfiguration(config: {
    projects?: string[];
    environments?: string[];
    tokenTypes?: string[];
    integrations?: string[];
  }): {
    score: number;
    recommendations: string[];
    optimizations: string[];
    securityIssues: string[];
    patterns: DopplerIntelligencePattern[];
  } {
    const recommendations: string[] = [];
    const optimizations: string[] = [];
    const securityIssues: string[] = [];
    const relatedPatterns: DopplerIntelligencePattern[] = [];
    let score = 100;

    // Analyze environment setup
    if (config.environments) {
      if (config.environments.length < 2) {
        score -= 10;
        recommendations.push('Consider adding staging environment for safer deployments');
        relatedPatterns.push(...this.searchIntelligence('environment promotion').slice(0, 2));
      }
      
      if (config.environments.includes('production') && config.environments.includes('development')) {
        score += 10;
        optimizations.push('Good environment separation detected');
      }
    }

    // Analyze token usage
    if (config.tokenTypes) {
      if (config.tokenTypes.includes('personal') && config.environments?.includes('production')) {
        score -= 20;
        securityIssues.push('Personal tokens should not be used in production environments');
        relatedPatterns.push(...this.searchIntelligence('service token production').slice(0, 2));
      }
      
      if (config.tokenTypes.includes('service')) {
        score += 5;
        optimizations.push('Service tokens configured for appropriate use cases');
      }
    }

    // Analyze integrations
    if (config.integrations) {
      if (config.integrations.includes('github-actions')) {
        score += 10;
        optimizations.push('GitHub Actions integration provides good CI/CD security');
        relatedPatterns.push(...this.searchIntelligence('github actions').slice(0, 2));
      }
      
      if (config.integrations.includes('docker')) {
        score += 5;
        optimizations.push('Docker integration enables containerized secret management');
      }
    }

    return {
      score: Math.max(0, Math.min(100, score)),
      recommendations,
      optimizations,
      securityIssues,
      patterns: relatedPatterns.slice(0, 10)
    };
  }

  /**
   * Get contextual help for specific operations
   */
  getContextualHelp(operation: string, _context: any = {}): {
    description: string;
    steps: string[];
    examples: string[];
    warnings: string[];
    relatedPatterns: DopplerIntelligencePattern[];
  } {
    const patterns = this.searchIntelligence(operation, { maxResults: 10 });
    
    const help = {
      description: `Help for operation: ${operation}`,
      steps: ['Follow the patterns and examples below'],
      examples: [] as string[],
      warnings: [] as string[],
      relatedPatterns: patterns
    };

    // Extract steps, examples, and warnings from patterns
    patterns.forEach(pattern => {
      help.examples.push(...pattern.examples.slice(0, 2));
      help.warnings.push(...pattern.warnings);
    });

    // Remove duplicates
    help.examples = [...new Set(help.examples)];
    help.warnings = [...new Set(help.warnings)];

    return help;
  }

  /**
   * Refresh intelligence database (for dynamic updates)
   */
  refreshDatabase(): boolean {
    try {
      // Clear existing indices
      this.patterns.clear();
      this.categoryIndex.clear();
      this.complexityIndex.clear();
      this.safetyIndex.clear();
      this.typeIndex.clear();
      this.fileIndex.clear();
      
      // Reinitialize
      this.initializeDatabase();
      this.lastUpdate = new Date();
      
      logger.info('Intelligence database refreshed successfully');
      return true;
    } catch (error) {
      logger.error('Failed to refresh intelligence database', error);
      return false;
    }
  }
}

// Export singleton instance
export const dopplerIntelligence = new DopplerIntelligenceClient();