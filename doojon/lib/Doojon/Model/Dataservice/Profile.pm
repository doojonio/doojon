package Doojon::Model::Dataservice::Profile;

use Mojo::Base 'Doojon::Model::Dataservice';

has table => 'profiles';
has columns => sub {+{
  id => {required => 1, uniq => 1},
  username => {required => 1, uniq => 1},
}};

1
