import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class TypeOfFoodIntakeItemDto {
    @IsString()
    @IsNotEmpty()
    typeOfFoodIntakeItemId: string;

    @IsArray()
    @IsNotEmpty()
    dishes: string[];
}
