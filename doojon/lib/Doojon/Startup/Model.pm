package Doojon::Startup::Model;

use Mojo::Base -base, -signatures;

use Doojon::Model;

sub startup ($self, $app) {

  $app->attr(
    model => sub {
      Doojon::Model->new(config => $app->config->{model});
    }
  );
}

1
