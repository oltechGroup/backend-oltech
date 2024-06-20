import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateComponenteUsedDto {
  @IsNotEmpty()
  componente_id: string;
  @IsNumber()
  @IsNotEmpty()
  hospital_id: number;
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
  @IsNotEmpty()
  patient: string;
  @IsNotEmpty()
  used_date: string;
}
