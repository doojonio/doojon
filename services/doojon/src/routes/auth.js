/**
 * TODO: move to separated microservice
 */
export default function api() {
  const v1 = this.any('/api/auth/v1');
  v1.post('/signup').to('auth#signup');
}