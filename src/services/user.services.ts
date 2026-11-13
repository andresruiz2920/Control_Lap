import { ICreateUserDTO, Rol } from '../dtos/user.dto';
import { DomainError } from '../errors/domain.errors';
import {
  User,
  UserFilters,
  UserRepository
} from '../repositories/user.repository';

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  public async createUser(input: ICreateUserDTO): Promise<User> {
    const email = input.email?.trim().toLowerCase();
    const nombre = input.nombre?.trim();

    if (!email || !this.isEmail(email)) {
      throw new DomainError(
        'VALIDATION_ERROR',
        'El email no tiene un formato válido.'
      );
    }
    if (!nombre) {
      throw new DomainError(
        'VALIDATION_ERROR',
        'El nombre es obligatorio.'
      );
    }
    if (!this.isRol(input.rol)) {
      throw new DomainError(
        'VALIDATION_ERROR',
        `El rol debe ser uno de: ${Object.values(Rol).join(', ')}.`
      );
    }

    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      throw new DomainError(
        'CONFLICT',
        'Ya existe un usuario registrado con ese email.'
      );
    }

    return this.userRepository.create({ email, nombre, rol: input.rol });
  }

  public async getUsers(filters: UserFilters = {}): Promise<User[]> {
    if (filters.rol !== undefined && !this.isRol(filters.rol)) {
      throw new DomainError(
        'VALIDATION_ERROR',
        `El filtro rol debe ser uno de: ${Object.values(Rol).join(', ')}.`
      );
    }
    if (filters.activo !== undefined && typeof filters.activo !== 'boolean') {
      throw new DomainError(
        'VALIDATION_ERROR',
        'El filtro activo debe ser booleano.'
      );
    }
    return this.userRepository.findAll({
      rol: filters.rol,
      activo: filters.activo
    });
  }

  public async getUserDetail(id: string): Promise<User> {
    this.validateId(id);
    const user = await this.userRepository.findById(id.toLowerCase());
    if (!user) {
      throw new DomainError(
        'NOT_FOUND',
        `No existe un usuario con identificador ${id}.`
      );
    }
    return user;
  }

  public async activateUser(id: string): Promise<User> {
    return this.changeActive(id, true);
  }

  public async deactivateUser(id: string): Promise<User> {
    return this.changeActive(id, false);
  }

  private async changeActive(id: string, activo: boolean): Promise<User> {
    this.validateId(id);
    const normalizedId = id.toLowerCase();

    const current = await this.userRepository.findById(normalizedId);
    if (!current) {
      throw new DomainError(
        'NOT_FOUND',
        `No existe un usuario con identificador ${id}.`
      );
    }
    if (current.activo === activo) {
      throw new DomainError(
        'CONFLICT',
        activo
          ? 'El usuario ya está activo.'
          : 'El usuario ya está inactivo.'
      );
    }

    const updated = await this.userRepository.setActive(normalizedId, activo);
    if (!updated) {
      throw new DomainError(
        'NOT_FOUND',
        `No existe un usuario con identificador ${id}.`
      );
    }
    return updated;
  }

  private validateId(id: string): void {
    if (typeof id !== 'string' || !this.isUuid(id)) {
      throw new DomainError(
        'VALIDATION_ERROR',
        'El identificador del usuario debe ser un UUID válido.'
      );
    }
  }

  private isRol(value: unknown): value is Rol {
    return Object.values(Rol).includes(value as Rol);
  }

  private isEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  private isUuid(value: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
  }
}