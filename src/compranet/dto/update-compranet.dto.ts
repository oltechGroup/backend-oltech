import { PartialType } from '@nestjs/mapped-types';
import { CreateCompranetDto } from './create-compranet.dto';

export class UpdateCompranetDto extends PartialType(CreateCompranetDto) {}
