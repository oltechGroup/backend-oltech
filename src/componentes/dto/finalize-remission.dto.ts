import { IsArray, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class FinalizeRemissionDto {
  @IsArray()
  @IsNotEmpty()
  componentes: Array<{
    id: string;
    remission_quantity: number;
    quantity_delivered: number;
  }>;
}
