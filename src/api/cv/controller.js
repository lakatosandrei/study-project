/* @flow */
import { type Request, type Response } from 'express';
import { ObjectId } from 'mongodb';
import head from 'lodash/head';
import { genericError, resultModel } from 'models/result.model';

export const getCVsController = () => async (
  req: Request,
  res: Response,
) => {
  const {
    params: { _id },
    cvsCollection,
  } = req;

  try {
    const cvs = await cvsCollection
      .aggregate([
        { $match: { job_id: ObjectId(_id) } },
        {
          $lookup: {
            let: { user: '$user_id' },
            from: 'users',
            pipeline: [
              { $match: { $expr: { $eq: ['$$user', '$_id'] } } },
              { $project: { _id: true, name: true } },
            ],
            as: 'user',
          },
        },
        { $unwind: '$user' },
      ])
      .toArray();

    return res.json(resultModel({ data: cvs }));
  } catch (error) {
    return res.json(genericError({ message: error.message }));
  }
};

export const postCVController = () => async (
  req: Request,
  res: Response,
) => {
  const {
    body: { _id, cv },
    user,
    cvsCollection,
  } = req;

  try {
    const { ops: data } = await cvsCollection.insertOne(
      {
        job_id: ObjectId(_id),
        user_id: ObjectId(user._id),
        cv,
        createAt: new Date(),
      },
      { serializeFunctions: true },
    );

    return res.json(resultModel({ data: head(data) }));
  } catch (error) {
    return res.json(genericError({ message: error.message }));
  }
};
