package Doojon::Model::Dataservice;

use Mojo::Base -base, -signatures, -async_await;

use List::Util qw(any);
use Mojo::Exception qw(raise);
use Mojo::Promise;

has q(columns)      => sub { raise q(E::NotInitialized), 'no columns specified for dataservice' };
has q(primary_keys) => sub ($self) { [grep { $self->columns->{$_}{is_primary_key} } keys $self->columns->%*] };
has q(table)        => sub { raise q(E::NotInitialized), 'no table specified for dataservice' };
has q(mstate);
has q(pg);

async sub check_create_perm ($self, $objects) {
  $objects, [];
}
async sub create ($self, $objects) {

  my ($passed, $forbidden) = await $self->check_create_perm($objects);

  raise q(E::CreateForbidden) if $forbidden && @$forbidden;

  my @insert_promises;

  for (@$passed) {
    my $promise = $self->pg->db->insert_p($self->table, $_, {returning => $self->primary_keys});
    push @insert_promises, $promise;
  }

  Mojo::Promise->all(@insert_promises)->then(sub { [map { $_->[0]->hash } @_] });
}

async sub check_read_perm ($self, $objects) {
  $objects, [];
}

async sub read ($self, $what = undef, $conditions = undef, $options = undef) {

  raise q(E::InvalidParameter) if defined($what) && ref($what) ne uc 'array';

  # primary keys should be selected for permission checks
  if (defined $what) {
    for my $pkey ($self->primary_keys->@*) {
      push @$what, $pkey unless any { $_ eq $pkey } @$what;
    }
  }

  my $res = await $self->pg->db->select_p($self->table, $what, $conditions, $options);

  return await $self->check_read_perm($res->hashes);
}

async sub check_update_perm ($self, $fields, $where) {
  1;
}
async sub update ($self, $fields, $where) {

  raise q(E::UpdateForbidden) unless await $self->check_update_perm($fields, $where);

  my $res = await $self->pg->db->update_p($self->table, $fields, $where, {returning => $self->primary_keys});

  $res->hashes;
}

async sub check_delete_perm ($self, $where) {
  1;
}
async sub delete ($self, $where) {

  raise q(E::DeleteForbidden) unless await $self->check_delete_perm($where);

  my $res = await $self->pg->db->delete_p($self->table, $where, {returning => $self->primary_keys});

  $res->hashes;
}

sub check_myself ($self) {
  my $pg = $self->pg or croak('need pg');
  my $db = $pg->db;

  my $tablename = $self->table;
  my $table     = $db->select('pg_tables', ['tablename'], {schemaname => 'public', tablename => $tablename})->hash;

  croak("no table '$tablename' found in database") unless $table;

  my $defined_columns = $self->columns;
  my $real_columns    = $db->select('information_schema.columns', ['column_name'], {table_name => $tablename})->hashes;

  for my $defined_column_name (keys $defined_columns->%*) {
    if (not any { $_->{column_name} eq $defined_column_name } $real_columns->@*) {
      croak("$defined_column_name is defined but not present in table $tablename");
    }
  }

  1;
}

1
