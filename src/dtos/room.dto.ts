export enum EstadoSala {
  OPERATIVO = 'OPERATIVO',
  MANTENIMIENTO = 'MANTENIMIENTO',
  INACTIVO = 'INACTIVO',
}

export interface ICreateRoomDTO {
  nombre: string;
  bloque: string;
  capacidadPcs: number;
  estado: EstadoSala;
}