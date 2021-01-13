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
      order: true
    },
  }
];

export const getJobsController = () => async (req: Request, res: Response) => {
  const {
    jobsCollection,
    participantsCollection,
    query: { participant: participantId },
  } = req;

  try {
    let jobs = await jobsCollection
      .aggregate([
        ...aggregateLookupUser,
        ...aggregateLookupJob,
        { $sort: { order: 1, publishAt: -1 } }
      ])
      .toArray();
    const participant = await participantsCollection.findOne({ _id: ObjectId(participantId) });

    if (participant) {
      const reviewed = participant.reviewed || [];

      jobs = jobs.filter(job => {
        return reviewed.findIndex(review => review.job_id !== job._id) < 0;
      });
    }

    return res.json(
      resultModel({
        data: { jobs },
      }),
    );
  } catch (error) {
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
    const lastJob = await jobsCollection.find().sort({ order: -1 }).limit(1).toArray();
    let order = 1;

    if (lastJob[0]) {
      order += lastJob[0].order;
    }

    const { ops } = await jobsCollection.insertOne(
      {
        title,
        description,
        content,
        order,
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

export const updateJobsController = () => async (
  req: Request,
  res: Response,
) => {
  const {
    body: { jobs },
    jobsCollection,
  } = req;

  if (!jobs) {
    return res.json(badRequest());
  }

  try {
    const promises = [];

    jobs.forEach((job) => {
      const { _id, content, description, order, title } = job;

      promises.push(jobsCollection.findOneAndUpdate({ _id: { $eq: ObjectId(_id) } }, { $set: { content, description, order, title } }));
    });

    await Promise.all(promises);

    const { values: newJobs, metaData } = await usePaging({
      collection: jobsCollection,
      aggregate: [...aggregateLookupUser, ...aggregateLookupJob, { $sort: { order: 1, publishAt: -1 } }],
      skip: 0
    });

    return res.json(
      resultModel({
        data: { jobs: newJobs, metaData },
      }),
    );
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
