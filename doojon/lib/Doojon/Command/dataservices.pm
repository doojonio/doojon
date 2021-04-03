package Doojon::Command::dataservices;

use Mojo::Base 'Mojolicious::Command', -signatures;

use Carp(qw(croak));
use List::Util qw(any);
use Term::ANSIColor qw(:constants);
use Mojo::Util qw(camelize);
use Mojo::Template;

use constant SKIP_TABLES => qw(mojo_migrations);
use constant AUTOGEN_START => "# ---
# autogen::start
# ---";
use constant AUTOGEN_END => "# ---
# autogen::end
# ---";

has description => 'Check and generate dataservices';

sub run ($self, $command) {

  my $method = $self->can('cli_'.$command);
  if (not $method) {
    croak("no such command $command")
  }

  binmode STDOUT, 'utf8';

  $method->($self);
}

sub cli_generate ($self) {

  my $home = $self->app->home;
  system("cd $home && git diff --quiet && git diff --cached --quiet");
  if ($? != 0) {
    say "👀 ${\RED} this command can hurt files and git repo doesn't clean or there is no git repo...${\RESET}";
    return 1;
  }

  my $db = $self->app->model->ioc->resolve(service => '/pg')->db;

  local $/ = '';
  my $gen_template = <DATA>;
  my $renderer = Mojo::Template->new;

  $db->select(
    'information_schema.tables', 'table_name', {table_schema => 'public'}
  )->hashes->map(sub {shift->{table_name}})->each(sub ($table, $num) {
    if (any {$_ eq $table} SKIP_TABLES) {
      return say "🖕($num) skipping table '$table'";
    }
    say "✍️ ($num) processing table '$table'";

    my $columns = $db->select('information_schema.columns', undef, {table_schema => 'public', table_name => $table})->hashes;

    my $meta_block = $self->render_data('meta-block.ep', {
      table => $table,
      columns => $columns,
      autogen_start => AUTOGEN_START,
      autogen_end => AUTOGEN_END,
    });
    chomp $meta_block;

    my $package_name = camelize $table;
    my $package_file = $self->app->home->child(lib => Doojon => Model => Dataservice => "$package_name.pm");

    if (-f $package_file->to_string) {
      my $package_content = $package_file->slurp;

      my $autogen_start = AUTOGEN_START;
      my $autogen_end = AUTOGEN_END;
      die "couldn't find metablock in $package_file" unless $package_content =~ s/${autogen_start}.*${autogen_end}/$meta_block/s;
      say "[write] $package_file";
      return $package_file->spurt($package_content);
    }

    $self->render_to_file('package.ep', $package_file, {
      package_name => $package_name,
      meta_block => $meta_block
    });
  });
}

sub cli_check ($self) {

  my $ds_container = $self->app->model->ioc->fetch('/dataservices');
  my @errors;
  for my $ds_name ($ds_container->get_service_list) {
    my $ds = $ds_container->resolve(service => $ds_name);
    my $is_ds_ok = eval {$ds->check_myself};
    push @errors, $@ unless $is_ds_ok;
  }

  if (scalar @errors) {
    say "👎 not good:";
    print RED, @errors, RESET;
  }
  else {
    print GREEN "👍 database is ok\n", RESET;
  }
}

1

__DATA__
@@ meta-block.ep
%= $autogen_start
has table => '<%= $table %>';
has columns => sub {+{
  % for my $c ($columns->@*) {
  <%= $c->{column_name} %> => {
    required => <%=!!$c->{is_nullable} || 0%>,
    has_default => <%=!!$c->{column_default} || 0%>,
    is_updatable => <%=!!$c->{is_updatable} || 0%>
  },
  % }
}};
%= $autogen_end

@@ package.ep
package Doojon::Model::Dataservice::<%=$package_name%>;

use Mojo::Base 'Doojon::Model::Dataservice';


%= $meta_block

1
