import { loginDto } from './login.dto';
import { IsNotEmpty } from 'class-validator';
import { Role } from '../auth.service';

export class SignupDto extends loginDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  lastname: string;
  @IsNotEmpty()
  role: Role;
}
