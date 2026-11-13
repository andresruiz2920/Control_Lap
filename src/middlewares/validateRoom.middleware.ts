import { Request, Response, NextFunction } from 'express';
import { ICreateRoomDTO, EstadoSala} from '../dtos/room.dto';

// Type Guard para validar la estructura de ICreateRoomDTO acorde al esquema SQL
const isCreateRoomDTO = (value: unknown): value is ICreateRoomDTO => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  const room = value as Record<string, unknown>;

  const allowedFields = new Set([
    'id',
    'nombre',
    'bloque',
    'capacidadPcs',
    'estado'
  ]);

  const hasOnlyAllowedKeys = Object.keys(room).every((key) => allowedFields.has(key));
  if (!hasOnlyAllowedKeys) return false;

  return (
    (room.id === undefined || typeof room.id === 'string') &&
    typeof room.nombre === 'string' &&
    room.nombre.trim() !== '' &&
    typeof room.bloque === 'string' &&
    room.bloque.trim() !== '' &&
    typeof room.capacidadPcs === 'number' &&
    Number.isInteger(room.capacidadPcs) &&
    room.capacidadPcs >= 0 && // Coincide con CHECK (capacidad_pcs >= 0)
    (room.estado === undefined || 
      room.estado === EstadoSala.OPERATIVO || 
      room.estado === EstadoSala.MANTENIMIENTO || 
      room.estado === EstadoSala.INACTIVO)
  );
};

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
      error: 'Datos de la sala inválidos o incompletos.'
    });
    return;
  }

  next();
};