// testHash.js

const bcrypt = require('bcryptjs');

// Replace these with the actual values
const plaintextPassword = 'qaadminpassword123';
const hashedPasswordFromDB = '$2a$10$dJkb8qV4zzY2vjZMqYCJo.TimrwvWxpTxFw08Q5mEFq21MBXl1bYq'; // Replace with actual hash from DB

const testPassword = async () => {
  try {
    const isMatch = await bcrypt.compare(plaintextPassword, hashedPasswordFromDB);
    console.log('Password Match:', isMatch); // Should return true
  } catch (error) {
    console.error('Error comparing passwords:', error.message);
  }
};

testPassword();
