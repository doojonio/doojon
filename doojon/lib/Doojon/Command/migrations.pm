package Doojon::Command::migrations;

use Mojo::Base 'Mojolicious::Command', -signatures;

use Carp(qw(croak));
use Mojo::File qw(path);
use Term::ANSIColor qw(:constants);

has description => 'Database migrations managment CLI';

sub run ($self, $command) {

  my $method = $self->can('cli_'.$command);
  if (not $method) {
    croak("no such command $command")
  }

  $method->($self);
}

sub cli_run ($self) {

  my $migrations = $self->app->model->ioc->resolve(service => 'pg')->migrations->from_file(
    path($self->app->home, 'doojon.sql')
  );

  $migrations->migrate;
  print GREEN "done\n";
}

sub cli_redo ($self) {

  my $migrations = $self->app->model->ioc->resolve(service => 'pg')->migrations->from_file(
    path($self->app->home, 'doojon.sql')
  );

  $migrations->migrate(0)->migrate;
  print GREEN "done\n";
}

sub cli_check ($self) {

  my $ds_container = $self->app->model->ioc->fetch('/dataservices');
  my @errors;
  for my $ds_name ($ds_container->get_service_list) {
    my $ds = $ds_container->resolve(service => $ds_name);
    my $is_ds_ok = eval {$ds->check_myself};
    push @errors, $@ unless $is_ds_ok;
  }

  if (scalar @errors) {
    print RED, @errors, RESET;
  }
  else {
    print GREEN "database is ok\n", RESET;
  }
}

1