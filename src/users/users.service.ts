import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { users as UserModel } from '@prisma/client';
import { Role } from 'src/auth/auth.service';
import axios from 'axios';

import * as FormData from 'form-data';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOneByEmail(email: string): Promise<UserModel | null> {
    return this.prisma.users.findUnique({
      where: {
        email,
      },
    });
  }

  async updateAvatar(id: string, avatar: Express.Multer.File) {
    try {
      const formData = fs.createReadStream(avatar.path)

      const imageUpload = await axios.post(
        'https://api.imgur.com/3/image',
        {
          image: formData,
        },
        {
          headers: {
            Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      const URLImageUpload = imageUpload.data.data.link;

      // Delete file from server
      fs.unlinkSync(avatar.path);
      
      // Update user avatar

      return this.prisma.users.update({
        where: {
          id,
        },
        data: {
          avatar: URLImageUpload,
        },
      });
    } catch (error) {
      fs.unlinkSync(avatar.path);
      console.log(error.response);
      return error;
    }
  }

  async create(data: {
    id: string;
    email: string;
    password: string;
    name: string;
    role: Role;
    lastname: string;
    active: boolean;
  }): Promise<UserModel> {
    return this.prisma.users.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.users.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        lastname: true,
        role: true,
        active: true,
        registration_date: true,
        avatar: true,
      },
    });
  }

  async update(
    id: string,
    data: {
      name: string;
      lastname: string;
      role: Role;
      email: string;
    },
  ) {
    return this.prisma.users.update({
      where: {
        id,
      },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.users.delete({
      where: {
        id,
      },
    });
  }

  async updateActive(id: string, active: boolean) {
    return this.prisma.users.update({
      where: {
        id,
      },
      data: {
        active,
      },
    });
  }
}
