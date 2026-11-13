import { EstadoSala, ICreateRoomDTO } from '../dtos/room.dto';

export interface Room extends ICreateRoomDTO {
  id: string; // UUID
}

export interface RoomFilters {
  bloque?: string;
  estado?: EstadoSala;
}

export interface RoomRepository {
  create(input: ICreateRoomDTO): Promise<Room>;
  findAll(filters?: RoomFilters): Promise<Room[]>;
  findById(id: string): Promise<Room | null>;
  findByNombre(nombre: string, bloque: string): Promise<Room | null>;
  updateEstado(id: string, estado: EstadoSala): Promise<Room | null>;
}