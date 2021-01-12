import { Router } from 'express';
import {
  getJobsController,
  createJobController,
  deleteJobController,
  getJobDetailController,
  updateJobsController
} from './controller';

const router = Router();

router.all('/newest', getJobsController());

router.get('/detail/:_id', getJobDetailController());

router.post('/create-job', createJobController());

router.put('/update-jobs', updateJobsController());

router.delete('/delete-job/:_id', deleteJobController());

export default router;
