import { BaseController } from '../common/base.controller';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';
import { IControllerInteface } from '../common/controller.inteface';
import { NextFunction, Request, Response } from 'express';
import { ValidatorMiddlewareService } from '../middlewares/validator/validatorMiddleware.service';
import { DishCreateDtoIn } from './dto/in/dishCreate.dto';
import { HttpError } from '../errors/http-error.class';
import { DishService } from './dish.service';
import { TypeOfDishCreateDtoIn } from './dto/in/typeOfDishCreate.dto';
import { TypeOfEatCreateDtoIn } from './dto/in/typeOfEatCreate.dto';
import 'reflect-metadata';
import { IIncomingQueryLogsMiddlewareInterface } from '../middlewares/logs/incomingQueryLogsMiddleware.interface';

@injectable()
export class DishController extends BaseController implements IControllerInteface {
    constructor(
        @inject(TYPES.Logger) private loggerService: ILogger,
        @inject(TYPES.DishService) private dishService: DishService,
        @inject(TYPES.IncomingQueryLogsMeddlewareService)
        private incomingQueryLogsMeddlewareService: IIncomingQueryLogsMiddlewareInterface
    ) {
        super(loggerService);
        this.bindApi();
    }

    public bindApi(): void {
        this.bindRoutes([
            {
                root: '/dish',
                path: '/add',
                method: 'post',
                func: this.createDish,
                middlewares: [new ValidatorMiddlewareService(DishCreateDtoIn, this.loggerService)],
            },
            {
                root: '/dish',
                path: '/add/x-typeOfDish',
                method: 'post',
                func: this.createTypeOfDish,
                middlewares: [
                    new ValidatorMiddlewareService(TypeOfDishCreateDtoIn, this.loggerService),
                ],
            },
            {
                root: '/dish',
                path: '/add/x-typeOfFoodIntake',
                method: 'post',
                func: this.createTypeOfFoodIntake,
                middlewares: [
                    new ValidatorMiddlewareService(TypeOfEatCreateDtoIn, this.loggerService),
                ],
            },
            {
                root: '/dish',
                path: '/all',
                method: 'get',
                func: this.getAllDishes,
            },
            {
                root: '/dish',
                path: '/all/typeOfDish',
                method: 'get',
                func: this.getAllTypesOfDish,
            },
            {
                root: '/dish',
                path: '/all/typeOfFoodIntake',
                method: 'get',
                func: this.getAllTypesOfFoodIntake,
            },
            {
                root: '/dish',
                path: '/typeOfFoodIntake/delete',
                method: 'delete',
                func: this.deleteTypeOfFoodIntake,
            },
            {
                root: '/dish',
                path: '/typeOfDish/delete',
                method: 'delete',
                func: this.deleteTypeOfDish,
            },
            {
                root: '/dish',
                path: '/delete',
                method: 'delete',
                func: this.deleteDish,
            },
            {
                root: '/dish',
                path: '/update',
                method: 'put',
                func: this.updateDishById,
            },
        ]);
    }

    public async createDish(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await this.dishService.createDish(req.body, next);
            data && res.status(data.status).send(data);
        } catch (err) {
            next(new HttpError(400, 'Bad Request', 'DishController'));
        }
    }

    public async createTypeOfDish(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await this.dishService.createTypeOfDish(req.body, next);
            data && res.status(data.status).send(data);
        } catch (e) {
            next(new HttpError(400, 'Bad Request', 'DishController'));
        }
    }

    public async createTypeOfFoodIntake(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await this.dishService.createTypeOfEat(req.body, next);
            data && res.status(data.status).send(data);
        } catch (e) {
            next(new HttpError(400, 'Bad Request', 'DishController'));
        }
    }

    public async getAllTypesOfDish(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await this.dishService.getAllTypeOfDish(next);
            data && res.status(data.status).send(data);
        } catch (e) {
            next(new HttpError(400, 'Bad Request', 'DishController'));
        }
    }

    public async getAllTypesOfFoodIntake(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await this.dishService.getAllTypesOfFoodIntakes(next);
            // this.incomingQueryLogsMeddlewareService.responseJSON = data;
            // next();
            data && res.status(data.status).send(data);
        } catch (e) {
            next(new HttpError(400, 'Bad Request', 'DishController'));
        }
    }

    public async getAllDishes(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await this.dishService.getAllDishes(next);
            data && res.status(data.status).send(data);
        } catch (e) {
            next(new HttpError(400, 'Bad Request', 'DishController'));
        }
    }

    public async deleteTypeOfFoodIntake(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await this.dishService.deleteTypeOfFoodIntake(String(req.query.id), next);
            data && res.status(data.status).send(data);
        } catch (e) {
            next(new HttpError(400, 'Bad Request', 'DishController'));
        }
    }

    public async deleteTypeOfDish(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await this.dishService.deleteTypeOfDish(String(req.query.id), next);
            data && res.status(data.status).send(data);
        } catch (e) {
            next(new HttpError(400, 'Bad Request', 'DishController'));
        }
    }

    public async deleteDish(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await this.dishService.deleteDish(String(req.query.id), next);
            data && res.status(data.status).send(data);
        } catch (e) {
            next(new HttpError(400, 'Bad Request', 'DishController'));
        }
    }

    public async updateDishById(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await this.dishService.updateDishById(
                String(req.query.id),
                req.body,
                next
            );
            data && res.status(data.status).send(data);
        } catch (e) {
            next(new HttpError(400, 'Bad Request', 'DishController'));
        }
    }
}
