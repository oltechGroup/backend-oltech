import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseFilePipeBuilder,
  Patch,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-users.dto';
import { ResponsePagination } from 'src/common/dto/response.dto';
import { IResponsePagination } from 'src/common/interfaces/responsePagination.interface';
import { FileInterceptor } from '@nestjs/platform-express';

type UserModel = {
  id: string;
  name: string;
  lastname: string;
  email: string;
  role: string;
  active: boolean;
};

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    const users = await this.usersService.findAll();

    const info: IResponsePagination = {
      success: true,
      message: 'Usuarios obtenidos correctamente',
      totalCount: users.length,
      perPage: 20,
      totalPages: Math.ceil(users.length / 20),
      currentPage: 1,
      next: null,
      prev: null,
    };

    return new ResponsePagination<UserModel>(info, users);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Patch('update-avatar/:id')
  @UseInterceptors(FileInterceptor('file'))
  updateAvatar(
    @Param('id') id: string,
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return this.usersService.updateAvatar(id, file);
  }
}
