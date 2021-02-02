package Doojon::Model::ORM::Result::User;

use Moose;
use MooseX::MarkAsMethods autoclean => 1;
use MooseX::NonMoose;

extends 'DBIx::Class::Core';

__PACKAGE__->table('users');
__PACKAGE__->add_columns(
    id => {
        data_type => 'integer',
        is_auto_increment => 1,
    },
    username => {
        data_type => 'varchar',
        size => 32,
    },
    email => {
        data_type => 'varchar',
        size => 500,
    },
    password => {
        data_type => 'text'
    },
);
__PACKAGE__->set_primary_key('id');
__PACKAGE__->add_unique_constraints([qw(username email)]);

__PACKAGE__->meta->make_immutable;

1