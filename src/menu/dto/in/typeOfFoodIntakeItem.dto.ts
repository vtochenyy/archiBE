import {IsArray, IsNotEmpty, IsString} from "class-validator";
import {TypeOfDishItemDto} from "./typeOfDishItem.dto";

export class TypeOfFoodIntakeItemDto {
    @IsString()
    @IsNotEmpty()
    typeOfFoodIntakeItemId: string;

    @IsArray()
    @IsNotEmpty()
    dishes: string[]
}