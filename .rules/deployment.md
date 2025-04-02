# Deployment Guidelines

## Purpose

This document outlines the deployment process, workflow, and best practices for the Daily Notes of Love project to ensure consistent, secure, and reliable deployments to GitHub Pages.

## Scope

These guidelines apply to all aspects of the deployment process, including GitHub Actions configuration, build steps, and environment setup.

## Guidelines

### GitHub Actions Workflow

1. **Workflow Structure**
   - Use the `.github/workflows/deploy.yml` file for deployment configuration
   - Trigger deployments on pushes to the main branch and manual workflow dispatch
   - Use Ubuntu as the base runner OS
   - Follow the proper sequence of steps: checkout, setup Node.js, install dependencies, build, and deploy

2. **Node.js Version**
   - Use Node.js version 20 for compatibility with all dependencies
   - Include npm cache configuration for faster builds
   - Ensure the node version matches package requirements

3. **Environment Variables**
   - Set required environment variables at build time
   - Use GitHub Secrets for sensitive information
   - Never hardcode secrets in the workflow file

### Build Process

1. **Installation**
   - Install all dependencies using `npm install`
   - Do not use `--production` flag to ensure dev dependencies are available for build

2. **Build Commands**
   - Use `npm run build` to build the Next.js application
   - Use `npm run export` to export static files
   - Ensure the build command produces the correct output directory structure

3. **Static Export Configuration**
   - Configure Next.js for static export in `next.config.ts`
   - Set `output: 'export'` for Next.js 13+ compatibility
   - Configure image optimization settings with `unoptimized: true`

### GitHub Pages Deployment

1. **Deployment Action**
   - Use the JamesIves/github-pages-deploy-action@v4 action
   - Deploy from the `out` directory to the `gh-pages` branch
   - Enable clean option to remove old files

2. **GitHub Pages Settings**
   - Configure GitHub repository to serve pages from the gh-pages branch
   - Set up custom domain if needed
   - Enable HTTPS for the GitHub Pages site

### Testing Before Deployment

1. **Local Verification**
   - Test the static export locally before pushing changes
   - Run `npm run build && npm run export` to generate static files
   - Serve the local `out` directory using a static file server to verify

2. **Environment Checks**
   - Verify all required environment variables are available
   - Test with sample data to ensure proper rendering
   - Check that client-side functionality works with static output

## Examples

### GitHub Actions Workflow

```yaml
name: Build and Deploy
on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm install
      
      - name: Create env file
        run: |
          echo "NOTES_DECRYPTION_PASSWORD=${{ secrets.NOTES_DECRYPTION_PASSWORD }}" > .env
          echo "NEXT_PUBLIC_HASHED_ACCESS_PASSWORD=${{ secrets.NEXT_PUBLIC_HASHED_ACCESS_PASSWORD }}" >> .env
      
      - name: Build
        run: npm run build
        
      - name: Deploy to GitHub Pages
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          branch: gh-pages
          folder: out
          clean: true
```

### Next.js Export Configuration

```typescript
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
```

## References

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Next.js Static Exports](https://nextjs.org/docs/pages/building-your-application/deploying/static-exports)
- [GitHub Pages Deploy Action](https://github.com/JamesIves/github-pages-deploy-action) 