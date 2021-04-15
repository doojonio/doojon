package Doojon::Startup::Commands;

use Mojo::Base -base, -signatures;

sub startup ($self, $app) {

  push $app->commands->namespaces->@*, 'Doojon::Command';
}

1
