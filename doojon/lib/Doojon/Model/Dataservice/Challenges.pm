package Doojon::Model::Dataservice::Challenges;

use Mojo::Base 'Doojon::Model::Dataservice';


# ---
# autogen::start
# ---
has table => 'challenges';
has columns => sub {+{
  id => {
    data_type => 'string',
    is_primary_key => 1,
    has_default => 1,
    is_updatable => 1,
    required => 1
  },
  title => {
    data_type => 'string',
    has_default => 0,
    is_updatable => 1,
    required => 1
  },
  descr => {
    data_type => 'string',
    has_default => 0,
    is_updatable => 1,
    required => 1
  },
  proposed_by => {
    data_type => 'string',
    has_default => 0,
    is_updatable => 1,
    required => 1
  },
  create_time => {
    data_type => 'timestamp',
    has_default => 1,
    is_updatable => 1,
    required => 1
  },
  update_time => {
    data_type => 'timestamp',
    has_default => 1,
    is_updatable => 1,
    required => 1
  },
}};
# ---
# autogen::end
# ---

1
