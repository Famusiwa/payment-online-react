import CryptoJS from 'crypto-js';
import { encryptionKey } from './env';

// Simple AES encryption/decryption helpers using CryptoJS

export const encrypt = (data: string) => {
  return CryptoJS.AES.encrypt(data, encryptionKey).toString();
};

export const decrypt = (ciphertext: string) => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, encryptionKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch {
    return null;
  }
};
