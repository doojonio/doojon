package Doojon::Command::openapi;

use Mojo::Base 'Mojolicious::Command', -signatures;

use Carp(qw(croak));
use List::Util qw(any);
use List::Util qw(any);
use Mojo::Template;
use Mojo::Util qw(camelize monkey_patch);
use OpenAPI::Generator;
use Term::ANSIColor qw(:constants);
use YAML::XS qw(Dump);

has description => 'Generate OpenAPI definitions';

sub run ($self, $command) {

  my $method = $self->can('cli_'.$command);
  if (not $method) {
    croak("no such command $command")
  }

  binmode STDOUT, 'utf8';
  $method->($self)
}

sub cli_generate ($self) {

  say '✍️ processing resource routes...';
  my @dss = map {$self->app->model->get_dataservice($_)}
    $self->app->model->list_dataservices;

  my $oa_dataservices = openapi_from(dataservices => {dataservices => \@dss});

  my $openapi = openapi_from(definitions => {
    definitions => [
      $oa_dataservices,
    ],
  });

  $openapi->{openapi} = '3.0.3';
  $openapi->{info}{title} = 'OpenAPI definition for Doojon';
  $openapi->{info}{version} = '0.0.1';

  my $openapi_file = $self->app->home->child('openapi.yml');
  say "[write] $openapi_file";

  $openapi_file->spurt(Dump($openapi));
}

1

__END__
