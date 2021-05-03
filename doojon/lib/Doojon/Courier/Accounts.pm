package Doojon::Courier::Accounts;

use Mojo::Base -base, -signatures, -async_await;

use Doojon::Courier::Accounts::Exception;
use Mojo::Exception qw(raise);
use Mojo::URL;
use Mojo::UserAgent;

has host => sub { raise MissingParameter, 'host' };
has scheme => 'http';
has port => 80;

has ua => sub { Mojo::UserAgent->new };

async sub auth_p ($self, $credentials) {

  for my $required (qw(email password)) {
    raise MissingParameter => $required unless $credentials->{$required};
  }

  my $url = $self->url_for_auth;
  my $tx = await $self->ua->post_p($url, {}, json => $credentials);

  if ($tx->res->code != 200) {
    raise UnsuccessfullRequest => join(':', $tx->res->code, $tx->res->message);
  }

  $tx->result->json
}

sub auth ($self, $credentials) {

  for my $required (qw(email password)) {
    raise MissingParameter => $required unless $credentials->{$required};
  }

  my $url = $self->url_for_auth;
  my $tx = $self->ua->post($url, {}, json => $credentials);

  if ($tx->res->code != 200) {
    raise UnsuccessfullRequest => join(':', $tx->res->code, $tx->res->message);
  }

  $self->ua->cookie_jar->collect($tx);

  $tx->result->json
}

async sub create_account_p ($self, $account) {

  for my $required (qw(email password)) {
    raise MissingParameter => $required unless $account->{$required};
  }

  my $url = $self->url_for_creating_account;
  my $tx = await $self->ua->post_p($url, {}, json => $account);

  if ($tx->res->code != 200) {
    raise UnsuccessfullRequest => join(':', $tx->res->code, $tx->res->message);
  }

  $tx->result->json
}

sub create_account ($self, $account) {

  for my $required (qw(email password)) {
    raise MissingParameter => $required unless $account->{$required};
  }

  my $url = $self->url_for_creating_account;
  my $tx = $self->ua->post($url, {}, json => $account);

  if ($tx->res->code != 200) {
    raise UnsuccessfullRequest => join(':', $tx->res->code, $tx->res->message);
  }

  $tx->result->json
}

async sub get_account_p ($self, $account_id) {

  my $url = $self->url_for_getting_account($account_id);
  my $tx = await $self->ua->get_p($url);

  if ($tx->res->code != 200) {
    raise UnsuccessfullRequest => join(':', $tx->res->code, $tx->res->message);
  }

  $tx->result->json
}

sub get_account ($self, $account_id) {

  my $url = $self->url_for_getting_account($account_id);
  my $tx = $self->ua->get($url);

  if ($tx->res->code != 200) {
    raise UnsuccessfullRequest => join(':', $tx->res->code, $tx->res->message);
  }

  $tx->result->json
}

async sub get_session_p ($self, $session_id) {

  my $url = $self->url_for_getting_session;
  my $tx = await $self->ua->get_p($url => {'X-Session' => $session_id});

  if ($tx->res->code != 200) {
    raise UnsuccessfullRequest => join(':', $tx->res->code, $tx->res->message);
  }

  $tx->result->json
}

sub get_session ($self, $session_id) {

  my $url = $self->url_for_getting_session;
  my $tx = $self->ua->get($url => {'X-Session' => $session_id});

  if ($tx->res->code != 200) {
    raise UnsuccessfullRequest => join(':', $tx->res->code, $tx->res->message);
  }

  $tx->result->json
}

# ------

sub url_for_getting_session ($self) {

  Mojo::URL->new
    ->scheme($self->scheme)
    ->host($self->host)
    ->port($self->port)
    ->path('api/session');
}

sub url_for_getting_account ($self, $account_id) {

  Mojo::URL->new
    ->scheme($self->scheme)
    ->host($self->host)
    ->port($self->port)
    ->path('api/account')
    ->query(id => $account_id)
}

sub url_for_creating_account ($self) {

  Mojo::URL->new
    ->scheme($self->scheme)
    ->host($self->host)
    ->port($self->port)
    ->path('api/account')
}

sub url_for_auth ($self) {

  Mojo::URL->new
    ->scheme($self->scheme)
    ->host($self->host)
    ->port($self->port)
    ->path('api/auth')
}

1
