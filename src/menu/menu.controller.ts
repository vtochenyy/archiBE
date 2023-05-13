import { BaseController } from '../common/base.controller';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';
import { DishService } from '../dish/dish.service';
import 'reflect-metadata';
import { NextFunction, Request, Response } from 'express';
import { MenuService } from './menu.service';
import { HttpError } from '../errors/http-error.class';
import { IControllerInteface } from '../common/controller.inteface';
import { ValidatorMiddlewareService } from '../middlewares/validator/validatorMiddleware.service';
import { CreateGlobalMenuDtoIn } from './dto/in/createGlobalMenu.dto';

@injectable()
export class MenuController extends BaseController implements IControllerInteface {
    constructor(
        @inject(TYPES.Logger) private loggerService: ILogger,
        @inject(TYPES.DishService) private dishService: DishService,
        @inject(TYPES.MenuService) private menuService: MenuService
    ) {
        super(loggerService);
        this.bindApi();
    }

    public bindApi() {
        this.bindRoutes([
            {
                root: '/menu',
                path: '/createGlobalMenu',
                method: 'post',
                func: this.createGlobalMenu,
                middlewares: [
                    new ValidatorMiddlewareService(CreateGlobalMenuDtoIn, this.loggerService),
                ],
            },
            {
                root: '/menu',
                path: '/createMenu',
                method: 'post',
                func: this.createMenu,
            },
            {
                root: '/menu',
                path: '/getGlobalMenuById',
                method: 'get',
                func: this.getGlobalMenuById,
            },
            {
                root: '/menu',
                path: '/getUserMenuByDate',
                method: 'get',
                func: this.getUserMenuByDate,
            },
            {
                root: '/menu',
                path: '/getSmetaByGlobalMenuId',
                method: 'get',
                func: this.getSmetaByGlobalMenuId,
            },
            {
                root: '/menu',
                path: '/getAllGlobalMenus',
                method: 'get',
                func: this.getAllGlobalMenus,
            },
        ]);
    }

    public async createGlobalMenu(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await this.menuService.createGlobalMenu(req.body, next);
            data && res.status(data.status).send(data);
        } catch (e) {
            next(new HttpError(400, 'Bad Request', 'MenuController'));
        }
    }

    public async createMenu(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await this.menuService.createUserMenu(
                String(req.headers.userid),
                req.body,
                next
            );
            data && res.status(data.status).send(data);
        } catch (e) {
            next(new HttpError(400, 'Bad Request', 'MenuController'));
        }
    }

    public async getGlobalMenuById(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await this.menuService.getGlobalMenuById(
                String(req.query.globalMenuId),
                next
            );
            data && res.status(data.status).send(data);
        } catch (e) {
            next(new HttpError(400, 'Bad Request', 'MenuController'));
        }
    }

    public async getUserMenuByDate(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await this.menuService.getUserMenuByDate(
                String(req.headers.userid),
                String(req.query.targetDate),
                next
            );
            data && res.status(data.status).send(data);
        } catch (e) {
            next(new HttpError(400, 'Bad Request', 'MenuController'));
        }
    }

    public async getSmetaByGlobalMenuId(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await this.menuService.getSmetaByGlobalMenuId(
                String(req.query.globalMenuId),
                next
            );
            data && res.status(data.status).send(data);
        } catch (e) {
            next(new HttpError(400, 'Bad Request', 'DishController'));
        }
    }

    public async getAllGlobalMenus(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await this.menuService.getAllGlobalMenus(next);
            data && res.status(data.status).send(data);
        } catch (e) {
            next(new HttpError(400, 'Bad Request', 'DishController'));
        }
    }
}
