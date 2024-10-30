const crypto = require('crypto');

// Function to generate a secure random 6-digit number
function generateRandomNumber() {
  const min = 100000; // Minimum 6-digit number
  const max = 999999; // Maximum 6-digit number
  const randomBytes = crypto.randomBytes(4); // Generate 4 random bytes (32 bits)

  // Convert the random bytes to a 32-bit unsigned integer
  const randomNumber = randomBytes.readUInt32BE(0);

  // Map the 32-bit integer to the desired range (min to max)
  const range = max - min + 1;
  const scaledNumber = (randomNumber % range) + min;

  // Convert the number to a 6-digit string (pad with leading zeros if needed)
  const sixDigitNumber = String(scaledNumber).padStart(6, '0');

  return sixDigitNumber;
}
const randomCode = generateRandomNumber();
module.exports = randomCode;
