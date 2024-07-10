import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailsService {
  mailTransport() {
    return nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: parseInt(process.env.MAIL_PORT, 10),
      secure: false, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async sendMail(procedimientos: any[]) {
    const info = await this.mailTransport().sendMail({
      from: 'COMPRANET | OLTECH <oltech.computers.general@gmail.com>',
      to: 'alberto.cm4007@gmail.com, pramirez@oltech.mx, jolivares@oltech.mx', 
      subject: 'Procedimientos de COMPRANET para Oltech',
      html: `
    <div
      style="background-color: #f3f3f3; border-radius: 20px; padding: 40px 0"
    >
      <div style="text-align: center">
        <img
          src="https://i.imgur.com/rIhhyNP.png"
          alt="Oltech"
          width="200"
          style="margin: 0 auto"
        />
      </div>

      <div
        style="
          background-color: #fff;
          padding: 32px;
          border-radius: 20px;
          max-width: max-content;
          margin: 0 auto;
          margin-top: 40px;
        "
      >
        <h1>Equipo Oltech!</h1>
        <p>
          Hemos realizado una busqueda de los procedimientos de COMPRANET y 
          estos son los que tienen mas relevancia en el mercado.
        </p>

        <div style="display: grid; gap: 20px;">
          ${procedimientos.map(
            (procedimiento) => 
              `<div style="padding-top: 10px; padding-bottom: 10px; border-bottom: 1px solid #000;">
                  <h4>${procedimiento.descripcion}</h4>
                  <p><b>N. Procedimiento:</b> ${procedimiento.numero_procedimiento}</p>
                  <p><b>Status:</b> ${procedimiento.estatus.nombre}</p>
                  <p><b>Fecha de apertura:</b> ${procedimiento.fecha_apertura_proposicion}</p>
                  <p><b>Tipo de procedimiento:</b> ${procedimiento.tipo_procedimiento.nombre}</p>
                </div>
              `
          )}
        </div>
        <div style="text-align: center; margin-top: 20px;">
          <p>
            Atentamente,<br />
            El equipo de Oltech
          </p>
          <img src="https://i.imgur.com/rIhhyNP.png" alt="Oltech" width="150" />
        </div>
      </div>
    </div>
    `,
    });

    console.log('Message sent: %s', info.messageId);
  }
}
