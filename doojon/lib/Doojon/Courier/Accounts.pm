package Doojon::Courier::Accounts;

use Mojo::Base -base, -signatures, -async_await;

use Mojo::Exception qw(raise);
use Mojo::URL;
use Mojo::UserAgent;

has host => sub { raise q(E::MissingParameter), 'host' };
has scheme => 'http';
has port => 80;

has ua => sub { Mojo::UserAgent->new };

async sub auth_p ($self, $credentials) {

  for my $required (qw(email password)) {
    raise q(E::MissingParameter) => $required unless $credentials->{$required};
  }

  my $url = $self->url_for_auth;
  my $tx = await $self->ua->post_p($url, {}, json => $credentials);

  if ($tx->res->code != 200) {
    raise q(E::UnsuccessfullRequest) => join(':', $tx->res->code, $tx->res->message);
  }

  $tx->result->json
}

sub auth ($self, $credentials) {

  for my $required (qw(email password)) {
    raise q(E::MissingParameter) => $required unless $credentials->{$required};
  }

  my $url = $self->url_for_auth;
  my $tx = $self->ua->post($url, {}, json => $credentials);

  if ($tx->res->code != 200) {
    raise q(E::UnsuccessfullRequest) => join(':', $tx->res->code, $tx->res->message);
  }

  $self->ua->cookie_jar->collect($tx);

  $tx->result->json
}

async sub logout_p ($self) {

  return unless $self->ua->cookie_jar->list->@*;

  my $tx = await $self->ua->delete_p($self->url_for_logout);

  if ($tx->res->code != 200) {
    raise q(E::UnsuccessfullRequest) => join(':', $tx->res->code, $tx->res->message);
  }

  return $tx->result->json
}

sub logout ($self) {

  return unless $self->ua->cookie_jar->all->@*;

  my $tx = $self->ua->delete($self->url_for_logout);

  if ($tx->res->code != 200) {
    raise q(E::UnsuccessfullRequest) => join(':', $tx->res->code, $tx->res->message);
  }

  return $tx->result->json
}

async sub create_account_p ($self, $account) {

  for my $required (qw(email password)) {
    raise q(E::MissingParameter) => $required unless $account->{$required};
  }

  my $url = $self->url_for_creating_account;
  my $tx = await $self->ua->post_p($url, {}, json => $account);

  if ($tx->res->code != 200) {
    raise q(E::UnsuccessfullRequest) => join(':', $tx->res->code, $tx->res->message);
  }

  $tx->result->json
}

sub create_account ($self, $account) {

  for my $required (qw(email password)) {
    raise q(E::MissingParameter) => $required unless $account->{$required};
  }

  my $url = $self->url_for_creating_account;
  my $tx = $self->ua->post($url, {}, json => $account);

  if ($tx->res->code != 200) {
    raise q(E::UnsuccessfullRequest) => join(':', $tx->res->code, $tx->res->message);
  }

  $tx->result->json
}

async sub get_account_p ($self, $by) {

  my $url = $self->url_for_getting_account;

  if (my $id = $by->{id}) {
    $url->query({id => $id})
  }
  elsif (my $email = $by->{email}) {
    $url->query({email => $email})
  }
  else {
    raise q(E::MissingParameter) => 'Need id or email';
  }

  my $tx = await $self->ua->get_p($url);

  if ($tx->res->code != 200) {
    raise q(E::UnsuccessfullRequest) => join(':', $tx->res->code, $tx->res->message);
  }

  $tx->result->json
}

sub get_account ($self, $by) {

  my $url = $self->url_for_getting_account;

  if (my $id = $by->{id}) {
    $url->query({id => $id})
  }
  elsif (my $email = $by->{email}) {
    $url->query({email => $email})
  }
  else {
    raise q(E::MissingParameter) => 'Need id or email';
  }

  my $tx = $self->ua->get($url);

  if ($tx->res->code != 200) {
    raise q(E::UnsuccessfullRequest) => join(':', $tx->res->code, $tx->res->message);
  }

  $tx->result->json
}

async sub get_session_p ($self, $session_id) {

  my $url = $self->url_for_getting_session;
  my $tx = await $self->ua->get_p($url => {'X-Session' => $session_id});

  if ($tx->res->code != 200) {
    raise q(E::UnsuccessfullRequest) => join(':', $tx->res->code, $tx->res->message);
  }

  $tx->result->json
}

sub get_session ($self, $session_id) {

  my $url = $self->url_for_getting_session;
  my $tx = $self->ua->get($url => {'X-Session' => $session_id});

  if ($tx->res->code != 200) {
    raise q(E::UnsuccessfullRequest) => join(':', $tx->res->code, $tx->res->message);
  }

  $tx->result->json
}

# ------

sub base_url ($self) {

  Mojo::URL->new
    ->scheme($self->scheme)
    ->host($self->host)
    ->port($self->port)
}

sub url_for_getting_session ($self) {

  $self->base_url->path('api/session')
}

sub url_for_getting_account ($self) {

  $self->base_url->path('api/account')
}

sub url_for_creating_account ($self) {

  $self->base_url->path('api/account')
}

sub url_for_auth ($self) {

  $self->base_url->path('api/auth')
}

sub url_for_logout ($self) {

  $self->base_url->path('api/logout')
}

1
