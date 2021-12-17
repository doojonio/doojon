/**
 * TODO: move to separated microservice
 */
export default function api() {
  const v1 = this.any('/api/id/v1');
  v1.get().to('id#getCurrentIdentity');
}
