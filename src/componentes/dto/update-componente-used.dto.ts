import { PartialType } from "@nestjs/mapped-types";
import { CreateComponenteUsedDto } from "./create-componente-used.dto";

export class UpdateComponenteUsedDto extends PartialType(CreateComponenteUsedDto) {
  used_date?: string;
  quantity?: number;
  patient?: string;
  hospital_id?: number;
}