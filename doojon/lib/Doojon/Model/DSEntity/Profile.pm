package Doojon::Model::DSEntity::Profile;

use constant {
  table => 'profiles',
  columns => {
    id => {auto => 1},
    username => {required => 1, uniq => 1},
    email => {required => 1, uniq => 1},
    password => {required => 1}
  },
};

1
