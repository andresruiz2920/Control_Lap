import { Request, Response } from 'express';
import { featureService } from '../container'; // Asegúrate de que esté registrado en tu contenedor
import { DomainError } from '../errors/domain.errors';
import { ICreateFeatureDTO, EstadoReporte, PrioridadReporte } from '../dtos/feature.dto';

export class FeatureController {
  public static createFeature = async (
    req: Request<Record<string, string>, unknown, ICreateFeatureDTO>,
    res: Response
  ): Promise<void> => {
    const feature = await featureService.createFeature(req.body);
    res.status(201).json({ success: true, data: feature });
  };

  public static getFeaturesByFilter = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { equipmentId, estado, prioridad } = req.query;

    if (equipmentId !== undefined && typeof equipmentId !== 'string') {
      throw new DomainError(
        'VALIDATION_ERROR',
        'El filtro equipmentId debe ser un texto.'
      );
    }
    if (estado !== undefined && typeof estado !== 'string') {
      throw new DomainError(
        'VALIDATION_ERROR',
        'El filtro estado debe ser un texto.'
      );
    }
    if (prioridad !== undefined && typeof prioridad !== 'string') {
      throw new DomainError(
        'VALIDATION_ERROR',
        'El filtro prioridad debe ser un texto.'
      );
    }

    const features = await featureService.getFeatures({ 
      equipmentId, 
      estado: estado as EstadoReporte, 
      prioridad: prioridad as PrioridadReporte 
    });
    
    res.status(200).json({ success: true, data: features });
  };

  public static getFeatureById = async (
    req: Request<{ id: string }>,
    res: Response
  ): Promise<void> => {
    // Si tu ID de feature es UUID (string), pasamos req.params.id directamente. 
    // Si fuera numérico usarías Number(req.params.id) como en Loan.
    const feature = await featureService.getFeatureDetail(req.params.id);
    res.status(200).json({ success: true, data: feature });
  };

  public static changeFeatureEstado = async (
    req: Request<{ id: string }, unknown, { estado: EstadoReporte }>,
    res: Response
  ): Promise<void> => {
    const { estado } = req.body;
    const feature = await featureService.changeEstado(req.params.id, estado);
    res.status(200).json({ success: true, data: feature });
  };
}