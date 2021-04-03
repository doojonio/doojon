package Doojon::Command::migrations;

use Mojo::Base 'Mojolicious::Command', -signatures;

use Carp(qw(croak));
use Term::ANSIColor qw(:constants);

has description => 'Database migrations managment CLI';
has 'migrations';

sub run ($self, $command) {

  my $method = $self->can('cli_'.$command);
  if (not $method) {
    croak("no such command $command")
  }

  $self->migrations($self->app->model->ioc->resolve(service => 'pg')->migrations->from_dir(
    $self->app->home->child('migrations')
  ));

  binmode STDOUT, 'utf8';

  $method->($self);
}

sub cli_run ($self) {

  $self->migrations->migrate;
  print GREEN "👌 done\n", RESET;
}

sub cli_redo ($self) {

  $self->migrations->migrate(0)->migrate;
  print GREEN "👌 done\n", RESET;
}

1
