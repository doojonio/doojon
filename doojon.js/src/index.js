import mojo from '@mojojs/mojo';

const app = mojo();

app.get('/', ctx => ctx.render({text: 'Hello, World!'}));

app.start()

