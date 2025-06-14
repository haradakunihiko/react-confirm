# Release Process

This document describes the automated release process for the react-confirm npm package.

## Overview

The release process is fully automated with strategic manual checkpoints for quality control:

1. **Manual trigger** - Start release via GitHub Actions
2. **Automated workflows** - Handle version updates, testing, and publishing
3. **Manual review points** - PR review and release publishing

## Release Workflow

### 1. Start Release

**Location**: GitHub Actions Web UI

1. Go to your repository on GitHub
2. Click "Actions" tab
3. Select "Start Release" workflow
4. Click "Run workflow"
5. Choose version update method:
   - **patch**: Bug fixes (0.3.0 → 0.3.1)
   - **minor**: New features (0.3.0 → 0.4.0)
   - **major**: Breaking changes (0.3.0 → 1.0.0)
   - **prepatch**: Prerelease patch (0.3.0 → 0.3.1-0)
   - **preminor**: Prerelease minor (0.3.0 → 0.4.0-0)
   - **premajor**: Prerelease major (0.3.0 → 1.0.0-0)
   - **prerelease**: Increment prerelease (0.3.1-0 → 0.3.1-1)
   - **custom**: Specify exact version (e.g., 2.0.0-beta.1)
6. If "custom" selected, enter the specific version number
7. Click "Run workflow"

### 2. Automated PR Creation

The workflow will automatically:
- Validate version format and availability
- Create release branch (`release/v1.0.1`)
- Update version in `package.json` and `package-lock.json` using `npm version`
- Run tests and build verification
- Create Pull Request with version changes

### 3. Review and Merge PR

**Manual step required:**
1. Review the automatically created PR
2. Verify all CI checks pass (tests, build)
3. Check that version numbers are correct in both package files
4. Merge the PR when satisfied

### 4. Automated Release Creation

After PR merge, the system automatically:
- Creates Git tag (`v1.0.1`)
- Generates GitHub Release draft with auto-generated changelog
- Cleans up the release branch

### 5. Publish Release

**Manual step required:**
1. Go to GitHub Releases page
2. Find the draft release
3. Edit release notes if needed (optional)
4. Click "Publish release"

### 6. Automated npm Publishing

After release publication, the system automatically:
- Runs final tests and build verification
- Publishes package to npm registry with provenance
- Verifies successful publication
- Updates GitHub release with npm package link

## Setup Requirements

### Required Secrets

Configure these secrets in your GitHub repository settings:

**Repository Settings → Secrets and variables → Actions**

| Secret Name | Value | Purpose |
|-------------|-------|---------|
| `NPM_TOKEN` | Your npm Access Token (Automation type) | Publishing to npm registry |
| `PAT_TOKEN` | GitHub Personal Access Token (repo scope) | Enabling CI on workflow-created PRs |

> **Why PAT_TOKEN is Required:**
> When GitHub Actions workflows create Pull Requests using the default `GITHUB_TOKEN`, other workflows (like CI tests) do not automatically run on those PRs due to security restrictions. Using a `PAT_TOKEN` ensures that CI workflows are triggered properly on release PRs, maintaining quality checks throughout the automated release process.

### Getting Your npm Token

