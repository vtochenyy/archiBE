import { Router } from 'express';
import { inject, injectable } from 'inversify';
import { IControllerRoute } from './route.interface';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import lodash, { LoDashStatic } from 'lodash';
import 'reflect-metadata';

@injectable()
export abstract class BaseController {
    private readonly _router: Router;
    protected _: LoDashStatic;

    // noinspection TypeScriptAbstractClassConstructorCanBeMadeProtected
    constructor(@inject(TYPES.Logger) private logger: ILogger) {
        this._router = Router();
        this._ = lodash;
    }

    public get router() {
        return this._router;
    }

    protected bindRoutes(routes: IControllerRoute[]) {
        for (const route of routes) {
            this.logger.log(`Endpoint [${route.method}] ${route.root + route.path} is active`);
            const middlewares = Array.isArray(route.middlewares)
                ? route.middlewares.map((x) => {
                      return x.execute.bind(x);
                  })
                : [];
            const controllerRouteHandler = route.func.bind(this);
            const pipeline = middlewares ? [...middlewares, controllerRouteHandler] : controllerRouteHandler;
            this.router[route.method](route.path, pipeline);
        }
    }
}
