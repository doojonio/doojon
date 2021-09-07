import { Client } from '@mojojs/core';
import { Cookie } from 'tough-cookie';

export default class AccountsCourier {
  constructor(conf) {
    for (const required of ['schema', 'host', 'port']) {
      if (!conf[required]) throw new Error(`${required} is required`);
    }

    const schema = conf.schema;
    const host = conf.host;
    const port = conf.port;
    const baseURL = new URL(`${schema}://${host}:${port}`);

    this._host = conf.host;
    this.ua = new Client({ name: 'Accounts Courier', baseURL });
    // do not throw error on domain 'accounts' for example
    this.ua.cookieJar.rejectPublicSuffixes = false;
  }

  /**
   *
   * @param {AccountCredentials} creds
   * @returns undefined
   */
  async auth(creds) {

    const res = await this.ua.post('/api/svc/accounts/1/auth', {
      json: creds,
    });

    if (res.isError)
      throw new Error(`error during auth to accounts: ${res.statusMessage}`);

    return;
  }

  /**
   *
   * @returns undefined
   */
  async logout() {
    if ((await this.ua.cookieJar.serialize()).cookies.length === 0) return;

    const res = await this.ua.delete('/api/svc/accounts/1/logout');

    if (res.isError)
      throw new Error(`error during logout in accounts: ${res.statusMessage}`);

    await this.ua.cookieJar.removeAllCookies();

    return;
  }

  /**
   * Throws error on fail
   *
   * @param {Object} account
   * @returns {Object} object with id
   */
  async createAccount(account) {
    const res = await this.ua.post('/api/svc/accounts/1/accounts', { json: account });

    if (res.isError)
      throw new Error(
        `error during creating account in accounts: ${res.statusMessage}`
      );

    return res.json();
  }

  /**
   *
   * @returns {Object} object with id
   */
  async createTestAccount() {

    const res = await this.ua.post('/api/svc/accounts/1/test_account');

    if (res.isError)
      throw new Error(`error during creating test account: ${res.statusMessage}`);

    return res.json();
  }

  /**
   *
   * @param {Object} by keys: email or id
   * @returns
   */
  async getAccount(by) {
    const url = new URL('/api/svc/accounts/1/accounts', this.ua.baseURL);

    if (by.id) {
      url.searchParams.append('id', by.id);
    } else if (by.email) {
      url.searchParams.append('email', by.email);
    } else {
      throw new Error('id or email required');
    }

    const res = await this.ua.get(url);

    if (res.status === 404) return null;

    if (res.isError)
      throw new Error(
        `Error during creating account in accounts: ${res.statusMessage}`
      );

    return res.json();
  }

  /**
   *
   * @param {string} sessionId
   * @returns Accounts information
   */
  async getAccountBySession(sessionId) {
    let authCookie = new Cookie({key: 'SID', value: sessionId, domain: this._host});
    this.ua.cookieJar.setCookie(authCookie, this.ua.baseURL);

    const res = await this.ua.get('/api/svc/accounts/1/current_user_account');

    if (res.status === 401) return null

    if (res.isError)
      throw new Error(
        `Error during getting session from accounts: ${res.statusMessage}`
      );

    return res.json();
  }
}

export class AccountCredentials {
  /**
   * @type {string}
   */
  email;
  /**
   * @type {string}
   */
  password;
}
