const crypto = require('crypto');

// Password to hash
const password = 'password';

// Generate SHA256 hash
const hash = crypto.createHash('sha256').update(password).digest('hex');

console.log('Password:', password);
console.log('SHA256 Hash:', hash); 