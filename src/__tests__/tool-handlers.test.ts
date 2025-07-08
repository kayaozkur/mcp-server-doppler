import { TOOLS } from '../tools';

describe('Tool Definitions', () => {
  it('should define all required tools', () => {
    const expectedTools = [
      'doppler_list_projects',
      'doppler_list_secrets',
      'doppler_get_secret',
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
  });
});