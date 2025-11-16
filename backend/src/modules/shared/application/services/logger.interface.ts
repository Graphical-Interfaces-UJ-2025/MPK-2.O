/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ILogger {
  /**
   * Create a child logger with a specific context
   * @param context - The context name (e.g., "AuthService", "RegisterUserUseCase")
   */
  child(context: string): ILogger;

  /**
   * Log an informational message
   * @param message - The message to log
   * @param meta - Optional metadata
   */
  info(message: string, meta?: Record<string, any>): void;

  /**
   * Log a warning message
   * @param message - The message to log
   * @param meta - Optional metadata
   */
  warn(message: string, meta?: Record<string, any>): void;

  /**
   * Log an error message
   * @param message - The message to log
   * @param meta - Optional metadata or Error object
   */
  error(message: string, meta?: Record<string, any> | Error): void;

  /**
   * Log a debug message
   * @param message - The message to log
   * @param meta - Optional metadata
   */
  debug(message: string, meta?: Record<string, any>): void;
}

export const ILoggerToken = Symbol('ILogger');
