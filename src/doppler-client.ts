import axios, { AxiosInstance, AxiosError } from 'axios';
import { logger } from './logger.js';

/**
 * Represents a Doppler project
 * @interface DopplerProject
 */
interface DopplerProject {
  id: string;
  slug: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}


/**
 * Represents a Doppler secret
 * @interface DopplerSecret
 */
interface DopplerSecret {
  name: string;
  value?: {
    raw: string;
    computed: string;
  };
}


/**
 * Client for interacting with the Doppler API
 * @class DopplerClient
 * @example
 * const client = new DopplerClient('dp.st.your_token');
 * const projects = await client.listProjects();
 */
export class DopplerClient {
  private axios: AxiosInstance;

  /**
   * Creates a new Doppler API client
   * @param {string} token - Doppler API token (service, personal, or CLI token)
   */
  constructor(token: string) {
    this.axios = axios.create({
      baseURL: 'https://api.doppler.com/v3',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    // Add request/response interceptors for logging
    this.axios.interceptors.request.use(
      (config) => {
        logger.debug(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        logger.error('Request error', error);
        return Promise.reject(error);
      }
    );

    this.axios.interceptors.response.use(
      (response) => {
        logger.debug(`API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error: AxiosError) => {
        if (error.response) {
          logger.error(`API Error: ${error.response.status} ${error.response.config.url}`, {
            data: error.response.data,
          });
        } else {
          logger.error('API Error', error.message);
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Lists all Doppler projects accessible by the token
   * @returns {Promise<DopplerProject[]>} Array of Doppler projects
   * @throws {Error} If the API request fails
   */
  async listProjects(): Promise<DopplerProject[]> {
    try {
      const response = await this.axios.get('/projects', {
        params: { per_page: 100 },
      });
      return response.data.projects || [];
    } catch (error) {
      logger.error('Failed to list projects', error);
      throw new Error('Failed to list projects');
    }
  }


  /**
   * Lists all secret names in a specific configuration
   * @param {string} project - The project slug
   * @param {string} config - The configuration name
   * @returns {Promise<string[]>} Array of secret names
   * @throws {Error} If the API request fails
   */
  async listSecrets(project: string, config: string): Promise<string[]> {
    try {
      const response = await this.axios.get('/configs/config/secrets/names', {
        params: { project, config },
      });
      return response.data.names || [];
    } catch (error) {
      logger.error(`Failed to list secrets for ${project}/${config}`, error);
      throw new Error(`Failed to list secrets for ${project}/${config}`);
    }
  }

  /**
   * Retrieves a specific secret value
   * @param {string} project - The project slug
   * @param {string} config - The configuration name
   * @param {string} name - The secret name
   * @returns {Promise<DopplerSecret>} The secret object with name and value
   * @throws {Error} If the secret doesn't exist or API request fails
   */
  async getSecret(project: string, config: string, name: string): Promise<DopplerSecret> {
    try {
      const response = await this.axios.get('/configs/config/secrets', {
        params: { project, config, name },
      });
      const secrets = response.data.secrets || {};
      return {
        name,
        value: secrets[name],
      };
    } catch (error) {
      logger.error(`Failed to get secret ${name} from ${project}/${config}`, error);
      throw new Error(`Failed to get secret ${name}`);
    }
  }


  async validateConnection(): Promise<boolean> {
    try {
      await this.axios.get('/me');
      return true;
    } catch (error) {
      logger.error('Failed to validate Doppler connection', error);
      return false;
    }
  }
}