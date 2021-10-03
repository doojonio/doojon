import { compare, hash } from 'bcrypt';
import { Service } from '../service.js';
import { randomBytes, randomUUID } from 'crypto';

export default class CryptService extends Service {
  async hashPassword(password) {
    return hash(password, 10);
  }

  async comparePasswords(password, hash) {
    return compare(password, hash);
  }

  generateUrlSafeKey(length) {
    const randomBytesBuffer = randomBytes((length * 3) / 4 + 1);
    const base64 = randomBytesBuffer.toString('base64');

    let urlSafeKey = base64
      .replace(/\+/g, 'd')
      .replace(/\//g, 'j')
      .replace(/=/g, 'n');

    if (urlSafeKey.length > length) {
      urlSafeKey = urlSafeKey.substring(0, length);
    }

    return urlSafeKey;
  }

  generateUUID() {
    /**
     * By default, to improve performance, Node.js generates and
     * caches enough random data to generate up to 128 random UUIDs.
     * To generate a UUID without using the cache, set disableEntropyCache
     * to true. Default: false.
     */
    return randomUUID({ disableEntropyCache: true });
  }
}
