/**
 * TODO: move to separated microservice
 */
export default function api() {
  const v1 = this.any('/api/auth/v1');
  v1.post('/signup').to('auth#signUp');
  v1.post('/signin').to('auth#signIn');
  v1.get('/check/username/:username').to('auth#checkUsername');
}