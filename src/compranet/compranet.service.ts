import { ConsoleLogger, Injectable } from '@nestjs/common';
import { CreateCompranetDto } from './dto/create-compranet.dto';
import { UpdateCompranetDto } from './dto/update-compranet.dto';
const fs = require('fs');
import * as path from 'path';
import axios from 'axios';

@Injectable()
export class CompranetService {
  create(createCompranetDto: CreateCompranetDto) {
    return 'This action adds a new compranet';
  }

  private readonly PROCEDIMIENTOS_PATH = path.join(__dirname, 'data/procedimientos.json');

  async checkFileExists(filePath: string) {
    console.log(this.PROCEDIMIENTOS_PATH);
    try {
      await fs.promises.access(filePath, fs.constants.F_OK);
      console.log('El archivo existe');
    } catch (err) {
      console.error('El archivo no existe');
    }
  }

  private async getProcedimientos() {
    this.checkFileExists(this.PROCEDIMIENTOS_PATH);
    // const response = await axios.get(
    //   'https://upcp-cnetservicios.hacienda.gob.mx/eiza/proveedor/procedimientos-licitante/?limit=400',
    //   {
    //     headers: {
    //       Accept: 'application/json, text/plain, */*',
    //       Authorization: `Bearer ${process.env.TOKEN_COMPRANET}`,
    //       'User-Agent': 'Thunder Client (https://www.thunderclient.com)',
    //       'Accept-Language': 'gzip, deflate, br, zstd',
    //       'Accept-Encoding': 'gzip, deflate, br, zstd',
    //     },
    //   },
    // );
    // const { data: procedimientos } = response;
    // fs.writeFileSync('./src/compranet/data/procedimientos.json', JSON.stringify(procedimientos));
    // return procedimientos;
    return [];
  }

  async findAll() {
    let procedimientos = await this.getProcedimientos();

    console.log(procedimientos);
  }

  findOne(id: number) {
    return `This action returns a #${id} compranet`;
  }

  update(id: number, updateCompranetDto: UpdateCompranetDto) {
    return `This action updates a #${id} compranet`;
  }

  remove(id: number) {
    return `This action removes a #${id} compranet`;
  }
}
