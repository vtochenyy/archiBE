import {IsNotEmpty, IsNumber, IsOptional, IsString, Length, Max, Min} from "class-validator";

export class RegisterUserDtoIn {
    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    @Max(100)
    tableNumber: number;

    @IsOptional()
    @Length(1, 10)
    itemNumber?: number;
}