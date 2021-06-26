import { Client } from '@mojojs/core';
import { Cookie } from 'tough-cookie';

export default class AccountsCourier {
  constructor(conf) {
    for (const required of ['protocol', 'host', 'port']) {
      if (!conf[required]) throw new Error(`${required} is required`);
    }

    const proto = conf.protocol;
    const host = conf.host;
    const port = conf.port;
    const baseURL = new URL(`${proto}://${host}:${port}`);

    this._host = conf.host;
    this.ua = new Client({ name: 'Accounts Courier', baseURL });
    // do not throw error on domain 'accounts' for example
    this.ua.cookieJar.rejectPublicSuffixes = false;
  }

  async auth(creds) {

    const res = await this.ua.post('/api/1/auth', {
      json: creds,
    });

    if (res.isError)
      throw new Error(`error during auth to accounts: ${res.statusMessage}`);

    return;
  }

  async logout() {
    if ((await this.ua.cookieJar.serialize()).cookies.length === 0) return;

    const res = await this.ua.delete('/api/1/logout');

    if (res.isError)
      throw new Error(`error during logout in accounts: ${res.statusMessage}`);

    await this.ua.cookieJar.removeAllCookies();

    return;
  }

  async createAccount(account) {
    const res = await this.ua.post('/api/1/accounts', { json: account });

    if (res.isError)
      throw new Error(
        `error during creating account in accounts: ${res.statusMessage}`
      );

    return res.json();
  }

  async createTestAccount() {

    const res = await this.ua.post('/api/1/test_account');

    if (res.isError)
      throw new Error(`error during creating test account: ${res.statusMessage}`);

    return res.json();
  }

  async getAccount(by) {
    const url = new URL('/api/1/accounts', this.ua.baseURL);

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

  async getAccountBySession(sessionId) {
    let authCookie = new Cookie({key: 'SID', value: sessionId, domain: this._host});
    this.ua.cookieJar.setCookie(authCookie, this.ua.baseURL);

    const res = await this.ua.get('/api/1/current_user_account');

    if (res.status === 401) return null

    if (res.isError)
      throw new Error(
        `Error during getting session from accounts: ${res.statusMessage}`
      );

    return res.json();
  }
}
