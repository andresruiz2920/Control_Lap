import { ICreateFeatureDTO, EstadoReporte, PrioridadReporte } from '../dtos/feature.dto';

export interface Feature extends ICreateFeatureDTO {
  id: string;
  estado: EstadoReporte;
  createdAt: string;
}

export interface FeatureFilters {
  equipmentId?: string;
  estado?: EstadoReporte;
  prioridad?: PrioridadReporte; // <- Asegúrate de incluir esta línea
}

export interface FeatureRepository {
  create(input: ICreateFeatureDTO): Promise<Feature>;
  findAll(filters?: FeatureFilters): Promise<Feature[]>;
  findById(id: string): Promise<Feature | null>;
  updateEstado(
    id: string,
    expectedEstado: EstadoReporte,
    estado: EstadoReporte
  ): Promise<Feature | null>;
}