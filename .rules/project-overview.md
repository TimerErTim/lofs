# Project Overview

## Purpose

This document provides comprehensive information about the Daily Notes of Love project's architecture, design decisions, and implementation details. It serves as the primary reference for understanding the project's structure and goals.

## Scope

This rule applies to the entire codebase and all development activities related to the project.

## Guidelines

### Project Goals

The Daily Notes of Love project aims to:

1. Provide a secure, private platform for sharing daily love notes between partners
2. Maintain security through encryption at rest and access control
3. Deliver a beautiful, responsive user interface using modern web technologies
4. Operate as a static website with no server-side requirements
5. Automate deployment while maintaining security of sensitive content

### Technical Stack

- **Frontend Framework**: Next.js with TypeScript
- **UI Library**: HeroUI components
- **Styling**: TailwindCSS
- **Encryption**: CryptoJS for AES encryption/decryption
- **File Handling**: JSZip for packaging notes and images
- **Authentication**: Client-side with SHA-256 password hashing
- **Deployment**: GitHub Pages via GitHub Actions

### Core Architecture

The application follows a static site generation (SSG) approach with the following key components:

1. **Authentication Layer**:
   - Client-side password protection
   - Token-based authentication stored in localStorage
   - SHA-256 password hashing

2. **Data Management**:
   - Encrypted ZIP archive containing notes and images
   - Notes stored as JSON with text and optional image references
   - Decryption occurs at build time only

3. **UI Components**:
   - Login form for access control
   - Notes display with image support
   - Navigation between notes

4. **Build Process**:
   - Static site generation using Next.js
   - Environment variables for secrets
   - Export to static HTML/CSS/JS

### Security Considerations

1. The project should never store unencrypted notes in the repository
2. Password hashing should use strong cryptographic methods (SHA-256)
3. Secrets should be managed via GitHub Secrets or environment variables
4. Source notes directory should be excluded from git

## Examples

### Typical User Flow

1. User navigates to the deployed site
2. User is presented with a login form
3. After entering the correct password, notes are displayed
4. User can navigate between different notes
5. Session persists for 30 days or until logout

### Data Update Flow

1. User creates new notes locally in the notes-source directory
2. User runs the encrypt script with appropriate password
3. Encrypted data is committed to the repository
4. GitHub Actions builds and deploys the updated site

## References

- [Next.js Documentation](https://nextjs.org/docs)
- [HeroUI Documentation](https://www.heroui.com/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [CryptoJS Documentation](https://cryptojs.gitbook.io/docs/) 