package Doojon::Model::Dataservice::Profiles;

use Mojo::Base 'Doojon::Model::Dataservice';
# ---
# autogen::start
# ---
has table => 'profiles';
has columns => sub {+{
  id => {
    required => 1,
    has_default => 0,
    is_updatable => 1
  },
  username => {
    required => 1,
    has_default => 0,
    is_updatable => 1
  },
  reg_date => {
    required => 1,
    has_default => 0,
    is_updatable => 1
  },
}};
# ---
# autogen::end
# ---

1
