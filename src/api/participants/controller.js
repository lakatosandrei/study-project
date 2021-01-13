/* @flow */
import { type Request, type Response } from 'express';
import { resultModel, genericError, badRequest } from 'models/result.model';

export const createOrUpdateParticipant = () => async (
  req: Request,
  res: Response,
) => {
  const {
    body: { participant },
    participantsCollection
  } = req;

  if (!participant) {
    return res.json(badRequest());
  }

  try {
    const { name, age, gender, studies } = participant;
    let { reviewed } = participant;

    reviewed = reviewed || [];

    const foundOrCreatedParticipant = await participantsCollection.findOneAndUpdate({ name: { $eq: name } }, { $set: { name, age, gender, studies, reviewed } }, { upsert: true, returnOriginal: false });

    return res.json(
      resultModel({
        data: { participant: foundOrCreatedParticipant.value },
      }),
    );
  } catch (error) {
    return res.json(genericError({ message: error.message }));
  }
};
