# Security Model

## Purpose

This document outlines the security architecture and practices that must be followed to maintain the confidentiality and integrity of the Daily Notes of Love project.

## Scope

These security rules apply to all code, configuration, deployment processes, and development practices within the project.

## Guidelines

### Encryption at Rest

1. **Note Content Security**
   - All note content must be stored in an encrypted format in the repository
   - AES encryption via CryptoJS is the standard encryption method
   - Encryption password must never be committed to the repository
   - The encrypted data should be stored in the `data/encrypted_notes.dat` file

2. **Image Security**
   - Images must be included in the encrypted ZIP archive
   - No unencrypted images should be stored in the repository
   - Images are extracted and converted to data URLs at build time

### Authentication

1. **Password Management**
   - The website access password must never be stored in plain text
   - Only SHA-256 hashes of passwords should be used for verification
   - Password hashing occurs client-side using CryptoJS
   - The hashed password is injected at build time via environment variables

2. **Session Management**
   - Authentication tokens are stored in localStorage
   - Tokens include creation and expiry timestamps
   - Default validity period is 30 days
   - No sensitive information should be stored in the token

### Environment Variables

1. **Required Secrets**
   - `NOTES_DECRYPTION_PASSWORD`: Used to decrypt notes at build time
   - `NEXT_PUBLIC_HASHED_ACCESS_PASSWORD`: SHA-256 hash of the website access password

2. **Secret Management**
   - For local development, use `.env.local` (excluded from git)
   - For production, use GitHub Secrets
   - Never log or expose secrets in any way

### Build-time vs. Runtime Security

1. **Build-time Operations**
   - Note decryption happens only at build time
   - Access to decryption keys is restricted to build time
   - Images are embedded as data URLs during build

2. **Runtime Operations**
   - No decryption keys are available at runtime
   - Authentication uses only the pre-built hash for comparison
   - All sensitive operations must complete during build

## Examples

### Correct Environment Variable Usage

```javascript
// Correct: Accessing build-time secret
const password = process.env.NOTES_DECRYPTION_PASSWORD;
if (!password) {
  throw new Error('NOTES_DECRYPTION_PASSWORD environment variable is not set');
}

// Correct: Using public environment variable for client-side code
const hashedPassword = process.env.NEXT_PUBLIC_HASHED_ACCESS_PASSWORD;
```

### Incorrect Security Practices (AVOID)

```javascript
// WRONG: Hardcoding secrets
const decryptionPassword = "myHardcodedPassword";

// WRONG: Storing unencrypted sensitive data
fs.writeFileSync('data/notes.json', JSON.stringify(notesData));

// WRONG: Exposing decryption functionality to client
export function decryptNotesClientSide(password) {
  // This would expose the decryption capability to the browser
}
```

## References

- [CryptoJS Documentation](https://cryptojs.gitbook.io/docs/)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets) 