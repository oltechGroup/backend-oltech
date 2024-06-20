import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcrypt';

export enum Role {
  ADMIN = 'Admin',
  USER = 'user',
  INSTRUMENT = 'Instrumentista',
  SUPPORT = 'Apoyo',
  INVENTORY = 'Inventario',
  STORE = 'Almacen',
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException();
    }

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException();
    }

    const { password, ...userData } = user;
    const payload = { sub: user.id, email: user.email };

    // Set active user
    await this.usersService.updateActive(user.id, true);
    
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: userData,
    };
  }

  async signUp(data: {
    email: string;
    password: string;
    name: string;
    role: Role;
    lastname: string;
  }) {
    const user = await this.usersService.findOneByEmail(data.email);
    if (user) {
      throw new UnauthorizedException();
    }

    const saltOrRounds = 10;
    const hash = await bcrypt.hash(data.password, saltOrRounds);

    const newUser = await this.usersService.create({
      id: uuid(),
      email: data.email,
      password: hash,
      role: data.role,
      name: data.name,
      lastname: data.lastname,
      active: true
    });

    const payload = { sub: newUser.id, email: newUser.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: newUser,
    };
  }

  async logout(id: string) {
    return this.usersService.updateActive(id, false);
  }
}
