# Development Guide

This guide covers advanced development workflows for the MCP Doppler Server.

## Table of Contents
- [Testing](#testing)
- [Performance Benchmarks](#performance-benchmarks)
- [API Documentation](#api-documentation)
- [Docker Development](#docker-development)
- [Release Process](#release-process)

## Testing

### Unit Tests
Run the standard test suite:
```bash
npm test
npm run test:coverage  # With coverage report
```

### Integration Tests
Integration tests require a real Doppler account:

1. **Setup Test Environment**
   ```bash
   cp .env.test.example .env.test
   # Edit .env.test with your test token
   ```

2. **Create Test Project**
   - Create a project named `mcp-test` in Doppler
   - Ensure it has a `development` config

3. **Run Integration Tests**
   ```bash
   npm run test:integration
   ```

## Performance Benchmarks

Benchmarks help ensure the server maintains good performance:

1. **Setup**
   ```bash
   # Use same .env.test as integration tests
   ```

2. **Run Benchmarks**
   ```bash
   npm run benchmark
   ```

3. **Benchmark Results**
   - Operations per second for each API call
   - Average, min, and max response times
   - Performance grades (A+ to F)

### Example Output
```
📊 BENCHMARK RESULTS
================================================================================
| Operation                          | Iterations | Avg (ms) | Min (ms) | Max (ms) | Ops/sec |
|-----------------------------------------------------------------------------|
| List Projects                      |         50 |    12.34 |     8.12 |    25.67 |    81.0 |
| List Secrets                       |        100 |     8.56 |     5.23 |    15.89 |   116.8 |
================================================================================
```

## API Documentation

### Generate Documentation
```bash
# HTML documentation
npm run docs

# Markdown documentation
npm run docs:markdown
```

### View Documentation
- HTML: Open `docs/api/index.html`
- Markdown: Browse `docs/api-markdown/`

### Documentation Standards
- All public methods must have JSDoc comments
- Include `@example` tags for complex methods
- Document all parameters and return types
- Add interface descriptions

## Docker Development

### Building Images

#### Production Image
```bash
docker build -t mcp-doppler-server:latest .
```

#### Multi-platform Build
```bash
docker buildx build --platform linux/amd64,linux/arm64 -t mcp-doppler-server:latest .
```

### Running with Docker

#### Using Docker Run
```bash
docker run -e DOPPLER_TOKEN=$DOPPLER_TOKEN mcp-doppler-server:latest
```

#### Using Docker Compose
```bash
# Production mode
docker-compose up

# Development mode with hot reload
docker-compose --profile dev up
```

### Publishing to GitHub Container Registry

Images are automatically published on:
- Push to main branch → `ghcr.io/kayaozkur/mcp-doppler-server:latest`
- Tag creation → `ghcr.io/kayaozkur/mcp-doppler-server:v1.0.0`

Pull published images:
```bash
docker pull ghcr.io/kayaozkur/mcp-doppler-server:latest
```

## Release Process

### Automated Releases

1. **Trigger Release Workflow**
   - Go to Actions → Release workflow
   - Choose version type: patch, minor, or major
   - Click "Run workflow"

2. **What Happens**
   - Version bumped in package.json
   - CHANGELOG.md updated
   - Git tag created
   - GitHub release created
   - Package published to npm
   - Docker images published

### Manual Release
```bash
# Patch release (1.0.0 → 1.0.1)
npm run release:patch

# Minor release (1.0.0 → 1.1.0)
npm run release:minor

# Major release (1.0.0 → 2.0.0)
npm run release:major

# Push changes
git push --follow-tags origin main
```

### Pre-release Checklist
- [ ] All tests passing
- [ ] Documentation updated
- [ ] CHANGELOG entries make sense
- [ ] Version bump is appropriate
- [ ] Breaking changes documented (major only)

## Development Workflow

### Feature Development
1. Create feature branch
2. Write tests first (TDD)
3. Implement feature
4. Update documentation
5. Run full test suite
6. Submit PR

### Code Quality Checks
```bash
# Run all checks
npm run lint
npm run format:check
npm test
npm run build

# Fix issues
npm run lint:fix
npm run format
```

### Performance Optimization
1. Run benchmarks before changes
2. Make optimization
3. Run benchmarks after
4. Document improvements in PR

## Troubleshooting

### Common Issues

#### Docker Build Fails
- Ensure Node.js version matches Dockerfile
- Check for uncommitted changes
- Verify .dockerignore isn't excluding needed files

#### Integration Tests Fail
- Verify Doppler token has correct permissions
- Check test project exists
- Ensure no rate limiting on account

#### Benchmarks Slow
- Check network latency to Doppler
- Verify no other processes consuming resources
- Consider reducing iteration count for quick tests

### Debug Mode
```bash
# Enable debug logging
export LOG_LEVEL=debug
export DOPPLER_DEBUG=true

# Run with verbose output
npm run dev
```