import { IsEmail, IsNotEmpty } from "class-validator";

export class loginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  password: string;
}
