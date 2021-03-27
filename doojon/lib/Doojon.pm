package Doojon;
use Mojo::Base 'Mojolicious', -signatures;

use Doojon::Model;
use Mojo::Util qw(decamelize);

use constant (
  MODE_DEVELOPMENT => 'development',
);

# This method will run once at server start
sub startup ($self) {

  my $config = $self->plugin('NotYAMLConfig');

  $self->renderer->default_format('json');
  $self->add_reply_helpers;
  $self->add_resource_shortcut;
  push $self->commands->namespaces->@*, 'Doojon::Command';

  $self->setup_model;

  $self->secrets($config->{secrets});

  my $r = $self->routes;
  my $api = $r->any('/api');

  for my $ds ($self->model->list_dataservices) {
    $api->resource($ds);
  }
}

sub setup_model ($self) {

  my $db_conf = $self->config->{database};
  my $redis_conf = $self->config->{redis};

  $self->attr(model => sub {
    state $model = Doojon::Model->new(
      db_conf => $db_conf,
      redis_conf => $redis_conf,
    );
  });

  return 1;
}

sub add_resource_shortcut ($self) {

  $self->routes->add_shortcut(resource => sub ($r, $name) {
    my $resource = $r->any("/resource/$name")->to("resource#", resource_name => $name);

    $resource->post->to('#create');
    $resource->get->to('#read');
    $resource->put->to('#update');
    $resource->delete->to('#delete');

    $resource->post('/search')->to('#search');

    return $resource;
  });
}

sub add_reply_helpers ($self) {

  $self->helper('reply.not_authorized', sub ($c) {
    $c->render(json => 'not authorized', {status => 401});
  });
  $self->helper('reply.forbidden', sub ($c) {
    $c->render(json => 'forbidden', {status => 403});
  });
}

1
