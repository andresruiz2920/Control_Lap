import { Router } from 'express';
import { FeatureController } from '../controllers/feature.controller';
import { validatefeaturePayload } from '../middlewares/validateFeature.middleware';
const router = Router();

router.post('/',validatefeaturePayload, FeatureController.createFeature);
router.get('/search', FeatureController.getFeaturesByFilter);
router.patch('/:id', FeatureController.updateFeature);


export default router;