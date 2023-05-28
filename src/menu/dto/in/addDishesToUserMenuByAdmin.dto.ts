import {
    ArrayMinSize,
    IsArray,
    IsInt,
    IsNotEmpty,
    IsPositive,
    IsString,
    IsUUID,
    Max,
    Min,
} from 'class-validator';

export class AddDishesToUserMenuByAdminDtoIn {
    @IsArray()
    @ArrayMinSize(1)
    @IsNotEmpty()
    private data: any[];

    @IsString()
    @IsUUID()
    @IsNotEmpty()
    private globalMenuId: string;

    @IsInt()
    @Min(1)
    @Max(4)
    @IsPositive()
    @IsNotEmpty()
    private placeNumber: number;

    @IsString()
    @IsUUID()
    @IsNotEmpty()
    private tableId: string;

    @IsString()
    @IsUUID()
    @IsNotEmpty()
    typeOfFoodIntakeId: string;
}
