# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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