package Doojon::Courier::Accounts;

use Mojo::Base -base, -signatures, -async_await;

use Carp qw(croak);
use Mojo::UserAgent;
use Mojo::URL;

has host => sub { croak 'accounts service host is not specified' };

async sub get_account ($self, $account_id) {

  my $url = Mojo::Url->new;
  $url->host($self->host);
  $url->path('/api/account');
  $url->query(id => $account_id);

  my $tx = await Mojo::UserAgent->new->get_p($url);

  $tx->result->json
}

async sub get_session ($self, $session_id) {

  my $url = Mojo::URL->new;
  $url->host($self->host);
  $url->path('/api/session');

  my $tx = await Mojo::UserAgent->new->get_p($url => {'X-Session' => $session_id});

  $tx->result->json
}

1
