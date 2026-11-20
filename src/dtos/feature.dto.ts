export type PrioridadReporte = 
'BAJA' | 'MEDIA' | 'ALTA';
export type EstadoReporte = 'PENDIENTE' | 'EN_PROCESO' | 'RESUELTA';

export interface ICreateFeatureDTO {
  equipmentId: string; // UUID
  reportedBy: string; // UUID
  descripcion: string;
  prioridad: PrioridadReporte;
  estado?: EstadoReporte; // Opcional, por defecto 'PENDIENTE' en BD
}