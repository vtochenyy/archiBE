import { PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { v1 as uuidv1 } from 'uuid';
import { IDatabaseService } from '../db/databaseService.interface';
import 'reflect-metadata';

@injectable()
export abstract class BaseRepository {
    client: PrismaClient;
    model: string;

    constructor(
        model: string,
        @inject(TYPES.DatabaseService) protected databaseService: IDatabaseService
    ) {
        this.model = model;
        this.client = this.databaseService.client;
    }

    public async create(params: any): Promise<any> {
        params.id = uuidv1();
        // @ts-ignore
        return await this.client[this.model].create({ data: params });
    }

    public async createMany(params: any): Promise<any> {
        params.id = uuidv1();
        const data = params.map((x: any) => {
            return { ...x, id: uuidv1() };
        });
        // @ts-ignore
        return await this.client[this.model].createMany({ data: data, skipDuplicates: true });
    }

    public async update(recordId: string, params: any): Promise<any> {
        // @ts-ignore
        return await this.client[this.model].update({
            where: { id: recordId },
            data: { ...params },
        });
    }

    public async findRecordById(recordId: string): Promise<any> {
        // @ts-ignore
        return await this.client[this.model].findUnique({
            where: { id: recordId },
        });
    }

    public async findAll(): Promise<any[]> {
        // @ts-ignore
        return await this.client[this.model].findMany();
    }

    public async getCountOfRecords(): Promise<any> {
        // @ts-ignore
        return await this.client[this.model].count();
    }

    public async findByCriteria(recordData: any, params?: any): Promise<any[]> {
        if (!!params) {
            // @ts-ignore
            return await this.client[this.model].findMany({
                where: {
                    ...recordData,
                },
                ...params,
            });
        } else {
            // @ts-ignore
            return await this.client[this.model].findMany({
                where: {
                    ...recordData,
                },
            });
        }
    }

    public async deleteById(recordId: string): Promise<any> {
        try {
            // @ts-ignore
            return await this.client[this.model].delete({ where: { id: recordId } });
        } catch (err: any) {
            return { error: err?.message };
        }
    }
}
