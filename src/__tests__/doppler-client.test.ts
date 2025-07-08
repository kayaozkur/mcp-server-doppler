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

  describe('validateConnection', () => {
    it('should return true on successful connection', async () => {
      mockAxiosInstance.get.mockResolvedValueOnce({ data: {} });

      const result = await client.validateConnection();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/me');
      expect(result).toBe(true);
    });

    it('should return false on connection failure', async () => {
      mockAxiosInstance.get.mockRejectedValueOnce(new Error('Unauthorized'));

      const result = await client.validateConnection();

      expect(result).toBe(false);
    });
  });
});