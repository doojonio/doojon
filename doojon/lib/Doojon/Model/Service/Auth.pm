package Doojon::Model::Service::Auth;

use Moose;

use experimental qw(signatures);

has password_hasher => (
    is => 'ro',
    required => 1,
);

has user_dataservice => (
    is => 'ro',
    isa => 'Doojon::Model::DataService::User',
    required => 1,
);

sub hash_password ($self, $password) {

  return $self->password_hasher->generate($password);
}

sub password_auth ($self, $username, $password) {

  my($user) = $self->user_dataservice->search({username => $username});

  if(!$user) {
    Carp::croak("no such user $username");
  }

  return $self->password_hasher->validate($user->{password}, $password);
}

1
