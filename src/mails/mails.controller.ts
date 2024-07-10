import { Controller, Get } from '@nestjs/common';
import { MailsService } from './mails.service';
import { CompranetService } from 'src/compranet/compranet.service';

@Controller('mails')
export class MailsController {
  constructor(private readonly mailsService: MailsService, private readonly compranetService: CompranetService) {}
  
  @Get()
  async sendMail() {
    const procedimientos = await this.compranetService.findAllProcedimientos();
    return await this.mailsService.sendMail(procedimientos.procedimientosRelevant.data);
  }

}
