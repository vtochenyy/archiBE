import { IMiddleware } from '../../common/middleware.interface';
import { NextFunction, Request, Response } from 'express';
import { validate } from 'class-validator';
import { ClassConstructor, plainToClass } from 'class-transformer';
import { inject } from 'inversify';
import { TYPES } from '../../types';
import { ILogger } from '../../logger/logger.interface';
import { HttpError } from '../../errors/http-error.class';

export class ValidatorMiddlewareService implements IMiddleware {
    constructor(
        private classToValidate: ClassConstructor<object>,
        @inject(TYPES.Logger) private logger: ILogger
    ) {}

    public execute({ body }: Request, res: Response, next: NextFunction) {
        // сконструировать объект для сравнения (нужная дто + боди реквеста)
        const instance = plainToClass(this.classToValidate, body);
        // функция валидации объекта
        validate(instance).then((errors) => {
            if (errors.length > 0) {
                next(
                    new HttpError(
                        400,

                        errors
                            .map(
                                ({ constraints }) =>
                                    typeof constraints === 'object' &&
                                    Object.values(constraints).reduce(
                                        (prev, current) => `${!!prev ? prev + '; ' : ''}${current}`,
                                        ''
                                    )
                            )
                            .reduce((prev, current) => `${!!prev ? prev : ''}${current}; `, '')
                            .toString(),

                        'ValidatorMiddlewareService',
                        7
                    )
                );
            } else next();
        });
    }
}
