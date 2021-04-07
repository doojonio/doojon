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
  my @dss = sort {$a->table cmp $b->table} map {$self->app->model->get_dataservice($_)} $self->app->model->list_dataservices;

  monkey_patch 'Mojo::Template::Sandbox',
    to_openapi_type => sub ($type) {
      if (any {$_ eq $type} qw(timestamp date)) {
        $type = 'string'
      }
      $type
    },
    has_id => sub ($ds) {
      !!$ds->columns->{id}
    },
    ls_required_in_create => sub ($ds) {
      sort grep {$ds->columns->{$_}{required} and not($ds->columns->{$_}{has_default})} keys $ds->columns->%*
    },
    ls_required => sub ($ds) {
      sort grep {$ds->columns->{$_}{required}} keys $ds->columns->%*
    };

  my $resources_paths = $self->render_data('resource_paths.ep', {
    dss => \@dss
  });

  my $paths = $self->render_data('paths.ep', {
    resources_paths => $resources_paths
  });

  my $openapi = $self->render_data('openapi.ep', {
    security_block => '',
    paths_block => $paths,
    components_block => '',
  });

  my $openapi_file = $self->app->home->child('openapi.yml');
  say "[write] $openapi_file";

  $openapi_file->spurt($openapi)
}

1

__DATA__
@@ openapi.ep
openapi: 3.0.3
info:
  title: openapi for doojon.com
  version: 0.0.1
<%=$security_block%>
<%=$paths_block%>
<%=$components_block%>

@@ paths.ep
paths:
<%=$resources_paths%>

@@ resource_paths.ep
% for my $ds ($dss->@*) {
  /api/resource/<%=$ds->table%>:
    post:
      tags: [resource_<%=$ds->table%>]
      description: create-resource for <%=$ds->table%>
      requestBody:
        content:
          application/json:
            schema:
              type: object
              required:
              % for my $field (ls_required_in_create($ds)) {
                - <%=$field%>
              % }
              properties:
              % for my $column (sort keys $ds->columns->%*) { my $info = $ds->columns->{$column};
                <%=$column%>:
                  type: <%=to_openapi_type($info->{data_type})%>
              % }
      responses:
        "200":
          description: <%=has_id($ds) ? 'id of created resource' : 'prints "1" as a sign of success'%>
          content:
            application/json:
              schema:
              % if (has_id($ds)) {
                type: object
                required: [id]
                properties:
                  id:
                    type: <%=to_openapi_type($ds->columns->{id}{data_type})%>
              % }
              % else {
                enum: [1]
              % }
  % if (has_id($ds)) {
    get:
      tags: [resource_<%=$ds->table%>]
      parameters:
        - name: id
          in: query
          schema:
            type: <%= to_openapi_type($ds->columns->{id}{data_type})%>
      responses:
        "200":
          description: fields of record of resource "<%=$ds->table%>"
          content:
            application/json:
              schema:
                type: object
                required:
                % for my $field (ls_required($ds)) {
                  - <%=$field%>
                % }
                properties:
                % for my $column (sort keys $ds->columns->%*) { my $info = $ds->columns->{$column};
                  <%=$column%>:
                    type: <%=to_openapi_type($info->{data_type})%>
                % }
    put:
      tags: [resource_<%=$ds->table%>]
      parameters:
        - name: id
          in: query
          schema:
            type: <%= to_openapi_type($ds->columns->{id}{data_type}) %>
      requestBody:
        content:
          application/json:
            schema:
              type: object
              required:
              % for my $field (ls_required_in_create($ds)) {
                - <%=$field%>
              % }
              properties:
              % for my $column (sort keys $ds->columns->%*) { my $info = $ds->columns->{$column};
                <%=$column%>:
                  type: <%=to_openapi_type($info->{data_type})%>
              % }
      responses:
        "200":
          description: id of the updated record
          content:
            application/json:
              schema:
                type: object
                required: [id]
                properties:
                  id:
                    type: <%= to_openapi_type($ds->columns->{id}{data_type}) %>
    delete:
      tags: [resource_<%=$ds->table%>]
      parameters:
        - name: id
          in: query
          schema:
            type: <%= to_openapi_type($ds->columns->{id}{data_type}) %>
      responses:
        "200":
          description: id of the deleted record
          content:
            application/json:
              schema:
                type: object
                required: [id]
                properties:
                  id:
                    type: <%= to_openapi_type($ds->columns->{id}{data_type}) %>
  % }
% }
