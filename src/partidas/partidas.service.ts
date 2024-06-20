import { Injectable } from '@nestjs/common';
import { CreatePartidaDto } from './dto/create-partida.dto';
import { UpdatePartidaDto } from './dto/update-partida.dto';

@Injectable()
export class PartidasService {
  create(createPartidaDto: CreatePartidaDto) {
    return 'This action adds a new partida';
  }

  findAll() {
    return `This action returns all partidas`;
  }

  findOne(id: number) {
    return `This action returns a #${id} partida`;
  }

  update(id: number, updatePartidaDto: UpdatePartidaDto) {
    return `This action updates a #${id} partida`;
  }

  remove(id: number) {
    return `This action removes a #${id} partida`;
  }
}
