package Doojon::Startup::Config;

use Mojo::Base -base, -signatures;

sub startup ($self, $app) {

  require YAML::XS;
  $YAML::XS::Boolean = 'JSON::PP';
  $app->plugin('NotYAMLConfig' => {module => 'YAML::XS'});
}

1
