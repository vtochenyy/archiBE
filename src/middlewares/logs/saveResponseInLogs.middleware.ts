import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { BaseRepository } from '../../common/base.repository';
import 'reflect-metadata';
import { IIncomingQueryLogsMiddlewareInterface } from './incomingQueryLogsMiddleware.interface';

@injectable()
export class SaveResponseInLogsMiddleware {
    constructor(
        @inject(TYPES.IncomingQueryLogsRepository)
        private incomingQueryLogsRepository: BaseRepository,
        @inject(TYPES.IncomingQueryLogsMeddlewareService)
        private incomingQueryLogsMeddlewareService: IIncomingQueryLogsMiddlewareInterface
    ) {}

    public keepResponse(req: Request, res: Response, next: NextFunction) {
        try {
            this.incomingQueryLogsRepository.update(
                this.incomingQueryLogsMeddlewareService.currentRequestRecord.id,
                { responseBody: this.incomingQueryLogsMeddlewareService.responseJSON }
            );
            console.log(this.incomingQueryLogsMeddlewareService.responseJSON);
            res.status(this.incomingQueryLogsMeddlewareService.responseJSON.status).send(
                this.incomingQueryLogsMeddlewareService.responseJSON
            );
        } catch (e) {
            next(new Error(String(e)));
        }
    }
}
