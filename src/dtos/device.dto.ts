export type TipoEquipo = 'COMPUTADOR' | 'MOUSE' | 'TECLADO' | 'CARGADOR' | 'TELEVISOR' | 'CONTROL_TV';
export type EstadoEquipo = 'OPERATIVO' | 'MANTENIMIENTO' | 'FUERA_DE_SERVICIO';

export interface ICreateDeviceDTO {
  id: string; // UUID
  placaSena: string;
  codigoActivo: string;
  tipo: TipoEquipo;
  roomId: string; // UUID
  estado: EstadoEquipo;
}