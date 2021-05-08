use Mojo::Base -strict;

use Test::More;
use Test::Mojo;

use constant useremail => 'test@doojon.com';
use constant userpw    => 'password';

my $t = Test::Mojo->new('Doojon');

# create account if not exists and login
my $accounts = $t->app->model->get_courier('accounts');

unless (eval { $accounts->get_account({email => useremail}) }) {
  $accounts->create_account({email => useremail, password => userpw});
}

$accounts->auth({email => useremail, password => userpw});

# change cookie domain to 127.0.0.1
for my $cookie ($accounts->ua->cookie_jar->all->@*) {
  $cookie->domain('127.0.0.1');
  $t->ua->cookie_jar->add($cookie);
}

subtest resource => sub {

  my $account = $accounts->get_account({email => useremail});
  my %profile = (id => $account->{id}, username => 'Anton',);

  $t->post_ok('/api/resource/profiles', json => \%profile)->status_is(200)->json_has('/id');

  my $profile_search = {
    fields     => [qw(id username)],
    conditions => {username => $profile{username},},
    options    => {order_by => 'username', limit => 10,}
  };
  $t->post_ok('/api/resource/profiles/search', json => $profile_search)->status_is(200)->json_has('/0');

  is $t->tx->res->json('/0/username'), $profile{username};

  my $created_profile_id = $t->tx->res->json('/0/id');

  $t->get_ok('/api/resource/profiles', form => {id => $created_profile_id})->status_is(200)->json_has('/username');

  $t->delete_ok('/api/resource/profiles', form => {id => $created_profile_id})->status_is(200);
};

$accounts->logout;

subtest without_cookie => sub {

  $t->ua->cookie_jar->empty;
  $t->get_ok('/api/resource/profiles');
};

done_testing();
