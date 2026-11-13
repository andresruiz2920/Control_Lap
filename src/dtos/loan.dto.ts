export type EstadoRevision = 'PENDIENTE_APROBACION' | 'APROBADO_Y_FIRMADO';

export interface ICreateLoanDTO {
  id: number; // BIGINT
  roomId: string; // UUID (references rooms)
  instructorId: string; // UUID (references users - instructor)
  guardaId: string; // UUID (references users - guarda)
  numeroPc: number;
  estado: EstadoRevision;
  createdAt: string; // ISO string (TIMESTAMPTZ)
  acceptedAt: string | null; // ISO string or null (TIMESTAMPTZ)
}