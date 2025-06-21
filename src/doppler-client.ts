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
 * Represents a Doppler configuration environment
 * @interface DopplerConfig
 */
interface DopplerConfig {
  name: string;
  root: boolean;
  locked: boolean;
  environment: string;
  project: string;
  created_at: string;
  initial_fetch_at?: string;
  last_fetch_at?: string;
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
 * Represents a Doppler service token
 * @interface DopplerServiceToken
 */
interface DopplerServiceToken {
  name: string;
  slug: string;
  key: string;
  project: string;
  environment: string;
  config: string;
  access: string;
  expires_at?: string;
  created_at: string;
}

/**
 * Represents a Doppler activity log entry
 * @interface DopplerActivityLog
 */
interface DopplerActivityLog {
  id: string;
  text: string;
  html: string;
  user: {
    email?: string;
    name?: string;
  };
  project?: string;
  environment?: string;
  config?: string;
  created_at: string;
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
   * Lists all configurations for a specific project
   * @param {string} project - The project slug
   * @returns {Promise<DopplerConfig[]>} Array of configurations
   * @throws {Error} If the API request fails
   */
  async listConfigs(project: string): Promise<DopplerConfig[]> {
    try {
      const response = await this.axios.get('/configs', {
        params: { project, per_page: 100 },
      });
      return response.data.configs || [];
    } catch (error) {
      logger.error(`Failed to list configs for project ${project}`, error);
      throw new Error(`Failed to list configs for project ${project}`);
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

  /**
   * Creates or updates a secret
   * @param {string} project - The project slug
   * @param {string} config - The configuration name
   * @param {string} name - The secret name
   * @param {string} value - The secret value
   * @returns {Promise<{ created: boolean }>} Object indicating if secret was created (true) or updated (false)
   * @throws {Error} If the API request fails
   */
  async setSecret(
    project: string,
    config: string,
    name: string,
    value: string
  ): Promise<{ created: boolean }> {
    try {
      const response = await this.axios.post('/configs/config/secrets', {
        project,
        config,
        secrets: {
          [name]: value,
        },
      });
      
      // Check if secret was created or updated
      const created = response.data.secrets?.[name]?.created || false;
      return { created };
    } catch (error) {
      logger.error(`Failed to set secret ${name} in ${project}/${config}`, error);
      throw new Error(`Failed to set secret ${name}`);
    }
  }

  async deleteSecrets(project: string, config: string, secrets: string[]): Promise<void> {
    try {
      await this.axios.delete('/configs/config/secrets', {
        data: {
          project,
          config,
          secrets,
        },
      });
    } catch (error) {
      logger.error(`Failed to delete secrets from ${project}/${config}`, error);
      throw new Error('Failed to delete secrets');
    }
  }

  async promoteSecrets(
    project: string,
    sourceConfig: string,
    targetConfig: string,
    excludeKeys?: string[]
  ): Promise<{ count: number }> {
    try {
      // First, get all secrets from source config
      const response = await this.axios.get('/configs/config/secrets/download', {
        params: {
          project,
          config: sourceConfig,
          format: 'json',
        },
      });

      const sourceSecrets = response.data || {};
      
      // Filter out excluded keys
      const secretsToPromote: Record<string, string> = {};
      let count = 0;
      
      for (const [key, value] of Object.entries(sourceSecrets)) {
        if (!excludeKeys || !excludeKeys.includes(key)) {
          secretsToPromote[key] = value as string;
          count++;
        }
      }

      // Update target config with filtered secrets
      if (count > 0) {
        await this.axios.post('/configs/config/secrets', {
          project,
          config: targetConfig,
          secrets: secretsToPromote,
        });
      }

      return { count };
    } catch (error) {
      logger.error(`Failed to promote secrets from ${sourceConfig} to ${targetConfig}`, error);
      throw new Error('Failed to promote secrets');
    }
  }

  async createServiceToken(
    project: string,
    config: string,
    name: string,
    access: string = 'read'
  ): Promise<DopplerServiceToken> {
    try {
      const response = await this.axios.post('/configs/config/tokens', {
        project,
        config,
        name,
        access,
      });
      return response.data.token;
    } catch (error) {
      logger.error(`Failed to create service token for ${project}/${config}`, error);
      throw new Error('Failed to create service token');
    }
  }

  async getActivityLogs(
    project?: string,
    page: number = 1,
    perPage: number = 20
  ): Promise<DopplerActivityLog[]> {
    try {
      const params: any = { page, per_page: perPage };
      if (project) {
        params.project = project;
      }

      const response = await this.axios.get('/logs', { params });
      return response.data.logs || [];
    } catch (error) {
      logger.error('Failed to get activity logs', error);
      throw new Error('Failed to get activity logs');
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