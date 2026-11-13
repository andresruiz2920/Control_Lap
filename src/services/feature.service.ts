import { EstadoReporte, PrioridadReporte, ICreateFeatureDTO } from '../dtos/feature.dto';
import { DomainError } from '../errors/domain.errors';
import {
  Feature,
  FeatureFilters,
  FeatureRepository
} from '../repositories/feature.repository';

export class FeatureService {
  constructor(private readonly featureRepository: FeatureRepository) {}

  public async createFeature(input: ICreateFeatureDTO): Promise<Feature> {
    const equipmentId = input.equipmentId?.trim();
    const reportedBy = input.reportedBy?.trim();
    const descripcion = input.descripcion?.trim();

    if (!equipmentId || !this.isUuid(equipmentId)) {
      throw new DomainError('VALIDATION_ERROR', 'El identificador del equipo (equipmentId) debe ser un UUID válido.');
    }
    if (!reportedBy || !this.isUuid(reportedBy)) {
      throw new DomainError('VALIDATION_ERROR', 'El identificador del usuario que reporta (reportedBy) debe ser un UUID válido.');
    }
    if (!descripcion) {
      throw new DomainError('VALIDATION_ERROR', 'La descripción del reporte es obligatoria.');
    }
    if (!this.isPrioridad(input.prioridad)) {
      throw new DomainError(
        'VALIDATION_ERROR',
        `La prioridad debe ser una de: ${Object.values(PrioridadReporte).join(', ')}.`
      );
    }

    // Si viene un estado inicial, validarlo, de lo contrario se asignará por defecto en el repositorio/BD
    const estadoInicial = input.estado ?? 'PENDIENTE';
    if (!this.isEstado(estadoInicial)) {
      throw new DomainError(
        'VALIDATION_ERROR',
        `El estado debe ser uno de: ${Object.values(EstadoReporte).join(', ')}.`
      );
    }

    return this.featureRepository.create({
      equipmentId,
      reportedBy,
      descripcion,
      prioridad: input.prioridad,
      estado: estadoInicial
    });
  }

  public async getFeatures(filters: FeatureFilters = {}): Promise<Feature[]> {
    if (filters.estado !== undefined && !this.isEstado(filters.estado)) {
      throw new DomainError(
        'VALIDATION_ERROR',
        `El filtro estado debe ser uno de: ${Object.values(EstadoReporte).join(', ')}.`
      );
    }
    if (filters.prioridad !== undefined && !this.isPrioridad(filters.prioridad)) {
      throw new DomainError(
        'VALIDATION_ERROR',
        `El filtro prioridad debe ser uno de: ${Object.values(PrioridadReporte).join(', ')}.`
      );
    }
    if (filters.equipmentId !== undefined && (typeof filters.equipmentId !== 'string' || !this.isUuid(filters.equipmentId))) {
      throw new DomainError('VALIDATION_ERROR', 'El filtro equipmentId debe ser un UUID válido.');
    }

    return this.featureRepository.findAll({
      equipmentId: filters.equipmentId?.trim(),
      estado: filters.estado,
      prioridad: filters.prioridad
    });
  }

  public async getFeatureDetail(id: string): Promise<Feature> {
    this.validateId(id);
    const normalizedId = id.toLowerCase();
    
    const feature = await this.featureRepository.findById(normalizedId);
    if (!feature) {
      throw new DomainError('NOT_FOUND', `No existe un reporte con identificador ${id}.`);
    }
    return feature;
  }

  public async changeEstado(id: string, nuevoEstado: EstadoReporte): Promise<Feature> {
    this.validateId(id);
    if (!this.isEstado(nuevoEstado)) {
      throw new DomainError(
        'VALIDATION_ERROR',
        `El estado debe ser uno de: ${Object.values(EstadoReporte).join(', ')}.`
      );
    }
    const normalizedId = id.toLowerCase();

    const current = await this.featureRepository.findById(normalizedId);
    if (!current) {
      throw new DomainError('NOT_FOUND', `No existe un reporte con identificador ${id}.`);
    }
    if (current.estado === nuevoEstado) {
      throw new DomainError('CONFLICT', `El reporte ya se encuentra en estado ${nuevoEstado}.`);
    }

    const updated = await this.featureRepository.updateEstado(normalizedId, current.estado, nuevoEstado);
    if (!updated) {
      throw new DomainError('NOT_FOUND', `No existe un reporte con identificador ${id}.`);
    }
    return updated;
  }

  private validateId(id: string): void {
    if (typeof id !== 'string' || !this.isUuid(id)) {
      throw new DomainError('VALIDATION_ERROR', 'El identificador del reporte debe ser un UUID válido.');
    }
  }

  private isEstado(value: unknown): value is EstadoReporte {
    return Object.values(EstadoReporte).includes(value as EstadoReporte);
  }

  private isPrioridad(value: unknown): value is PrioridadReporte {
    return Object.values(PrioridadReporte).includes(value as PrioridadReporte);
  }

  private isUuid(value: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
  }
}