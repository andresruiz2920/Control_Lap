import { Request, Response, NextFunction } from 'express';
import { ICreateRoomDTO  } from '../dtos/room.dto';

// Type Guard para validar la estructura de ICreateRoomDTO
const isCreateRoomDTO = (value: unknown): value is ICreateRoomDTO => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  const room = value as Record<string, unknown>;

return (
  typeof room.numeroSala === 'number' && !isNaN(room.numeroSala) &&
  typeof room.Sede === 'string' && room.Sede.trim() !== '' &&
  typeof room.Tamaño === 'string' && room.Tamaño.trim() !== '' &&
  typeof room.Tipo === 'string' && room.Tipo.trim() !== ''
);
}
// Middleware de validación de Express
export const validateRoomPayload = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const body: unknown = req.body;

  if (!isCreateRoomDTO(body)) {
    res.status(400).json({
      success: false,
      error: 'Datos de la sala inválidos.'
    });
    return;
  }

  next();
};