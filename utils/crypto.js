const crypto = require('crypto');

const ALGORITHM = 'aes-256-gcm';

const getKey = () => {
    if (!process.env.ENCRYPTION_KEY || process.env.ENCRYPTION_KEY.length !== 64) {
        throw new Error('ENCRYPTION_KEY must be a 64-character hex string (32 bytes).');
    }
    return Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
};

exports.encrypt = (text) => {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');

    // Format: iv:encrypted:authTag
    return `${iv.toString('hex')}:${encrypted}:${authTag}`;
};

exports.decrypt = (encryptedText) => {
    const [ivHex, encryptedHex, authTagHex] = encryptedText.split(':');
    if (!ivHex || !encryptedHex || !authTagHex) throw new Error('Invalid encrypted token format');

    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');

    const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
};
