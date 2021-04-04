package Doojon::Model::Dataservice::Profiles;

use Mojo::Base 'Doojon::Model::Dataservice';


# ---
# autogen::start
# ---
has table => 'profiles';
has columns => sub {+{
  id => {
    data_type => 'string',
    has_default => 0,
    is_updatable => 1,
    required => 1
  },
  username => {
    data_type => 'string',
    has_default => 0,
    is_updatable => 1,
    required => 1
  },
  reg_date => {
    data_type => 'date',
    has_default => 0,
    is_updatable => 1,
    required => 1
  },
}};
# ---
# autogen::end
# ---

1
