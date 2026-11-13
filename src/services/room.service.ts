import { EstadoSala, ICreateRoomDTO } from '../dtos/room.dto';
import { DomainError } from '../errors/domain.errors';
import {
  Room,
  RoomFilters,
  RoomRepository
} from '../repositories/room.repository';

export class RoomService {
  constructor(private readonly roomRepository: RoomRepository) {}

  public async createRoom(input: ICreateRoomDTO): Promise<Room> {
    const nombre = input.nombre?.trim();
    const bloque = input.bloque?.trim();

    if (!nombre) {
      throw new DomainError('VALIDATION_ERROR', 'El nombre de la sala es obligatorio.');
    }
    if (!bloque) {
      throw new DomainError('VALIDATION_ERROR', 'El bloque es obligatorio.');
    }
    if (!Number.isInteger(input.capacidadPcs) || input.capacidadPcs <= 0) {
      throw new DomainError(
        'VALIDATION_ERROR',
        'La capacidad de PCs debe ser un entero positivo.'
      );
    }
    if (!this.isEstado(input.estado)) {
      throw new DomainError(
        'VALIDATION_ERROR',
        `El estado debe ser uno de: ${Object.values(EstadoSala).join(', ')}.`
      );
    }

    const existing = await this.roomRepository.findByNombre(nombre, bloque);
    if (existing) {
      throw new DomainError(
        'CONFLICT',
        'Ya existe una sala con ese nombre en el mismo bloque.'
      );
    }

    return this.roomRepository.create({
      nombre,
      bloque,
      capacidadPcs: input.capacidadPcs,
      estado: input.estado
    });
  }

  public async getRooms(filters: RoomFilters = {}): Promise<Room[]> {
    if (filters.estado !== undefined && !this.isEstado(filters.estado)) {
      throw new DomainError(
        'VALIDATION_ERROR',
        `El filtro estado debe ser uno de: ${Object.values(EstadoSala).join(', ')}.`
      );
    }
    if (filters.bloque !== undefined && typeof filters.bloque !== 'string') {
      throw new DomainError('VALIDATION_ERROR', 'El filtro bloque debe ser un texto.');
    }
    return this.roomRepository.findAll({
      bloque: filters.bloque?.trim(),
      estado: filters.estado
    });
  }

  public async getRoomDetail(id: string): Promise<Room> {
    this.validateId(id);
    const room = await this.roomRepository.findById(id.toLowerCase());
    if (!room) {
      throw new DomainError('NOT_FOUND', `No existe una sala con identificador ${id}.`);
    }
    return room;
  }

  public async changeEstado(id: string, estado: EstadoSala): Promise<Room> {
    this.validateId(id);
    if (!this.isEstado(estado)) {
      throw new DomainError(
        'VALIDATION_ERROR',
        `El estado debe ser uno de: ${Object.values(EstadoSala).join(', ')}.`
      );
    }
    const normalizedId = id.toLowerCase();

    const current = await this.roomRepository.findById(normalizedId);
    if (!current) {
      throw new DomainError('NOT_FOUND', `No existe una sala con identificador ${id}.`);
    }
    if (current.estado === estado) {
      throw new DomainError('CONFLICT', `La sala ya se encuentra en estado ${estado}.`);
    }

    const updated = await this.roomRepository.updateEstado(normalizedId, estado);
    if (!updated) {
      throw new DomainError('NOT_FOUND', `No existe una sala con identificador ${id}.`);
    }
    return updated;
  }

  private validateId(id: string): void {
    if (typeof id !== 'string' || !this.isUuid(id)) {
      throw new DomainError('VALIDATION_ERROR', 'El identificador de la sala debe ser un UUID válido.');
    }
  }

  private isEstado(value: unknown): value is EstadoSala {
    return Object.values(EstadoSala).includes(value as EstadoSala);
  }

  private isUuid(value: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
  }
}