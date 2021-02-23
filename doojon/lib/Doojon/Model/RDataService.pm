package Doojon::Model::RDataService;

use Moose;
use experimental qw(signatures);

use Carp qw();

has redis => (
  is => 'ro',
  isa => 'Redis',
  required => 1,
);

# TODO common definition for this methods
sub create {Carp::croak('abstract method called')}
sub read {Carp::croak('abstract method called')}
sub update {Carp::croak('abstract method called')}
sub delete {Carp::croak('abstract method called')}

1
