import { Client } from '@mojojs/core';

export default class AccountsCourier {
  constructor(conf) {
    for (const required of ['protocol', 'host', 'port']) {
      if (!conf[required]) throw new Error(`${required} is required`);
    }

    const proto = conf.protocol;
    const host = conf.host;
    const port = conf.port;
    const baseURL = new URL(`${proto}://${host}:${port}`);

    this.ua = new Client({ name: 'Accounts Courier', baseURL });
    // do not throw error on domain 'accounts' for example
    this.ua.cookieJar.rejectPublicSuffixes = false;
  }

  async auth(creds) {
    for (const required of ['email', 'password']) {
      if (!creds[required]) throw new Error(`${required} is required`);
    }

    const res = await this.ua.post('/api/1/auth', {
      json: creds,
    });

    if (res.isError)
      throw new Error(`error during auth to accounts: ${res.statusMessage}`);

    return res.json();
  }

  async logout() {
    if ((await this.ua.cookieJar.serialize()).cookies.length === 0) return;

    const res = await this.ua.delete('/api/1/logout');

    if (res.isError)
      throw new Error(`error during logout in accounts: ${res.statusMessage}`);

    await this.ua.cookieJar.removeAllCookies();

    return res.json();
  }

  async createAccount(account) {
    for (const required of ['email', 'password']) {
      if (!account[required]) throw new Error(`${required} is required`);
    }

    const res = await this.ua.post('/api/1/accounts', { json: account });

    if (res.isError)
      throw new Error(
        `error during creating account in accounts: ${res.statusMessage}`
      );

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

  async getSession(sessionId) {
    const res = await this.ua.get('/api/1/session', {headers: {'X-Session': sessionId}});

    if (res.status === 404) return null

    if (res.isError)
      throw new Error(
        `Error during getting session from accounts: ${res.statusMessage}`
      );

    return res.json();
  }
}
