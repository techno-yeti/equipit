const crypto = require('crypto');
const Request = require('../models/Request');

const generateRequestNumber = async () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let attempts = 0;
  const maxAttempts = 100;

  while (attempts < maxAttempts) {
    let number = '';
    const bytes = crypto.randomBytes(8);
    for (let i = 0; i < 8; i++) {
      number += chars[bytes[i] % chars.length];
    }

    const exists = await Request.findOne({ requestNumber: number }).lean();
    if (!exists) {
      return number;
    }
    attempts++;
  }

  throw new Error('Unable to generate unique request number');
};

module.exports = { generateRequestNumber };
