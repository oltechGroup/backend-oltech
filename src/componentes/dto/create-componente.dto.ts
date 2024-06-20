import { IsDate, IsNotEmpty, IsNumber } from "class-validator";

export class  CreateComponenteDto {
  @IsNotEmpty()
  measures: string;
  @IsNotEmpty()
  category: string;
  @IsNumber()
  @IsNotEmpty()
  stock: number;
  @IsNotEmpty()
  lote: string;
  @IsNotEmpty()
  caducidad: string;
}
