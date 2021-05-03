package Doojon::Courier::Accounts::Exception {
  use Mojo::Base qw(Mojo::Exception);
}
package MissingParameter {
  use Mojo::Base qw(Doojon::Courier::Accounts::Exception);
}
package UnsuccessfullRequest {
  use Mojo::Base qw(Doojon::Courier::Accounts::Exception);
}

1
