package Doojon::Model::ORM;

use Moose;
use MooseX::MarkAsMethods autoclean => 1;

extends 'DBIx::Class::Schema';

__PACKAGE__->load_namespaces;
__PACKAGE__->meta->make_immutable;

sub users {shift->resultset('User')}

1