import { BaseRepository } from "../common/base.repository";
import { IDatabaseService } from "../db/databaseService.interface";
import { TYPES } from "../types";
import { inject, injectable } from "inversify";
import 'reflect-metadata';
import { ILogger } from "../logger/logger.interface";

@injectable()
export class DishToGlobalMenuRepository extends BaseRepository{
    constructor(
        @inject(TYPES.DatabaseService) protected databaseService: IDatabaseService,
        @inject(TYPES.Logger) private logger: ILogger,
    ) {
        super('DishToGlobalMenu', databaseService);
    }
}