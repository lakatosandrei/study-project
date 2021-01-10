/* @flow */
import { type MongoPagingType, type MongoPagingResultType } from 'types';
import head from 'lodash/head';
import { genSaltSync, hashSync } from 'bcrypt';

export const hashPassword = (password: string): string =>
  hashSync(password, genSaltSync());

export const usePaging = async ({
  collection,
  aggregate = [],
  skip = 0,
  limit = 10,
}: MongoPagingType): MongoPagingResultType => {
  const roundSkip = Math.abs(Math.floor(skip));

  const roundLimit = Math.abs(Math.floor(limit));

  const realSkip = roundSkip * roundLimit;

  const list = await collection
    .aggregate([
      {
        $facet: {
          total: [{ $count: 'count' }],
          data: [
            ...aggregate,
            { $skip: realSkip },
            {
              $limit: roundLimit,
            },
          ],
        },
      },
      { $unwind: '$total' },
    ])
    .toArray();

  const result = head(list);

  const { count = 0 } = result?.total || {};

  const total = Math.ceil(count / roundLimit);

  const metaData = {
    index: roundSkip,
    total,
  };

  return {
    values: result?.data || [],
    metaData,
  };
};

export const createInitialDbValues = async (usersCollection) => {
  const userAdmin = await usersCollection.findOne({ email: 'admin@admin.com' });

  if (!userAdmin) {
    await usersCollection.insertOne(
      {
        email: 'admin@admin.com',
        password: hashPassword('admin'),
      },
      { serializeFunctions: true },
    );
  }

};
