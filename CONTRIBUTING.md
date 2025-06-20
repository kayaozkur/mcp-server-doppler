# Contributing to MCP Doppler Server

First off, thank you for considering contributing to MCP Doppler Server! It's people like you that make this tool better for everyone.

## Code of Conduct

By participating in this project, you are expected to uphold our standards of behavior:
- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, please include:

- A clear and descriptive title
- Steps to reproduce the issue
- Expected behavior vs actual behavior
- Your environment details (OS, Node.js version, etc.)
- Any relevant error messages or logs

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- A clear and descriptive title
- A detailed description of the proposed functionality
- Examples of how the feature would be used
- Any potential drawbacks or considerations

### Pull Requests

1. Fork the repository and create your branch from `main`
2. If you've added code that should be tested, add tests
3. Ensure the test suite passes (`npm test`)
4. Make sure your code lints (`npm run lint`)
5. Update the documentation if needed
6. Issue that pull request!

## Development Setup

1. Fork and clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/mcp-doppler-server.git
   cd mcp-doppler-server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with your Doppler token:
   ```env
   DOPPLER_TOKEN=your_token_here
   ```

4. Run in development mode:
   ```bash
   npm run dev
   ```

## Development Guidelines

### Code Style

- We use TypeScript for type safety
- Follow the existing code style (enforced by ESLint)
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

Examples:
- `feat: add support for Doppler webhooks`
- `fix: handle rate limiting errors properly`
- `docs: update Python client examples`
- `chore: bump dependencies`

### Testing

- Write tests for new functionality
- Ensure all tests pass before submitting PR
- Include both positive and negative test cases
- Mock external API calls appropriately

### Documentation

- Update the README.md if you change functionality
- Add JSDoc comments to exported functions
- Include examples for new features
- Keep documentation concise but comprehensive

## Project Structure

```
mcp-doppler-server/
├── src/                 # TypeScript source files
│   ├── index.ts        # Main server entry point
│   ├── doppler-client.ts # Doppler API client
│   └── logger.ts       # Logging configuration
├── dist/               # Compiled JavaScript (git ignored)
├── test/               # Test files
├── docs/               # Additional documentation
└── examples/           # Usage examples
```

## Release Process

Releases are automated through GitHub Actions:

1. Use the Release workflow in GitHub Actions
2. Select the version type (patch, minor, major)
3. The workflow will:
   - Bump the version
   - Create a git tag
   - Create a GitHub release
   - Publish to npm

## Questions?

Feel free to open an issue with your question or reach out to kayaozkur@gmail.com.

Thank you for contributing! 🎉