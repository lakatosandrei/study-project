import { Router } from 'express';
import {
  getStudyController,
  updateStudyController
} from './controller';

const router = Router();

router.get('/', getStudyController());

router.put('/', updateStudyController());

export default router;
