package Doojon::Model::DS;

use Mojo::Base -base, -signatures, -async_await;

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

async sub create ($self, $obj) {

  my $res = await $self->pg->db->insert_p($self->table, $obj, {returning => 'id'});
  $res->hash->{id}
}

async sub read ($self, $id) {

  my $res = await $self->pg->db->select_p(
    $self->table,
    undef,
    {id => $id},
    {limit => 1}
  );

  $res->hash
}

async sub update ($self, $id, $new_fields) {

  my $res = await $self->pg->db->update_p(
    $self->table,
    $new_fields,
    {id => $id},
    {returning => $id},
  );

  $res->hash->{id}
}

async sub delete ($self, $id) {

  my $res = await $self->pg->db->delete_p(
    $self->table,
    {id => $id},
    {returning => 'id'}
  );

  $res->hash->{id}
}

async sub search ($self, $columns = undef, $conditions = undef, $options = undef) {
  my $res = await $self->pg->db->select_p(
    $self->table,
    $columns,
    $conditions,
    $options,
  );

  $res->hashes
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
