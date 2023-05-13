import { NextFunction, Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import { IExeptionFilter } from './exeption.filter.interface';
import { HttpError } from './http-error.class';
import 'reflect-metadata';

@injectable()
export class ExeptionFilter implements IExeptionFilter {
    constructor(@inject(TYPES.Logger) private logger: ILogger) {
        this.logger.log('Exeption filter active now');
    }

    public catch(err: Error | HttpError, req: Request, res: Response, next: NextFunction) {
        if (err instanceof HttpError) {
            this.logger.err(`[${err.context}] Ошибка ${err.statusCode} ${err.message}`);
            res.status(err.statusCode).send({
                status: err.statusCode,
                errorText: err.message,
                context: err.context,
                errorcode: err.errorcode,
            });
        } else {
            this.logger.err(`${err.message}`);
            res.status(500).send({ status: 500, message: err.message });
        }
    }
}
