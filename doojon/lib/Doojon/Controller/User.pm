package Doojon::Controller::User;

use Mojo::Base 'Mojolicious::Controller', -signatures;

sub create ($self) {

  my $user = $self->req->json;
  my $repo = $self->app->orm->users;
  my $result = $repo->create($user);

  $self->render(json => $result->id);
}

sub read ($self) {

  my $user_id = $self->param('id');
  my $user = $self->app->orm->users->find($user_id);
  if (!$user) {
    return $self->reply->not_found;
  }

  return +{$user->get_columns};
}

sub update ($self) {


}

sub delete ($self) {


}

1