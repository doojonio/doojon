package Doojon::Model::ORM;

use base qw(DBIx::Class::Schema);
use CLASS;

CLASS->load_namespaces;

sub users {shift->resultset('User')}

1