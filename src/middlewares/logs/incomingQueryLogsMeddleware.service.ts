import { NextFunction, Request, Response } from 'express';
import { IIncomingQueryLogsMiddlewareInterface } from './incomingQueryLogsMiddleware.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { ILogger } from '../../logger/logger.interface';
import { BaseRepository } from '../../common/base.repository';
import { OutgoingQueriesLog } from '@prisma/client';
import 'reflect-metadata';

@injectable()
export class IncomingQueryLogsMeddlewareService implements IIncomingQueryLogsMiddlewareInterface {
    get responseJSON(): any {
        return this._responseJSON;
    }
    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(TYPES.IncomingQueryLogsRepository)
        private incomingQueryLogsRepository: BaseRepository
    ) {}

    set responseJSON(value: any) {
        this._responseJSON = value;
    }

    public currentRequestRecord: OutgoingQueriesLog;
    private _responseJSON: any;

    public async log(req: Request, res: Response, next: NextFunction): Promise<void> {
        this.logger.log([
            `Outgoing request received`,
            `URL: ${req.url}`,
            `METHOD: ${req.method}`,
            `HEADERS: ${req.rawHeaders}`,
            `BODY: ${JSON.stringify(req.body)}`,
            `DATE-TIME: ${new Date().toLocaleString()}`,
        ]);
        this.currentRequestRecord = await this.incomingQueryLogsRepository.create({
            url: req.url,
            method: req.method,
            headers: JSON.stringify(req.rawHeaders),
            requestBody: JSON.stringify(req.body),
        });
        next();
    }
}
