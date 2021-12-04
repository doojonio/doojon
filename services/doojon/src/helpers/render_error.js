import { ParsingError } from '../errors.js';
import {
  NotAuthorizedError,
  ValidationError,
  NotFoundError,
  ForbiddenError,
  ConflictError,
} from '../model/errors.js';

export default async function renderError(ctx, error) {
  let status;
  if (error instanceof ValidationError || error instanceof ParsingError) {
    status = 400;
  } else if (error instanceof NotAuthorizedError) {
    status = 401;
  } else if (error instanceof ForbiddenError) {
    status = 403;
  } else if (error instanceof NotFoundError) {
    status = 404;
  } else if (error instanceof ConflictError) {
    status = 409;
  }

  if (status === undefined) {
    status = 500;
    error = { kind: 'UnhandledException', message: error.message };
  }

  ctx.render({
    status,
    json: error,
  });
}
