package Doojon::Model::ORM::Base;

use strict;
use warnings;
use utf8;
use feature qw(:5.16);
use experimental qw(signatures);

use Carp qw();
use DBIx::Class::Core qw();

sub import {

  my ($class, $caller) = (shift, caller);

  _add_parent_for_caller($caller, 'DBIx::Class::Core');
  _make_alias_for_caller($caller);

  $_->import for qw(strict warnings utf8);
  feature->import(':5.16');
}

sub _make_alias_for_caller ($caller) {

  my $alias = ($caller =~ s/.+::(\w+)$/$1/r or Carp::croak("Failed selecting class name for package $caller"));
  no strict;
  *{$caller."::$alias"} = sub () { $caller };
}


sub _add_parent_for_caller ($caller, $parent) {

  no strict 'refs';
  push @{"${caller}::ISA"}, $parent;
}


1