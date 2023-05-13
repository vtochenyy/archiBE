import { NextFunction, Request, Response } from 'express';
import { OutgoingQueriesLog } from '@prisma/client';

export interface IIncomingQueryLogsMiddlewareInterface {
    currentRequestRecord: OutgoingQueriesLog;
    responseJSON: any;
    log(req: Request, res: Response, next: NextFunction): void;
}
