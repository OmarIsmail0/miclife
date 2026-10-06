type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerOptions {
  enableInProduction?: boolean;
  minLevel?: LogLevel;
}

class Logger {
  private isDevelopment: boolean;
  private options: Required<LoggerOptions>;

  constructor(options: LoggerOptions = {}) {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.options = {
      enableInProduction: options.enableInProduction ?? false,
      minLevel: options.minLevel ?? 'info',
    };
  }

  private shouldLog(level: LogLevel): boolean {
    if (this.isDevelopment) return true;
    if (!this.options.enableInProduction) return false;
    
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    return levels.indexOf(level) >= levels.indexOf(this.options.minLevel);
  }

  debug(message: string, ...args: any[]): void {
    if (this.shouldLog('debug')) {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  }

  info(message: string, ...args: any[]): void {
    if (this.shouldLog('info')) {
      console.info(`[INFO] ${message}`, ...args);
    }
  }

  warn(message: string, ...args: any[]): void {
    if (this.shouldLog('warn')) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  }

  error(message: string, error?: Error | unknown, ...args: any[]): void {
    if (this.shouldLog('error')) {
      if (error instanceof Error) {
        console.error(`[ERROR] ${message}`, error.message, error.stack, ...args);
      } else {
        console.error(`[ERROR] ${message}`, error, ...args);
      }
    }
  }
}

export const logger = new Logger({
  enableInProduction: false, // Set to true if you need logs in production
  minLevel: 'info',
});

export default logger;

