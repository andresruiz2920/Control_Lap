import { ICreateUserDTO, Rol } from '../dtos/user.dto';

export interface User extends ICreateUserDTO {
  id: string;        // UUID
  activo: boolean;
  createdAt: string; // ISO
}

export interface UserFilters {
  rol?: Rol;
  activo?: boolean;
}

export interface UserRepository {
  create(input: ICreateUserDTO): Promise<User>;
  findAll(filters?: UserFilters): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  setActive(id: string, activo: boolean): Promise<User | null>;
}