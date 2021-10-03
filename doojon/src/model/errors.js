export class NotAuthorizedError extends Error {
  toString() {
    let errorString = 'NotAuthorizedError';

    if (this.message) {
      errorString += `: ${this.message}`;
    }

    return errorString;
  }

  toJSON() {
    return {
      kind: 'NotAuthorizedError',
      message: this.message,
    };
  }
}
export class ForbiddenError extends Error {
  toString() {
    let errorString = 'ForbiddenError';

    if (this.message) {
      errorString += `: ${this.message}`;
    }

    return errorString;
  }

  toJSON() {
    return {
      kind: 'ForbiddenError',
      message: this.message,
    };
  }
}
export class ValidationError extends Error {
  toString() {
    let errorString = 'ValidationError';

    if (this.message) {
      errorString += `: ${this.message}`;
    }

    return errorString;
  }

  toJSON() {
    return {
      kind: 'ValidationError',
      message: this.message,
    };
  }
}
