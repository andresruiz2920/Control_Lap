import { ICreateLoanDTO, EstadoRevision } from '../dtos/loan.dto';

export type LoanStatus = 'PENDIENTE_APROBACION' | 'APROBADO_Y_FIRMADO';

export interface Loan extends ICreateLoanDTO {
  id: number; // BIGINT
  roomId: string; // UUID (references rooms)
  instructorId: string; // UUID (references users - instructor)
  guardaId: string; // UUID (references users - guarda)
  numeroPc: number;
  estado: EstadoRevision;
  createdAt: string; // ISO string (TIMESTAMPTZ)
  acceptedAt: string | null; // ISO string or null (TIMESTAMPTZ)
}

export interface LoanFilters {
  roomId?: string;
}

// Tipo auxiliar que excluye los campos generados por la base de datos
export type CreateLoanInput = Omit<
  ICreateLoanDTO,
  'id' | 'estado' | 'createdAt' | 'acceptedAt'
>;

export interface LoanRepository {
  create(input: CreateLoanInput): Promise<Loan>;
  findAll(filters?: LoanFilters): Promise<Loan[]>;
  findById(id: number): Promise<Loan | null>;
  updateStatus(
    id: number,
    expectedStatus: LoanStatus,
    status: LoanStatus
  ): Promise<Loan | null>;
}