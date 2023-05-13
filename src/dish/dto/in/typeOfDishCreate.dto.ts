import { IsInt, IsString, Length, Max, Min } from "class-validator";

export class TypeOfDishCreateDtoIn {
  @IsInt()
  @Min(1)
  @Max(20)
  code: number;

  @IsString()
  @Length(4, 100)
  description: string;
}