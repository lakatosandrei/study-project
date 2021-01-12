import { Router } from 'express';
import {
  getCVsController,
  createCVController,
  deleteCVController,
  getCVDetailController,
  updateCVsController
} from './controller';

const router = Router();

router.get('/get-cvs/:_id', getCVsController());

router.get('/detail/:_id', getCVDetailController());

router.post('/create-cv/:_projectId', createCVController());

router.put('/update-cvs', updateCVsController());

router.delete('/delete-cv/:_id', deleteCVController());

export default router;
