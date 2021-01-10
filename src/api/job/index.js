import { Router } from 'express';
import {
  getJobsController,
  createJobController,
  deleteJobController
} from './controller';

const router = Router();

router.all('/newest', getJobsController());

router.post('/create-job', createJobController());

router.delete('/delete-job/:_id', deleteJobController());

export default router;
