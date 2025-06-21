// Basic integration test for the MCP server

jest.mock('../doppler-client');
jest.mock('../logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn()
  }
}));

describe('DopplerMCPServer Integration', () => {
  let originalEnv: string | undefined;

  beforeAll(() => {
    originalEnv = process.env.DOPPLER_TOKEN;
    process.env.DOPPLER_TOKEN = 'test-token';
  });

  afterAll(() => {
    if (originalEnv) {
      process.env.DOPPLER_TOKEN = originalEnv;
    } else {
      delete process.env.DOPPLER_TOKEN;
    }
  });

  it('should create server instance', () => {
    // This is a basic smoke test to ensure the server can be instantiated
    // Full integration testing would require more complex MCP server setup
    expect(() => {
      jest.isolateModules(() => {
        require('../index');
      });
    }).not.toThrow();
  });
});