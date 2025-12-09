export class ValidationError extends Error {
  public stack?: string | undefined;
  public message: string;
  constructor(
    public path: (string | number)[],
    message: string,
    public code?: string,
    public expected?: unknown,
    public received?: unknown,
    public value?: unknown
  ) {
    super(message);
    this.message = message;
  }
}

export namespace e {
  // Error tree structure
  // export interface ValidationError extends Error {
  //   name: "ValidationError";
  //   path: (string | number)[];
  //   message: string;
  //   code?: string;
  //   expected?: unknown;
  //   received?: unknown;
  //   value?: unknown;
  // }

  export class ValidationResult<T> {
    constructor(
      public success: boolean,
      public data?: T,
      public errors: ValidationError[] = []
    ) {}

    static ok<T>(data: T): ValidationResult<T> {
      return new ValidationResult(true, data, []);
    }

    static fail<T>(errors: ValidationError[]): ValidationResult<T> {
      return new ValidationResult(
        false,
        undefined,
        errors
      ) as ValidationResult<T>;
    }

    // Add path prefix to all errors (useful for nested validation)
    mapErrors(pathPrefix: (string | number)[]): ValidationResult<T> {
      return new ValidationResult(
        this.success,
        this.data,
        this.errors.map((err) => ({
          ...err,
          path: [...pathPrefix, ...err.path],
        }))
      );
    }

    // Get errors as a tree structure
    getErrorTree(): Record<string, any> {
      const tree: Record<string, any> = {};

      for (const error of this.errors) {
        let current = tree;
        const path = error.path;

        for (let i = 0; i < path.length; i++) {
          const key = String(path[i]);

          if (i === path.length - 1) {
            // Last element - store the error
            if (!current[key]) {
              current[key] = [];
            }
            if (Array.isArray(current[key])) {
              current[key].push(error.message);
            }
          } else {
            // Intermediate element - create nested object
            if (!current[key]) {
              current[key] = {};
            }
            current = current[key];
          }
        }
      }

      return tree;
    }

    // Get flat list of error messages
    getErrorMessages(): string[] {
      return this.errors.map((err) => {
        const pathStr = err.path.length > 0 ? `${err.path.join(".")}: ` : "";
        return `${pathStr}${err.message}`;
      });
    }
  }
}
