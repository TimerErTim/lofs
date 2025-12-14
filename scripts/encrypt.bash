#!/usr/bin/env bash

set -e

# Check arguments
if [ $# -lt 2 ]; then
  echo "Usage: $0 <source_folder> <password>" >&2
  exit 1
fi

SOURCE_FOLDER="$1"
PASSWORD="$2"

# Validate source folder
if [ ! -d "$SOURCE_FOLDER" ]; then
  echo "Source folder does not exist: $SOURCE_FOLDER" >&2
  exit 1
fi

# Check for notes.json in the source folder
NOTES_PATH="$SOURCE_FOLDER/notes.json"
if [ ! -f "$NOTES_PATH" ]; then
  echo "notes.json not found in $SOURCE_FOLDER" >&2
  exit 1
fi

# Create temporary directory for zip creation
TEMP_DIR=$(mktemp -d)
SCRIPT_DIR="$(cd -- "$(dirname -- "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
trap "rm -rf $TEMP_DIR" EXIT

echo "Creating archive..."

# Copy notes.json to temp directory
cp "$NOTES_PATH" "$TEMP_DIR/"

# Check if images folder exists and copy referenced images
IMAGES_FOLDER="$SOURCE_FOLDER/images"
if [ -d "$IMAGES_FOLDER" ]; then
  mkdir -p "$TEMP_DIR/images"
  
  # Extract image URLs from notes.json and copy them
  if command -v jq >/dev/null 2>&1; then
    # Use jq if available for proper JSON parsing
    IMAGE_URLS=$(jq -r '.notes[]?.imageUrl // empty' "$NOTES_PATH" 2>/dev/null | grep -v '^null$' | sort -u)
    
    for IMAGE_URL in $IMAGE_URLS; do
      IMAGE_PATH="$IMAGES_FOLDER/$IMAGE_URL"
      if [ -f "$IMAGE_PATH" ]; then
        cp "$IMAGE_PATH" "$TEMP_DIR/images/"
        echo "Added image: $IMAGE_URL"
      else
        echo "Warning: Image not found: $IMAGE_URL" >&2
      fi
    done
  else
    # Fallback: copy all images (less precise but works without jq)
    echo "Warning: jq not found, copying all images from images folder" >&2
    cp "$IMAGES_FOLDER"/* "$TEMP_DIR/images/" 2>/dev/null || true
  fi
else
  echo "Warning: Images folder not found, continuing without images" >&2
fi

# Create ZIP file with maximum compression containing notes.json (+ images if present)
echo "Creating ZIP file..."
ZIP_FILE="$TEMP_DIR/archive.zip"
cd "$TEMP_DIR"
zip -9 -r "$ZIP_FILE" . >/dev/null

# Convert ZIP to a single-line base64 string (this is the plaintext expected by the app)
ZIP_BASE64_FILE="$TEMP_DIR/archive_base64.txt"
base64 -w 0 "$ZIP_FILE" > "$ZIP_BASE64_FILE"

# Encrypt the base64 plaintext using OpenSSL "Salted__" format compatible with CryptoJS passphrase API
# IMPORTANT: Do NOT use -pbkdf2 here; CryptoJS.AES.decrypt(passphrase) expects the legacy OpenSSL EVP_BytesToKey derivation.
echo "Encrypting data (OpenSSL Salted__ format, EVP_BytesToKey)..."

# Ensure data directory exists at repo-root/data
DATA_DIR="$REPO_ROOT/data"
mkdir -p "$DATA_DIR"

OUTPUT_PATH="$DATA_DIR/encrypted_notes.dat"

# Produce base64-encoded OpenSSL salted ciphertext:
#  - Input: base64 string of the ZIP (text)
#  - Output: base64 string of "Salted__" || salt || ciphertext
openssl enc -aes-256-cbc -salt -md md5 -pass pass:"$PASSWORD" -base64 -A < "$ZIP_BASE64_FILE" > "$OUTPUT_PATH"

echo "Notes encrypted successfully to: $OUTPUT_PATH"