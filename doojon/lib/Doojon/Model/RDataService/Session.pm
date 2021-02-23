package Doojon::Model::RDataService::Session;

use Moose;
use experimental qw(signatures);

extends 'Doojon::Model::RDataService';

use Carp qw();

has tokenizer => (
  is => 'ro',
  isa => 'Session::Token',
  required => 1,
);

has storage_key => (
  is => 'ro',
  isa => 'Str',
  required => 1,
);

sub create ($self, $user_id) {

  if (!$user_id) {
    Carp::croak("invalid user_id passed: '$user_id'")
  }
  my $token = $self->tokenizer->get;
  $self->redis->hset($self->storage_key, $token, $user_id);
  return $token;
}

sub read ($self, $session) {

  return $self->redis->hget($self->storage_key, $session);
}

sub update {

  Carp::croak('session updating is forbidden');
}

# TODO delete sesions


1
