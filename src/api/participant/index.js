import { Router } from 'express';
import {
  getAllParticipantsController,
  getParticipantController,
  createOrUpdateParticipant
} from './controller';

const router = Router();

router.get('/', getAllParticipantsController());

router.get('/:_id', getParticipantController());

router.post('/', createOrUpdateParticipant());

export default router;
