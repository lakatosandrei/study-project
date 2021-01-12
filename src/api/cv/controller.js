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

const aggregateLookupCV = [
  {
    $project: {
      name: true,
      gender: true,
      age: true,
      post_id: true,
      order: true
    },
  }
];

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
        { $match: { project_id: ObjectId(_id) } },
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
        { $sort: { order: 1, publishAt: -1 } }
      ])
      .toArray();

    return res.json(resultModel({ data: cvs }));
  } catch (error) {
    return res.json(genericError({ message: error.message }));
  }
};

export const getCVDetailController = () => async (
  req: Request,
  res: Response,
) => {
  const {
    params: { _id },
    cvsCollection,
  } = req;

  if (!_id || !ObjectId.isValid(_id)) {
    return res.json(badRequest());
  }

  try {
    const cvs = await cvsCollection
      .aggregate([{ $match: { _id: ObjectId(_id) } }, ...aggregateLookupUser])
      .toArray();

    return res.json(resultModel({ data: head(cvs) }));
  } catch (error) {
    return res.json(genericError({ message: error.message }));
  }
};

export const createCVController = () => async (
  req: Request,
  res: Response,
) => {
  const {
    params: { _projectId },
    body: { profilePicture, name, gender, age, maritalStatus, education, skills },
    user,
    cvsCollection,
  } = req;

  if (!profilePicture || !name || !gender || !age || !maritalStatus || !education || !skills) {
    return res.json(badRequest());
  }

  try {
    const lastCV = await cvsCollection.find().sort({ order: -1 }).limit(1).toArray();
    let order = 1;

    if (lastCV[0]) {
      order += lastCV[0].order;
    }

    const { ops } = await cvsCollection.insertOne(
      {
        profilePicture,
        name,
        gender,
        age,
        maritalStatus,
        education,
        skills,
        order,
        publishAt: new Date(),
        user_id: ObjectId(user._id),
        project_id: ObjectId(_projectId)
      },
      { serializeFunction: true },
    );

    return res.json(resultModel({ data: head(ops) }));
  } catch (error) {
    return res.json(genericError({ message: error.message }));
  }
};

export const updateCVsController = () => async (
  req: Request,
  res: Response,
) => {
  const {
    body: { cvs },
    cvsCollection,
  } = req;

  if (!cvs) {
    return res.json(badRequest());
  }

  try {
    const promises = [];

    cvs.forEach((cv) => {
      const { _id, profilePicture, name, gender, age, maritalStatus, education, skills, order } = cv;

      promises.push(cvsCollection.findOneAndUpdate({ _id: { $eq: ObjectId(_id) } }, { $set: { profilePicture, name, gender, age, maritalStatus, education, skills, order } }));
    });

    await Promise.all(promises);

    const { values: newCVs, metaData } = await usePaging({
      collection: cvsCollection,
      aggregate: [...aggregateLookupUser, ...aggregateLookupCV, { $sort: { order: 1, publishAt: -1 } }],
      skip: 0
    });

    return res.json(
      resultModel({
        data: { cvs: newCVs, metaData },
      }),
    );
  } catch (error) {
    return res.json(genericError({ message: error.message }));
  }
};

export const deleteCVController = () => async (
  req: Request,
  res: Response,
) => {
  const {
    params: { _id },
    cvsCollection,
  } = req;

  if (!_id || !ObjectId.isValid(_id)) {
    return res.json(badRequest());
  }

  try {
    const removedCV = await cvsCollection.remove({
      _id: ObjectId(_id),
    });

    return res.json(resultModel({ data: removedCV }));
  } catch (error) {
    return res.json(genericError({ message: error.message }));
  }
};
