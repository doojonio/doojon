export default async function routesStartup(app) {
  const api = app.any('/api/svc/doojon/1');

  api.get('uinfo').to('id#getUserInfo');
  api.get('/resource/challenges/common').to('challenges#getChallengeCommonInfo');
  api.get('/resource/profiles/common').to('profiles#getProfileCommonInfo');
  api.get('/resource/profiles/is_username_available').to('profiles#isUsernameAvailable');
  api.get('/resource/events/following').to('events#getEventsFromFollowing');
  api.get('/health', ctx => ctx.render({text: 'OK'}));

  _resourceRoutes(app, api);
}

function _resourceRoutes(app, apiRoute) {
  const resourse = apiRoute.any('/resource');
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
