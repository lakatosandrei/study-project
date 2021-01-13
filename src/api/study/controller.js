/* @flow */
import { type Request, type Response } from 'express';
import { resultModel, genericError, badRequest } from 'models/result.model';

export const getStudyController = () => async (req: Request, res: Response) => {
  const { studyCollection } = req;

  try {
    const study = await studyCollection.findOne({});

    return res.json(
      resultModel({
        data: { study },
      }),
    );
  } catch (error) {
    return res.json(genericError({ message: error.message }));
  }
};

export const updateStudyController = () => async (
  req: Request,
  res: Response,
) => {
  const {
    body: { study },
    studyCollection
  } = req;

  if (!study) {
    return res.json(badRequest());
  }

  try {
    const { title, details } = study;

    await studyCollection.findOneAndUpdate({}, { $set: { title, details } });

    return res.json(
      resultModel({
        data: { study },
      }),
    );
  } catch (error) {
    return res.json(genericError({ message: error.message }));
  }
};
