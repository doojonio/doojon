package Doojon::Controller::Resource;

use Mojo::Base 'Mojolicious::Controller', -signatures, -async_await;
use Mojo::Util qw(camelize);

has service => sub ($self) {
  $self->app->model->get_dataservice($self->stash('resource_name'));
};

async sub create ($self) {

  my $obj_to_create = $self->req->json;
  my $id = await $self->service->create($obj_to_create);

  $self->render(json => {id => $id})
}

async sub read ($self) {

  my $id = $self->param('id');
  my $obj = await $self->service->read($id);

  if (not defined $obj) {
    return $self->reply->not_found;
  }

  $self->render(json => $obj)
}

async sub update ($self) {

  my $id = $self->param('id');
  my $obj = await $self->service->read($id);

  if (!$obj) {
    return $self->reply->not_found;
  }

  my $updated_fields = $self->req->json;
  await $self->service->update($id, $updated_fields);

  $self->render(json => {id => $id});
}

async sub delete ($self) {

  my $id = $self->param('id');
  my $obj = await $self->service->read($id);

  if (!$obj) {
    return $self->reply->not_found;
  }

  my $deleted_object_id = $obj->{id};
  await $self->service->delete($deleted_object_id);

  $self->render(json => {id => $deleted_object_id});
}

async sub search ($self) {

  my $search_obj = $self->req->json;
  my @objects = $self->service->search(
    $search_obj->{conditions},
    $search_obj->{options},
  );

  return $self->render(json => \@objects);
}

1