import { IsArray, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateRemissionDto {
  @IsNotEmpty({ message: 'El nombre es requerido' })
  name: string;
  @IsNotEmpty({ message: 'La fecha de remisión es requerida' })
  date_remission: string;
  @IsArray()
  @IsNotEmpty()
  componentes: Array<{
    id: string;
    quantity: number;
  }>;
  @IsOptional()
  @IsNumber()
  hospital_id: number;
  @IsOptional()
  client: string;
  @IsOptional()
  encargado: string;
}
