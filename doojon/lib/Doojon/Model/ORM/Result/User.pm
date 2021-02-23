package Doojon::Model::ORM::Result::User;

use parent qw(DBIx::Class::Core);
use constant User => __PACKAGE__;

User->table('users');
User->add_columns(
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
User->set_primary_key('id');
User->add_unique_constraints([qw(username email)]);

1
