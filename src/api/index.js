import { Router } from 'express';
import auth from './auth';
import generic from './generic';
import cv from './cv';
import study from './study';
import participants from './participants';
import job from './job';
import comment from './comment';

const router = Router();

router.use('/auth', auth);

router.use('/cv', cv);

router.use('/job', job);

router.use('/study', study);

router.use('/participants', participants);

router.use('/comment', comment);

router.use('/', [generic]);

export default router;
