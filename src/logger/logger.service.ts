import { Logger } from 'tslog';
import { injectable } from 'inversify';
import { ILogger } from './logger.interface';
import 'reflect-metadata';
@injectable()
export class LoggerService implements ILogger {
    public logger: Logger;

    constructor() {
        this.logger = new Logger({
            displayInstanceName: false,
            displayLoggerName: false,
            displayFilePath: 'hidden',
            displayFunctionName: false,
        });
    }

    public log(...args: unknown[]) {
        this.logger.info(...args);
    }

    public err(...args: unknown[]) {
        this.logger.error(...args);
    }

    public warn(...args: unknown[]) {
        this.logger.warn(...args);
    }

    public debug(...args: unknown[]) {
        this.logger.debug(...args);
    }
}
