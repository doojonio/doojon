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
use Doojon::Courier::Accounts;

has 'config';
has 'ioc';

sub new ($type, @args) {
  my $self = $type->SUPER::new(@args);

  my $db_conf = $self->config->{database};
  my $redis_conf = $self->config->{redis};
  my $couriers_conf = $self->config->{couriers};

  my $ioc = container 'ioc' => as {
    container services => as {};
    container dataservices => as {};
    container couriers => as {
      service accounts => (
        block => sub {
          Doojon::Courier::Accounts->new(
            $couriers_conf->{accounts}->%*
          )
        }
      );
    };

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

  $self->ioc->resolve(service => "services/$name")
}

sub get_dataservice ($self, $name) {

  $self->ioc->resolve(service => "dataservices/$name")
}

sub get_courier ($self, $name) {

  $self->ioc->resolve(service => "couriers/$name")
}

sub list_dataservices($self) {

  $self->ioc->fetch('/dataservices')->get_service_list;
}

sub ds_entities_classes ($self) {

  findsubmod 'Doojon::Model::Dataservice';
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
        class => $class,
        dependencies => {
          pg => depends_on('/pg'),
        },
      )
    );
  }
}

1
