/* @flow */
import { Router } from 'express';
import { getCVsController, postCVController } from './controller';

const router = Router();

router.get('/get-cvs/:_id', getCVsController());

router.post('/post-cv', postCVController());

export default router;
