package Doojon::Startup::Routes;

use Mojo::Base -base, -signatures;

sub startup ($self, $app) {

  $app->renderer->default_format('json');
  $app->secrets($app->config->{secrets});

  $self->add_resource_shortcut($app);

  my $r = $app->routes;
  my $api = $r->any('/api');

  for my $ds ($app->model->list_dataservices) {
    $api->resource($ds);
  }
}

sub add_resource_shortcut ($self, $app) {

  $app->routes->add_shortcut(resource => sub ($r, $name) {
    my $resource = $r->any("/resource/$name")->to("resource#", resource_name => $name);

    $resource->post->to('#create');
    $resource->get->to('#read');
    $resource->put->to('#update');
    $resource->delete->to('#delete');

    $resource->post('/search')->to('#search');

    return $resource;
  });
}

1
