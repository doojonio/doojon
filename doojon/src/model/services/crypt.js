import { compare, hash } from 'bcrypt';
import { Service } from '../service.js';

export default class CryptService extends Service {
  async hashPassword(password) {
    return hash(password, 10);
  }
  async comparePasswords(password, hash) {
    return compare(password, hash);
  }
}
