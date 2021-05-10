package Doojon::Model::Dataservice::Profiles;

use Mojo::Base 'Doojon::Model::Dataservice', -signatures, -async_await;

async sub check_create_perm ($self, $objects) {

  my(@passed, @forbidden);

  return [], $objects if @$objects != 1;
  return [], $objects unless my $cu_id = $self->mstate->cu->{id};


  if ($objects->[0]->{id} ne $cu_id) {
    return undef, $objects; ## no critic (Subroutines::ProhibitExplicitReturnUndef)
  }

  return $objects;
}


# ---
# autogen::start
# ---
has table => 'profiles';
has columns => sub {+{
  id => {
    data_type => 'string',
    is_primary_key => 1,
    has_default => 0,
    is_updatable => 1,
    required => 1
  },
  username => {
    data_type => 'string',
    has_default => 0,
    is_updatable => 1,
    required => 1
  },
  reg_date => {
    data_type => 'date',
    has_default => 1,
    is_updatable => 1,
    required => 1
  },
}};
# ---
# autogen::end
# ---

1
