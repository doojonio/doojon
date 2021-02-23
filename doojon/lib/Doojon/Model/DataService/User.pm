package Doojon::Model::DataService::User;

use Moose;

use Carp qw();
use experimental qw(signatures);

extends q(Doojon::Model::DataService);

has auth_service => (
  is => 'ro',
  isa => 'Doojon::Model::Service::Auth',
  required => 1,
  weak_ref => 1,
);

before create => sub ($self, $vals) {

  $vals->{password} = $self->auth_service->hash_password($vals->{password});
};

1
