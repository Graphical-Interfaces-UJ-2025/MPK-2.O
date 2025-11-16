import winston, { Logger as WinstonLoggerInstance } from 'winston';
import { singleton } from 'tsyringe';
import { ILogger } from '../../application/services/logger.interface';

@singleton()
export class WinstonLogger implements ILogger {
  private logger: WinstonLoggerInstance;
  private context?: string;

  constructor() {
    const logLevel = process.env.LOG_LEVEL || 'info';
    const isDevelopment = process.env.NODE_ENV !== 'production';

    const customFormat = winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.errors({ stack: true }),
      winston.format.splat(),
      winston.format.printf(({ timestamp, level, message, context, ...meta }) => {
        const contextStr = context ? `[${context}]` : '';
        const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
        return `${timestamp} [${level.toUpperCase()}] ${contextStr} ${message}${metaStr}`;
      })
    );

    const consoleFormat = winston.format.combine(winston.format.colorize(), customFormat);

    this.logger = winston.createLogger({
      level: logLevel,
      format: customFormat,
      transports: [
        new winston.transports.Console({
          format: isDevelopment ? consoleFormat : customFormat,
        }),
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
          maxsize: 5242880, // 5MB
          maxFiles: 5,
        }),
        new winston.transports.File({
          filename: 'logs/combined.log',
          maxsize: 5242880, // 5MB
          maxFiles: 5,
        }),
      ],
    });

    // Handle uncaught exceptions
    this.logger.exceptions.handle(new winston.transports.File({ filename: 'logs/exceptions.log' }));

    // Handle unhandled promise rejections
    this.logger.rejections.handle(new winston.transports.File({ filename: 'logs/rejections.log' }));
  }

  /**
   * Create a child logger with a specific context
   */
  child(context: string): ILogger {
    const childLogger = new WinstonLogger();
    childLogger.logger = this.logger;
    childLogger.context = context;
    return childLogger;
  }

  info(message: string, meta?: Record<string, unknown>): void {
    this.logger.info(message, { context: this.context, ...meta });
  }

  warn(message: string, meta?: Record<string, unknown>): void {
    this.logger.warn(message, { context: this.context, ...meta });
  }

  error(message: string, meta?: Record<string, unknown> | Error): void {
    if (meta instanceof Error) {
      this.logger.error(message, {
        context: this.context,
        error: meta.message,
        stack: meta.stack,
      });
    } else {
      this.logger.error(message, { context: this.context, ...meta });
    }
  }

  debug(message: string, meta?: Record<string, unknown>): void {
    this.logger.debug(message, { context: this.context, ...meta });
  }
}
