import { BaseRepository } from "../common/base.repository";
import { IDatabaseService } from "../db/databaseService.interface";
import { Logger } from "tslog";
import { TYPES } from "../types";
import { inject, injectable } from "inversify";
import "reflect-metadata";

@injectable()
export class DishRepository extends BaseRepository {
  constructor(
    @inject(TYPES.DatabaseService) protected databaseService: IDatabaseService,
    @inject(TYPES.Logger) private logger: Logger
  ) {
    super("Dish", databaseService);
  }
}