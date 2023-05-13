import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { TYPES } from '../types';
import { BaseRepository } from '../common/base.repository';
import { NextFunction } from 'express';
import { HttpError } from '../errors/http-error.class';
import { baseAnswer } from '../common/baseAnswer';

@injectable()
export class AdminService {
    constructor(@inject(TYPES.AdminRepository) private adminRepository: BaseRepository) {}

    public async login(params: { login: string; password: string }, next: NextFunction) {
        try {
            const requestedAdmin = await this.adminRepository.findByCriteria({
                login: params.login,
            });
            if (requestedAdmin.length === 0) {
                throw new Error('Такой администратор не найден');
            }
            const admin = requestedAdmin[0];
            if (admin.password === params.password) {
                return baseAnswer(200, { isAuth: true }, []);
            } else {
                throw new Error('Неверный пароль');
            }
        } catch (e) {
            next(new HttpError(500, String(e), 'AdminService'));
        }
    }

    public async getAdminPanelHTML(next: NextFunction) {
        try {
            return '/';
        } catch (e) {}
    }
}
