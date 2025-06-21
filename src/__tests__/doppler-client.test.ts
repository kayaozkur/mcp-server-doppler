import { DopplerClient } from '../doppler-client';
import axios from 'axios';

jest.mock('axios');
jest.mock('../logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn()
  }
}));

describe('DopplerClient', () => {
  let client: DopplerClient;
  const mockToken = 'dp.st.test_token';
  let mockAxiosInstance: any;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Create a mock axios instance
    mockAxiosInstance = {
      get: jest.fn(),
      post: jest.fn(),
      delete: jest.fn(),
      interceptors: {
        request: {
          use: jest.fn()
        },
        response: {
          use: jest.fn()
        }
      }
    };

    // Mock axios.create to return our mock instance
    (axios.create as jest.Mock).mockReturnValue(mockAxiosInstance);

    client = new DopplerClient(mockToken);
  });

  describe('constructor', () => {
    it('should initialize with provided token', () => {
      expect(client).toBeDefined();
    });
  });

  describe('listProjects', () => {
    it('should return list of projects', async () => {
      const mockProjects = {
        projects: [
          { id: '1', name: 'Project 1', slug: 'project-1' },
          { id: '2', name: 'Project 2', slug: 'project-2' }
        ]
      };

      mockAxiosInstance.get.mockResolvedValueOnce({ data: mockProjects });

      const result = await client.listProjects();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/projects',
        expect.objectContaining({
          params: { per_page: 100 }
        })
      );
      expect(result).toEqual(mockProjects.projects);
    });

    it('should handle API errors', async () => {
      mockAxiosInstance.get.mockRejectedValueOnce(new Error('API Error'));

      await expect(client.listProjects()).rejects.toThrow('Failed to list projects');
    });
  });

  describe('listConfigs', () => {
    it('should return list of configs for a project', async () => {
      const mockConfigs = {
        configs: [
          { name: 'dev', environment: 'development' },
          { name: 'prod', environment: 'production' }
        ]
      };

      mockAxiosInstance.get.mockResolvedValueOnce({ data: mockConfigs });

      const result = await client.listConfigs('test-project');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/configs',
        expect.objectContaining({
          params: { project: 'test-project', per_page: 100 }
        })
      );
      expect(result).toEqual(mockConfigs.configs);
    });
  });

  describe('listSecrets', () => {
    it('should return list of secret names', async () => {
      mockAxiosInstance.get.mockResolvedValueOnce({ data: { names: ['DATABASE_URL', 'API_KEY'] } });

      const result = await client.listSecrets('test-project', 'dev');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/configs/config/secrets/names',
        expect.objectContaining({
          params: { project: 'test-project', config: 'dev' }
        })
      );
      expect(result).toEqual(['DATABASE_URL', 'API_KEY']);
    });
  });

  describe('getSecret', () => {
    it('should return secret value', async () => {
      const mockSecret = {
        secrets: {
          DATABASE_URL: {
            computed: 'postgres://user:pass@host:5432/db',
            note: 'Production database'
          }
        }
      };

      mockAxiosInstance.get.mockResolvedValueOnce({ data: mockSecret });

      const result = await client.getSecret('test-project', 'prod', 'DATABASE_URL');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/configs/config/secrets',
        expect.objectContaining({
          params: {
            project: 'test-project',
            config: 'prod',
            name: 'DATABASE_URL'
          }
        })
      );
      expect(result).toEqual({
        name: 'DATABASE_URL',
        value: {
          computed: 'postgres://user:pass@host:5432/db',
          note: 'Production database'
        }
      });
    });

    it('should return undefined value if secret not found', async () => {
      mockAxiosInstance.get.mockResolvedValueOnce({ data: { secrets: {} } });

      const result = await client.getSecret('test-project', 'prod', 'NONEXISTENT');
      
      expect(result).toEqual({
        name: 'NONEXISTENT',
        value: undefined
      });
    });
  });

  describe('setSecret', () => {
    it('should create new secret', async () => {
      const mockResponse = { secrets: { NEW_KEY: { created: true } } };
      mockAxiosInstance.post.mockResolvedValueOnce({ data: mockResponse });

      const result = await client.setSecret('test-project', 'dev', 'NEW_KEY', 'new-value');

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/configs/config/secrets',
        {
          project: 'test-project',
          config: 'dev',
          secrets: { NEW_KEY: 'new-value' }
        }
      );
      expect(result).toEqual({ created: true });
    });
  });

  describe('deleteSecrets', () => {
    it('should delete multiple secrets', async () => {
      mockAxiosInstance.delete.mockResolvedValueOnce({ data: {} });

      await client.deleteSecrets('test-project', 'dev', ['KEY1', 'KEY2']);

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith(
        '/configs/config/secrets',
        expect.objectContaining({
          data: {
            project: 'test-project',
            config: 'dev',
            secrets: ['KEY1', 'KEY2']
          }
        })
      );
    });
  });

  describe('promoteSecrets', () => {
    it('should promote secrets between configs', async () => {
      // Mock get secrets
      mockAxiosInstance.get.mockResolvedValueOnce({
        data: {
          DATABASE_URL: 'postgres://...',
          API_KEY: 'sk-123',
          DEBUG: 'true'
        }
      });

      // Mock set secrets
      mockAxiosInstance.post.mockResolvedValueOnce({ data: {} });

      const result = await client.promoteSecrets(
        'test-project',
        'dev',
        'staging',
        ['DEBUG']
      );

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/configs/config/secrets',
        {
          project: 'test-project',
          config: 'staging',
          secrets: {
            DATABASE_URL: 'postgres://...',
            API_KEY: 'sk-123'
          }
        }
      );
      expect(result).toEqual({ count: 2 });
    });
  });

  describe('createServiceToken', () => {
    it('should create service token with read access', async () => {
      const mockToken = {
        token: {
          name: 'ci-token',
          key: 'dp.st.dev.abc123',
          access: 'read'
        }
      };

      mockAxiosInstance.post.mockResolvedValueOnce({ data: mockToken });

      const result = await client.createServiceToken(
        'test-project',
        'dev',
        'ci-token',
        'read'
      );

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/configs/config/tokens',
        {
          project: 'test-project',
          config: 'dev',
          name: 'ci-token',
          access: 'read'
        }
      );
      expect(result).toEqual({
        name: 'ci-token',
        key: 'dp.st.dev.abc123',
        access: 'read'
      });
    });
  });

  describe('getActivityLogs', () => {
    it('should fetch activity logs', async () => {
      const mockLogs = {
        logs: [
          {
            id: '1',
            created_at: '2024-01-01T00:00:00Z',
            user: { email: 'user@example.com' },
            action: 'secret.updated',
            config: { name: 'dev' }
          }
        ],
        page: 1,
        total: 1
      };

      mockAxiosInstance.get.mockResolvedValueOnce({ data: mockLogs });

      const result = await client.getActivityLogs('test-project', 1, 20);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/logs',
        expect.objectContaining({
          params: {
            project: 'test-project',
            page: 1,
            per_page: 20
          }
        })
      );
      expect(result).toEqual(mockLogs.logs);
    });
  });
});