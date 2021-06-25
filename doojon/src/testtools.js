import { Cookie } from 'tough-cookie';

export async function generateFreeTestUsername(app) {
  const profiles = app.model.getDataservice('profiles');

  let username;
  let userexists;
  do {
    username = 'testuser_' + Math.random().toString(36).substring(7);
    userexists = await profiles.read({ username });
  } while (userexists.length !== 0);

  return username;
}

export async function newAuthorizedClient(app) {
  const conf = app.config.testtools.authorizedClient;
  const client = await app.newTestClient();

  const accountsCourier = app.model.getCourier('accounts');
  let account = await accountsCourier.getAccount({ email: conf.testUserEmail });
  if (!account)
    account = await accountsCourier.createAccount({
      email: conf.testUserEmail,
      password: conf.testUserPassword,
    });
  await accountsCourier.auth({
    email: conf.testUserEmail,
    password: conf.testUserPassword,
  });

  const jar = await accountsCourier.ua.cookieJar.serialize();
  const authCookie = jar.cookies.filter(c => c.key === 'auth')[0];

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
