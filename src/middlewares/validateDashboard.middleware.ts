import { Request, Response, NextFunction } from 'express';
import { ICreateDashboardDTO  } from '../dtos/dashboard.dto';


// Type Guard para validar la estructura de ICreateDashboardDTO
const isCreateDashboardDTO = (value: unknown): value is ICreateDashboardDTO => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  const dashboard = value as Record<string, unknown>;

    return (
  typeof dashboard.Totalsalas === 'number' && Number.isInteger(dashboard.Totalsalas) &&
  typeof dashboard.Totaldispositivos === 'number' && Number.isInteger(dashboard.Totaldispositivos) &&
  typeof dashboard.Disonibles === 'number' && Number.isInteger(dashboard.Disonibles) &&
  typeof dashboard.Tipo === 'string' && dashboard.Tipo.trim() !== '' 
    );
};
// Middleware de validación de Express
export const validateDashboardPayload = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const body: unknown = req.body;

  if (!isCreateDashboardDTO(body)) {
    res.status(400).json({
      success: false,
      error: 'Datos del dashboard inválidos.'
    });
    return;
  }

  next();
};