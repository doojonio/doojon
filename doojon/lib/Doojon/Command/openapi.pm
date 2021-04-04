package Doojon::Command::openapi;

use Mojo::Base 'Mojolicious::Command', -signatures;

use Carp(qw(croak));
use List::Util qw(any);
use List::Util qw(any);
use Mojo::Template;
use Mojo::Util qw(camelize monkey_patch);
use Term::ANSIColor qw(:constants);

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
  my @dss = map {$self->app->model->get_dataservice($_)} $self->app->model->list_dataservices;

  monkey_patch 'Mojo::Template::Sandbox',
    to_openapi_type => sub ($type) {
      if (any {$_ eq $type} qw(timestamp date)) {
        $type = 'string'
      }
      $type
    },
    has_id => sub ($ds) {
      !!$ds->columns->{id}
    },;

  my $resources_schema = $self->render_data('resources.ep', {
    dss => \@dss
  });

  print $resources_schema;
}

1

__DATA__
@@ resources.ep
% for my $ds ($dss->@*) {
  /api/resource/<%=$ds->table%>:
    post:
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
  % if (has_id($ds)) {
    get:
      parameters:
        - name: id
          in: query
          schema:
            type: <%= to_openapi_type($ds->columns->{id}{data_type})%>
  % }
% }
