import {BaseController} from "../common/base.controller";
import {inject, injectable} from "inversify";
import {TYPES} from "../types";
import {ILogger} from "../logger/logger.interface";
import {NextFunction, Request, Response} from "express";
import {UserService} from "./user.service";
import "reflect-metadata";
import {HttpError} from "../errors/http-error.class";
import {ValidatorMiddlewareService} from "../middlewares/validator/validatorMiddleware.service";
import {RegisterUserDtoIn} from "./dto/in/registerUser.dto";

@injectable()
export class UserController extends BaseController {
    constructor(
        @inject(TYPES.Logger) private loggerService: ILogger,
        @inject(TYPES.UserService) private userService: UserService
    ) {
        super(loggerService);
        this.bindApi();
    }

    public bindApi(): void {
        this.bindRoutes([
            {
                root: "/user",
                path: "/register",
                method: "post",
                func: this.registerUser,
                middlewares: [new ValidatorMiddlewareService(RegisterUserDtoIn, this.loggerService)]
            }
        ])
    }

    public async registerUser(req: Request, res: Response, next: NextFunction) {
        try {
            let data = await this.userService.registerUser(req.body, next);
            data && res.status(data.status).send(data);
        } catch (e) {
            next(new HttpError(400, "Bad Request", "UserController"));
        }
    }
}