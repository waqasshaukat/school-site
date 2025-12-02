# Continuous Integration Setup

This document explains the CI/CD setup for this project.

## GitHub Actions Workflow

The CI workflow is defined in [.github/workflows/ci.yml](.github/workflows/ci.yml).

### Triggers

The workflow runs automatically on:

1. **Push to any branch**
   ```yaml
   push:
     branches:
       - main
       - '**'  # All branches
   ```

2. **Pull requests to main**
   ```yaml
   pull_request:
     branches:
       - main
   ```

### Workflow Steps

The CI pipeline executes the following steps:

1. **Checkout Code**
   - Uses `actions/checkout@v4` to clone the repository

2. **Setup Node.js**
   - Installs Node.js 20.x
   - Caches npm dependencies for faster builds

3. **Install Dependencies**
   - Runs `npm ci` for clean, reproducible installs

4. **Run Linter**
   - Executes ESLint to check code quality
   - Command: `npm run lint`

5. **Run Tests**
   - Executes Jest tests with coverage
   - Command: `npm test -- --ci --coverage --maxWorkers=2`
   - Uses 2 workers for optimal CI performance

6. **Upload Coverage Reports**
   - Uploads coverage to Codecov (optional)
   - Requires `CODECOV_TOKEN` secret (if enabled)

7. **Build Project**
   - Creates production build to verify no build errors
   - Command: `npm run build`

## Test Configuration

### Jest Configuration

Tests are configured in `jest.config.js`:

```javascript
{
  testEnvironment: 'jest-environment-jsdom',
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
  ],
}
```

### Coverage Thresholds

Currently set to 0% to allow flaky tests:

```javascript
coverageThreshold: {
  global: {
    branches: 0,
    functions: 0,
    lines: 0,
    statements: 0,
  },
}
```

You can increase these thresholds as you add more reliable tests.

## Running Tests Locally

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test:watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- src/components/__tests__/AdmissionForm.test.tsx
```

## CI/CD Best Practices

### Branch Protection Rules

Consider adding these branch protection rules on GitHub:

1. Require status checks to pass before merging
2. Require branches to be up to date before merging
3. Require pull request reviews before merging

### Setting Up Branch Protection

1. Go to repository Settings → Branches
2. Add a branch protection rule for `main`
3. Enable:
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - ✅ Status checks: `test` (from CI workflow)

## Environment Variables

### Optional Secrets

Add these secrets in GitHub repository settings if needed:

- `CODECOV_TOKEN`: For code coverage reporting (optional)

### Adding Secrets

1. Go to repository Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add the secret name and value

## Troubleshooting

### CI Fails but Tests Pass Locally

1. Check Node.js version matches CI (20.x)
2. Run `npm ci` instead of `npm install`
3. Run tests with CI flag: `npm test -- --ci`

### Coverage Upload Fails

- This is expected if `CODECOV_TOKEN` is not set
- The workflow continues even if coverage upload fails
- Set `fail_ci_if_error: false` in workflow

### Build Takes Too Long

- Adjust `maxWorkers` in test command
- Consider splitting tests into multiple jobs
- Use GitHub Actions cache for node_modules

## Monitoring CI

### View Workflow Runs

1. Go to the "Actions" tab in your GitHub repository
2. Click on "CI" workflow
3. View runs and their results

### Status Badge

Add this badge to your README:

```markdown
![CI](https://github.com/YOUR_USERNAME/YOUR_REPO/workflows/CI/badge.svg)
```

Replace `YOUR_USERNAME` and `YOUR_REPO` with your actual values.

## Future Improvements

Consider adding:

1. **Parallel test execution** - Split tests into multiple jobs
2. **E2E tests** - Add Playwright or Cypress tests
3. **Deploy previews** - Auto-deploy PR previews to Vercel
4. **Semantic versioning** - Auto-generate version numbers
5. **Automated releases** - Create GitHub releases on tag push
6. **Dependency updates** - Use Dependabot for automatic updates
