use Mojo::Base -strict;

use Test::More;
use Test::Mojo;

my $t = Test::Mojo->new('Doojon');

subtest resource => sub {

  my $profile = {
    id => '123e4567-e89b-12d3-a456-426614174000',
    username => 'Anton',
  };
  $t->post_ok('/api/resource/profile', json => $profile)
    ->status_is(200)
    ->json_has('/id');

  my $profile_search = {
    fields => [qw(id username)],
    conditions => {
      username => $profile->{username},
    },
    options => {
      order_by => 'username',
      limit => 10,
    }
  };
  $t->post_ok('/api/resource/profile/search', json => $profile_search)
    ->status_is(200)
    ->json_has('/0');

  is $t->tx->res->json('/0/username'), $profile->{username};

  my $created_profile_id = $t->tx->res->json('/0/id');

  $t->get_ok('/api/resource/profile', form => {id => $created_profile_id})
    ->status_is(200)
    ->json_has('/username');

  $t->delete_ok('/api/resource/profile', form => {id => $created_profile_id})
    ->status_is(200);
};

done_testing();
