/* @flow */
import { type Request, type Response } from 'express';
import { ObjectId } from 'mongodb';
import { usePaging } from 'mongo/helper';
import { resultModel, genericError, badRequest } from 'models/result.model';
import head from 'lodash/head';

const aggregateLookupUser = [
  {
    $lookup: {
      let: { user: '$user_id' },
      from: 'users',
      pipeline: [
        { $match: { $expr: { $eq: ['$$user', '$_id'] } } },
        {
          $project: {
            _id: true,
            name: true,
          },
        },
      ],
      as: 'user',
    },
  },
  { $unwind: '$user' },
];

const aggregateLookupJob = [
  {
    $project: {
      title: true,
      description: true,
    },
  }
];

export const getJobsController = () => async (req: Request, res: Response) => {
  const {
    jobsCollection,
    query: { skip = 0 },
  } = req;

  try {
    const { values: jobs, metaData } = await usePaging({
      collection: jobsCollection,
      aggregate: [...aggregateLookupUser, ...aggregateLookupJob, { $sort: { publishAt: -1 } }],
      skip,
    });

    return res.json(
      resultModel({
        data: { jobs, metaData },
      }),
    );
  } catch (error) {
    console.log('LOGARE', error);
    return res.json(genericError({ message: error.message }));
  }
};

export const getJobDetailController = () => async (
  req: Request,
  res: Response,
) => {
  const {
    params: { _id },
    jobsCollection,
  } = req;

  if (!_id || !ObjectId.isValid(_id)) {
    return res.json(badRequest());
  }

  try {
    const posts = await jobsCollection
      .aggregate([{ $match: { _id: ObjectId(_id) } }, ...aggregateLookupUser])
      .toArray();

    return res.json(resultModel({ data: head(posts) }));
  } catch (error) {
    return res.json(genericError({ message: error.message }));
  }
};

export const createJobController = () => async (
  req: Request,
  res: Response,
) => {
  const {
    body: { content, title, description },
    user,
    jobsCollection,
  } = req;

  if (!title || !description) {
    return res.json(badRequest());
  }

  try {
    const { ops } = await jobsCollection.insertOne(
      {
        title,
        description,
        content,
        cvs: [],
        publishAt: new Date(),
        user_id: user._id,
      },
      { serializeFunction: true },
    );

    return res.json(resultModel({ data: head(ops) }));
  } catch (error) {
    return res.json(genericError({ message: error.message }));
  }
};

export const deleteJobController = () => async (
  req: Request,
  res: Response,
) => {
  const {
    params: { _id },
    jobsCollection,
  } = req;

  if (!_id || !ObjectId.isValid(_id)) {
    return res.json(badRequest());
  }

  try {
    const removedJob = await jobsCollection.remove({
      _id: ObjectId(_id),
    });

    return res.json(resultModel({ data: removedJob }));
  } catch (error) {
    return res.json(genericError({ message: error.message }));
  }
};
