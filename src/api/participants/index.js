import { Router } from 'express';
import {
  createOrUpdateParticipant
} from './controller';

const router = Router();

router.post('/', createOrUpdateParticipant());

export default router;
