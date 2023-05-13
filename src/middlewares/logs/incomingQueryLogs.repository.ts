import { BaseRepository } from "../../common/base.repository";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types";
import { IDatabaseService } from "../../db/databaseService.interface";
import { ILogger } from "../../logger/logger.interface";

@injectable()
export class IncomingQueryLogsRepository extends BaseRepository {
  constructor(
    @inject(TYPES.DatabaseService) protected databaseService: IDatabaseService,
    @inject(TYPES.Logger) private logger: ILogger
  ) {
    super("OutgoingQueriesLog", databaseService);
  }
}