1. Visit [npm](https://www.npmjs.com/)
2. Log in with your npm account
3. Go to Profile → Access Tokens
4. Click "Generate New Token"
5. Select "Automation" type (for CI/CD)
6. Provide a name (e.g., "GitHub Actions")
7. Copy the generated token
8. Add to GitHub repository secrets

### Initial Package Upload

**Important**: The first package version should be published manually following the [PUBLISHING_SETUP.md](PUBLISHING_SETUP.md) guide. After that, all subsequent releases will be automated.

## Version Management

### npm version Benefits

The workflow uses `npm version` command which automatically:
- ✅ Updates `package.json` version
- ✅ Updates `package-lock.json` version (keeps them in sync)
- ✅ Validates version format
- ✅ Handles semantic versioning correctly

### Version Types Explained

```bash
# Current version: 0.3.0

patch      → 0.3.1      # Bug fixes, patches
minor      → 0.4.0      # New features, backward compatible
major      → 1.0.0      # Breaking changes

# Prerelease versions
premajor   → 1.0.0-0    # Prerelease for next major
preminor   → 0.4.0-0    # Prerelease for next minor
prepatch   → 0.3.1-0    # Prerelease for next patch
prerelease → 0.3.1-1    # Increment existing prerelease

custom     → 2.0.0-beta.1  # Any specific version
```

### Prerelease Version Examples

```bash
# From 1.0.0
premajor   → 2.0.0-0
preminor   → 1.1.0-0
prepatch   → 1.0.1-0

# From 1.0.0-0 (existing prerelease)
prerelease → 1.0.0-1

# Custom prerelease naming
custom     → 1.0.0-alpha.1
custom     → 1.0.0-beta.1
custom     → 1.0.0-rc.1
```

## Quality Checks

The CI pipeline includes comprehensive validation:

- **Multi-step Testing**: Tests run at PR creation and before publishing
- **Build Verification**: Ensures package builds correctly
- **Version Validation**: Prevents duplicate versions
- **npm Verification**: Confirms successful publication
- **Provenance**: Packages include npm provenance for security

## Monitoring Your Release

### GitHub Actions
Monitor progress in the Actions tab:
- Check workflow execution status
- View logs for any issues
- Re-run workflows if needed

### npm Registry
After successful publishing:
- Package appears on [npm](https://www.npmjs.com/)
- Users can install with `npm install react-confirm@latest`
- Download statistics become available

## Troubleshooting

### Common Issues

**Release workflow fails to start:**
- Check version format (patch/minor/major or valid semver for custom)
- Verify version doesn't already exist as a Git tag

**Tests fail:**
- Review test output in GitHub Actions
- Fix issues and re-run workflows

**Build fails:**
- Check build script in package.json
- Verify all dependencies are properly installed

**npm publishing fails:**
- Verify `NPM_TOKEN` is set correctly
- Ensure package was manually published at least once
- Check token permissions (should be "Automation" type)

### Manual Recovery

**If you need to restart a release:**

```bash
# Delete release branch if it exists
git push origin --delete release/v1.0.1

# Delete tag if it was created
git tag -d v1.0.1
git push origin :v1.0.1

# Restart from GitHub Actions
```

**If workflows fail:**
1. Fix the underlying issue
2. Re-run the failed workflow from GitHub Actions
3. Continue from where it left off

**Emergency manual publish:**
```bash
# Only if automated publishing fails
npm login
npm publish --access public
```

## Release Checklist

Before starting a release:
- [ ] All desired changes are merged to master branch
- [ ] Tests are passing locally
- [ ] Package builds successfully
- [ ] Release notes content is planned (can be edited later)

During release:
- [ ] PR created successfully
- [ ] CI checks pass
- [ ] Version numbers are correct in both package.json and package-lock.json
- [ ] PR merged
- [ ] Release draft created
- [ ] Release published
- [ ] npm publishing completed

## Current vs. Previous Manual Process

### Previous Manual Process
```bash
npm version patch          # Updates package.json + package-lock.json + creates commit + tag
git push && git push --tags
npm publish
```

### New Automated Process
- **Same reliability**: Uses `npm version` internally
- **Added safety**: Multiple validation and review steps
- **Better tracking**: Full audit trail in GitHub
- **Team collaboration**: PR-based review process
- **Automatic publishing**: No manual npm publish step needed

## Benefits of This Process

- **Consistent Versioning**: Automated version management using npm standards
- **Quality Control**: Multiple test and verification stages
- **Safe Rollback**: Each step can be reviewed before proceeding
- **Immediate Availability**: Published packages are instantly available to users
- **Complete Audit Trail**: Full history of releases and changes
- **Team Friendly**: PR-based process allows team review

The process maintains all the benefits of `npm version` while adding automation, safety checks, and team collaboration features.
