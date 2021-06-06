async function routesStartup(app) {
  const api = app.any('/api/1/');

  const resourse = api.any('/resource');
  const dss = app.model.listDataservices();
  for (const ds of dss) {
    const postroute = resourse.post(`/${ds}`).to('resource#create');
    postroute.pattern.defaults.dsname = ds;

    const getroute = resourse.get(`/${ds}`).to('resource#read');
    getroute.pattern.defaults.dsname = ds;

    const putroute = resourse.put(`/${ds}`).to('resource#update');
    putroute.pattern.defaults.dsname = ds;

    const deleteroute = resourse.delete(`/${ds}`).to('resource#delete');
    deleteroute.pattern.defaults.dsname = ds;
  }
}

module.exports = routesStartup;
