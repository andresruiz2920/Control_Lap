import { Request, Response } from 'express';
import { userService } from '../container';
import { DomainError } from '../errors/domain.errors';
import { ICreateRoomDTO, EstadoSala } from '../dtos/room.dto';

export class UserController {
  public static createUser = async (
    req: Request<Record<string, string>, unknown, ICreateRoomDTO>,
    res: Response
  ): Promise<void> => {
    const Room = await roomService.createRoom(req.body);
    res.status(201).json({ success: true, data: user });
  };

  public static getUsersByFilter = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { rol, activo } = req.query;

    if (rol !== undefined && typeof rol !== 'string') {
      throw new DomainError(
        'VALIDATION_ERROR',
        'El filtro rol debe ser un texto.'
      );
    }
    if (activo !== undefined && activo !== 'true' && activo !== 'false') {
      throw new DomainError(
        'VALIDATION_ERROR',
        'El filtro activo debe ser "true" o "false".'
      );
    }

    const users = await userService.getUsers({
      rol: rol?.toUpperCase() as Rol | undefined,
      activo: activo === undefined ? undefined : activo === 'true'
    });
    res.status(200).json({ success: true, data: users });
  };

  public static getUserById = async (
    req: Request<{ id: string }>,
    res: Response
  ): Promise<void> => {
    const user = await userService.getUserDetail(req.params.id);
    res.status(200).json({ success: true, data: user });
  };

  public static activateUser = async (
    req: Request<{ id: string }>,
    res: Response
  ): Promise<void> => {
    const user = await userService.activateUser(req.params.id);
    res.status(200).json({ success: true, data: user });
  };

  public static deactivateUser = async (
    req: Request<{ id: string }>,
    res: Response
  ): Promise<void> => {
    const user = await userService.deactivateUser(req.params.id);
    res.status(200).json({ success: true, data: user });
  };
}