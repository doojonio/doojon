export default async function startup(app) {

  app.any('/').to('resource#read');
}
