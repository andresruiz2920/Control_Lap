import { Request, Response, NextFunction } from 'express';
import { ICreateUserDTO, Rol } from '../dtos/user.dto'; // Asegúrate de importar tu Rol enum o tipo

// Type Guard para validar la estructura de ICreateUserDTO según tu esquema SQL
const isCreateUserDTO = (value: unknown): value is ICreateUserDTO => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  const user = value as Record<string, unknown>;

  const allowedFields = new Set([
    'id',
    'email',
    'nombre',
    'rol',
    'activo',
    'createdAt'
  ]);

  return (
    (user.id === undefined || typeof user.id === 'string') &&
    typeof user.email === 'string' &&
    user.email.trim() !== '' &&
    typeof user.nombre === 'string' &&
    user.nombre.trim() !== '' &&
    // Validamos que el rol sea uno de los permitidos en tu base de datos ('ADMIN', 'GUARDA', 'INSTRUCTOR')
    (user.rol === Rol.ADMIN || user.rol === Rol.GUARDA || user.rol === Rol.INSTRUCTOR) &&
    (user.activo === undefined || typeof user.activo === 'boolean') &&
    (user.createdAt === undefined || typeof user.createdAt === 'string')
  );
};

// Middleware de validación de Express
export const validateUserPayload = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const body: unknown = req.body;

  if (!isCreateUserDTO(body)) {
    res.status(400).json({
      success: false,
      error: 'Datos del usuario inválidos o incompletos.'
    });
    return;
  }

  next();
};
