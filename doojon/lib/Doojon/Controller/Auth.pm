package Doojon::Controller::Auth;

use Mojo::Base 'Mojolicious::Controller', -signatures;

sub password_auth ($self) {

  my $user = $self->req->json;
  my $user_ds = $self->app->model->get_dataservice('user');

  my $is_user_exists = !!($user_ds->search(
    {username => $user->{username}},
    {columns => ['username']}
  ));

  if (!$is_user_exists) {
    return $self->reply->not_found;
  }

  my $auth_service = $self->app->model->get_service('auth');
  my $is_authorized = $auth_service->password_auth($user->{username}, $user->{password});

  if (!$is_authorized) {
    return $self->reply->not_authorized;
  }

  # TODO sessions
  return $self->render(json => 1);
}

1
