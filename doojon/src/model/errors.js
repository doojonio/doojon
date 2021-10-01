export class NotAuthorizedError extends Error {
  toJSON() {
    return {
      kind: 'NotAuthorizedError',
      message: this.message,
    };
  }
}
export class ForbiddenError extends Error {
  toJSON() {
    return {
      kind: 'ForbiddenError',
      message: this.message,
    };
  }
}
export class ValidationError extends Error {
  toJSON() {
    return {
      kind: 'ValidationError',
      message: this.message,
    };
  }
}
