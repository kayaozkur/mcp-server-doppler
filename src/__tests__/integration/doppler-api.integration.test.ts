import { DopplerClient } from '../../doppler-client';
import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

/**
 * Integration tests for Doppler API
 * 
 * These tests require:
 * 1. A valid Doppler service token in DOPPLER_TEST_TOKEN env var
 * 2. A test project named 'mcp-test' with 'development' config
 * 
 * Run with: npm run test:integration
 */

describe('Doppler API Integration Tests', () => {
  let client: DopplerClient;
  const testProject = process.env.DOPPLER_TEST_PROJECT || 'mcp-test';
  const testConfig = process.env.DOPPLER_TEST_CONFIG || 'development';
  const isIntegrationTest = process.env.DOPPLER_TEST_TOKEN && process.env.RUN_INTEGRATION_TESTS === 'true';

  beforeAll(() => {
    if (!isIntegrationTest) {
      console.log('Skipping integration tests. Set RUN_INTEGRATION_TESTS=true and provide DOPPLER_TEST_TOKEN');
      return;
    }
    
    client = new DopplerClient(process.env.DOPPLER_TEST_TOKEN!);
  });

  describe.skipIf(!isIntegrationTest)('Project Operations', () => {
    it('should list projects', async () => {
      const projects = await client.listProjects();
      
      expect(Array.isArray(projects)).toBe(true);
      expect(projects.length).toBeGreaterThan(0);
      
      const project = projects[0];
      expect(project).toHaveProperty('slug');
      expect(project).toHaveProperty('name');
      expect(project).toHaveProperty('created_at');
    });

    it('should list configs for a project', async () => {
      const configs = await client.listConfigs(testProject);
      
      expect(Array.isArray(configs)).toBe(true);
      expect(configs.length).toBeGreaterThan(0);
      
      const hasTestConfig = configs.some(c => c.name === testConfig);
      expect(hasTestConfig).toBe(true);
    });
  });

  describe.skipIf(!isIntegrationTest)('Secret Operations', () => {
    const testSecretName = `TEST_SECRET_${Date.now()}`;
    const testSecretValue = 'integration-test-value';

    afterAll(async () => {
      // Cleanup test secret
      if (isIntegrationTest) {
        try {
          await client.deleteSecrets(testProject, testConfig, [testSecretName]);
        } catch (error) {
          console.warn('Failed to cleanup test secret:', error);
        }
      }
    });

    it('should create a new secret', async () => {
      const result = await client.setSecret(
        testProject,
        testConfig,
        testSecretName,
        testSecretValue
      );

      expect(result).toHaveProperty('created', true);
    });

    it('should list secrets including the new one', async () => {
      const secrets = await client.listSecrets(testProject, testConfig);
      
      expect(secrets).toHaveProperty(testSecretName);
      expect(secrets[testSecretName]).toBe(testSecretValue);
    });

    it('should get a specific secret', async () => {
      const secret = await client.getSecret(
        testProject,
        testConfig,
        testSecretName
      );

      expect(secret).toHaveProperty('name', testSecretName);
      expect(secret).toHaveProperty('value');
      expect(secret.value).toHaveProperty('raw', testSecretValue);
    });

    it('should update an existing secret', async () => {
      const newValue = 'updated-integration-test-value';
      const result = await client.setSecret(
        testProject,
        testConfig,
        testSecretName,
        newValue
      );

      expect(result).toHaveProperty('created', false);

      // Verify update
      const secret = await client.getSecret(
        testProject,
        testConfig,
        testSecretName
      );
      expect(secret.value.raw).toBe(newValue);
    });

    it('should delete a secret', async () => {
      await client.deleteSecrets(testProject, testConfig, [testSecretName]);

      // Verify deletion
      const secrets = await client.listSecrets(testProject, testConfig);
      expect(secrets).not.toHaveProperty(testSecretName);
    });
  });

  describe.skipIf(!isIntegrationTest)('Environment Promotion', () => {
    const sourceConfig = testConfig;
    const targetConfig = 'test-promotion';
    const promotionSecrets = {
      PROMO_SECRET_1: 'value1',
      PROMO_SECRET_2: 'value2',
      PROMO_SECRET_3: 'value3',
    };

    beforeAll(async () => {
      if (!isIntegrationTest) return;
      
      // Set up source secrets
      for (const [name, value] of Object.entries(promotionSecrets)) {
        await client.setSecret(testProject, sourceConfig, name, value);
      }
    });

    afterAll(async () => {
      if (!isIntegrationTest) return;
      
      // Cleanup
      const secretNames = Object.keys(promotionSecrets);
      try {
        await client.deleteSecrets(testProject, sourceConfig, secretNames);
      } catch (error) {
        console.warn('Failed to cleanup source secrets:', error);
      }
    });

    it('should promote secrets between environments', async () => {
      const result = await client.promoteSecrets(
        testProject,
        sourceConfig,
        targetConfig,
        ['PROMO_SECRET_3'] // Exclude one secret
      );

      expect(result).toHaveProperty('count');
      expect(result.count).toBeGreaterThan(0);

      // Note: Full verification would require access to target config
      // which may not exist in test environment
    });
  });

  describe.skipIf(!isIntegrationTest)('Service Token Operations', () => {
    it('should create a service token', async () => {
      const tokenName = `test-token-${Date.now()}`;
      
      const token = await client.createServiceToken(
        testProject,
        testConfig,
        tokenName,
        'read'
      );

      expect(token).toHaveProperty('key');
      expect(token).toHaveProperty('name', tokenName);
      expect(token).toHaveProperty('access', 'read');
      expect(token.key).toMatch(/^dp\.st\./);
    });
  });

  describe.skipIf(!isIntegrationTest)('Activity Logs', () => {
    it('should retrieve activity logs', async () => {
      const logs = await client.getActivityLogs(testProject, 1, 10);
      
      expect(logs).toHaveProperty('logs');
      expect(Array.isArray(logs.logs)).toBe(true);
      
      if (logs.logs.length > 0) {
        const log = logs.logs[0];
        expect(log).toHaveProperty('id');
        expect(log).toHaveProperty('text');
        expect(log).toHaveProperty('created_at');
      }
    });
  });

  describe.skipIf(!isIntegrationTest)('Error Handling', () => {
    it('should handle 404 for non-existent project', async () => {
      await expect(
        client.listConfigs('non-existent-project-12345')
      ).rejects.toThrow();
    });

    it('should handle 404 for non-existent secret', async () => {
      await expect(
        client.getSecret(testProject, testConfig, 'NON_EXISTENT_SECRET_12345')
      ).rejects.toThrow();
    });

    it('should handle invalid token', async () => {
      const invalidClient = new DopplerClient('invalid-token');
      
      await expect(
        invalidClient.listProjects()
      ).rejects.toThrow();
    });
  });
});

// Helper to conditionally skip tests
describe.skipIf = (condition: boolean) => condition ? describe.skip : describe;