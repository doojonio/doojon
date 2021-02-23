use Mojo::Base -strict;

use Test::More;
use Test::Mojo;

my $t = Test::Mojo->new('Doojon');

subtest password_auth => sub {

  my %user = (
    username => 'Anton',
    password => 'password',
    email => 'tosha.fedotov.2000@gmail.com',
  );
  $t->post_ok('/api/user', json => \%user)
    ->status_is(200);

  my %creds = (
    username => $user{username},
    password => $user{password},
  );
  $t->post_ok('/api/auth/password', json => \%creds)
    ->status_is(200);
};

done_testing();
