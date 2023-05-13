import { BaseController } from '../common/base.controller';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';
import { IControllerInteface } from '../common/controller.inteface';
import { NextFunction, Request, Response } from 'express';
import { ValidatorMiddlewareService } from '../middlewares/validator/validatorMiddleware.service';
import 'reflect-metadata';
import { HttpError } from '../errors/http-error.class';
import { AdminService } from './admin.service';
import { AdminLoginDtoIn } from './dto/in/adminLogin.dto';

@injectable()
export class AdminController extends BaseController implements IControllerInteface {
    constructor(
        @inject(TYPES.Logger) private loggerService: ILogger,
        @inject(TYPES.AdminService) private adminService: AdminService
    ) {
        super(loggerService);
        this.bindApi();
    }

    public bindApi(): void {
        this.bindRoutes([
            {
                root: '/admin',
                path: '/login',
                method: 'post',
                func: this.login,
                middlewares: [new ValidatorMiddlewareService(AdminLoginDtoIn, this.loggerService)],
            },
            {
                root: '/admin',
                path: '/adminPanel',
                method: 'get',
                func: this.login,
            },
        ]);
    }

    public async login(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await this.adminService.login(req.body, next);
            data && res.status(data.status).send(data);
        } catch (e) {
            next(new HttpError(400, 'Bad Request', 'DishController'));
        }
    }

    public async getAdminPanelHTML(req: Request, res: Response, next: NextFunction) {
        try {
        } catch (e) {}
    }
}
