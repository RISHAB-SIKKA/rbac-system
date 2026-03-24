class AppError extends Error {
    constructor(
      message: string,
      public statusCode: number = 500,
      public cause?: unknown
    ) {
      super(message);
      this.name = "AppError";
    }
}
  
class ValidationError extends AppError {
    constructor(message: string) {
      super(message, 400);
    }
}
  
class ConflictError extends AppError {
    constructor(message: string) {
      super(message, 409);
    }
}

class DatabaseError extends Error {
    constructor(message: string, public originalError?: unknown) {
        super(message);
        this.name = "DatabaseError";
      }    
}

class authError extends Error {
    constructor(message: string, public originalError?: unknown) {
        super(message);
        this.name = "authError";
    }
}

export = { AppError, ValidationError, ConflictError, DatabaseError, authError };