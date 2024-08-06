import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class  CreateComponenteArthexDto {
  @IsNotEmpty()
  @IsString()
  nombre_comercial: string;
  @IsNotEmpty()
  @IsString()
  nombre_generico: string;
  @IsNumber()
  @IsNotEmpty()
  stock: number;
  @IsNotEmpty()
  lote: string;
  @IsNotEmpty()
  caducidad: string;
  @IsNotEmpty()
  referencia: string;
}
