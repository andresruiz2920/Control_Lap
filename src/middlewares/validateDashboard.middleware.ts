import { Request, Response, NextFunction } from 'express';
import { ICreateDashboardDTO } from '../dtos/dashboard.dto';

// Función auxiliar para validar que un campo sea un número entero no negativo
const isValidCount = (value: unknown): value is number => {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0;
};

// Type Guard para validar la estructura de ICreateDashboardDTO
const isCreateDashboardDTO = (value: unknown): value is ICreateDashboardDTO => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  const dashboard = value as Record<string, unknown>;

  const allowedFields = new Set([
    'Totalsalas',
    'Totaldispositivos',
    'Disonibles', // Nota: Revisa si en tu DTO está escrito así o como 'Disponibles'
    'Tipo'
  ]);

  const hasOnlyAllowedKeys = Object.keys(dashboard).every((key) => allowedFields.has(key));
  if (!hasOnlyAllowedKeys) return false;

  return (
    isValidCount(dashboard.Totalsalas) &&
    isValidCount(dashboard.Totaldispositivos) &&
    isValidCount(dashboard.Disonibles) &&
    (
      dashboard.Tipo === 'COMPUTADOR' ||
      dashboard.Tipo === 'MOUSE' ||
      dashboard.Tipo === 'TECLADO' ||
      dashboard.Tipo === 'CARGADOR' ||
      dashboard.Tipo === 'TELEVISOR' ||
      dashboard.Tipo === 'CONTROL_TV'
    )
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
      error: 'Datos del dashboard inválidos o incompletos.'
    });
    return;
  }

  next();
};
