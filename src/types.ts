import { DishService } from './dish/dish.service';
import { ExeptionFilter } from './errors/exeption.filter';
import { TypeOfDishRepository } from './dish/typeOfDish.repository';
import { IncomingQueryLogsMeddlewareService } from './middlewares/logs/incomingQueryLogsMeddleware.service';
import { IncomingQueryLogsRepository } from './middlewares/logs/incomingQueryLogs.repository';
import { GlobalMenuRepository } from './menu/globalMenuRepository.repository';
import { MenuService } from './menu/menu.service';
import { MenuController } from './menu/menu.controller';
import { AdminRepository } from './admin/admin.repository';
import { AdminService } from './admin/admin.service';
import { AdminController } from './admin/admin.controller';
import { DishToGlobalMenuRepository } from './menu/dishToGlobalMenu.repository';
import { UserService } from './user/user.service';
import { UserRepository } from './user/user.repository';
import { TableRepository } from './table/table.repository';
import { MenuRepository } from './menu/menu.repository';
import { DishToMenuRepository } from './menu/dishToMenu.repository';
import { SaveResponseInLogsMiddleware } from './middlewares/logs/saveResponseInLogs.middleware';

export const TYPES = {
    Application: Symbol.for('Application'),
    Logger: Symbol.for('Logger'),
    ConfigService: Symbol.for('ConfigService'),
    DatabaseService: Symbol.for('DatabaseService'),
    DishRepository: Symbol.for('DishRepository'),
    DishService: Symbol.for('DishService'),
    DishController: Symbol.for('DishController'),
    ExeptionFilter: Symbol.for('ExeptionFilter'),
    TypeOfDishRepository: Symbol.for('TypeOfDishRepository'),
    TypeOfFoodIntakesRepository: Symbol.for('DictionaryTypeOfEat'),
    IncomingQueryLogsMeddlewareService: Symbol.for('IncomingQueryLogsMeddlewareService'),
    IncomingQueryLogsRepository: Symbol.for('IncomingQueryLogsRepository'),
    GlobalMenuRepository: Symbol.for('GlobalMenuRepository'),
    MenuService: Symbol.for('MenuService'),
    MenuController: Symbol.for('MenuController'),
    AdminRepository: Symbol.for('AdminRepository'),
    AdminService: Symbol.for('AdminService'),
    AdminController: Symbol.for('AdminController'),
    DishToGlobalMenuRepository: Symbol.for('DishToGlobalMenuRepository'),
    UserController: Symbol.for('UserController'),
    UserService: Symbol.for('UserService'),
    UserRepository: Symbol.for('UserRepository'),
    TableRepository: Symbol.for('TableRepository'),
    MenuRepository: Symbol.for('MenuRepository'),
    DishToMenuRepository: Symbol.for('DishToMenuRepository'),
    SaveResponseInLogsMiddleware: Symbol.for('SaveResponseInLogsMiddleware'),
};
