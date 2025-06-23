#!/usr/bin/env node

/**
 * Doppler Intelligence Parser
 * 
 * Phase 3A (KAYA-21): Parse all 20 Doppler documentation files and extract
 * comprehensive intelligence patterns for enhanced secret management.
 * 
 * Categories extracted:
 * - Security Patterns (token types, access control, audit requirements)
 * - Integration Workflows (GitHub Actions, CI/CD, cloud providers)
 * - Best Practices (environment management, secret promotion, lifecycle)
 * - Troubleshooting (common issues, diagnostic commands, resolution steps)
 * - Configuration Templates (project setups, environment hierarchies)
 * - Installation & Setup (various environment configurations)
 * - API Usage Patterns (CLI commands, SDK usage, automation)
 * - Performance & Scaling (optimization tips, large-scale deployment)
 */

const fs = require('fs');
const path = require('path');

// Configuration
const DOCS_DIR = '/Users/kayaozkur/Desktop/lepion/docs/doppler/doppler_docs';
const OUTPUT_FILE = '../src/generated-doppler-intelligence.ts';

// Intelligence pattern categories
const CATEGORIES = {
    SECURITY: 'security',
    INTEGRATION: 'integration', 
    BEST_PRACTICES: 'best_practices',
    TROUBLESHOOTING: 'troubleshooting',
    CONFIGURATION: 'configuration',
    INSTALLATION: 'installation',
    API_USAGE: 'api_usage',
    PERFORMANCE: 'performance',
    WORKFLOWS: 'workflows',
    TEMPLATES: 'templates'
};

// Complexity levels
const COMPLEXITY = {
    LOW: 'low',
    MODERATE: 'moderate', 
    HIGH: 'high',
    EXPERT: 'expert'
};

// Safety levels
const SAFETY = {
    SAFE: 'safe',
    MODERATE: 'moderate',
    CAREFUL: 'careful',
    CRITICAL: 'critical'
};

class DopplerIntelligenceParser {
    constructor() {
        this.intelligence = [];
        this.stats = {
            filesProcessed: 0,
            totalPatterns: 0,
            categoryCounts: {},
            complexityCounts: {},
            safetyLevels: {}
        };
        
        // Initialize counters
        Object.values(CATEGORIES).forEach(cat => this.stats.categoryCounts[cat] = 0);
        Object.values(COMPLEXITY).forEach(comp => this.stats.complexityCounts[comp] = 0);
        Object.values(SAFETY).forEach(safety => this.stats.safetyLevels[safety] = 0);
    }

    /**
     * Parse all Doppler documentation files
     */
    async parseAllFiles() {
        console.log('🚀 Starting Doppler Intelligence Extraction...');
        console.log(`📂 Processing files from: ${DOCS_DIR}`);
        
        const files = fs.readdirSync(DOCS_DIR).filter(file => file.endsWith('.md'));
        console.log(`📄 Found ${files.length} documentation files to process`);
        
        for (const file of files) {
            await this.parseFile(file);
        }
        
        console.log(`✅ Processing complete! Extracted ${this.intelligence.length} intelligence patterns`);
        this.generateOutput();
    }

    /**
     * Parse individual markdown file and extract intelligence patterns
     */
    async parseFile(filename) {
        const filePath = path.join(DOCS_DIR, filename);
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n');
        
        console.log(`📖 Processing: ${filename}`);
        
        let currentSection = '';
        let currentSubsection = '';
        let currentContent = [];
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmedLine = line.trim();
            
            // Track sections for context
            if (trimmedLine.startsWith('# ')) {
                currentSection = trimmedLine.substring(2);
                currentContent = [];
            } else if (trimmedLine.startsWith('## ')) {
                currentSubsection = trimmedLine.substring(3);
                currentContent = [];
            } else {
                currentContent.push(line);
            }
            
            // Extract various intelligence patterns
            this.extractSecurityPatterns(line, filename, i + 1, currentSection, currentSubsection);
            this.extractIntegrationPatterns(line, filename, i + 1, currentSection, currentSubsection);
            this.extractBestPractices(line, filename, i + 1, currentSection, currentSubsection);
            this.extractTroubleshootingPatterns(line, filename, i + 1, currentSection, currentSubsection);
            this.extractConfigurationPatterns(line, filename, i + 1, currentSection, currentSubsection);
            this.extractAPIUsagePatterns(line, filename, i + 1, currentSection, currentSubsection);
            this.extractWorkflowPatterns(line, filename, i + 1, currentSection, currentSubsection);
            this.extractCommandPatterns(line, filename, i + 1, currentSection, currentSubsection);
            this.extractEnvironmentPatterns(line, filename, i + 1, currentSection, currentSubsection);
            this.extractTemplatePatterns(line, filename, i + 1, currentSection, currentSubsection);
        }
        
