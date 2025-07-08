# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a simplified MCP (Model Context Protocol) Server for Doppler - a TypeScript implementation that enables AI assistants to read secrets from Doppler's secret management platform. The project provides read-only access through three core tools.

## Key Commands

### Development
- `npm run dev` - Run development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run production server (requires build)

### Testing
- `npm test` - Run unit tests
- `npm run test:coverage` - Run tests with coverage report

### Code Quality
- `npm run lint` - Run ESLint checks
- `npm run format` - Format code with Prettier

### Release
- `npm run release:patch` - Create patch release (bug fixes)
- `npm run release:minor` - Create minor release (new features)
- `npm run release:major` - Create major release (breaking changes)

## Architecture Overview

The codebase follows a simple modular architecture:

### Core Components
- **`src/index.ts`** - Main entry point and MCP server implementation
- **`src/doppler-client.ts`** - HTTP client for Doppler API interactions
- **`src/tools.ts`** - MCP tool definitions (3 tools)
- **`src/logger.ts`** - Winston logger configuration

### Tool System
The server implements three read-only tools:
1. **doppler_list_projects** - List all accessible projects
2. **doppler_list_secrets** - List secret names in a project/config
3. **doppler_get_secret** - Get a specific secret value

### Testing Strategy
- Unit tests for individual components
- Minimum 50% code coverage requirement

## Development Practices

### Environment Setup
1. Copy `.env.example` to `.env`
2. Set `DOPPLER_TOKEN` with a valid Doppler service token
3. Set `LOG_LEVEL` as needed (debug, info, warn, error)

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

### Debugging
- Set `LOG_LEVEL=debug` for verbose logging
- Use `npm run dev` for hot reload during development
- Check `src/__tests__/` for usage patterns

## Important Notes

- This is a simplified implementation (v0.3.0) for read-only access
- The npm package is published under `@lepion` scope
- Minimum Node.js version is 18