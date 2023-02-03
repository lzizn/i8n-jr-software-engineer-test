type BaseErrorStatusCodes = 400;

class BaseError extends Error {
  statusCode: BaseErrorStatusCodes;

  constructor(statusCode: BaseErrorStatusCodes, message: string, stack = '') {
    super(message);
    this.statusCode = statusCode;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { BaseError };
