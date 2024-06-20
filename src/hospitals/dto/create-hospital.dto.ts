import { IsNotEmpty } from 'class-validator';

export class CreateHospitalDto {
  @IsNotEmpty()
  name: string;
}
