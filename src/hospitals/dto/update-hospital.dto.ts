import { PartialType } from '@nestjs/mapped-types';
import { CreateHospitalDto } from './create-hospital.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateHospitalDto extends PartialType(CreateHospitalDto) {
  @IsNotEmpty()
  name: string;
}
