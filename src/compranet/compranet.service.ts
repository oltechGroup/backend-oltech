import { Injectable, Logger } from '@nestjs/common';
import { CreateCompranetDto } from './dto/create-compranet.dto';
import * as cron from 'node-cron';
const fs = require('fs');
import axios from 'axios';

@Injectable()
export class CompranetService {
  private readonly logger = new Logger(CompranetService.name);
  
  constructor() {
    this.scheduleDailyTask();
  }

  private readonly vocabulary = [
    'insumos',
    'osteosíntesis',
    'protesis',
    'endoprotesis',
    'artoscropia',
    'reemplazo',
    'articular',
    'trauma',
    'maxiliar',
    'maxilofacial',
    'placas',
    'laboratorio',
    'prótesis',
    'cadera',
    'hombro',
    'rodilla',
    'tornillos',
    'clavos',
    'fijadores',
    'columna',
  ]; 
  
  private readonly vocabularyRelevant = [
    'osteosíntesis',
    'osteosintesis',
    'protesis',
    'endoprotesis',
  ];


  async scheduleDailyTask() {
    cron.schedule('0 9 * * *', () => {
      this.handleDailyTask();
    });
  }
  
  async handleDailyTask() {
    this.logger.log('Executing daily task at 9:00 AM');
    
    await this.getProcedimientos(true)
  }
  
  private async getProcedimientos(reload = false) {
    if (fs.existsSync('procedimientos.json') && !reload) {
      console.log('Reading from file');
      return JSON.parse(fs.readFileSync('procedimientos.json'));
    } else {
      console.log('Fetching from API');
      const response = await axios.get(
        'https://upcp-cnetservicios.hacienda.gob.mx/eiza/proveedor/procedimientos-licitante/?limit=400',
        {
          headers: {
            Accept: 'application/json, text/plain, */*',
            Authorization: `Bearer ${process.env.TOKEN_COMPRANET}`,
            'Accept-Language': 'es-419,es;q=0.9,es-ES;q=0.8,en;q=0.7,en-GB;q=0.6,en-US;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br, zstd',
          },
        },
      );
      const procedimientos = response.data.results;

      // limpieza de datos
      let procedimientosCleaned = procedimientos.map((procedimiento: any) => {
        const descripcionCleaned = procedimiento.descripcion
          .toLowerCase()
          .replace(/[^a-zA-Z\s]/g, '')
          .split(' ')
          .filter((word: string) => word.length > 1);
        const nameCleaned = procedimiento.nombre_procedimiento
          .toLowerCase()
          .replace(/[^a-zA-Z\s]/g, '')
          .split(' ')
          .filter((word: string) => word.length > 1);

        return {
          ...procedimiento,
          textToProcess: [...nameCleaned, ...descripcionCleaned],
        };
      });

      fs.writeFileSync(
        'procedimientos.json',
        JSON.stringify(procedimientosCleaned),
      );

      return procedimientosCleaned;
    }
  }

  async findAllProcedimientos() {
    let procedimientos: Array<any> = await this.getProcedimientos();

    const procedimientosFiltered = procedimientos.filter((procedimiento) => {
      const textToProcess = procedimiento.textToProcess;
      const intersection = textToProcess.filter((word) =>
        this.vocabulary.includes(word),
      );
      return intersection.length > 0;
    });

    const procedimientosRelevant = procedimientosFiltered.filter(
      (procedimiento) => {
        const textToProcess = procedimiento.textToProcess;
        const intersection = textToProcess.filter((word) =>
          this.vocabularyRelevant.includes(word),
        );
        return intersection.length > 0;
      },
    );

    const response = {
      procedimientosFiltered: {
        count: procedimientosFiltered.length,
        data: procedimientosFiltered,
      },
      procedimientosRelevant: {
        count: procedimientosRelevant.length,
        data: procedimientosRelevant,
      },
    };

    return response
  }
}
