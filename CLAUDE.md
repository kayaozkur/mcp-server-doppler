# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the MCP (Model Context Protocol) Server for Doppler - a TypeScript implementation that enables AI assistants to interact with Doppler's secret management platform. The project provides both core functionality and optional AI-powered intelligence features.

## Key Commands

### Development
- `npm run dev` - Run development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run production server (requires build)

### Testing
- `npm test` - Run unit tests
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:integration` - Run integration tests (requires `RUN_INTEGRATION_TESTS=true` and real Doppler token)

### Code Quality
- `npm run lint` - Run ESLint checks
- `npm run format` - Format code with Prettier

### Release
- `npm run release:patch` - Create patch release (bug fixes)
- `npm run release:minor` - Create minor release (new features)
- `npm run release:major` - Create major release (breaking changes)

## Architecture Overview

The codebase follows a modular architecture with clear separation of concerns:

### Core Components
- **`src/index.ts`** - Unified entry point that combines all features
- **`src/doppler-client.ts`** - HTTP client for Doppler API interactions
- **`src/tools.ts`** - Core MCP tool definitions (8 tools)
- **`src/intelligence-tools.ts`** - Optional AI-powered tools (3 tools)
- **`src/logger.ts`** - Winston logger configuration

### Tool System
The server implements two categories of tools:
1. **Core Tools**: Basic Doppler operations (list projects, manage secrets, etc.)
2. **Intelligence Tools**: AI-powered features (security recommendations, validation, troubleshooting)

Intelligence features are opt-in via the `DOPPLER_ENABLE_INTELLIGENCE` environment variable.

### Testing Strategy
- Unit tests for individual components
- Integration tests for API interactions
- Performance benchmarks for optimization validation
- Minimum 50% code coverage requirement

## Development Practices

### Environment Setup
1. Copy `.env.example` to `.env`
2. Set `DOPPLER_TOKEN` with a valid Doppler service token
3. Optionally set `DOPPLER_ENABLE_INTELLIGENCE=true` for AI features
4. Set `LOG_LEVEL` as needed (debug, info, warn, error)

### TypeScript Configuration
- Strict mode is enabled - all types must be explicitly defined
- Target ES2022 for modern JavaScript features
- Use Zod for runtime schema validation

### Error Handling
- Always handle Doppler API errors gracefully
- Use structured logging via Winston
- Implement exponential backoff for rate limiting

### Security Considerations
- Never log or expose Doppler tokens
- Use service account tokens for production
- Validate all tool inputs with Zod schemas

## Common Tasks

### Adding a New Tool
1. Define the tool schema in `src/tools.ts` or `src/intelligence-tools.ts`
2. Implement the handler function with proper error handling
3. Add comprehensive tests in `src/__tests__/`
4. Update usage examples in `examples/`

### Debugging
- Set `LOG_LEVEL=debug` for verbose logging
- Use `npm run dev` for hot reload during development
- Check `src/__tests__/` for usage patterns

### Performance Optimization
1. Run benchmarks before changes: `npm run benchmark`
2. Make optimizations
3. Run benchmarks after to verify improvements
4. Document significant changes in commit messages

## Important Notes

- This is a unified implementation (v0.2.0) that combines original and enhanced features
- Backward compatibility must be maintained for existing integrations
- The npm package is published under `@lepion` scope
- Minimum Node.js version is 18
- Docker support includes multi-platform builds