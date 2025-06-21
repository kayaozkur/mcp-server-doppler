import { TOOLS } from '../tools';

describe('Tool Definitions', () => {
  it('should define all required tools', () => {
    const expectedTools = [
      'doppler_list_projects',
      'doppler_list_secrets',
      'doppler_get_secret',
      'doppler_set_secret',
      'doppler_delete_secrets',
      'doppler_promote_secrets',
      'doppler_create_service_token',
      'doppler_get_activity_logs'
    ];

    const toolNames = TOOLS.map(tool => tool.name);
    expect(toolNames).toEqual(expect.arrayContaining(expectedTools));
    expect(toolNames).toHaveLength(expectedTools.length);
  });

  it('should have valid input schemas for all tools', () => {
    TOOLS.forEach(tool => {
      expect(tool.inputSchema).toBeDefined();
      expect(tool.inputSchema.type).toBe('object');
      expect(tool.description).toBeDefined();
      expect(tool.description!.length).toBeGreaterThan(0);
    });
  });

  describe('Tool input schemas', () => {
    it('doppler_list_projects should have no required fields', () => {
      const tool = TOOLS.find(t => t.name === 'doppler_list_projects');
      expect(tool?.inputSchema.properties).toEqual({});
    });

    it('doppler_list_secrets should require project and config', () => {
      const tool = TOOLS.find(t => t.name === 'doppler_list_secrets');
      expect(tool?.inputSchema.required).toEqual(['project', 'config']);
    });

    it('doppler_get_secret should require project, config, and name', () => {
      const tool = TOOLS.find(t => t.name === 'doppler_get_secret');
      expect(tool?.inputSchema.required).toEqual(['project', 'config', 'name']);
    });

    it('doppler_set_secret should require project, config, name, and value', () => {
      const tool = TOOLS.find(t => t.name === 'doppler_set_secret');
      expect(tool?.inputSchema.required).toEqual(['project', 'config', 'name', 'value']);
    });

    it('doppler_delete_secrets should require project, config, and secrets array', () => {
      const tool = TOOLS.find(t => t.name === 'doppler_delete_secrets');
      expect(tool?.inputSchema.required).toEqual(['project', 'config', 'secrets']);
      const secretsProp = tool?.inputSchema.properties?.secrets as any;
      expect(secretsProp?.type).toBe('array');
    });

    it('doppler_promote_secrets should require project, sourceConfig, and targetConfig', () => {
      const tool = TOOLS.find(t => t.name === 'doppler_promote_secrets');
      expect(tool?.inputSchema.required).toEqual(['project', 'sourceConfig', 'targetConfig']);
    });

    it('doppler_create_service_token should require project, config, and name', () => {
      const tool = TOOLS.find(t => t.name === 'doppler_create_service_token');
      expect(tool?.inputSchema.required).toEqual(['project', 'config', 'name']);
    });

    it('doppler_get_activity_logs should have optional fields', () => {
      const tool = TOOLS.find(t => t.name === 'doppler_get_activity_logs');
      expect(tool?.inputSchema.required).toBeUndefined();
    });
  });
});