export default async function startup(app) {
  const api = app.any('/api/1/');

  const resourse = api.any('/resource');
  resourse.post('/:dsname').to('resource#create');
  resourse.get('/:dsname').to('resource#read');
  resourse.put('/:dsname').to('resource#update');
  resourse.delete('/:dsname').to('resource#delete');
}
