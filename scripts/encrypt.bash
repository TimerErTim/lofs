#!/usr/bin/env bash

set -euo pipefail

# Check requirements
if ! command -v jq >/dev/null 2>&1; then
  echo "jq is required to extract image paths; install it before running this script." >&2
  exit 1
fi

# Usage
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

# Validate notes.json
NOTES_PATH="$SOURCE_FOLDER/notes.json"
if [ ! -f "$NOTES_PATH" ]; then
  echo "notes.json not found in $SOURCE_FOLDER" >&2
  exit 1
fi

SCRIPT_DIR="$(cd -- "$(dirname -- "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

DATA_DIR="$REPO_ROOT/data"
DATA_IMAGES_DIR="$DATA_DIR/notes-images"
PUBLIC_DIR="$REPO_ROOT/public"

mkdir -p "$DATA_IMAGES_DIR"

echo "Encrypting notes json..."
openssl enc -aes-256-cbc -salt -md md5 -pass pass:"$PASSWORD" -base64 -A < "$NOTES_PATH" > "$DATA_DIR/encrypted_notes.dat"

IMAGE_URLS=$(jq -r '.notes[]?.imageUrl // empty' "$NOTES_PATH" | awk 'NF' | sort -u)

if [ -n "$IMAGE_URLS" ]; then
  echo "Encrypting image assets..."
  while IFS= read -r imageUrl; do
    if [ -z "$imageUrl" ]; then
      continue
    fi

    SOURCE_IMAGE="$SOURCE_FOLDER/images/$imageUrl"
    if [ ! -f "$SOURCE_IMAGE" ]; then
      echo "Warning: referenced image does not exist: $SOURCE_IMAGE" >&2
      continue
    fi

    DEST_IMAGE="$DATA_IMAGES_DIR/$imageUrl.dat"
    mkdir -p "$(dirname "$DEST_IMAGE")"
    openssl enc -aes-256-cbc -salt -md md5 -pass pass:"$PASSWORD" -base64 -A < "$SOURCE_IMAGE" > "$DEST_IMAGE"
    echo "Encrypted image: $imageUrl"
  done <<< "$IMAGE_URLS"
else
  echo "No images referenced in notes.json."
fi

# Ensure public symlinks point to data assets
rm -f "$PUBLIC_DIR/encrypted_notes.dat"
ln -sf "../data/encrypted_notes.dat" "$PUBLIC_DIR/encrypted_notes.dat"

rm -rf "$PUBLIC_DIR/notes-images"
ln -s "../data/notes-images" "$PUBLIC_DIR/notes-images"

echo "Notes encrypted to $DATA_DIR/encrypted_notes.dat"
echo "Image assets written to $DATA_IMAGES_DIR"