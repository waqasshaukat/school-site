# Springfield Elementary School Website

![CI](https://github.com/YOUR_USERNAME/school-site/workflows/CI/badge.svg)

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Testing

Run tests locally:

```bash
npm test                 # Run all tests
npm test:watch          # Run tests in watch mode
npm test -- --coverage  # Run tests with coverage report
```

### Continuous Integration

This project uses GitHub Actions for CI/CD. The workflow automatically runs on:
- Every push to any branch
- Every pull request to the main branch

The CI pipeline includes:
- Linting (ESLint)
- Unit and integration tests
- Code coverage reporting
- Production build verification
- Test results uploaded to Mergify CI Insights

See [.github/workflows/ci.yml](.github/workflows/ci.yml) for the complete workflow configuration.

### Flaky Test Detection

We use **Mergify CI Insights** to automatically detect flaky tests:

- Scheduled workflow runs tests 5 times every 12 hours (Mon-Fri)
- Identifies tests that pass sometimes and fail other times on the same code
- View flaky test reports in the [Mergify Dashboard](https://dashboard.mergify.com)

See [MERGIFY_FLAKY_TESTS.md](MERGIFY_FLAKY_TESTS.md) for detailed documentation.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
