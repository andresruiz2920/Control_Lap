import { Request, Response } from 'express';
import { roomService } from '../container';
import { DomainError } from '../errors/domain.errors';
import { ICreateRoomDTO, EstadoSala } from '../dtos/room.dto';

export class RoomController {
  public static createRoom = async (
    req: Request<Record<string, string>, unknown, ICreateRoomDTO>,
    res: Response
  ): Promise<void> => {
    const room = await roomService.createRoom(req.body);
    res.status(201).json({ success: true, data: room });
  };

  public static getRoomsByFilter = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { bloque, estado } = req.query;

    if (bloque !== undefined && typeof bloque !== 'string') {
      throw new DomainError(
        'VALIDATION_ERROR',
        'El filtro bloque debe ser un texto.'
      );
    }
    if (estado !== undefined && typeof estado !== 'string') {
      throw new DomainError(
        'VALIDATION_ERROR',
        'El filtro estado debe ser un texto.'
      );
    }

    const rooms = await roomService.getRooms({ 
      bloque, 
      estado: estado as EstadoSala 
    });
    
    res.status(200).json({ success: true, data: rooms });
  };

  public static getRoomById = async (
    req: Request<{ id: string }>,
    res: Response
  ): Promise<void> => {
    const room = await roomService.getRoomDetail(req.params.id);
    res.status(200).json({ success: true, data: room });
  };

  public static changeRoomEstado = async (
    req: Request<{ id: string }, unknown, { estado: EstadoSala }>,
    res: Response
  ): Promise<void> => {
    const { estado } = req.body;
    const room = await roomService.changeEstado(req.params.id, estado);
    res.status(200).json({ success: true, data: room });
  };
}