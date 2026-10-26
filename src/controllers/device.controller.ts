import { Request, Response } from 'express';

<<<<<<< HEAD
export class FeatureController {
  public static createFeature = (req: Request, res: Response): void => {
    // TODO: llamar al servicio con req.body y responder 201 con el préstamo creado.
    res.status(501).json({
      success: false,
      message: 'El registro de características todavía no está implementado.'
    });
  };

  public static getFeaturesByFilter = (req: Request, res: Response): void => {
    // TODO: tomar los filtros de req.query, llamar al servicio y responder con los resultados.
    res.status(501).json({
      success: false,
      message: 'La consulta de características todavía no está implementada.'
    });
  };

  public static updateFeature = (req: Request, res: Response): void => {
=======
export class DeviceController {
  public static createDevice = (req: Request, res: Response): void => {
    // TODO: llamar al servicio con req.body y responder 201 con el dispositivo creado.
    res.status(501).json({
      success: false,
      message: 'El registro de dispositivos todavía no está implementado.'
    });
  };

  public static getDevicesByFilter = (req: Request, res: Response): void => {
    // TODO: tomar los filtros de req.query, llamar al servicio y responder con los resultados.
    res.status(501).json({
      success: false,
      message: 'La consulta de dispositivos todavía no está implementada.'
    });
  };

  public static updateDevice = (req: Request, res: Response): void => {
>>>>>>> a6ccaf28fe9b404e8b380189ab84c45b81fd7dbd
    const { id } = req.params;
    // TODO: pasar id a la operación de actualización y responder con el resultado.
    res.status(501).json({
      success: false,
<<<<<<< HEAD
      message: `La actualización de la característica ${id} todavía no está implementada.`
=======
      message: `La actualización del dispositivo ${id} todavía no está implementada.`
>>>>>>> a6ccaf28fe9b404e8b380189ab84c45b81fd7dbd
    });
  };

}