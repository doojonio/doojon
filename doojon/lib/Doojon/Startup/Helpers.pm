package Doojon::Startup::Helpers;

use Mojo::Base -base, -signatures;

sub startup ($self, $app) {

  $self->add_reply_helpers($app);

  $app->helper(
    cu => sub ($c) {
      $c->app->model->get_cu
    }
  );
}

sub add_reply_helpers ($self, $app) {

  $app->helper(
    'reply.not_authorized',
    sub ($c) {
      $c->render(json => 'not authorized', status => 401);
    }
  );
  $app->helper(
    'reply.forbidden',
    sub ($c) {
      $c->render(json => 'forbidden', status => 403);
    }
  );
}


1
