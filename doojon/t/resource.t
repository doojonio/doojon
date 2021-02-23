use Mojo::Base -strict;

use Test::More;
use Test::Mojo;

my $t = Test::Mojo->new('Doojon');

subtest resource => sub {

  my $user = {
    username => 'Anton',
    password => 'password',
    email => 'tosha.fedotov.2000@gmail.com',
  };
  $t->post_ok('/api/user', json => $user)
    ->status_is(200)
    ->json_has('/id');

  my $user_search = {
    conditions => {
      username => $user->{username},
    },
    options => {
      order_by => 'username',
    }
  };
  $t->post_ok('/api/user/search', json => $user_search)
    ->status_is(200)
    ->json_has('/0');

  is $t->tx->res->json('/0/username'), $user->{username};

  my $created_user_id = $t->tx->res->json('/0/id');

  $t->get_ok('/api/user', form => {id => $created_user_id})
    ->status_is(200)
    ->json_has('/username');

  $t->delete_ok('/api/user', form => {id => $created_user_id})
    ->status_is(200);
};

done_testing();
