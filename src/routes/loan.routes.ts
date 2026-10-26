import { Router } from 'express';
import { RoomController } from '../controllers/room.controller';
import { validateRoomPayload } from '../middlewares/validateRoom.middleware';

const router = Router();

router.post('/', validateRoomPayload, RoomController.createRoom);
router.get('/search', RoomController.getRoomsByFilter);
router.patch('/:id', RoomController.updateRoom);


export default router;