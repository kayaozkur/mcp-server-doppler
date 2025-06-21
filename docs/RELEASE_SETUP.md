# Release Setup Guide

This guide explains how to set up automated releases for the MCP Doppler Server.

## Prerequisites

### 1. NPM_TOKEN for Automated Publishing

To enable automated npm publishing through GitHub Actions, you need to add an NPM token to your repository secrets.

#### Steps to Create and Add NPM Token:

1. **Create NPM Access Token**
   ```bash
   # Login to npm if not already logged in
   npm login
   
   # Create an automation token
   npm token create --read-only=false
   ```
   
   Or via NPM website:
   - Go to https://www.npmjs.com/
   - Login to your account
   - Navigate to Account Settings → Access Tokens
   - Click "Generate New Token"
   - Select "Automation" token type
   - Give it a descriptive name like "mcp-doppler-server-github-actions"
   - Copy the generated token

2. **Add Token to GitHub Repository**
   - Go to your repository on GitHub
   - Navigate to Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `NPM_TOKEN`
   - Value: Paste your npm token (starts with `npm_`)
   - Click "Add secret"

3. **Verify Setup**
   - The release workflow (`.github/workflows/release.yml`) is already configured to use this token
   - Test by manually triggering a release workflow from the Actions tab

### 2. Branch Protection Rules

To ensure code quality and prevent accidental pushes to main branch:

#### Recommended Protection Rules:

Navigate to Settings → Branches → Add rule:

1. **Branch name pattern**: `main`

2. **Protect matching branches**:
   - ✅ Require a pull request before merging
     - ✅ Require approvals: 1
     - ✅ Dismiss stale pull request approvals when new commits are pushed
   - ✅ Require status checks to pass before merging
     - ✅ Require branches to be up to date before merging
     - Status checks:
       - `test` (from CI workflow)
       - `build` (from CI workflow)
       - `dependency-check` (from security workflow)
       - `codeql / Analyze (javascript-typescript)` (from security workflow)
   - ✅ Require conversation resolution before merging
   - ✅ Include administrators (optional, for strict enforcement)

3. **Additional rules for `develop` branch** (if using git-flow):
   - Same as above but with relaxed approval requirements
   - Consider allowing direct pushes for hotfixes

## Release Process

Once NPM_TOKEN is configured, releases are automated:

### Manual Release Trigger
1. Go to Actions → Release workflow
2. Click "Run workflow"
3. Select version type: patch, minor, or major
4. The workflow will:
   - Run tests
   - Generate changelog
   - Bump version
   - Create git tag
   - Create GitHub release
   - Publish to npm

### Automated Changelog
- Commits following conventional format will be included
- Format: `type(scope): description`
- Types: feat, fix, docs, style, refactor, test, chore

### Version Bumping
- `patch`: Bug fixes (0.1.3 → 0.1.4)
- `minor`: New features (0.1.3 → 0.2.0)
- `major`: Breaking changes (0.1.3 → 1.0.0)

## Troubleshooting

### NPM Publishing Fails
- Verify NPM_TOKEN is correctly set in repository secrets
- Check if package name is available on npm
- Ensure you have publish permissions for the package

### GitHub Release Creation Fails
- Verify GITHUB_TOKEN permissions in workflow
- Check if tag already exists
- Ensure changelog generation succeeded

### Status Checks Not Found
- Push a PR to trigger initial workflow runs
- Wait for workflows to complete once
- GitHub will then recognize the check names