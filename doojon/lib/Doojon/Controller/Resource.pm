package Doojon::Controller::Resource;

use Mojo::Base 'Mojolicious::Controller', -signatures;

sub create ($self) {

  return $self->render(json => $self->stash('model'));
}

sub read ($self) {

  return $self->render(json => $self->stash('model'));
}

sub update ($self) {

  return $self->render(json => $self->stash('model'));
}

sub delete ($self) {

  return $self->render(json => $self->stash('model'));
}

1