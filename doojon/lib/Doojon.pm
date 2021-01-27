package Doojon;
use Mojo::Base 'Mojolicious', -signatures;

use Mojo::Pg;
use Doojon::Model::ORM;

# This method will run once at server start
sub startup ($self) {

  # Load configuration from config file
  my $config = $self->plugin('NotYAMLConfig');

  $self->renderer->default_format('json');
  $self->setup_database;
  $self->add_resource_shortcut;

  # Configure the application
  $self->secrets($config->{secrets});

  # Router
  my $r = $self->routes;

  # Normal route to controller
  $r->get('/')->to('example#welcome');

  my $api = $r->any('/api');

  $api->resource('user');
}

sub setup_database ($self) {

  $self->attr(pg => sub {
    state $pg = Mojo::Pg->new($self->config->{database}{url});
  });
  $self->pg->migrations->from_file($self->home->child('migrations.sql'))->migrate;

  $self->attr(orm => sub {
    state $orm = Doojon::Model::ORM->connect(
      $self->pg->dsn, $self->pg->username, $self->pg->password
    );
  });
}

sub add_resource_shortcut ($self) {

  $self->routes->add_shortcut(resource => sub ($r, $name) {
    my $resource = $r->any("/$name")->to("$name#");

    $resource->post('')->to('#create');
    $resource->get('')->to('#read');
    $resource->put('')->to('#update');
    $resource->delete('')->to('#delete');

    return $resource;
  });
}

sub add_api_helpers ($self) {

}

1;
