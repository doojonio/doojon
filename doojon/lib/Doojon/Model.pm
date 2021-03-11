package Doojon::Model;

use Moose;
use Bread::Board;

use Doojon::Model::ORM qw();
use List::Util qw(any);
use Module::Find qw(findsubmod);
use String::CamelCase qw(decamelize);
use experimental qw(signatures);

extends qw(Bread::Board::Container);

has db_conf => (
  is => 'ro',
  isa => 'HashRef',
  required => 1,
);

has redis_conf => (
  is => 'ro',
  isa => 'HashRef',
  required => 1,
);

sub BUILD {

  my $self = shift;
  my $db_conf = $self->db_conf;
  my $redis_conf = $self->redis_conf;

  container $self => as {

    container services => as {
      service auth => (
        class => 'Doojon::Model::Service::Auth',
        lifecycle => 'Singleton',
        dependencies => {
          password_hasher => (
            service password_hasher => (
              class => 'Crypt::PBKDF2',
              lifecycle => 'Singleton',
            )
          ),
          user_dataservice => depends_on('/dataservices/user'),
        },
      );
      service session => (
        class => 'Doojon::Model::Service::Session',
        lifecycle => 'Singleton',
        dependencies => {
          tokenizer => (
            service tokenizer => (
              class => 'Session::Token',
              lifecycle => 'Singleton', # TODO singleton allowed?
            ),
          ),
          redis => depends_on('/redis/handler'),
          storage_key => literal 'sessions',
        }
      );
    };

    container dataservices => as {
      service user => (
        class => 'Doojon::Model::DataService::User',
        dependencies => {
          result_name => literal 'User',
          auth_service => depends_on('/services/auth'),
          orm => depends_on('/db/orm'),
        },
      );
    };

    container db => as {
      container conf => as {
        service dsn => $db_conf->{dsn};
        service username => $db_conf->{username};
        service password => $db_conf->{password};
      };
      service orm => (
        lifecycle => 'Singleton',
        block => sub {
          my $service = shift;
          Doojon::Model::ORM->connect(
            $service->param('dsn'),
            $service->param('username'),
            $service->param('password'),
          );
        },
        dependencies => {
          dsn => depends_on('conf/dsn'),
          username => depends_on('conf/username'),
          password => depends_on('conf/password'),
        },
      );
    };

    container redis => as {
      container conf => as {
        service server => $redis_conf->{server};
      };
      service handler => (
        lifecycle => 'Singleton',
        class => 'Redis',
        dependencies => {
          server => depends_on('conf/server'),
        }
      );
    };
  };

  $self->_complete_dataservces;

  return $self;
}

sub get_service ($self, $name) {

  $self->resolve(service => "services/$name");
}

sub get_dataservice ($self, $name) {

  $self->resolve(service => "dataservices/$name");
}

sub list_orm_result_classes ($self) {

  findsubmod 'Doojon::Model::ORM::Result';
}

sub _complete_dataservces ($self) {

  my $dataservice_container = $self->fetch('/dataservices');
  my @orm_classes = $self->list_orm_result_classes;

  for my $class (@orm_classes) {
    my $result_name = (split /::/, $class)[-1];
    my $ds_name = decamelize $result_name;

    next if $dataservice_container->has_service($ds_name);

    $dataservice_container->add_service(
      service $ds_name => (
        class => 'Doojon::Model::Service',
        dependencies => {
          result_name => (service result_name => $result_name),
          orm => depends_on('/db/orm'),
        },
      )
    );
  }
}

1
