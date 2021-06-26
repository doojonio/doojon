import { Cookie } from 'tough-cookie';

export async function generateFreeTestUsername(app) {
  const profiles = app.model.getDataservice('profiles');

  let username;
  let userexists;
  do {
    username = 'testuser_' + Math.random().toString(36).substring(7);
    userexists = await profiles.read({}, { username });
  } while (userexists.length !== 0);

  return username;
}

export async function newAuthorizedClient(app) {
  const client = await app.newTestClient();

  const accountsCourier = app.model.getCourier('accounts');
  let account = await accountsCourier.createTestAccount();

  let authCookieName = app.config.web.authCookie.name;
  const authCookie = (
    await accountsCourier.ua.cookieJar.getCookies(accountsCourier.ua.baseURL)
  ).filter(c => c.key === authCookieName)[0].clone();

  client.accountsSession = authCookie.value;
  client.accountsAccount = account;

  const domain = client.baseURL.hostname;
  authCookie.domain = domain;

  await client.cookieJar.setCookie(
    new Cookie(authCookie),
    `http://accounts.${domain}/api/auth`
  );

  const basicStop = client.stop;
  client.stop = () => {
    accountsCourier.logout();
    return basicStop.apply(client);
  };

  return client;
}
