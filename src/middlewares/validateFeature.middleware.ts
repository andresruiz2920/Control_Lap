import { Request, Response, NextFunction } from 'express';
import { ICreateFeatureDTO } from '../dtos/feature.dto';

// Función auxiliar para validar UUIDs si ya la tienes en tu proyecto, o puedes usar una regex estándar
const isUuid = (id: unknown): id is string => {
  if (typeof id !== 'string') return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

// Type Guard para validar la estructura de ICreateIncidentDTO acorde al esquema SQL
const isCreateIncidentDTO = (value: unknown): value is ICreateFeatureDTO => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  const incident = value as Record<string, unknown>;

  const allowedFields = new Set([
    'equipmentId',
    'reportedBy',
    'descripcion',
    'prioridad',
    'estado'
  ]);

  const hasOnlyAllowedKeys = Object.keys(incident).every((key) => allowedFields.has(key));
  if (!hasOnlyAllowedKeys) return false;

  return (
    isUuid(incident.equipmentId) &&
    isUuid(incident.reportedBy) &&
    typeof incident.descripcion === 'string' &&
    incident.descripcion.trim() !== '' &&
    (incident.prioridad === 'BAJA' || incident.prioridad === 'MEDIA' || incident.prioridad === 'ALTA') &&
    (incident.estado === undefined || 
      incident.estado === 'PENDIENTE' || 
      incident.estado === 'EN_PROCESO' || 
      incident.estado === 'RESUELTA')
  );
};

// Middleware de validación de Express
export const validateIncidentPayload = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const body: unknown = req.body;

  if (!isCreateIncidentDTO(body)) {
    res.status(400).json({
      success: false,
      error: 'Datos de la incidencia inválidos o incompleto.'
    });
    return;
  }

  next();
};