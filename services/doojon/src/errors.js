export class ParsingError extends Error {
  toString() {
    let errorString = 'ParsingError';

    if (this.message) {
      errorString += `: ${this.message}`;
    }

    return errorString;
  }

  toJSON() {
    return {
      kind: 'ParsingError',
      message: this.message,
    };
  }
}