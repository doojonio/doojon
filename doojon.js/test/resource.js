const tap = require('tap');
const startup = require('../src/startup');
const {
  newAuthorizedClient,
  generateFreeTestUsername,
} = require('../src/testtools');

tap.test('Resource', async t => {
  const app = await startup();
  const client = await newAuthorizedClient(app);

  await t.test('Profiles', async t => {
    const username = await generateFreeTestUsername(app);

    const profile = {
      id: client.accountsAccount.id,
      username: username,
    };

    (
      await client.deleteOk(`/api/1/resource/profiles?id=${profile.id}`)
    ).statusIs(200);
    (
      await client.postOk('/api/1/resource/profiles', { json: profile })
    ).statusIs(200);
    (
      await client.getOk(`/api/1/resource/profiles?username=${username}`)
    ).statusIs(200);
    (
      await client.putOk(`/api/1/resource/profiles?username=${username}`, {
        json: { username: await generateFreeTestUsername(app) },
      })
    ).statusIs(200);
    (
      await client.deleteOk(`/api/1/resource/profiles?id=${profile.id}`)
    ).statusIs(200);
  });

  app.model.closeHandlers();
  client.stop();
});
