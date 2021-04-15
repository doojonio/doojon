package Doojon;
use Mojo::Base 'Mojolicious', -signatures;

use Mojo::Loader qw(load_classes);

use constant STARTUP_STEPS => (
  'Config',
  'Model',
  'Routes',
  'Helpers',
  'Commands',
);

# This method will run once at server start
sub startup ($self) {

  load_classes 'Doojon::Startup';

  for my $startup (STARTUP_STEPS) {
    $startup = "Doojon::Startup::$startup"->new;
    $startup->startup($self);
  }
}

1
