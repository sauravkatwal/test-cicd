import { randomBytes, createCipheriv, createDecipheriv } from 'node:crypto';

const ALGORITHM = 'aes-256-cbc';
const ENCODING = 'hex';
const IV_LENGTH = 16;
const KEY = 'm68vwiY7BkTSUogxmmsS5KHhxPQhSv8U';

class Crypto {
  private static instance: Crypto;
  constructor() {}

  static get(): Crypto {
    if (!Crypto.instance) {
      Crypto.instance = new Crypto();
    }
    return Crypto.instance;
  }

  public encrypt = async (data: string) => {
    const iv = randomBytes(IV_LENGTH);
    const cipher = createCipheriv(ALGORITHM, Buffer.from(KEY), iv, {});
    return Buffer.concat([cipher.update(data), cipher.final(), iv]).toString(ENCODING);
  };

  public decrypt = async (data: string) => {
    const binaryData = Buffer.from(data, ENCODING);
    const iv = binaryData.subarray(-IV_LENGTH);
    const encryptedData = binaryData.subarray(0, binaryData.length - IV_LENGTH);
    const decipher = createDecipheriv(ALGORITHM, Buffer.from(KEY), iv);
    return Buffer.concat([decipher.update(encryptedData), decipher.final()]).toString();
  };
}

const crypto = Crypto.get();

export { crypto as Crypto };
