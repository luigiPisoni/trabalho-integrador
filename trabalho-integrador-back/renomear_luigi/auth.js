import { randomBytes, createHash, scryptSync } from 'crypto';

// salt = se não passar ele cria um novo
// password nunca pode ser null
export function hashPassword(password, salt) {
  const databaseSalt = salt ?? randomBytes(16).toString('hex');
  const shaedPass = createHash('sha256').update(password).digest('hex');
  const backendPepper = `${databaseSalt}#${shaedPass}`;

  const hash = scryptSync(password, backendPepper, 40).toString('hex');
  return `${databaseSalt}.${hash}`;
}

export function verifyHash(password, hashedPassword) {
  const [databaseSalt, hashValue] = hashedPassword.split('.');
  const [salt, hash] = hashPassword(password, databaseSalt).split('.');
  return salt === databaseSalt && hash === hashValue;
}
