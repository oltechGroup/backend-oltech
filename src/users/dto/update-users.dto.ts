import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { Role } from 'src/auth/auth.service';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name: string;
  @IsString()
  @IsOptional()
  lastname: string;
  @IsEnum(Role)
  @IsOptional()
  role: Role;
  @IsEmail()
  @IsOptional()
  email: string;
}
