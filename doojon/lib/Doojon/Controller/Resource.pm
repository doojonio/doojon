package Doojon::Controller::Resource;

use Mojo::Base 'Mojolicious::Controller', -signatures, -async_await;
use Mojo::Util qw(camelize);

has service => sub ($self) {
  $self->app->model->get_dataservice($self->stash('resource_name'));
};

async sub create ($self) {

  my $objs_to_create = $self->req->json;

  if (ref $objs_to_create ne uc 'array') {
    $objs_to_create = [$objs_to_create];
  }

  my ($allowed, $forbidden) = await $self->service->check_create_perm($objs_to_create);
  return $self->reply->forbidden if $forbidden && @$forbidden;

  my $keys = await $self->service->create($objs_to_create);

  $self->render(json => $keys);
}

async sub read ($self) {

  my $fields = $self->service->columns;
  my %search_by;
  for my $fname (keys $fields->%*) {
    next unless my $param_val = $self->param($fname);
    $search_by{$fname} = $param_val;
  }

  my($objects, $forbidden) = await $self->service->read(undef, \%search_by);

  if (not @$objects) {
    return $self->reply->not_found;
  }

  $self->render(json => $objects);
}

async sub update ($self) {

  my $fields = $self->service->columns;
  my %where;
  for my $fname (keys $fields->%*) {
    next unless my $param_val = $self->param($fname);
    $where{$fname} = $param_val;
  }

  my $fields_to_update = $self->req->json;
  return $self->reply->forbidden unless $self->service->check_update_perm($fields_to_update, \%where);

  my $keys = await $self->service->update($fields_to_update, \%where);

  return $self->reply->not_found unless @$keys;

  $self->render(json => $keys);
}

async sub delete ($self) {

  my $fields = $self->service->columns;
  my %where;
  for my $fname (keys $fields->%*) {
    next unless my $param_val = $self->param($fname);
    $where{$fname} = $param_val;
  }

  return $self->reply->forbidden unless $self->service->check_delete_perm(\%where);

  my $keys = await $self->service->delete(\%where);

  return $self->reply->not_found unless @$keys;

  $self->render(json => $keys);
}

1
