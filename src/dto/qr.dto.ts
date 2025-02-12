import { IsNumber, IsObject, IsString } from "class-validator";

export class clientDTO {
  @IsString()
  nombreCliente: string;

  @IsString()
  ciCliente: string;

  constructor(nombreCliente: string, ciCliente: string) {
    this.nombreCliente = nombreCliente;
    this.ciCliente = ciCliente;
  }
}

export class transactionDTO {
  @IsNumber()
  monto: number;

  @IsString()
  moneda: string;

  @IsString()
  fechaHoraTransaccion: Date;

  @IsObject()
  cliente: clientDTO;

  constructor(
    monto: number,
    moneda: string,
    fechaHoraTransaccion: Date,
    cliente: clientDTO
  ) {
    this.monto = monto;
    this.moneda = moneda;
    this.fechaHoraTransaccion = fechaHoraTransaccion;
    this.cliente = cliente;
  }
}

export class QrDTO {
  @IsString()
  numeroReferencia: string;

  @IsString()
  estado: string;

  @IsObject()
  transacciones: transactionDTO;

  constructor(
    numeroReferencia: string,
    estado: string,
    transacciones: transactionDTO
  ) {
    this.numeroReferencia = numeroReferencia;
    this.estado = estado;
    this.transacciones = transacciones;
  }
}
