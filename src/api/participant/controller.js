/* @flow */
import { ObjectId } from 'mongodb';
import { type Request, type Response } from 'express';
import { resultModel, genericError, badRequest } from 'models/result.model';

export const getAllParticipantsController = () => async (req: Request, res: Response) => {
  const { cvsCollection, jobsCollection, participantsCollection } = req;

  try {
    const allJobs = (await jobsCollection.find().toArray()).reduce((obj, job) => {
      // eslint-disable-next-line
      obj[job._id] = job;
      return obj;
    }, {});
    const allCvs = (await cvsCollection.find().toArray()).reduce((obj, cv) => {
      // eslint-disable-next-line
      obj[cv._id] = cv;
      return obj;
    }, {});
    const participants = await participantsCollection.find().toArray();

    participants.forEach((participant) => {
      (participant.reviewed || []).forEach((review) => {
        // eslint-disable-next-line
        review.job = allJobs[review.job_id];
        // eslint-disable-next-line
        review.cv = allCvs[review.cv_id];
      });
    });

    return res.json(
      resultModel({
        data: { participants },
      }),
    );
  } catch (error) {
    return res.json(genericError({ message: error.message }));
  }
};

export const getParticipantController = () => async (req: Request, res: Response) => {
  const { params: { _id }, participantsCollection } = req;

  try {
    const participant = await participantsCollection.findOne({ _id: ObjectId(_id) });

    return res.json(
      resultModel({
        data: { participant },
      }),
    );
  } catch (error) {
    return res.json(genericError({ message: error.message }));
  }
};

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
    const { name, age, gender, studies, reviewed } = participant;
    const newValues = { name, age, gender, studies, reviewed };

    if (!newValues.reviewed) {
      delete newValues.reviewed;
    }

    const foundOrCreatedParticipant = await participantsCollection.findOneAndUpdate({ name: { $eq: name } }, { $set: newValues }, { upsert: true, returnOriginal: false });

    return res.json(
      resultModel({
        data: { participant: foundOrCreatedParticipant.value },
      }),
    );
  } catch (error) {
    return res.json(genericError({ message: error.message }));
  }
};
