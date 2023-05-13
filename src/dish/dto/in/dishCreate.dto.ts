import {
    IsArray,
    IsBoolean,
    IsDecimal,
    IsEmpty,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsPositive,
    IsString,
    Max,
    Min,
} from 'class-validator';

export class DishCreateDtoIn {
    @IsString()
    @IsNotEmpty()
    private name: string;

    @IsString()
    @IsNotEmpty()
    private weight: string;

    @IsArray()
    @IsOptional()
    private dieta?: string;

    @IsPositive()
    @IsInt()
    @Min(0)
    @Max(1000)
    private protein: number;

    @IsPositive()
    @IsInt()
    @Min(0)
    @Max(1000)
    private fats: number;

    @IsPositive()
    @IsInt()
    @Min(0)
    @Max(1000)
    private carbohydrates: number;

    @IsPositive()
    @IsNumber()
    @Min(0)
    @Max(10000)
    private calories: number;

    @IsBoolean()
    private isForKids: boolean;

    @IsBoolean()
    @IsOptional()
    private isDefaultDish?: boolean;

    @IsEmpty()
    private createdAt: string;

    @IsString()
    private typeOfDishId: string;
}
