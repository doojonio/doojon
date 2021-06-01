import mojo from '@mojojs/mojo';

export default class AccountsCourier {
  constructor(conf) {
    for (const required of ['protocol', 'host', 'port']) {
      if (!conf[required]) throw new Error(`${required} is required`);
    }

    const proto = conf.protocol;
    const host = conf.host;
    const port = conf.port;
    const baseURL = new URL(`${proto}://${host}:${port}`);

    this.ua = new mojo.Client({ name: 'Accounts Courier', baseURL });
  }

  async auth(creds) {
    for (const required of ['username', 'password']) {
      if (!creds[required]) throw new Error(`${required} is required`);
    }

    const res = await this.ua.post('/api/auth', {
      json: creds
    })

    if (res.isError)
      throw new Error(`error during request to accounts: ${res.statusMessage}`);

    return res.json();
  }
}
