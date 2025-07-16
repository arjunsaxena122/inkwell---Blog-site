export class ApiError extends Error {
  public statusCode: number;
  public errors: Array<any>;
  public success: boolean;

  constructor(
    statusCode: number,
    message: string = "Something went wrong",
    errors: Array<any> = [],
    stack: string = "",
  ) {
    super(message);
    this.statusCode = statusCode;
    (this.success = false), (this.errors = errors);

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
