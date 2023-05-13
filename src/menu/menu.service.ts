import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';
import { BaseRepository } from '../common/base.repository';
import { NextFunction } from 'express';
import { HttpError } from '../errors/http-error.class';
import { baseAnswer } from '../common/baseAnswer';
import { IDatabaseService } from '../db/databaseService.interface';
import moment from 'moment';
import 'reflect-metadata';

@injectable()
export class MenuService {
    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(TYPES.DatabaseService) private databaseService: IDatabaseService,
        @inject(TYPES.DishRepository) private dishRepository: BaseRepository,
        @inject(TYPES.TypeOfDishRepository) private typeOfDishRepository: BaseRepository,
        @inject(TYPES.TypeOfFoodIntakesRepository)
        private typeOfFoodIntakesRepository: BaseRepository,
        @inject(TYPES.GlobalMenuRepository) private globalMenuRepository: BaseRepository,
        @inject(TYPES.DishToGlobalMenuRepository)
        private dishToGlobalMenuRepository: BaseRepository,
        @inject(TYPES.MenuRepository) private menuRepository: BaseRepository,
        @inject(TYPES.DishToMenuRepository) private dishToMenuRepository: BaseRepository,
        @inject(TYPES.UserRepository) private userRepository: BaseRepository,
        @inject(TYPES.TableRepository) private tableRepository: BaseRepository
    ) {}

    private mapUserMenuJSONToDBModel(params: any, userMenuId: string) {
        return params.menu.typeOfFoodIntakeItems.flatMap(
            (typeOfFoodIntakeItem: { dishes: any[]; typeOfFoodIntakeItemId: any }) => {
                return typeOfFoodIntakeItem.dishes.map((dish) => ({
                    menuId: userMenuId,
                    typeOfFoodIntakeId: typeOfFoodIntakeItem.typeOfFoodIntakeItemId,
                    dishId: dish,
                    placeNumber: params.placeNumber,
                }));
            }
        );
    }

    private mapMenuDBModelToJSON(
        menu: any,
        allTypesOfDish: any,
        grouppedByItakesId: any,
        targetGlobalMenu: any,
        tableId?: string
    ) {
        let grouppedByTypeOfDishIds = allTypesOfDish
            .map((x: { id: any }) => ({
                typeOfDishId: x.id,
                dishes: menu.filter((y: { typeOfDishId: any }) => y.typeOfDishId === x.id),
            }))
            .filter((x: { dishes: string | any[] }) => !!x.dishes.length);
        let finalJSON = grouppedByItakesId.map((x: { typeOfFoodIntakeId: any; dishes: any[] }) => ({
            typeOfFoodIntakeId: x.typeOfFoodIntakeId,
            typeOfDishItems: grouppedByTypeOfDishIds
                .map((y: { typeOfDishId: any; dishes: any[] }) => {
                    let typeOfIDishFinalItem = {
                        typeOfDishItemId: y.typeOfDishId,
                        dishes: y.dishes.filter((z: { id: any }) =>
                            x.dishes.find((dish: { dishId: any }) => dish.dishId === z.id)
                        ),
                    };
                    if (!!typeOfIDishFinalItem.dishes.length) {
                        return typeOfIDishFinalItem;
                    }
                })
                .filter((item: any) => !!item),
        }));
        const result = {
            menu: {
                typeOfFoodIntakeItems: finalJSON,
                targetDate: targetGlobalMenu.targetDate,
            },
        };
        // @ts-ignore
        !!tableId && (result.tableId = tableId);
        return result;
    }

    public async createGlobalMenu(params: any, next: NextFunction) {
        try {
            let countOfCreatedRecords = 0;
            await this.databaseService.client.$transaction(async () => {
                let menuWithTargetDate = await this.globalMenuRepository.findByCriteria({
                    targetDate: params.menu.targetDate,
                });
                if (!menuWithTargetDate.length) {
                    let globalMenu = await this.globalMenuRepository.create({
                        targetDate: params.menu.targetDate,
                        createdBy: '693a6961-a100-4fdf-be28-1fe34528569d',
                    });
                    let result = params.menu.typeOfFoodIntakeItems.flatMap(
                        (typeOfFoodIntakeItem: { dishes: any[]; typeOfFoodIntakeItemId: any }) => {
                            return typeOfFoodIntakeItem.dishes.map((dish) => ({
                                globalMenuId: globalMenu.id,
                                typeOfFoodIntakeId: typeOfFoodIntakeItem.typeOfFoodIntakeItemId,
                                dishId: dish,
                            }));
                        }
                    );
                    countOfCreatedRecords = await this.dishToGlobalMenuRepository.createMany(
                        result
                    );
                } else {
                    throw new Error('Меню на эту дату уже было создано');
                }
            });
            return baseAnswer(201, countOfCreatedRecords, []);
        } catch (e) {
            next(new HttpError(500, String(e), 'MenuService'));
        }
    }

    public async createUserMenu(userId: string, params: any[], next: NextFunction) {
        try {
            let countOfCreatedRecords = 0;
            await this.databaseService.client.$transaction(async () => {
                let tomorrowDate = moment().add(1, 'day').toISOString();
                let targetGlobalMenu = await this.globalMenuRepository.findByCriteria({
                    targetDate: tomorrowDate,
                });
                if (!!targetGlobalMenu.length) {
                    let user = await this.userRepository.findRecordById(userId);
                    let foundUserMenus = await this.menuRepository.findByCriteria({
                        globalMenuId: targetGlobalMenu[0].id,
                        tableId: user.tableId,
                    });
                    if (!!foundUserMenus.length) {
                        let alredyExsistsItemsInMenu =
                            await this.dishToMenuRepository.findByCriteria({
                                menuId: foundUserMenus[0].id,
                                placeNumber: {
                                    in: [...new Set(params.map((x) => x.placeNumber))],
                                },
                            });
                        let placeNumbersWhichAlredyExsistsInMenu = Array.from(
                            new Set(alredyExsistsItemsInMenu.flat().map((x) => x.placeNumber))
                        );
                        if (
                            !!placeNumbersWhichAlredyExsistsInMenu.length &&
                            !!params
                                .map((x) => x.placeNumber)
                                .filter((x) => placeNumbersWhichAlredyExsistsInMenu.includes(x))
                                .length
                        ) {
                            throw new Error(
                                `Меню на места с номерами ${placeNumbersWhichAlredyExsistsInMenu} уже заполнено`
                            );
                        } else {
                            let result = params.flatMap((x) =>
                                this.mapUserMenuJSONToDBModel(x, foundUserMenus[0].id)
                            );
                            countOfCreatedRecords = await this.dishToMenuRepository.createMany(
                                result
                            );
                        }
                    } else {
                        let userMenu = await this.menuRepository.create({
                            userId: userId,
                            globalMenuId: targetGlobalMenu[0].id,
                            tableId: user.tableId,
                        });
                        let result = params.flatMap((x) =>
                            this.mapUserMenuJSONToDBModel(x, userMenu.id)
                        );
                        countOfCreatedRecords = await this.dishToMenuRepository.createMany(result);
                    }
                } else {
                    throw new Error('На эту дату ещё не добавлено общее меню');
                }
            });
            return baseAnswer(201, countOfCreatedRecords, []);
        } catch (e) {
            next(new HttpError(500, String(e), 'MenuService'));
        }
    }

    public async getAllGlobalMenus(next: NextFunction) {
        try {
            const data = await this.globalMenuRepository.findByCriteria(
                {},
                { orderBy: { targetDate: 'desc' } }
            );
            return baseAnswer(200, data, {});
        } catch (e) {
            next(new HttpError(500, String(e), 'MenuService'));
        }
    }

    public async getGlobalMenuById(globalMenuId: string, next: NextFunction) {
        try {
            let result = {};
            await this.databaseService.client.$transaction(async () => {
                let globalMenu = await this.globalMenuRepository.findRecordById(globalMenuId);
                let allTypesOfDish = await this.typeOfDishRepository.findAll();
                let dishToGlobalMenuItems = await this.dishToGlobalMenuRepository.findByCriteria({
                    globalMenuId: globalMenuId,
                });
                let uniqueFoodIntakesIds = new Set(
                    dishToGlobalMenuItems.map((x) => x.typeOfFoodIntakeId)
                );
                let grouppedByItakesId = Array.from(uniqueFoodIntakesIds).map((x) => ({
                    typeOfFoodIntakeId: x,
                    dishes: dishToGlobalMenuItems.filter((y) => y.typeOfFoodIntakeId === x),
                }));
                let allDishesIds = grouppedByItakesId.flatMap((x) => x.dishes.map((y) => y.dishId));
                let allHavedDishes = await this.dishRepository.findByCriteria({
                    id: { in: [...allDishesIds] },
                });
                allHavedDishes = allHavedDishes.map((x) => ({
                    ...x,
                    typeOfFoodIntakeItemId: dishToGlobalMenuItems.find((y) => y.dishId === x.id)
                        .typeOfFoodIntakeId,
                }));
                result = this.mapMenuDBModelToJSON(
                    allHavedDishes,
                    allTypesOfDish,
                    grouppedByItakesId,
                    globalMenu
                );
            });
            return baseAnswer(200, result, []);
        } catch (e) {
            next(new HttpError(500, String(e), 'MenuService'));
        }
    }

    public async getSmetaByGlobalMenuId(globalMenuId: string, next: NextFunction) {
        try {
            const targetGlobalMenu = await this.globalMenuRepository.findRecordById(globalMenuId);
            const allUserMenusByGlobalMenuId = await this.menuRepository
                .findByCriteria({
                    globalMenuId: globalMenuId,
                })
                .then((menus) => menus.map((x) => ({ userId: x.userId, tableId: x.tableId })));
            const allMenus = await Promise.all(
                allUserMenusByGlobalMenuId.map(
                    async (x) =>
                        await this.getUserMenuByDate(
                            x.userId,
                            targetGlobalMenu.targetDate,
                            next,
                            x.tableId
                        ).then(async (x) => {
                            const table = await this.tableRepository.findRecordById(
                                // @ts-ignore
                                x.data[0].tableId
                            );
                            return !!x && { smeta: x.data, tableNumber: table.tableNumber };
                        })
                )
            );
            return baseAnswer(200, allMenus, []);
        } catch (e) {
            next(new HttpError(500, String(e), 'MenuService'));
        }
    }

    public async getUserMenuByDate(
        userId: string,
        targetDate: string,
        next: NextFunction,
        tableId?: string
    ) {
        try {
            let result = {};
            await this.databaseService.client.$transaction(async () => {
                let targetGlobalMenu = await this.globalMenuRepository
                    .findByCriteria({
                        targetDate: targetDate,
                    })
                    .then((x) => x[0]);
                if (!!targetGlobalMenu) {
                    let user = await this.userRepository.findRecordById(userId);
                    if (!user) {
                        throw new Error(`Не был найден пользователь с id = ${userId}`);
                    }
                    let userMenu = await this.menuRepository.findByCriteria({
                        globalMenuId: targetGlobalMenu.id,
                        tableId: user.tableId,
                    });
                    if (!!userMenu.length) {
                        let allTypesOfDish = await this.typeOfDishRepository.findAll();
                        let dishToMenuItems = await this.dishToMenuRepository.findByCriteria({
                            menuId: userMenu[0].id,
                        });
                        let uniqueFoodIntakesIds = new Set(
                            dishToMenuItems.map((x) => x.typeOfFoodIntakeId)
                        );
                        let grouppedByItakesId = Array.from(uniqueFoodIntakesIds).map((x) => ({
                            typeOfFoodIntakeId: x,
                            dishes: dishToMenuItems.filter((y) => y.typeOfFoodIntakeId === x),
                        }));
                        let allDishesIds = grouppedByItakesId.flatMap((x) =>
                            x.dishes.map((y) => y.dishId)
                        );
                        let allHavedDishes = await this.dishRepository.findByCriteria({
                            id: { in: [...allDishesIds] },
                        });
                        let parsedAllHavedDishes = dishToMenuItems.map((x) => {
                            let targetDish = { ...allHavedDishes.find((y) => y.id === x.dishId) };
                            targetDish.placeNumber = x.placeNumber;
                            targetDish.typeOfFoodIntakeItemId = x.typeOfFoodIntakeId;
                            return targetDish;
                        });
                        let grouppedByPlaceNumber = Object.entries(
                            parsedAllHavedDishes.reduce(
                                (
                                    acc: { [x: string]: any },
                                    item: { placeNumber: string | number }
                                ) => ({
                                    ...acc,
                                    [item.placeNumber]: [...(acc[item.placeNumber] ?? []), item],
                                }),
                                {}
                            )
                        );
                        result = grouppedByPlaceNumber.map((x: any) => ({
                            ...this.mapMenuDBModelToJSON(
                                x[1],
                                allTypesOfDish,
                                grouppedByItakesId,
                                targetGlobalMenu,
                                tableId
                            ),
                            placeNumber: x[0],
                        }));
                    } else {
                        throw new Error('На эту дату ещё не добавлено пользовательское меню');
                    }
                } else {
                    throw new Error('На эту дату ещё не добавлено общее меню');
                }
            });
            return baseAnswer(200, result, []);
        } catch (e) {
            next(new HttpError(500, String(e), 'MenuService'));
        }
    }
}
