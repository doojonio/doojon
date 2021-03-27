package Doojon::Model::Dataservice::Challenge;

use Mojo::Base 'Doojon::Model::Dataservice';

has table => 'challenges';
has columns => sub {+{
  id => {auto => 1},
}};

1
