package Doojon::Model::Dataservice::Challenges;

use Mojo::Base 'Doojon::Model::Dataservice';
# ---
# autogen::start
# ---
has table => 'challenges';
has columns => sub {+{
  id => {
    required => 1,
    has_default => 1,
    is_updatable => 1
  },
  title => {
    required => 1,
    has_default => 0,
    is_updatable => 1
  },
  descr => {
    required => 1,
    has_default => 0,
    is_updatable => 1
  },
  proposed_by => {
    required => 1,
    has_default => 0,
    is_updatable => 1
  },
  create_time => {
    required => 1,
    has_default => 1,
    is_updatable => 1
  },
  update_time => {
    required => 1,
    has_default => 1,
    is_updatable => 1
  },
}};
# ---
# autogen::end
# ---

1
