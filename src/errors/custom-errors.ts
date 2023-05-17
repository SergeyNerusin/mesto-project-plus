class AppError extends Error {
  statusCode: number;

  constructor(code: number, message: string) {
    super(message);
    this.statusCode = code;
  }

  static badRequest(message: string) {
    return new AppError(400, message);
  }

  static unathorized(message: string) {
    return new AppError(401, message);
  }

  static notFound(message: string) {
    return new AppError(404, message);
  }

  static conflict(message: string) {
    return new AppError(409, message);
  }
}

export default AppError;