        // Extract file-level patterns
        this.extractFilePatterns(filename, content);
        
        this.stats.filesProcessed++;
    }

    /**
     * Extract security-related intelligence patterns
     */
    extractSecurityPatterns(line, filename, lineNumber, section, subsection) {
        const trimmed = line.trim().toLowerCase();
        
        // Token security patterns
        if (trimmed.includes('service token') || trimmed.includes('dp.st.')) {
            this.addIntelligence({
                name: 'service_token_usage',
                description: 'Service token for production applications - read-only recommended',
                pattern: line.trim(),
                category: CATEGORIES.SECURITY,
                type: 'token_management',
                complexity: COMPLEXITY.MODERATE,
                safety: SAFETY.CAREFUL,
                filename, lineNumber, section, subsection,
                usage: 'Use service tokens (dp.st.) for production applications with read-only access',
                examples: [
                    'export DOPPLER_TOKEN="dp.st.your_service_token"',
                    'docker run -e DOPPLER_TOKEN=$DOPPLER_TOKEN myapp'
                ],
                recommendations: ['Use read-only tokens in production', 'Rotate tokens regularly'],
                warnings: ['Never commit service tokens to version control']
            });
        }
        
        // Personal token patterns
        if (trimmed.includes('personal token') || trimmed.includes('dp.pt.')) {
            this.addIntelligence({
                name: 'personal_token_security',
                description: 'Personal tokens for development - should not be used in production',
                pattern: line.trim(),
                category: CATEGORIES.SECURITY,
                type: 'token_management',
                complexity: COMPLEXITY.LOW,
                safety: SAFETY.MODERATE,
                filename, lineNumber, section, subsection,
                usage: 'Personal tokens for local development only',
                examples: ['doppler login', 'DOPPLER_TOKEN=dp.pt.development_token'],
                recommendations: ['Use only for local development', 'Login via CLI for better security'],
                warnings: ['Do not use personal tokens in CI/CD or production']
            });
        }
        
        // Access control patterns
        if (trimmed.includes('trusted ip') || trimmed.includes('ip allowlist')) {
            this.addIntelligence({
                name: 'ip_access_control',
                description: 'IP allowlisting for enhanced security in production environments',
                pattern: line.trim(),
                category: CATEGORIES.SECURITY,
                type: 'access_control',
                complexity: COMPLEXITY.HIGH,
                safety: SAFETY.CRITICAL,
                filename, lineNumber, section, subsection,
                usage: 'Configure trusted IPs for production token access',
                examples: ['Add CI/CD server IPs to allowlist', 'Configure production server IP ranges'],
                recommendations: ['Always use IP allowlisting in production', 'Regular audit of trusted IPs'],
                warnings: ['Incorrect IP configuration can break production access']
            });
        }
        
        // Audit patterns
        if (trimmed.includes('audit') || trimmed.includes('activity log')) {
            this.addIntelligence({
                name: 'audit_logging',
                description: 'Activity logging for compliance and security monitoring',
                pattern: line.trim(),
                category: CATEGORIES.SECURITY,
                type: 'audit_compliance',
                complexity: COMPLEXITY.MODERATE,
                safety: SAFETY.SAFE,
                filename, lineNumber, section, subsection,
                usage: 'Enable audit logging for compliance and security monitoring',
                examples: ['doppler activity', 'API endpoint: /v3/logs/activity'],
                recommendations: ['Regular audit log review', 'Set up automated alerting'],
                warnings: ['Audit logs are essential for compliance']
            });
        }
    }

    /**
     * Extract integration workflow patterns
     */
    extractIntegrationPatterns(line, filename, lineNumber, section, subsection) {
        const trimmed = line.trim().toLowerCase();
        
        // GitHub Actions patterns
        if (trimmed.includes('github action') || trimmed.includes('github_token')) {
            this.addIntelligence({
                name: 'github_actions_integration',
                description: 'GitHub Actions workflow integration with Doppler secrets',
                pattern: line.trim(),
                category: CATEGORIES.INTEGRATION,
                type: 'ci_cd_workflow',
                complexity: COMPLEXITY.MODERATE,
                safety: SAFETY.SAFE,
                filename, lineNumber, section, subsection,
                usage: 'Integrate Doppler secrets into GitHub Actions workflows',
                examples: [
                    'uses: dopplerhq/secrets-fetch-action@v1.1.0',
                    'with: doppler-token: ${{ secrets.DOPPLER_TOKEN }}'
                ],
                recommendations: ['Use GitHub Actions integration action', 'Store Doppler token in GitHub Secrets'],
                warnings: ['Never expose Doppler tokens in workflow logs']
            });
        }
        
        // Docker integration patterns
        if (trimmed.includes('docker') && (trimmed.includes('secret') || trimmed.includes('doppler'))) {
            this.addIntelligence({
                name: 'docker_secret_injection',
                description: 'Docker container secret injection using Doppler CLI',
                pattern: line.trim(),
                category: CATEGORIES.INTEGRATION,
                type: 'container_deployment',
                complexity: COMPLEXITY.MODERATE,
                safety: SAFETY.MODERATE,
                filename, lineNumber, section, subsection,
                usage: 'Inject secrets into Docker containers using Doppler CLI',
                examples: [
                    'doppler run -- docker build -t myapp .',
                    'docker run -e DOPPLER_TOKEN=$DOPPLER_TOKEN myapp'
                ],
                recommendations: ['Use Doppler CLI for secret injection', 'Never bake secrets into images'],
                warnings: ['Ensure Doppler CLI is available in container']
            });
        }
        
        // Kubernetes patterns
        if (trimmed.includes('kubernetes') || trimmed.includes('k8s')) {
            this.addIntelligence({
                name: 'kubernetes_integration',
                description: 'Kubernetes secret management with Doppler operator or CLI',
                pattern: line.trim(),
                category: CATEGORIES.INTEGRATION,
                type: 'orchestration',
                complexity: COMPLEXITY.HIGH,
                safety: SAFETY.CAREFUL,
                filename, lineNumber, section, subsection,
                usage: 'Deploy secrets to Kubernetes using Doppler operator or sidecar pattern',
                examples: [
                    'kubectl apply -f doppler-operator.yaml',
                    'doppler kubernetes create secret --name myapp-secrets'
                ],
                recommendations: ['Use Doppler Kubernetes operator', 'Implement proper RBAC'],
                warnings: ['Kubernetes secrets are base64 encoded, not encrypted']
            });
        }
    }

    /**
     * Extract best practice patterns
     */
    extractBestPractices(line, filename, lineNumber, section, subsection) {
        const trimmed = line.trim().toLowerCase();
        
        // Environment management
        if (trimmed.includes('environment') && (trimmed.includes('promote') || trimmed.includes('staging'))) {
            this.addIntelligence({
                name: 'environment_promotion_strategy',
                description: 'Best practices for promoting secrets between environments',
                pattern: line.trim(),
                category: CATEGORIES.BEST_PRACTICES,
                type: 'environment_management',
                complexity: COMPLEXITY.MODERATE,
                safety: SAFETY.SAFE,
                filename, lineNumber, section, subsection,
                usage: 'Systematically promote secrets from development to production',
                examples: [
                    'doppler secrets download --no-file -c dev | doppler secrets upload -c staging',
                    'Exclude environment-specific secrets like DATABASE_URL'
                ],
                recommendations: ['Test in staging before production', 'Exclude environment-specific secrets'],
                warnings: ['Always validate promoted secrets before deployment']
            });
        }
        
        // Secret naming conventions
        if (trimmed.includes('naming') || (trimmed.includes('secret') && trimmed.includes('convention'))) {
            this.addIntelligence({
                name: 'secret_naming_conventions',
                description: 'Standardized naming conventions for secrets management',
                pattern: line.trim(),
                category: CATEGORIES.BEST_PRACTICES,
                type: 'organization',
                complexity: COMPLEXITY.LOW,
                safety: SAFETY.SAFE,
                filename, lineNumber, section, subsection,
                usage: 'Use consistent naming patterns for secrets across environments',
                examples: [
                    'DATABASE_URL, API_KEY, STRIPE_SECRET_KEY',
                    'PREFIX_SERVICE_ENVIRONMENT pattern'
                ],
                recommendations: ['ALL_CAPS with underscores', 'Descriptive but concise names'],
                warnings: ['Avoid revealing sensitive information in secret names']
            });
        }
        
        // Rotation patterns
        if (trimmed.includes('rotat') || trimmed.includes('refresh')) {
            this.addIntelligence({
                name: 'secret_rotation_strategy',
                description: 'Secret rotation best practices for security and compliance',
                pattern: line.trim(),
                category: CATEGORIES.BEST_PRACTICES,
                type: 'security_lifecycle',
                complexity: COMPLEXITY.HIGH,
                safety: SAFETY.CRITICAL,
                filename, lineNumber, section, subsection,
                usage: 'Implement regular secret rotation for security compliance',
                examples: [
                    'Automated rotation via API',
                    'Zero-downtime rotation strategies'
                ],
                recommendations: ['Automate rotation where possible', 'Test rotation procedures'],
                warnings: ['Improper rotation can cause service outages']
            });
        }
    }

    /**
     * Extract troubleshooting patterns
     */
    extractTroubleshootingPatterns(line, filename, lineNumber, section, subsection) {
        const trimmed = line.trim().toLowerCase();
        
        // Common error patterns
        if (trimmed.includes('error') || trimmed.includes('failed') || trimmed.includes('issue')) {
            const errorContext = this.extractErrorContext(line);
            if (errorContext) {
                this.addIntelligence({
                    name: `troubleshoot_${errorContext.type}`,
                    description: `Troubleshooting guide for ${errorContext.description}`,
                    pattern: line.trim(),
                    category: CATEGORIES.TROUBLESHOOTING,
                    type: 'error_resolution',
                    complexity: COMPLEXITY.MODERATE,
                    safety: SAFETY.SAFE,
                    filename, lineNumber, section, subsection,
                    usage: `Resolve ${errorContext.description} issues`,
                    examples: errorContext.examples,
                    recommendations: errorContext.solutions,
                    warnings: errorContext.warnings || []
                });
            }
        }
        
        // Permission issues
        if (trimmed.includes('permission') || trimmed.includes('unauthorized') || trimmed.includes('forbidden')) {
            this.addIntelligence({
                name: 'permission_troubleshooting',
                description: 'Troubleshooting permission and access issues',
                pattern: line.trim(),
                category: CATEGORIES.TROUBLESHOOTING,
                type: 'access_issues',
                complexity: COMPLEXITY.MODERATE,
                safety: SAFETY.MODERATE,
                filename, lineNumber, section, subsection,
                usage: 'Diagnose and resolve permission-related access issues',
                examples: [
                    'Check token permissions: doppler me',
                    'Verify project access in Doppler dashboard'
                ],
                recommendations: ['Verify token scope', 'Check workplace permissions'],
                warnings: ['Overly permissive tokens pose security risks']
            });
        }
    }

    /**
     * Extract configuration patterns
     */
    extractConfigurationPatterns(line, filename, lineNumber, section, subsection) {
        const trimmed = line.trim().toLowerCase();
        
        // Project setup patterns
        if (trimmed.includes('doppler setup') || trimmed.includes('project setup')) {
            this.addIntelligence({
                name: 'project_setup_configuration',
                description: 'Project initialization and configuration best practices',
                pattern: line.trim(),
                category: CATEGORIES.CONFIGURATION,
                type: 'project_initialization',
                complexity: COMPLEXITY.LOW,
                safety: SAFETY.SAFE,
                filename, lineNumber, section, subsection,
                usage: 'Initialize new projects with proper Doppler configuration',
                examples: [
                    'doppler setup',
                    'doppler configure'
                ],
                recommendations: ['Use doppler setup for new projects', 'Configure default environments'],
                warnings: ['Ensure proper project selection before configuration']
            });
        }
        
        // Environment configuration
        if (trimmed.includes('config') && (trimmed.includes('dev') || trimmed.includes('prod') || trimmed.includes('staging'))) {
            this.addIntelligence({
                name: 'environment_configuration_strategy',
                description: 'Environment-specific configuration management patterns',
                pattern: line.trim(),
                category: CATEGORIES.CONFIGURATION,
                type: 'environment_setup',
                complexity: COMPLEXITY.MODERATE,
                safety: SAFETY.SAFE,
                filename, lineNumber, section, subsection,
                usage: 'Configure environments with appropriate inheritance and overrides',
                examples: [
                    'dev -> staging -> production hierarchy',
                    'Environment-specific overrides for DATABASE_URL'
                ],
                recommendations: ['Use inheritance for common secrets', 'Override environment-specific values'],
                warnings: ['Test configuration changes in staging first']
            });
        }
    }

    /**
     * Extract API and command usage patterns
     */
    extractAPIUsagePatterns(line, filename, lineNumber, section, subsection) {
        const trimmed = line.trim();
        
        // CLI command patterns
        if (trimmed.startsWith('doppler ') || trimmed.includes('$ doppler')) {
            const command = this.extractCommand(trimmed);
            if (command) {
                this.addIntelligence({
                    name: `cli_${command.name}`,
                    description: `CLI command: ${command.description}`,
                    pattern: trimmed,
                    category: CATEGORIES.API_USAGE,
                    type: 'cli_command',
                    complexity: command.complexity,
                    safety: SAFETY.SAFE,
                    filename, lineNumber, section, subsection,
                    usage: command.usage,
                    examples: [trimmed, ...command.variations],
                    recommendations: command.recommendations,
                    warnings: command.warnings || []
                });
            }
        }
        
        // API endpoint patterns
        if (trimmed.includes('/v3/') || trimmed.includes('api.doppler.com')) {
            this.addIntelligence({
                name: 'api_endpoint_usage',
                description: 'Doppler REST API endpoint usage pattern',
                pattern: trimmed,
                category: CATEGORIES.API_USAGE,
                type: 'rest_api',
                complexity: COMPLEXITY.MODERATE,
                safety: SAFETY.MODERATE,
                filename, lineNumber, section, subsection,
                usage: 'Use Doppler REST API for programmatic access',
                examples: [trimmed],
                recommendations: ['Use service tokens for API access', 'Implement proper error handling'],
                warnings: ['Rate limiting applies to API calls']
            });
        }
    }

    /**
     * Extract workflow patterns
     */
    extractWorkflowPatterns(line, filename, lineNumber, section, subsection) {
        const trimmed = line.trim().toLowerCase();
        
        // Deployment workflows
        if (trimmed.includes('deploy') || (trimmed.includes('workflow') && trimmed.includes('secret'))) {
            this.addIntelligence({
                name: 'deployment_workflow',
                description: 'Deployment workflow integration with secret management',
                pattern: line.trim(),
                category: CATEGORIES.WORKFLOWS,
                type: 'deployment_process',
                complexity: COMPLEXITY.HIGH,
                safety: SAFETY.CAREFUL,
                filename, lineNumber, section, subsection,
                usage: 'Integrate secret management into deployment workflows',
                examples: [
                    'doppler run -- npm run deploy',
                    'Pre-deployment secret validation'
                ],
                recommendations: ['Validate secrets before deployment', 'Use environment-specific tokens'],
                warnings: ['Failed secret injection can break deployments']
            });
        }
        
        // Development workflows
        if (trimmed.includes('development') && (trimmed.includes('local') || trimmed.includes('dev'))) {
            this.addIntelligence({
                name: 'development_workflow',
                description: 'Local development workflow with Doppler integration',
                pattern: line.trim(),
                category: CATEGORIES.WORKFLOWS,
                type: 'development_process',
                complexity: COMPLEXITY.LOW,
                safety: SAFETY.SAFE,
                filename, lineNumber, section, subsection,
                usage: 'Set up local development environment with Doppler secrets',
                examples: [
                    'doppler login',
                    'doppler run -- npm start'
                ],
                recommendations: ['Use personal tokens for development', 'Never commit .env files'],
                warnings: ['Development secrets should not be production secrets']
            });
        }
    }

    /**
     * Extract command patterns and variations
     */
    extractCommandPatterns(line, filename, lineNumber, section, subsection) {
        const trimmed = line.trim();
        
        // Code block commands
        if (trimmed.startsWith('```') || trimmed.startsWith('`')) {
            // Skip code block markers
            return;
        }
        
        // Direct commands
        if (trimmed.includes('doppler ') && !trimmed.startsWith('#')) {
            const commandMatch = trimmed.match(/doppler\s+([a-zA-Z-]+)(?:\s+([a-zA-Z-]+))?/);
            if (commandMatch) {
                const [, mainCommand, subCommand] = commandMatch;
                const fullCommand = subCommand ? `${mainCommand}_${subCommand}` : mainCommand;
                
                this.addIntelligence({
                    name: `command_${fullCommand}`,
                    description: `Doppler CLI command: ${mainCommand}${subCommand ? ' ' + subCommand : ''}`,
                    pattern: trimmed,
                    category: CATEGORIES.API_USAGE,
                    type: 'cli_command',
                    complexity: COMPLEXITY.LOW,
                    safety: SAFETY.SAFE,
                    filename, lineNumber, section, subsection,
                    usage: `Execute ${mainCommand} operations via CLI`,
                    examples: [trimmed],
                    recommendations: ['Check command help: doppler --help', 'Use appropriate authentication'],
                    warnings: ['Some commands require specific permissions']
                });
            }
        }
    }

    /**
     * Extract environment-specific patterns
     */
    extractEnvironmentPatterns(line, filename, lineNumber, section, subsection) {
        const trimmed = line.trim().toLowerCase();
        
        // Environment variables
        if (trimmed.includes('export') || trimmed.includes('env_var') || 
            (trimmed.includes('doppler_') && (trimmed.includes('token') || trimmed.includes('project')))) {
            
            this.addIntelligence({
                name: 'environment_variable_configuration',
                description: 'Environment variable configuration for Doppler integration',
                pattern: line.trim(),
                category: CATEGORIES.CONFIGURATION,
                type: 'environment_setup',
                complexity: COMPLEXITY.LOW,
                safety: SAFETY.MODERATE,
                filename, lineNumber, section, subsection,
                usage: 'Configure environment variables for Doppler CLI and applications',
                examples: [
                    'export DOPPLER_TOKEN="dp.st.your_token"',
                    'export DOPPLER_PROJECT="myproject"'
                ],
                recommendations: ['Use secure token storage', 'Set project defaults for convenience'],
                warnings: ['Never expose tokens in scripts or logs']
            });
        }
    }

    /**
     * Extract template and example patterns
     */
    extractTemplatePatterns(line, filename, lineNumber, section, subsection) {
        const trimmed = line.trim();
        
        // YAML/JSON configuration templates
        if (trimmed.includes('---') || trimmed.includes('{') || 
            (trimmed.includes(':') && (trimmed.includes('doppler') || trimmed.includes('secret')))) {
            
            this.addIntelligence({
                name: 'configuration_template',
                description: 'Configuration template for various integration scenarios',
                pattern: line.trim(),
                category: CATEGORIES.TEMPLATES,
                type: 'configuration_template',
                complexity: COMPLEXITY.MODERATE,
                safety: SAFETY.SAFE,
                filename, lineNumber, section, subsection,
                usage: 'Use as template for integration configuration',
                examples: [trimmed],
                recommendations: ['Customize for your specific use case', 'Validate configuration syntax'],
                warnings: ['Review security settings before deployment']
            });
        }
    }

    /**
     * Extract file-level patterns and metadata
     */
    extractFilePatterns(filename, content) {
        const fileIntelligence = {
            name: `file_${filename.replace('.md', '').replace('-', '_')}`,
            description: `Comprehensive guide: ${filename}`,
            pattern: `Documentation file: ${filename}`,
            category: this.categorizeFile(filename),
            type: 'documentation',
            complexity: this.assessFileComplexity(content),
            safety: SAFETY.SAFE,
            filename,
            lineNumber: 1,
            section: 'file_overview',
            subsection: '',
            usage: `Reference guide for ${filename.replace('.md', '').replace('-', ' ')}`,
            examples: [`Study ${filename} for detailed information`],
            recommendations: [`Follow practices outlined in ${filename}`],
            warnings: []
        };
        
        // Extract key topics from file content
        const topics = this.extractTopics(content);
        if (topics.length > 0) {
            fileIntelligence.topics = topics;
        }
        
        this.addIntelligence(fileIntelligence);
    }

    /**
     * Helper methods for pattern extraction
     */
    extractErrorContext(line) {
        const trimmed = line.toLowerCase();
        
        if (trimmed.includes('token') && (trimmed.includes('invalid') || trimmed.includes('expired'))) {
            return {
                type: 'token_error',
                description: 'invalid or expired token',
                examples: ['Check token validity: doppler me', 'Regenerate token if expired'],
                solutions: ['Verify token format', 'Check token expiration', 'Regenerate if needed']
            };
        }
        
        if (trimmed.includes('project') && trimmed.includes('not found')) {
            return {
                type: 'project_error',
                description: 'project not found',
                examples: ['List projects: doppler projects', 'Verify project name spelling'],
                solutions: ['Check project existence', 'Verify permissions', 'Use correct project name']
            };
        }
        
        return null;
    }

    extractCommand(line) {
        const commandMatch = line.match(/doppler\s+([a-zA-Z-]+)(?:\s+([a-zA-Z-]+))?/);
        if (!commandMatch) return null;
        
        const [, mainCommand, subCommand] = commandMatch;
        const fullCommand = subCommand ? `${mainCommand} ${subCommand}` : mainCommand;
        
        return {
            name: fullCommand.replace(' ', '_'),
            description: `${fullCommand} command`,
            usage: `Use doppler ${fullCommand} for ${mainCommand} operations`,
            complexity: COMPLEXITY.LOW,
            variations: [`doppler ${fullCommand} --help`],
            recommendations: ['Check command documentation', 'Use appropriate flags'],
            warnings: subCommand === 'delete' ? ['Deletion is irreversible'] : []
        };
    }

    categorizeFile(filename) {
        const name = filename.toLowerCase();
        
        if (name.includes('security') || name.includes('access-control')) return CATEGORIES.SECURITY;
        if (name.includes('integration') || name.includes('github') || name.includes('docker')) return CATEGORIES.INTEGRATION;
        if (name.includes('troubleshooting')) return CATEGORIES.TROUBLESHOOTING;
        if (name.includes('getting-started') || name.includes('installation')) return CATEGORIES.INSTALLATION;
        if (name.includes('cli') || name.includes('api')) return CATEGORIES.API_USAGE;
        if (name.includes('organization') || name.includes('workplace')) return CATEGORIES.CONFIGURATION;
        
        return CATEGORIES.BEST_PRACTICES;
    }

    assessFileComplexity(content) {
        const lines = content.split('\n').length;
        const codeBlocks = (content.match(/```/g) || []).length / 2;
        const commands = (content.match(/doppler\s+/g) || []).length;
        
        if (lines > 500 || codeBlocks > 10 || commands > 20) return COMPLEXITY.EXPERT;
        if (lines > 200 || codeBlocks > 5 || commands > 10) return COMPLEXITY.HIGH;
        if (lines > 100 || codeBlocks > 2 || commands > 5) return COMPLEXITY.MODERATE;
        
        return COMPLEXITY.LOW;
    }

    extractTopics(content) {
        const topics = [];
        const lines = content.split('\n');
        
        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('## ')) {
                topics.push(trimmed.substring(3));
            }
        }
        
        return topics.slice(0, 10); // Limit to first 10 topics
    }

    /**
     * Add intelligence pattern to collection
     */
    addIntelligence(pattern) {
        // Avoid exact duplicates
        const exists = this.intelligence.some(p => 
            p.name === pattern.name && 
            p.pattern === pattern.pattern && 
            p.filename === pattern.filename
        );
        
        if (!exists) {
            this.intelligence.push(pattern);
            this.stats.totalPatterns++;
            this.stats.categoryCounts[pattern.category]++;
            this.stats.complexityCounts[pattern.complexity]++;
            this.stats.safetyLevels[pattern.safety]++;
        }
    }

    /**
     * Generate TypeScript output file
     */
    generateOutput() {
        console.log('📝 Generating TypeScript intelligence database...');
        
        const output = `/**
 * Generated Doppler Intelligence Database
 * 
 * Phase 3 (KAYA-21): Doppler Integration Intelligence
 * Auto-generated from ${this.stats.filesProcessed} Doppler documentation files
 * 
 * Total Intelligence Patterns: ${this.stats.totalPatterns}
 * Categories: ${Object.keys(this.stats.categoryCounts).length}
 * Generated: ${new Date().toISOString()}
 */

export interface DopplerIntelligencePattern {
  name: string;
  description: string;
  pattern: string;
  category: string;
  type: string;
  complexity: 'low' | 'moderate' | 'high' | 'expert';
  safety: 'safe' | 'moderate' | 'careful' | 'critical';
  filename: string;
  lineNumber: number;
  section: string;
  subsection: string;
  usage: string;
  examples: string[];
  recommendations: string[];
  warnings: string[];
  topics?: string[];
}

export const DOPPLER_INTELLIGENCE_PATTERNS: DopplerIntelligencePattern[] = ${JSON.stringify(this.intelligence, null, 2)};

export const INTELLIGENCE_CATEGORIES = {
  SECURITY: 'security',
  INTEGRATION: 'integration',
  BEST_PRACTICES: 'best_practices',
  TROUBLESHOOTING: 'troubleshooting',
  CONFIGURATION: 'configuration',
  INSTALLATION: 'installation',
  API_USAGE: 'api_usage',
  PERFORMANCE: 'performance',
  WORKFLOWS: 'workflows',
  TEMPLATES: 'templates'
} as const;

export const COMPLEXITY_LEVELS = {
  LOW: 'low',
  MODERATE: 'moderate',
  HIGH: 'high',
  EXPERT: 'expert'
} as const;

export const SAFETY_LEVELS = {
  SAFE: 'safe',
  MODERATE: 'moderate',
  CAREFUL: 'careful',
  CRITICAL: 'critical'
} as const;

export const INTELLIGENCE_STATS = {
  totalPatterns: ${this.stats.totalPatterns},
  filesProcessed: ${this.stats.filesProcessed},
  categoryCounts: ${JSON.stringify(this.stats.categoryCounts, null, 2)},
  complexityCounts: ${JSON.stringify(this.stats.complexityCounts, null, 2)},
  safetyLevels: ${JSON.stringify(this.stats.safetyLevels, null, 2)},
  lastUpdate: '${new Date().toISOString()}'
};

// Category-based access helpers
export const getPatternsByCategory = (category: string): DopplerIntelligencePattern[] => {
  return DOPPLER_INTELLIGENCE_PATTERNS.filter(p => p.category === category);
};

export const getPatternsByComplexity = (complexity: string): DopplerIntelligencePattern[] => {
  return DOPPLER_INTELLIGENCE_PATTERNS.filter(p => p.complexity === complexity);
};

export const getPatternsBySafety = (safety: string): DopplerIntelligencePattern[] => {
  return DOPPLER_INTELLIGENCE_PATTERNS.filter(p => p.safety === safety);
};

export const searchPatterns = (query: string): DopplerIntelligencePattern[] => {
  const searchTerm = query.toLowerCase();
  return DOPPLER_INTELLIGENCE_PATTERNS.filter(p => 
    p.name.toLowerCase().includes(searchTerm) ||
    p.description.toLowerCase().includes(searchTerm) ||
    p.pattern.toLowerCase().includes(searchTerm) ||
    p.usage.toLowerCase().includes(searchTerm) ||
    p.examples.some(ex => ex.toLowerCase().includes(searchTerm))
  );
};
`;

        const outputPath = path.resolve(__dirname, OUTPUT_FILE);
        fs.writeFileSync(outputPath, output, 'utf8');
        
        console.log(`✅ Generated: ${outputPath}`);
        console.log(`📊 Intelligence Database Statistics:`);
        console.log(`   Total Patterns: ${this.stats.totalPatterns}`);
        console.log(`   Files Processed: ${this.stats.filesProcessed}`);
        console.log(`   Categories: ${Object.keys(this.stats.categoryCounts).length}`);
        
        console.log('\n📂 Category Breakdown:');
        Object.entries(this.stats.categoryCounts).forEach(([category, count]) => {
            console.log(`   ${category}: ${count} patterns`);
        });
        
        console.log('\n🎯 Complexity Distribution:');
        Object.entries(this.stats.complexityCounts).forEach(([complexity, count]) => {
            console.log(`   ${complexity}: ${count} patterns`);
        });
        
        console.log('\n🛡️ Safety Level Distribution:');
        Object.entries(this.stats.safetyLevels).forEach(([safety, count]) => {
            console.log(`   ${safety}: ${count} patterns`);
        });
    }
}

// Execute the parser
if (require.main === module) {
    const parser = new DopplerIntelligenceParser();
    parser.parseAllFiles().catch(console.error);
}

module.exports = { DopplerIntelligenceParser };