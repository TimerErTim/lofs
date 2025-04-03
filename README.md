# Daily Notes of Love

A private website for sharing daily love notes with your significant other. Built with Next.js, HeroUI components, and TailwindCSS.

## Features

- Static site generation with Next.js
- Encrypted notes that are decrypted at build time
- Client-side password protection
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
│   ├── pages/          # Next.js pages
│   ├── styles/         # CSS styles
│   ├── types/          # TypeScript type definitions
│   └── utils/          # Utility functions
├── notes-source/       # Source folder for unencrypted notes (not committed)
│   ├── images/         # Images for notes
│   └── notes.json      # Notes data in JSON format
└── .github/workflows/  # GitHub Actions workflows
```

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
