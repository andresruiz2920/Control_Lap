export enum Rol {
  ADMIN = 'ADMIN',
  INSTRUCTOR = 'INSTRUCTOR',
  GUARDA = 'GUARDA',
}

export interface ICreateUserDTO {
  email: string;
  nombre: string;
  rol: Rol;
}