# Doppler MCP Server Usage Examples

## Basic Operations

### 1. List All Projects
```
User: Can you show me all my Doppler projects?
Assistant: I'll list all your Doppler projects.

[Uses doppler_list_projects tool]
```

### 2. View Secrets in a Project
```
User: What secrets are in my 'api-service' project in the production environment?
Assistant: I'll check the secrets in your api-service project's production environment.

[Uses doppler_list_secrets with project="api-service", config="production"]
```

### 3. Get a Specific Secret
```
User: What's the value of DATABASE_URL in my app's staging environment?
Assistant: I'll retrieve the DATABASE_URL secret from your app's staging environment.

[Uses doppler_get_secret with project="app", config="staging", name="DATABASE_URL"]
```

## Secret Management

### 4. Create a New Secret
```
User: Add a new API key for Stripe in my payment-service development environment
Assistant: I'll add the new Stripe API key to your payment-service development environment.

[Uses doppler_set_secret with project="payment-service", config="development", name="STRIPE_API_KEY", value="sk_test_..."]
```

### 5. Update an Existing Secret
```
User: Update the REDIS_URL in production to point to the new Redis cluster
Assistant: I'll update the REDIS_URL in your production environment.

[Uses doppler_set_secret with updated value]
```

### 6. Delete Unused Secrets
```
User: Remove the OLD_API_KEY and DEPRECATED_ENDPOINT from staging
Assistant: I'll remove those deprecated secrets from your staging environment.

[Uses doppler_delete_secrets with secrets=["OLD_API_KEY", "DEPRECATED_ENDPOINT"]]
```

## Environment Management

### 7. Promote Secrets Between Environments
```
User: Promote all secrets from staging to production, except for DEBUG and LOG_LEVEL
Assistant: I'll promote your secrets from staging to production, excluding DEBUG and LOG_LEVEL.

[Uses doppler_promote_secrets with sourceConfig="staging", targetConfig="production", excludeKeys=["DEBUG", "LOG_LEVEL"]]
```

### 8. Clone Environment Configuration
```
User: I need to set up a new QA environment with the same secrets as staging
Assistant: I'll help you create a QA environment by promoting all staging secrets to it.

[First creates QA config, then uses doppler_promote_secrets]
```

## Security Operations

### 9. Create Service Token for CI/CD
```
User: Create a read-only token for GitHub Actions to use with my frontend project
Assistant: I'll create a read-only service token for your GitHub Actions workflow.

[Uses doppler_create_service_token with project="frontend", config="production", name="github-actions", access="read"]
```

### 10. Rotate API Keys
```
User: I need to rotate the PAYMENT_API_KEY in all environments
Assistant: I'll help you rotate the PAYMENT_API_KEY across all environments. Let me:
1. Generate a new key
2. Update it in development first
3. Test the connection
4. Then promote to staging and production

[Uses multiple doppler_set_secret calls for each environment]
```

## Audit and Compliance

### 11. Review Recent Activity
```
User: Show me the last 10 changes made to my production secrets
Assistant: I'll retrieve the recent activity logs for your production environment.

[Uses doppler_get_activity_logs with project filter and pagination]
```

### 12. Security Audit
```
User: Check if any secrets in production haven't been updated in the last 90 days
Assistant: I'll analyze your production secrets to identify any that might need rotation.

[Combines doppler_list_secrets and doppler_get_activity_logs to analyze secret age]
```

## Complex Workflows

### 13. Multi-Project Secret Sync
```
User: Ensure the DATABASE_URL is the same across frontend, backend, and worker projects in production
Assistant: I'll synchronize the DATABASE_URL across all three projects in production.

[Uses doppler_get_secret from one project, then doppler_set_secret for others]
```

### 14. Environment Setup for New Developer
```
User: Set up development environment secrets for a new team member working on the API service
Assistant: I'll help set up the development environment for your new team member:
1. List current development secrets
2. Create personalized tokens where needed
3. Ensure all required secrets are present

[Combines multiple tools to audit and configure environment]
```

### 15. Disaster Recovery
```
User: We need to restore our production secrets from the staging backup
Assistant: I'll help restore your production secrets from staging:
1. First, I'll list all staging secrets
2. Show you what will be replaced in production
3. With your confirmation, promote all staging secrets to production

[Uses doppler_list_secrets for comparison, then doppler_promote_secrets]
```

## Best Practices Examples

### 16. Pre-deployment Checklist
```
User: Run a pre-deployment check for my app
Assistant: I'll run a comprehensive pre-deployment check:
1. Verify all required secrets exist in production
2. Check for any test/development values
3. Ensure service tokens are configured
4. Review recent secret changes

[Combines multiple tools for comprehensive validation]
```

### 17. Secret Organization
```
User: Help me organize my secrets better - they're getting messy
Assistant: I'll help organize your secrets:
1. List all current secrets
2. Identify naming inconsistencies
3. Suggest a naming convention
4. Help rename secrets to follow the pattern

[Uses doppler_list_secrets, then systematic doppler_set_secret and doppler_delete_secrets]
```

## Integration Patterns

### 18. Kubernetes ConfigMap Generation
```
User: Generate a Kubernetes ConfigMap from my production secrets
Assistant: I'll retrieve your production secrets and format them as a Kubernetes ConfigMap.

[Uses doppler_list_secrets and doppler_get_secret to build ConfigMap YAML]
```

### 19. Docker Compose Environment File
```
User: Create a .env file for Docker Compose from my development secrets
Assistant: I'll generate a .env file with your development secrets for Docker Compose.

[Uses doppler_list_secrets and doppler_get_secret to create formatted output]
```

### 20. Terraform Variable Generation
```
User: Generate Terraform variables from my infrastructure secrets
Assistant: I'll create Terraform variable definitions from your infrastructure secrets.

[Uses tools to extract and format secrets as Terraform variables]
```