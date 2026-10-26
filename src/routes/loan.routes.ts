import { Router } from 'express';
<<<<<<< HEAD
import { RoomController } from '../controllers/room.controller';
import { validateRoomPayload } from '../middlewares/validateRoom.middleware';

const router = Router();

router.post('/', validateRoomPayload, RoomController.createRoom);
router.get('/search', RoomController.getRoomsByFilter);
router.patch('/:id', RoomController.updateRoom);

=======
import { LoanController } from '../controllers/loan.controller';
import { validateLoanPayload } from '../middlewares/validateLoan.middleware';

const router = Router();

router.post('/', validateLoanPayload, LoanController.createLoan);
router.get('/search', LoanController.getLoansByFilter);
router.get('/:id', LoanController.getLoanById);
router.put('/:id/accept', LoanController.acceptLoanInventory);
>>>>>>> a6ccaf28fe9b404e8b380189ab84c45b81fd7dbd

export default router;