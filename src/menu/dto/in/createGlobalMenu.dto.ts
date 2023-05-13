import {IsObject} from "class-validator";
import {MenuDto} from "./menu.dto";

export class CreateGlobalMenuDtoIn {
    @IsObject()
    menu: MenuDto;
}