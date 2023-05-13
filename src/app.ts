import express, { Express, NextFunction, Request, Response } from 'express';
import { Server } from 'http';
import cors from 'cors';
import { injectable, inject } from 'inversify';
import { TYPES } from './types';
import { ILogger } from './logger/logger.interface';
import { IConfigService } from './config/config.service.interface';
import { DishController } from './dish/dish.controller';
import timeout from 'connect-timeout';
import 'reflect-metadata';
import { IExeptionFilter } from './errors/exeption.filter.interface';
import { IIncomingQueryLogsMiddlewareInterface } from './middlewares/logs/incomingQueryLogsMiddleware.interface';
import { MenuController } from './menu/menu.controller';
import { AdminController } from './admin/admin.controller';
import { responseHeaderSetterMiddleware } from './middlewares/responseHeaderSetter.middleware';
import { UserController } from './user/user.controller';
import { SaveResponseInLogsMiddleware } from './middlewares/logs/saveResponseInLogs.middleware';
import { IDatabaseService } from './db/databaseService.interface';

@injectable()
export class App {
    app: Express;
    server: Server;
    port: number;

    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(TYPES.ConfigService) private configService: IConfigService,
        @inject(TYPES.DishController) private dishController: DishController,
        @inject(TYPES.ExeptionFilter) private exeptionFilter: IExeptionFilter,
        @inject(TYPES.IncomingQueryLogsMeddlewareService)
        private incomingQueryLogsMeddlewareService: IIncomingQueryLogsMiddlewareInterface,
        @inject(TYPES.MenuController) private menuController: MenuController,
        @inject(TYPES.UserController) private userController: UserController,
        @inject(TYPES.AdminController) private adminController: AdminController,
        @inject(TYPES.SaveResponseInLogsMiddleware)
        private saveResponseInLogsMiddleware: SaveResponseInLogsMiddleware,
        @inject(TYPES.DatabaseService) private databaseService: IDatabaseService
    ) {
        this.app = express();
        this.port = +this.configService.get('SERVER_PORT');
    }

    public useRoutes() {
        this.app.options('*', cors({ credentials: true, origin: 'http://localhost:3000' }));
        this.app.use(express.json({ limit: this.configService.get('REQUEST_JSON_LIMIT') }));
        this.app.use(express.urlencoded({ limit: this.configService.get('REQUEST_SIZE_LIMIT') }));
        this.app.use(timeout(+this.configService.get('SERVER_TIMEOUT_ON_REQUEST')));
        this.app.use(responseHeaderSetterMiddleware);
        this.app.use(
            this.incomingQueryLogsMeddlewareService.log.bind(
                this.incomingQueryLogsMeddlewareService
            )
        );
        this.app.use(
            '/static',
            express.static(__dirname.split('\\').slice(0, -1).join('\\') + '\\UI\\build')
        );
        this.app.use('/dish', this.dishController.router);
        this.app.use('/menu', this.menuController.router);
        this.app.use('/admin', this.adminController.router);
        this.app.use('/user', this.userController.router);
    }

    public useErrorValidation() {
        this.app.use(this.exeptionFilter.catch.bind(this));
    }

    public useResponseBodyKeepMiddleware() {
        this.app.use(
            this.saveResponseInLogsMiddleware.keepResponse.bind(this.saveResponseInLogsMiddleware)
        );
    }

    public async init() {
        this.server = this.app.listen(this.port, () => {
            this.logger.log(`Server running at port: ${this.port}`);
            this.databaseService.connect();
            this.useRoutes();
            this.useErrorValidation();
        });
    }
}
