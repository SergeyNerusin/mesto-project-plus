class AppError extends Error {
  status: number;

  constructor(code: number, message: string) {
    super();
    this.status = code;
    this.message = message;
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

  static serverError(message: string) {
    return new AppError(500, message);
  }
}

export default AppError;
