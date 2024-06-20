import { Injectable } from '@nestjs/common';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { UpdateHospitalDto } from './dto/update-hospital.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma, hospitals as Hospital } from '@prisma/client';

@Injectable()
export class HospitalsService {
  constructor(private prisma: PrismaService) {}

  create(createHospitalDto: CreateHospitalDto, userId: string) {
    return this.prisma.hospitals.create({
      data: {
        ...createHospitalDto,
        users: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.hospitalsWhereUniqueInput;
    where?: Prisma.hospitalsWhereInput;
    orderBy?: Prisma.hospitalsOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params;

    return this.prisma.hospitals.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      select: {
        id: true,
        name: true,
        registration_date: true,
        users: {
          select: {
            id: true,
            name: true,
            lastname: true,
          },
        },
      },
    });
  }

  update(id: number, updateHospitalDto: UpdateHospitalDto) {
    return this.prisma.hospitals.update({
      where: { id },
      data: {
        name: updateHospitalDto.name,
      },
    });
  }

  async select() {
    const hospitals = await this.prisma.hospitals.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    // Find the hospital with id 14
    const hospital14 = hospitals.find((hospital) => hospital.id === 14);

    // Remove the hospital with id 14 from the array
    const otherHospitals = hospitals.filter((hospital) => hospital.id !== 14);

    // If the hospital with id 14 was found, add it at the beginning of the array
    if (hospital14) {
      otherHospitals.unshift(hospital14);
    }

    return otherHospitals;
  }

  remove(id: number) {
    return this.prisma.hospitals.delete({
      where: { id },
    });
  }
}
