package Doojon::Model::Service::Session;

use Moose;
use experimental qw(signatures);

use Carp qw();

has redis => (
  is => 'ro',
  isa => 'Redis',
  required => 1,
);

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

# TODO delete sesions


1
