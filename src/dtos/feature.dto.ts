export enum PrioridadReporte {
  BAJA = 'BAJA',
  MEDIA = 'MEDIA',
  ALTA = 'ALTA'
}

export enum EstadoReporte {
  PENDIENTE = 'PENDIENTE',
  EN_PROCESO = 'EN_PROCESO',
  RESUELTA = 'RESUELTA'
}

export interface Feature {
  id: string;
  equipmentId: string;
  reportedBy: string;
  descripcion: string;
  prioridad: PrioridadReporte;
  estado: EstadoReporte;
  createdAt: string;
}

export interface ICreateFeatureDTO {
  equipmentId: string;
  reportedBy: string;
  descripcion: string;
  prioridad: PrioridadReporte;
  estado?: EstadoReporte;
}