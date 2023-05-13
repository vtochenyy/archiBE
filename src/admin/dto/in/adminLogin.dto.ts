import { IsString, Length } from "class-validator";

export class AdminLoginDtoIn {
  @IsString()
  @Length(4, 50)
  login: string;

  @IsString()
  @Length(4, 50)
  password: string;
}