package Doojon::Model::Dataservice::PostComments;

use Mojo::Base 'Doojon::Model::Dataservice';
# ---
# autogen::start
# ---
has table => 'post_comments';
has columns => sub {+{
  id => {
    required => 1,
    has_default => 1,
    is_updatable => 1
  },
  post_id => {
    required => 1,
    has_default => 0,
    is_updatable => 1
  },
  message => {
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
