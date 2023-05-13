import { PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import { IDatabaseService } from './databaseService.interface';
import 'reflect-metadata';

@injectable()
export class DatabaseService implements IDatabaseService {
	client: PrismaClient;

	constructor(@inject(TYPES.Logger) private logger: ILogger) {
		this.client = new PrismaClient();
	}

	async connect() {
		try {
			await this.client.$connect();
			this.logger.log(`[DatabaseService] Successfully connected to DB`);
		} catch (err) {
			this.logger.err(`[DatabaseService] Error while trying connect to DB: ${err}`);
		}
	}

	async disconnect() {
		await this.client.$disconnect();
		this.logger.log(`[DatabaseService] Successfully disconnected to DB`);
	}
}
