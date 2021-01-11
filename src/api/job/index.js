import { Router } from 'express';
import {
  getJobsController,
  createJobController,
  deleteJobController,
  getJobDetailController
} from './controller';

const router = Router();

router.all('/newest', getJobsController());

router.get('/detail/:_id', getJobDetailController());

router.post('/create-job', createJobController());

router.delete('/delete-job/:_id', deleteJobController());

export default router;
