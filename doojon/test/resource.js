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

    (
      await client.deleteOk(`/api/1/resource/profiles?id=${client.accountsAccount.id}`)
    );
    (
      await client.postOk('/api/1/resource/profiles', { json: { username } })
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
      await client.deleteOk(`/api/1/resource/profiles?id=${client.accountsAccount.id}`)
    ).statusIs(200);
  });

  await t.test('Challenges', async t => {
    const challenge = {
      title: 'Do not eat sugar 30 days',
      descr: 'Try to live without sugar 30 days. The most challenging is...',
    };
  });

  app.model.closeHandlers();
  client.stop();
});
