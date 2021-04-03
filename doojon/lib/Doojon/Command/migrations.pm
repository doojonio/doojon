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

  $method->($self);
}

sub cli_runc ($self) {
  $self->cli_run;
  $self->cli_check;
}
sub cli_redoc ($self) {
  $self->cli_redo;
  $self->cli_check;
}

sub cli_run ($self) {

  $self->migrations->migrate;
  print GREEN "done\n", RESET;
}

sub cli_redo ($self) {

  $self->migrations->migrate(0)->migrate;
  print GREEN "done\n", RESET;
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