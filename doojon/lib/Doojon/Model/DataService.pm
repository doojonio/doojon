package Doojon::Model::DataService;

use Moose;

use experimental qw(signatures);
use Carp qw();

has result_name => (
  is => 'ro',
  isa => 'Str',
  required => 1,
);

has orm => (
  is => 'ro',
  required => 1,
);

sub create ($self, $obj) {

  return $self->_resultset->create($obj);
}

sub read ($self, $id) {

  return $self->_resultset->find($id);
}

sub update ($self, $id, $new_fields) {

  my $obj = $self->_resultset->find($id);
  if (!$obj) {
    my $result_name = $self->result_name;
    Carp::croak("resultset $result_name hasn't record with id $id");
  }

  return $obj->update($new_fields);
}

sub delete ($self, $id) {

  my $obj = $self->_resultset->find($id);
  if (!$obj) {
    my $result_name = $self->result_name;
    Carp::croak("resultset $result_name hasn't record with id $id");
  }

  return $obj->delete;
}

sub search ($self, $conditions = undef, $options = undef) {

  return map {
    +{$_->get_columns}
  } $self->_resultset->search($conditions, $options)->all;
}

sub _resultset ($self) {

  return $self->orm->resultset($self->result_name);
}

1
