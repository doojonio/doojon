export class SerializableError extends Error {
  toString() {
    let errorString = this.constructor.name;

    if (this.message) {
      errorString += `: ${this.message}`;
    }

    return errorString;
  }

  toJSON() {
    return {
      kind: this.constructor.name,
      message: this.message,
    };
  }
}

export class NotAuthorizedError extends SerializableError {}
export class ForbiddenError extends SerializableError {}
export class ValidationError extends SerializableError {}
export class NotFoundError extends SerializableError {}
export class ConflictError extends SerializableError {}
export class FailedAuthError extends SerializableError {}
