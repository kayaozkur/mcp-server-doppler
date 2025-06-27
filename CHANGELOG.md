# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.3.0](https://github.com/kayaozkur/mcp-doppler-server/compare/v0.1.3...v0.3.0) (2025-06-27)

### ⚠ BREAKING CHANGES

- None

### Features

- add comprehensive test suite and automation ([bf04a45](https://github.com/kayaozkur/mcp-doppler-server/commit/bf04a458ecf7baaaf33ccab36d262bc5c2b83a02))
- Add GitHub Actions CI/CD and security workflows ([a382b2d](https://github.com/kayaozkur/mcp-doppler-server/commit/a382b2d44999194cfc64f196b2a40e13dc9ed376))
- add GitHub Actions workflows and contribution guidelines ([e120d0b](https://github.com/kayaozkur/mcp-doppler-server/commit/e120d0b875f0956d929cb38735b474bb869fdba9))
- add integration tests, benchmarks, API docs, and Docker support ([1251d86](https://github.com/kayaozkur/mcp-doppler-server/commit/1251d86b61c3ebff13c8d5f0a13d59835972734b))
- Replace original index.ts with unified version ([a819414](https://github.com/kayaozkur/mcp-doppler-server/commit/a819414892730b6f89a0e439a15b4e18538b107b))

### Bug Fixes

- prevent Jest package version mismatches in Dependabot ([3671146](https://github.com/kayaozkur/mcp-doppler-server/commit/36711460bddad51872d6f11470e75195f520b7c8))

### Chores

- add ESLint config and update Dependabot settings ([f9ee505](https://github.com/kayaozkur/mcp-doppler-server/commit/f9ee50528b2ba96a4ad6b92e32faf939d6e53f7b))
- add test configuration and dependencies ([540e393](https://github.com/kayaozkur/mcp-doppler-server/commit/540e39371f1a382705250027f4cba5bfc85ae2c2))
- **deps-dev:** bump @types/node from 20.19.1 to 24.0.3 ([9fabe96](https://github.com/kayaozkur/mcp-doppler-server/commit/9fabe9626a07d17e81fa156a7f05bc68da3f7368))
- **deps:** bump @modelcontextprotocol/sdk from 0.5.0 to 1.13.0 ([a4bf22f](https://github.com/kayaozkur/mcp-doppler-server/commit/a4bf22f7c3c8bf38b174543d888d5e28eeafe144))
- Remove GitHub Actions workflows for later configuration ([c76dddc](https://github.com/kayaozkur/mcp-doppler-server/commit/c76dddc648f96017aa85a7edab548d9db35ba428))

### Documentation

- add comprehensive examples directory ([2e96e54](https://github.com/kayaozkur/mcp-doppler-server/commit/2e96e544a1f7d3c079fff28f38b1348a8f279d93))
- add comprehensive examples for MCP server usage ([1acfb13](https://github.com/kayaozkur/mcp-doppler-server/commit/1acfb13cc2de7fd14f25f3bf525fe6cbffacb222))
- Update README for v0.2.0 unified implementation with intelligence features ([cfbaf29](https://github.com/kayaozkur/mcp-doppler-server/commit/cfbaf29f0961f9ecfdc908f15102d5e7b5d5702b))

## [0.2.0] - 2025-06-23

### 🎉 Major Update: Unified Implementation

This release combines the original `mcp-doppler-server` with enhanced intelligence features into a single, unified package.

### Features

- **Unified Codebase**: Single implementation supporting both basic and intelligence features
- **Optional AI Intelligence**: 3 new AI-powered tools (disabled by default):
  - `doppler_get_security_recommendations`: Environment-specific security guidance
  - `doppler_validate_configuration`: Configuration validation against best practices
  - `doppler_troubleshoot_issue`: AI-powered troubleshooting assistance
- **Enhanced Tool Parameters**: Core tools now support optional intelligence parameters:
  - `includeAnalysis`, `validateNaming` on `doppler_list_secrets`
  - `includeContext` on `doppler_get_secret`
  - `validateSecurity`, `checkNaming` on `doppler_set_secret`
  - `autoExclude`, `dryRun` on `doppler_promote_secrets`
- **Progressive Enhancement**: Enable features as needed with `DOPPLER_ENABLE_INTELLIGENCE=true`

### Changes

- **Package Rename**: Now published as `@lepion/mcp-server-doppler`
- **Repository Move**: Now hosted at `github.com/lepion/mcp-server-doppler`
- **Backward Compatibility**: 100% compatible with v0.1.x - no breaking changes

### Improvements

- Better error handling and recovery mechanisms
- Optimized performance with lazy loading of intelligence features
- Enhanced logging with intelligence mode indicator
- Comprehensive test coverage for all features

### Documentation

- Updated README with unified feature documentation
- Added upgrade guide for v0.1.x users
- Enhanced examples showing both basic and intelligence features
- Clear documentation of optional parameters

## [0.1.3] - 2024-01-01

### Features

- Initial release of MCP Doppler Server
- Full Doppler API integration with 8 core operations
- TypeScript implementation with strong typing
- Comprehensive error handling and logging
- MCP resources support for project/config browsing

### Documentation

- Complete README with usage examples
- API documentation for all operations
- Token type guide and best practices

## [0.1.2] - 2024-01-01

### Bug Fixes

- Fixed regex escape character linting errors
- Removed unnecessary escaping in character classes

## [0.1.1] - 2024-01-01

### Features

- Added Python client integration support
- Enhanced documentation with troubleshooting guide

## [0.1.0] - 2024-01-01

### Features

- Initial implementation of MCP server for Doppler
- Basic secret management operations
- Environment variable support
