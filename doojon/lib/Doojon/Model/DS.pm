package Doojon::Model::DS;

use Mojo::Base -base, -signatures;

use Carp qw(croak);
use List::Util qw(any);

has 'entity_class';
has 'pg';

has 'table';
has 'columns';

sub new ($type, @args) {
  my $self = $type->SUPER::new(@args);
  $self->_init_metadata;

  $self
}

sub create ($self, $obj) {
}

sub read ($self, $id) {
}

sub update ($self, $id, $new_fields) {
}

sub delete ($self, $id) {
}

sub search ($self, $conditions = undef, $options = undef) {
}

sub check_myself ($self) {
  my $pg = $self->pg or croak('need pg');
  my $db = $pg->db;

  my $tablename = $self->table;
  my $table = $db->select(
    'pg_tables',
    ['tablename'],
    {schemaname => 'public', tablename => $tablename}
  )->hash;

  croak("no table '$tablename' found in database") unless $table;

  my $defined_columns = $self->columns;
  my $real_columns = $db->select(
    'information_schema.columns',
    ['column_name'],
    {table_name => $tablename}
  )->hashes;

  for my $defined_column_name (keys $defined_columns->%*) {

    if (not any {$_->{column_name} eq $defined_column_name} $real_columns->@*) {
      croak("$defined_column_name is defined but not present in table $tablename");
    }
  }

  1
}

sub _init_metadata($self) {
  my $entity_class = $self->entity_class or croak('need entity class');
  require $entity_class =~ s{::}{/}gr . '.pm';
  no strict 'refs';
  my $table = &{$entity_class.'::table'} || croak("no table in $entity_class");
  my $columns = &{$entity_class.'::columns'} || croak("no columns in $entity_class");

  $self->table($table);
  $self->columns($columns);
}

1
