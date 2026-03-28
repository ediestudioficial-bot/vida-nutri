export class AppError extends Error {
  constructor(
    message: string,
    public readonly exitCode: number,
    public readonly kind: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export const ExitCode = {
  Usage: 64,
  DataError: 65,
  Unavailable: 69,
  Software: 70,
} as const;
