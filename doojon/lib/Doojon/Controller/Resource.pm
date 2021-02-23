package Doojon::Controller::Resource;

use Mojo::Base 'Mojolicious::Controller', -signatures;
use Mojo::Util qw(camelize);

has service => sub ($self) {
  $self->app->model->get_dataservice($self->stash('resource_name'));
};

sub create ($self) {

  my $obj_to_create = $self->req->json;
  my $obj_in_db = $self->service->create($obj_to_create);
  return $self->render(json => {id => $obj_in_db->id});
}

sub read ($self) {

  my $id = $self->param('id');
  my $obj_in_db = $self->service->read($id);

  if (!$obj_in_db) {
    return $self->reply->not_found;
  }

  return $self->render(json => {$obj_in_db->get_columns});
}

sub update ($self) {

  my $id = $self->param('id');
  my $obj_in_db = $self->service->read($id);

  if (!$obj_in_db) {
    return $self->reply->not_found;
  }

  my $updated_fields = $self->req->json;
  $obj_in_db->update($updated_fields);

  return $self->render(json => {id => $obj_in_db->id});
}

sub delete ($self) {

  my $id = $self->param('id');
  my $obj_in_db = $self->service->read($id);

  if (!$obj_in_db) {
    return $self->reply->not_found;
  }

  my $deleted_object_id = $obj_in_db->id;
  $obj_in_db->delete;

  return $self->render(json => {id => $deleted_object_id});
}

sub search ($self) {

  my $search_obj = $self->req->json;
  my @objects = $self->service->search(
    $search_obj->{conditions},
    $search_obj->{options},
  );

  return $self->render(json => \@objects);
}

1