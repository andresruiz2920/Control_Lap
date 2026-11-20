import { Request, Response, NextFunction } from 'express';
import { ICreateDeviceDTO} from '../dtos/device.dto';

// Función auxiliar para validar UUIDs
const isUuid = (id: unknown): id is string => {
  if (typeof id !== 'string') return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

// Type Guard para validar la estructura de ICreateDeviceDTO acorde al esquema SQL
const isCreateDeviceDTO = (value: unknown): value is ICreateDeviceDTO => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  const device = value as Record<string, unknown>;

  const allowedFields = new Set([
    'placaSena',
    'codigoActivo',
    'tipo',
    'roomId',
    'estado'
  ]);

  const hasOnlyAllowedKeys = Object.keys(device).every((key) => allowedFields.has(key));
  if (!hasOnlyAllowedKeys) return false;

  return (
    typeof device.placaSena === 'string' &&
    device.placaSena.trim() !== '' &&
    typeof device.codigoActivo === 'string' &&
    device.codigoActivo.trim() !== '' &&
    // Validamos que el tipo sea uno de los permitidos en la base de datos
    (
      device.tipo === 'COMPUTADOR' ||
      device.tipo === 'MOUSE' ||
      device.tipo === 'TECLADO' ||
      device.tipo === 'CARGADOR' ||
      device.tipo === 'TELEVISOR' ||
      device.tipo === 'CONTROL_TV'
    ) &&
    isUuid(device.roomId) &&
    // Estado es opcional, pero si viene debe ser uno de los válidos
    (
      device.estado === undefined ||
      device.estado === 'OPERATIVO' ||
      device.estado === 'MANTENIMIENTO' ||
      device.estado === 'FUERA_DE_SERVICIO'
    )
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
      error: 'Datos del dispositivo inválido o incompleto.'
    });
    return;
  }

  next();
};