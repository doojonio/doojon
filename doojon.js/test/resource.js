import tap from 'tap';
import startup from '../src/startup.js';

tap.test('Resource', async t => {
  const app = await startup();
  const client = await app.newTestClient({tap: t});

  (await client.getOk('/api/1/resource/profiles?username=uuid')).statusIs(200);

  app.model.closeHandlers();
  client.stop();
})