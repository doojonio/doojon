package Doojon::Command::migration;

use Mojo::Base 'Mojolicious::Command', -signatures;

use Carp(qw(croak));
use Mojo::File qw(path);

has description => 'Database migrations managment CLI';
has usage => sub ($self) { 'ss'};

sub run ($self, $command) {

  my $method = $self->can($command);
  if (not $method) {
    croak("no such command $command")
  }

  $method->($self);
}

sub redo ($self) {

  my $migrations = $self->app->model->ioc->resolve(service => 'pg')->migrations->from_file(
    path($self->app->home, 'doojon.sql')
  );

  $migrations->migrate(0)->migrate(1);
}

1