const fs = require('fs');
const path = require('path');
const crypto = require('crypto-js');
const JSZip = require('jszip');

// Check arguments
if (process.argv.length < 4) {
  console.error('Usage: node encrypt.js <source_folder> <password>');
  process.exit(1);
}

const sourceFolder = process.argv[2];
const password = process.argv[3];

// Validate source folder
if (!fs.existsSync(sourceFolder)) {
  console.error(`Source folder does not exist: ${sourceFolder}`);
  process.exit(1);
}

// Check for notes.json in the source folder
const notesPath = path.join(sourceFolder, 'notes.json');
if (!fs.existsSync(notesPath)) {
  console.error(`notes.json not found in ${sourceFolder}`);
  process.exit(1);
}

async function encryptFolder() {
  try {
    const zip = new JSZip();
    
    // Add notes.json
    const notesContent = fs.readFileSync(notesPath, 'utf8');
    zip.file('notes.json', notesContent);
    
    // Parse notes to find images
    const notes = JSON.parse(notesContent);
    const imagesFolder = path.join(sourceFolder, 'images');
    
    if (fs.existsSync(imagesFolder)) {
      // Add image files referenced in notes
      if (notes.notes && Array.isArray(notes.notes)) {
        for (const note of notes.notes) {
          if (note.imageUrl) {
            const imagePath = path.join(imagesFolder, note.imageUrl);
            if (fs.existsSync(imagePath)) {
              const imageContent = fs.readFileSync(imagePath);
              zip.file(`images/${note.imageUrl}`, imageContent);
              console.log(`Added image: ${note.imageUrl}`);
            } else {
              console.warn(`Image not found: ${note.imageUrl}`);
            }
          }
        }
      }
    } else {
      console.warn('Images folder not found, continuing without images');
    }
    
    // Generate the ZIP file content
    const zipContent = await zip.generateAsync({ type: 'base64' });
    
    // Encrypt the ZIP content
    const encrypted = crypto.AES.encrypt(zipContent, password).toString();
    
    // Save to data directory
    const outputPath = path.join(__dirname, '..', 'data', 'encrypted_notes.dat');
    fs.writeFileSync(outputPath, encrypted);
    
    console.log(`Notes encrypted successfully to: ${outputPath}`);
  } catch (error) {
    console.error('Error encrypting notes:', error);
    process.exit(1);
  }
}

encryptFolder(); 