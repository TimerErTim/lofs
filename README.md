# Daily Notes of Love

A private website for sharing daily love notes with your significant other. Built with Next.js, HeroUI components, and TailwindCSS.

## Features

- Static site generation with Next.js
- Encrypted notes that are decrypted at build time
- Client-side password protection with dedicated login page
- Session-based authentication with automatic redirect
- Support for images alongside notes
- Automatic deployment to GitHub Pages

## Project Structure

```
├── data/               # Contains encrypted notes data
├── public/             # Static assets
├── scripts/            # Utility scripts
│   └── encrypt.js      # Script to encrypt notes
├── src/
│   ├── components/     # React components
│   │   └── AuthGuard.tsx # Authentication component
│   ├── pages/          # Next.js pages
│   │   ├── login.tsx   # Dedicated login page
│   │   └── notes/      # Individual note pages
│   ├── styles/         # CSS styles
│   ├── types/          # TypeScript type definitions
│   └── utils/          # Utility functions
│       └── auth.ts     # Authentication utilities
├── notes-source/       # Source folder for unencrypted notes (not committed)
│   ├── images/         # Images for notes
│   └── notes.json      # Notes data in JSON format
└── .github/workflows/  # GitHub Actions workflows
```

## Authentication System

The application uses a client-side authentication system:

- Password protection via dedicated login page
- Passwords are stored in sessionStorage (expires when browser is closed)
- When accessing a protected URL without authentication, users are redirected to the login page
- After successful login, users are redirected back to their originally requested URL
- Authentication is validated by successful decryption of the encrypted notes

## Development

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env.local` file with:
   ```
   NOTES_DECRYPTION_PASSWORD=your-decryption-password
   NEXT_PUBLIC_HASHED_ACCESS_PASSWORD=your-hashed-access-password
   ```
4. Run the development server:
   ```
   npm run dev
   ```

## Encrypting Notes

1. Create a folder with your notes and images
2. Ensure the folder contains a `notes.json` file with the format:
   ```json
   {
     "notes": [
       {
         "id": "1",
         "date": "2023-04-01",
         "text": "Your love note text here",
         "imageUrl": "optional-image.jpg"
       }
     ]
   }
   ```
3. Run the encryption script:
   ```
   npm run build:notes -- ./path-to-notes-folder your-password
   ```

## Deployment

The site is automatically deployed to GitHub Pages when changes are pushed to the main branch.

### GitHub Secrets

For deployment, you need to set up the following GitHub repository secrets:

- `NOTES_DECRYPTION_PASSWORD`: The password to decrypt the notes data

## License

Private
