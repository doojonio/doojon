package Doojon::Controller::Resource;

use Mojo::Base 'Mojolicious::Controller', -signatures;
use Mojo::Util qw(camelize);

has model => sub ($self) {$self->app->orm->resultset(camelize($self->stash('model')))};

sub create ($self) {

  my $obj_to_create = $self->req->json;
  my $obj_in_db = $self->model->create($obj_to_create);
  return $self->render(json => {$obj_in_db->get_columns});
}

sub read ($self) {

  my $id = $self->param('id');
  my $obj_in_db = $self->model->find($id);

  if (!$obj_in_db) {
    return $self->reply->not_found;
  }

  return $self->render(json => {$obj_in_db->get_columns});
}

sub update ($self) {

  my $id = $self->param('id');
  my $obj_in_db = $self->model->find($id);

  if (!$obj_in_db) {
    return $self->reply->not_found;
  }

  my $updated_fields = $self->req->json;
  $obj_in_db->update($updated_fields);

  return $self->render(json => {$obj_in_db->get_columns});
}

sub delete ($self) {

  my $id = $self->param('id');
  my $obj_in_db = $self->model->find($id);

  if (!$obj_in_db) {
    return $self->reply->not_found;
  }

  my $deleted_object_id = $obj_in_db->id;
  $obj_in_db->delete;

  return $self->render(json => $deleted_object_id);
}

1