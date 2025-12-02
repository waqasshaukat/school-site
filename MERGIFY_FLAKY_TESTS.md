# Mergify Flaky Test Detection Setup

This document explains how flaky test detection is configured using Mergify CI Insights.

## Overview

Flaky tests are tests that produce inconsistent results when run on the same code. They can pass or fail randomly, making it difficult to trust your test suite. Mergify CI Insights automatically detects these flaky tests by analyzing test results across multiple runs.

## How It Works

Mergify identifies a test as flaky when:
- The same test has 2 different outcomes (pass/fail) on the same code commit
- This is tracked across all test runs uploaded to CI Insights

## Configuration

### 1. GitHub Actions Workflows

We have two workflows configured:

#### Main CI Workflow ([.github/workflows/ci.yml](.github/workflows/ci.yml))
- Runs on every push and pull request
- Executes tests once
- Uploads test results to Mergify CI Insights
- Provides real-time test data for PRs

#### Flaky Test Detection Workflow ([.github/workflows/flaky-test-detection.yml](.github/workflows/flaky-test-detection.yml))
- Runs on a schedule (every 12 hours, Monday-Friday)
- Can be triggered manually via `workflow_dispatch`
- Executes the test suite **5 times** on the same code
- Identifies tests that pass sometimes and fail other times
- Uploads all results to Mergify for analysis

### 2. Jest Configuration

The project is configured to generate JUnit XML test reports:

```javascript
reporters: [
  'default',
  [
    'jest-junit',
    {
      outputDirectory: './test-results',
      outputName: 'junit.xml',
      uniqueOutputName: 'true', // Creates unique filenames for multiple runs
      // ... other settings
    },
  ],
]
```

### 3. Required Secrets

**MERGIFY_TOKEN** must be configured in your GitHub repository:

1. Go to [Mergify Dashboard](https://dashboard.mergify.com)
2. Navigate to your repository settings
3. Create an API token with `ci` scope
4. Add it to GitHub: Settings → Secrets and variables → Actions → New repository secret
5. Name: `MERGIFY_TOKEN`
6. Value: Your Mergify API token

## Viewing Flaky Test Reports

1. Go to [Mergify CI Insights Dashboard](https://dashboard.mergify.com)
2. Select your repository
3. Navigate to the "Flaky Tests" section
4. View:
   - Which tests are flaky
   - Flakiness rate (% of failures)
   - Recent failure history
   - Specific commits where failures occurred

## Test Result Format

Test results are uploaded in **JUnit XML** format:

```
test-results/
  └── junit-*.xml  (unique filename per run)
```

## Workflow Details

### Scheduled Flaky Detection

```yaml
on:
  schedule:
    - cron: '0 */12 * * 1-5'  # Every 12 hours, Mon-Fri
```

**Why this schedule?**
- **Frequency**: Twice daily catches flaky tests quickly without overwhelming CI resources
- **Weekdays only**: Most development happens during the week
- **Default branch**: Runs on stable code to establish baseline reliability

### Multiple Test Runs

```yaml
env:
  RUN_COUNT: ${{ github.event_name == 'schedule' && 5 || 1 }}
```

- **On schedule**: Runs tests 5 times to detect flakiness
- **On PR**: Runs tests once for quick feedback
- **5 iterations**: Provides statistical confidence while remaining practical

## Interpreting Results

### Flakiness Rate

- **0%**: Test is stable (always passes or always fails)
- **1-20%**: Occasionally flaky - investigate
- **20-50%**: Frequently flaky - high priority fix
- **50%+**: Extremely unreliable - should be fixed or disabled

### Common Causes of Flaky Tests

Based on our test suite, watch for:

1. **Timing Issues**
   - Random delays (`Math.random() * 100`)
   - Race conditions in async operations
   - Missing `waitFor` or proper async handling

2. **Shared State**
   - Global variables between tests
   - Test pollution (one test affects another)
   - Improper cleanup in `beforeEach`/`afterEach`

3. **Time-Dependent Tests**
   - Tests that only pass during certain hours
   - Timezone-dependent logic
   - Date/time assertions

4. **Random Values**
   - Using `Math.random()` in test logic
   - Non-deterministic test data generation

5. **External Dependencies**
   - Network requests without proper mocking
   - File system operations
   - Environment-specific behavior

## Best Practices

### Fixing Flaky Tests

1. **Identify the root cause** using Mergify dashboard
2. **Reproduce locally** by running the test multiple times:
   ```bash
   # Run test 10 times
   for i in {1..10}; do npm test -- path/to/test.test.tsx; done
   ```
3. **Fix the underlying issue** (not just the symptom)
4. **Verify the fix** by monitoring flaky test rate after deployment

### Writing Stable Tests

- ✅ Use `waitFor` for async operations
- ✅ Mock external dependencies consistently
- ✅ Clean up state in `afterEach`
- ✅ Use deterministic test data
- ✅ Avoid time-based assertions
- ❌ Don't use `Math.random()` in tests
- ❌ Don't rely on execution timing
- ❌ Don't share state between tests

## Manual Trigger

To manually run flaky test detection:

1. Go to Actions tab in GitHub
2. Select "Flaky Test Detection" workflow
3. Click "Run workflow"
4. Select branch (usually `main`)
5. Click "Run workflow" button

This is useful when:
- You've fixed flaky tests and want to verify
- You suspect new flaky tests were introduced
- You want immediate feedback without waiting for the schedule

## Troubleshooting

### No test results appearing in Mergify

**Check:**
1. `MERGIFY_TOKEN` is correctly set in GitHub secrets
2. Workflow completed successfully (check Actions tab)
3. JUnit XML files were generated in `test-results/` directory
4. Token has `ci` scope permissions

### Tests not marked as flaky

**Remember:**
- Flaky detection requires multiple runs on the **same commit**
- Tests need to show different results (pass/fail) on identical code
- Main CI workflow only runs once per commit (not enough for detection)
- Scheduled workflow provides the multiple runs needed

### Workflow not running on schedule

**Check:**
1. Repository must have recent activity (GitHub may pause workflows)
2. Default branch must have the workflow file
3. Workflow must be enabled in repository settings

## Resources

- [Mergify CI Insights Documentation](https://docs.mergify.com/ci-insights)
- [Mergify Dashboard](https://dashboard.mergify.com)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Jest JUnit Reporter](https://github.com/jest-community/jest-junit)
