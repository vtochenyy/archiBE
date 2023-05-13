import {inject, injectable} from "inversify";
import 'reflect-metadata';
import {TYPES} from "../types";
import {UserRepository} from "./user.repository";
import {NextFunction} from "express";
import {HttpError} from "../errors/http-error.class";
import {TableRepository} from "../table/table.repository";
import {IDatabaseService} from "../db/databaseService.interface";
import {baseAnswer} from "../common/baseAnswer";
import {RegisterUserDtoIn} from "./dto/in/registerUser.dto";

@injectable()
export class UserService {
    constructor(
        @inject(TYPES.UserRepository) private userRepository: UserRepository,
        @inject(TYPES.TableRepository) private tableRepository: TableRepository,
        @inject(TYPES.DatabaseService) private databaseService: IDatabaseService,
    ) {
    }

    public async registerUser(params: RegisterUserDtoIn, next: NextFunction) {
        try {
            let result = {};
            await this.databaseService.client.$transaction(async () => {
                let findedTable = await this.tableRepository.findByCriteria({tableNumber: params.tableNumber});
                if (!!findedTable.length) {
                        result = await this.userRepository.create({tableId: findedTable[0].id});
                } else {
                    throw new Error("Стола с таким номером не существует");
                }
            })
            return baseAnswer(201, result, []);
        } catch (e) {
            next(new HttpError(500, String(e), "UserService"));
        }
    }

}