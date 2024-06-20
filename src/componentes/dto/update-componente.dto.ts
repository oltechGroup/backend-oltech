import { PartialType } from "@nestjs/mapped-types";
import { CreateComponenteDto } from "./create-componente.dto";

export class UpdateComponenteDto extends PartialType(CreateComponenteDto) {
  caducidad?: string;
  lote?: string;
  stock?: number;
  measures?: string;
  category?: string;
}