package Doojon::Model::Dataservice::PostCommentLikes;

use Mojo::Base 'Doojon::Model::Dataservice';
# ---
# autogen::start
# ---
has table => 'post_comment_likes';
has columns => sub {+{
  comment_id => {
    required => 1,
    has_default => 0,
    is_updatable => 1
  },
  liked_by => {
    required => 1,
    has_default => 0,
    is_updatable => 1
  },
}};
# ---
# autogen::end
# ---

1
