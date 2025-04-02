# Deployment Guidelines

## Purpose

This document outlines the deployment process and requirements for the Daily Notes of Love project, ensuring consistent and secure deployments across environments.

## Scope

These guidelines apply to all deployment processes, GitHub Actions workflows, and environment configurations.

## Guidelines

### Static Site Generation

1. **Build Process**
   - The project uses Next.js Static Site Generation (SSG)
   - All pages must be pre-rendered at build time
   - The `NOTES_DECRYPTION_PASSWORD` environment variable is required during the build phase
   - This password is used to decrypt the notes file only at build time to generate static paths
   - Static paths are generated for each note date to ensure proper static generation
   - No fallback pages are used since there is no server running in production

2. **Output Configuration**
   - Build output is a completely static website
   - No server-side code is executed after deployment
   - Static export is configured in `next.config.ts`
   - Output directory should be configured as `out/`

### Environment Configuration

1. **Environment Variables**
   - Required environment variables:
     - `NOTES_DECRYPTION_PASSWORD`: Used at build time to decrypt notes for static path generation
     - `NEXT_PUBLIC_HASHED_ACCESS_PASSWORD`: Public hash of the website access password
   - Environment variables are managed differently depending on environment:
     - Development: `.env.local` file (not committed to repository)
     - Production: GitHub Repository Secrets

2. **Secret Management**
   - All secrets must be stored in GitHub Repository Secrets
   - No secrets should be committed to the repository
   - The `NOTES_DECRYPTION_PASSWORD` secret must be set in GitHub Repository Secrets
   - The password hash is public and can be exposed in the client-side code

### GitHub Actions Workflow

1. **Workflow Configuration**
   - Workflow is defined in `.github/workflows/deploy.yml`
   - Runs on push to main branch and manual dispatch
   - Uses Node.js 20.x for build environment
   - Automatically deploys to GitHub Pages

2. **Workflow Steps**
   - Checkout code
   - Set up Node.js environment
   - Install dependencies
   - Build with environment variables including `NOTES_DECRYPTION_PASSWORD`
   - Export static files
   - Deploy to GitHub Pages

3. **Error Handling**
   - Build will fail if `NOTES_DECRYPTION_PASSWORD` is not provided
   - Build will fail if password cannot decrypt the notes file
   - No fallback mechanism is provided as all pages must be pre-generated

### GitHub Pages Configuration

1. **Repository Settings**
   - GitHub Pages source should be set to the `gh-pages` branch
   - Custom domain can be configured if needed
   - HTTPS should be enforced

2. **Custom Domain (Optional)**
   - If using a custom domain:
     - Configure DNS settings with your domain provider
     - Add `CNAME` file to `public/` directory
     - Enable HTTPS in GitHub Pages settings

## Examples

### GitHub Workflow YAML

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
      
      - name: Build
        env:
          NOTES_DECRYPTION_PASSWORD: ${{ secrets.NOTES_DECRYPTION_PASSWORD }}
        run: npm run build
        
      - name: Export static files
        run: npm run export
        
      - name: Deploy to GitHub Pages
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          branch: gh-pages
          folder: out
          clean: true
```

### Environment Variable Setup

Development `.env.local`:
```
NOTES_DECRYPTION_PASSWORD=your-secure-password
NEXT_PUBLIC_HASHED_ACCESS_PASSWORD=5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8
```

## References

- [Next.js Static Site Generation](https://nextjs.org/docs/basic-features/data-fetching/get-static-props)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Environment Variables in Next.js](https://nextjs.org/docs/basic-features/environment-variables) 