package Doojon::Model::Dataservice;

use Mojo::Base -base, -signatures, -async_await;

use Carp qw(croak);
use List::Util qw(any);

has 'pg';
has 'table' => sub {croak 'no table specified for dataservice'};
has 'columns' => sub {croak 'no columns specified for dataservice'};

async sub check_create_perm ($self, $obj) {
  1
}
async sub create ($self, $obj) {

  if (not await $self->check_create_perm($obj)) {
    croak("no rights to create objects")
  }

  my $res = await $self->pg->db->insert_p($self->table, $obj, {returning => 'id'});
  $res->hash->{id}
}

async sub check_read_perm ($self, $id) {
  1
}
async sub read ($self, $id) {

  if (not await $self->check_read_perm($id)) {
    croak("no rights to read object $id")
  }
  my $res = await $self->pg->db->select_p(
    $self->table,
    undef,
    {id => $id},
    {limit => 1}
  );

  $res->hash
}

async sub check_update_perm ($self, $id, $new_fields) {
  1
}
async sub update ($self, $id, $new_fields) {

  if (not await $self->check_update_perm($id, $new_fields)) {
    croak("no rights to update $id")
  }

  my $res = await $self->pg->db->update_p(
    $self->table,
    $new_fields,
    {id => $id},
    {returning => $id},
  );

  $res->hash->{id}
}

async sub check_delete_perm ($self, $id) {
  1
}
async sub delete ($self, $id) {

  if (not await $self->check_delete_perm($id)) {
    croak("no rights to delete $id")
  }

  my $res = await $self->pg->db->delete_p(
    $self->table,
    {id => $id},
    {returning => 'id'}
  );

  $res->hash->{id}
}

async sub search ($self, $columns = undef, $conditions = undef, $options = undef) {
  if (defined($columns) and (not any {$_ eq 'id'} $columns)) {
    push $columns->@*, 'id';
  }
  my $res = await $self->pg->db->select_p(
    $self->table,
    $columns,
    $conditions,
    $options,
  );

  #TODO: perm checks
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

1
