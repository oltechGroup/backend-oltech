import { Injectable } from '@nestjs/common';
import { CreateSurgeryDto } from './dto/create-surgery.dto';
import { UpdateSurgeryDto } from './dto/update-surgery.dto';
import { Prisma, surgeries as Surgery } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class SurgeriesService {
  constructor(private prisma: PrismaService) {}

  create(createSurgeryDto: CreateSurgeryDto) {
    return 'This action adds a new surgery';
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.surgeriesWhereUniqueInput;
    where?: Prisma.surgeriesWhereInput;
    orderBy?: Prisma.surgeriesOrderByWithRelationInput;
  }): Promise<Surgery[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.surgeries.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} surgery`;
  }

  update(id: number, updateSurgeryDto: UpdateSurgeryDto) {
    return `This action updates a #${id} surgery`;
  }

  remove(id: number) {
    return `This action removes a #${id} surgery`;
  }
}
