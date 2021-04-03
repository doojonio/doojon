package Doojon::Model::Dataservice::Posts;

use Mojo::Base 'Doojon::Model::Dataservice';
# ---
# autogen::start
# ---
has table => 'posts';
has columns => sub {+{
  id => {
    required => 1,
    has_default => 1,
    is_updatable => 1
  },
  challenge_id => {
    required => 1,
    has_default => 0,
    is_updatable => 1
  },
  title => {
    required => 1,
    has_default => 0,
    is_updatable => 1
  },
  body => {
    required => 1,
    has_default => 0,
    is_updatable => 1
  },
  writed_by => {
    required => 1,
    has_default => 0,
    is_updatable => 1
  },
  create_time => {
    required => 1,
    has_default => 1,
    is_updatable => 1
  },
}};
# ---
# autogen::end
# ---

1
