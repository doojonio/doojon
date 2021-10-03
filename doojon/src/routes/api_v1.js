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
  v1.get('id').to('id#id');
}

function resourceApi(resourcesEndpoint) {
  const resourceApi = {
    posts: { create: true },
    comments: { create: true },
    replies: { create: true },
  };

  for (const [resourceName, methods] of Object.entries(resourceApi)) {
    if (methods.create) {
      resourcesEndpoint
        .post(resourceName)
        .to('resource#create', { dataserviceName: resourceName });
    }
  }

}
