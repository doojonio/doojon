/**
 * @typedef {import('@mojojs/core/lib/app').default} MojoApp
 */
/**
 *
 * @this MojoApp
 */
export default async function apiV1() {
  const v1 = this.any('/api/doojon/v1');

  resourceApi(v1.any('rs'));
  authorizationApi(v1.any('a'));

  v1.get('id').to('id#id');
}

function authorizationApi(endpoint) {
  endpoint.post('signup').to('authorization#signup');
}

function resourceApi(endpoint) {
  const resourceApi = {
    posts: { create: true },
    comments: { create: true },
    replies: { create: true },
  };

  for (const [resourceName, methods] of Object.entries(resourceApi)) {
    if (methods.create) {
      endpoint
        .post(resourceName)
        .to('resource#create', { dataserviceName: resourceName });
    }
  }

}
