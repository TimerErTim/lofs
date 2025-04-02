const crypto = require('crypto-js');

// Check if password was provided as an argument
if (process.argv.length < 3) {
  console.error('Usage: node generate-password-hash.js <password>');
  process.exit(1);
}

const password = process.argv[2];
const hashedPassword = crypto.SHA256(password).toString();

console.log('SHA-256 Hash:', hashedPassword);
console.log('\nAdd this to your GitHub repository secrets as NEXT_PUBLIC_HASHED_ACCESS_PASSWORD'); 