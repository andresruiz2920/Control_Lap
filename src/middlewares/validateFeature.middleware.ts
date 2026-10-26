import { Request, Response, NextFunction } from 'express';
import { ICreateFeatureDTO  } from '../dtos/feature.dto';


// Type Guard para validar la estructura de ICreateRoomDTO
const isCreateFeatureDTO = (value: unknown): value is ICreateFeatureDTO => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  const feature = value as Record<string, unknown>;

    return (
  typeof feature.Tipo === 'string' && feature.Tipo.trim() !== '' &&
  typeof feature.Prioridad === 'string' && feature.Prioridad.trim() !== '' &&
  typeof feature.Descripcion === 'string' && feature.Descripcion.trim() !== '' &&
  typeof feature.Fecha === 'number' &&  !isNaN(feature.Fecha) 
    );
};
// Middleware de validación de Express
export const validatefeaturePayload = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const body: unknown = req.body;

  if (!isCreateFeatureDTO(body)) {
    res.status(400).json({
      success: false,
      error: 'Datos de la sala inválidos.'
    });
    return;
  }

  next();
};