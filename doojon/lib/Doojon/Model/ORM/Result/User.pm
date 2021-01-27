package Doojon::Model::ORM::Result::User;

use base qw(DBIx::Class::Core);
use CLASS;

CLASS->table('users');
CLASS->add_columns(
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
CLASS->set_primary_key('id');
CLASS->add_unique_constraints([qw(username email)]);

1