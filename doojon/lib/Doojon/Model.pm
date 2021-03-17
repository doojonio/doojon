package Doojon::Model;

use Bread::Board;
use Mojo::Base -base, -signatures;

use Carp qw(croak);
use List::Util qw(any);
use Module::Find qw(findsubmod);
use Mojo::IOLoop;
use Mojo::Pg;
use Mojo::Util qw(decamelize);
use Redis;

has 'db_conf';
has 'redis_conf';
has 'ioc';

sub new ($type, @args) {
  my $self = $type->SUPER::new(@args);

  my $db_conf = $self->db_conf;
  my $redis_conf = $self->redis_conf;

  my $ioc = container 'ioc' => as {
    container services => as {};
    container dataservices => as {};

    service pg => (
      lifecycle => 'Singleton',
      block => sub {
        Mojo::Pg->new($db_conf->{url} or croak 'need db url')
      }
    );
    service redis => (
      lifecycle => 'Singleton',
      block => sub {
        Redis->new($redis_conf->%*);
      }
    );
  };

  $self->ioc($ioc);

  $self->_complete_dataservices;

  return $self;
}

sub get_service ($self, $name) {

  $self->ioc->resolve(service => "services/$name");
}

sub get_dataservice ($self, $name) {

  $self->ioc->resolve(service => "dataservices/$name");
}

sub list_dataservices($self) {

  $self->ioc->fetch('/dataservices')->get_service_list;
}

sub ds_entities_classes ($self) {

  findsubmod 'Doojon::Model::DSEntity';
}

sub _complete_dataservices ($self) {

  my $dataservice_container = $self->ioc->fetch('/dataservices');
  my @classes = $self->ds_entities_classes;

  for my $class (@classes) {
    my $ds_name = decamelize((split /::/, $class)[-1]);
    next if $dataservice_container->has_service($ds_name);

    $dataservice_container->add_service(
      service $ds_name => (
        lifecycle => 'Singleton',
        class => 'Doojon::Model::DS',
        dependencies => {
          entity_class => (service entity_class => $class),
          pg => depends_on('/pg'),
        },
      )
    );
  }

  $self->_init_and_check_dataservices;
}

sub _init_and_check_dataservices ($self) {

  my $ds_container = $self->ioc->fetch('/dataservices');
  for my $service_name ($ds_container->get_service_list) {
    my $ds = $ds_container->resolve(service => $service_name);
    $ds->check_myself;
  }
}

1
