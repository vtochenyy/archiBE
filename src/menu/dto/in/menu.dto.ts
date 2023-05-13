import {IsArray, IsDateString, IsNotEmpty} from "class-validator";
import {TypeOfFoodIntakeItemDto} from "./typeOfFoodIntakeItem.dto";

export class MenuDto {
    @IsDateString()
    targetDate: string;

    @IsArray()
    @IsNotEmpty()
    typeOfFoodIntakeItems: TypeOfFoodIntakeItemDto[];
}