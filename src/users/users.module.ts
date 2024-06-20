import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from 'src/prisma.service';
import { UsersController } from './users.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';

@Module({
  providers: [UsersService, PrismaService],
  exports: [UsersService],
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const extName = path.extname(file.originalname).toLowerCase();
          const fileName = path.basename(file.originalname, extName);
          callback(null, `${fileName}-${Date.now()}${extName}`);
        },
      }),
    }),
  ],
  controllers: [UsersController],
})
export class UsersModule {}
