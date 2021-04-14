package OpenAPI::Generator::From::Dataservices;

use Mojo::Base -base, -signatures;

use Carp;
use List::Util qw(any);
use Mojo::JSON qw(true false);
use Mojo::Util qw(camelize);

use constant METHOD_TO_COMPTYPE => {
  post => 'writeable',
  get => 'readable',
  put => 'updatable',
  delete => 'deleted',
};

sub generate ($self, $conf) {

  my $dataservices = $conf->{dataservices} || croak 'need dataservices';
  my %def;

  for my $ds ($dataservices->@*) {
    my $name = $ds->table;
    while (my($method, $type) = each METHOD_TO_COMPTYPE->%*) {
      my $comp = $self->can("_generate_$type")->($self, $ds);
      next unless $comp;
      $def{components}{schemas}{camelize "${name}_$type"} = $comp;

      my $route = $self->can("_generate_$method")->($self, $ds);
      $def{paths}{"/api/resource/${\$ds->table}"}{$method} = $route;
    }
  }

  return \%def;
}

sub _generate_post ($self, $ds) {

  my @primary_keys = _primary_keys($ds);
  my %response_properties;

  for my $key (@primary_keys) {
    $response_properties{$key} = {
      type => _openapi_type($ds->columns->{$key})
    }
  }

  my $tag_name = join(" ", map {camelize $_} split /_/, $ds->table);

  +{
    tags => [$tag_name],
    requestBody => {
      content => {
        'application/json' => {
          schema => {
            '$ref' => '#/components/schemas/'.camelize($ds->table.'_writeable')
          }
        }
      }
    },
    responses => {
      200 => {
        description => "Object with created id/ids (${\join(',',@primary_keys)})",
        content => {
          'application/json' => {
            schema => {
              type => 'object',
              required => \@primary_keys,
              properties => \%response_properties
            }
          }
        }
      }
    }
  }
}

sub _generate_writeable ($self, $ds) {

  my %comp = (
    type => 'object',
    required => [],
    properties => {},
    additionalProperties => false,
  );
  while (my($name, $col) = each $ds->columns->%*) {
    next if $col->{has_default};
    $comp{properties}{$name} = {
      type => _openapi_type($col),
    };
    if ($col->{required} and not $col->{has_default}) {
      push $comp{required}->@*, $name;
    }
  }

  delete $comp{required} unless $comp{required}->@*;

  \%comp
}

sub _generate_get ($self, $ds) {

  my @primary_keys = _primary_keys($ds);
  my $table = $ds->table;

  my @parameters;
  for my $key (@primary_keys) {
    push @parameters, {
      name => $key,
      schema => {
        type => _openapi_type($ds->columns->{$key}),
      },
      description => "id for $table",
      required => true,
      in => 'query',
    }
  }

  my $tag_name = join(" ", map {camelize $_} split /_/, $table);

  +{
    tags => [$tag_name],
    parameters => \@parameters,
    responses => {
      200 => {
        description => "Readable object for $table",
        content => {
          'application/json' => {
            schema => {
              '$ref' => '#/components/schemas/'.camelize("${table}_readable"),
            }
          }
        }
      }
    }
  }
}

sub _generate_readable ($self, $ds) {

  my %comp = (
    type => 'object',
    required => [],
    properties => {},
    additionalProperties => false,
  );
  while (my($name, $col) = each $ds->columns->%*) {
    $comp{properties}{$name} = {
      type => _openapi_type($col),
    };
    if ($col->{required}) {
      push $comp{required}->@*, $name
    }
  }

  delete $comp{required} unless $comp{required}->@*;

  \%comp
}

sub _generate_put ($self, $ds) {
  my @primary_keys = _primary_keys($ds);
  my $table = $ds->table;

  my @parameters;
  for my $key (@primary_keys) {
    push @parameters, {
      name => $key,
      schema => {
        type => _openapi_type($ds->columns->{$key}),
      },
      description => "id for $table",
      required => true,
      in => 'query',
    }
  }

  my %response_properties;

  for my $key (@primary_keys) {
    $response_properties{$key} = {
      type => _openapi_type($ds->columns->{$key})
    }
  }

  my $tag_name = join(" ", map {camelize $_} split /_/, $table);

  +{
    tags => [$tag_name],
    parameters => \@parameters,
    responses => {
      200 => {
        description => "Object with created id/ids (${\join(',',@primary_keys)})",
        content => {
          'application/json' => {
            schema => {
              type => 'object',
              required => \@primary_keys,
              properties => \%response_properties
            }
          }
        }
      }
    }
  }
}

sub _generate_updatable ($self, $ds) {

  my %comp = (
    type => 'object',
    required => [],
    properties => {},
    additionalProperties => false,
    minProperties => 1,
  );
  while (my($name, $col) = each $ds->columns->%*) {
    next if ($col->{has_default} or $col->{is_primary_key} or not $col->{is_updatable});
    $comp{properties}{$name} = {type => _openapi_type($col)};
  }

  return undef unless $comp{properties}->%*;

  delete $comp{required} unless $comp{required}->@*;

  \%comp
}

sub _generate_delete ($self, $ds) {

  my @primary_keys = _primary_keys($ds);
  my $table = $ds->table;

  my @parameters;
  for my $key (@primary_keys) {
    push @parameters, {
      name => $key,
      schema => {
        type => _openapi_type($ds->columns->{$key}),
      },
      description => "id for $table",
      required => true,
      in => 'query',
    }
  }

  my %response_properties;

  for my $key (@primary_keys) {
    $response_properties{$key} = {
      type => _openapi_type($ds->columns->{$key})
    }
  }

  my $tag_name = join(" ", map {camelize $_} split /_/, $table);

  +{
    tags => [$tag_name],
    parameters => \@parameters,
    responses => {
      200 => {
        description => "Object with created id/ids (${\join(',',@primary_keys)})",
        content => {
          'application/json' => {
            schema => {
              type => 'object',
              required => \@primary_keys,
              properties => \%response_properties
            }
          }
        }
      }
    }
  }
}

sub _generate_deleted ($self, $ds) {

  my @primary_keys = _primary_keys($ds);

  my %comp = (
    type => 'object',
    required => \@primary_keys,
    additionalProperties => false,
    properties => {}
  );

  for my $key (@primary_keys) {
    $comp{properties}{$key} = {
      type => _openapi_type($ds->columns->{$key})
    }
  }

  \%comp
}

sub _openapi_type ($column) {

  my $type = $column->{data_type};
  if (any {$_ eq $type} qw(timestamp date)) {
    $type = 'string'
  }
  $type
}

sub _primary_keys ($ds) {

  grep {$ds->columns->{$_}{is_primary_key}} keys $ds->columns->%*
}

1
