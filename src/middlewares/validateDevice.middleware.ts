import { Request, Response, NextFunction } from 'express';
import { ICreateDeviceDTO  } from '../dtos/device.dto';


// Type Guard para validar la estructura de ICreateRoomDTO
const isCreateDeviceDTO = (value: unknown): value is ICreateDeviceDTO => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  const device = value as Record<string, unknown>;

    return (
  typeof device.Codigo === 'number' && Number.isInteger(device.codigo) &&
  typeof device.Marca === 'string' && device.Marca.trim() !== '' &&
  typeof device.Sede === 'string' && device.Sede.trim() !== '' &&
  typeof device.Fecha === 'number' &&  !isNaN(device.Fecha) 
    );
};
// Middleware de validación de Express
export const validatedevicePayload = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const body: unknown = req.body;

  if (!isCreateDeviceDTO(body)) {
    res.status(400).json({
      success: false,
      error: 'Datos de la sala inválidos.'
    });
    return;
  }

  next();
};