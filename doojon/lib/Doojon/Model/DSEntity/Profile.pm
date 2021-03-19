package Doojon::Model::DSEntity::Profile;

use constant {
  table => 'profiles',
  columns => {
    id => {required => 1, uniq => 1},
    username => {required => 1, uniq => 1},
  },
};

1
