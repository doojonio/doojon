import { ParsingError } from '../errors.js';
import {
  NotAuthorizedError,
  ValidationError,
  NotFoundError,
  ForbiddenError,
} from '../model/errors.js';

export default async function renderError(ctx, error) {
  console.log(error);

  let status;
  if (error instanceof ValidationError || error instanceof ParsingError) {
    status = 400;
  } else if (error instanceof NotAuthorizedError) {
    status = 401;
  } else if (error instanceof ForbiddenError) {
    status = 403;
  } else if (error instanceof NotFoundError) {
    status = 404;
  }

  if (status === undefined) {
    status = 500;
    error = { kind: "UnhandledException", message: error.message };
  }

  ctx.render({
    status,
    json: error
  })
}
