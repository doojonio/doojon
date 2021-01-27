package Doojon;
use Mojo::Base 'Mojolicious', -signatures;

use Mojo::Pg;
use Doojon::Model::ORM;

# This method will run once at server start
sub startup ($self) {

  # Load configuration from config file
  my $config = $self->plugin('NotYAMLConfig');

  $self->setup_database;

  # Configure the application
  $self->secrets($config->{secrets});

  # Router
  my $r = $self->routes;

  # Normal route to controller
  $r->get('/')->to('example#welcome');
}

sub setup_database($self) {

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

1;
