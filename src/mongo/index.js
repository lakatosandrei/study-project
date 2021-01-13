/* @flow */
import { MongoClient } from 'mongodb';
import { type MongoConnectionType, type MongoResultType } from 'types';
import { createInitialDbValues } from './helper';

const useMongo = ({
  host,
  database,
  user,
  password,
  app,
}: MongoConnectionType): Promise<MongoResultType> =>
  MongoClient.connect(host, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    auth: !user || !password ? null : { user, password },
  })
    .then(async (client) => {
      const db = client.db(database);

      const studyCollection = db.collection('study');

      const participantsCollection = db.collection('participants');

      const usersCollection = db.collection('users');

      const jobsCollection = db.collection('jobs');

      const cvsCollection = db.collection('cvs');

      await createInitialDbValues({
        studyCollection,
        usersCollection
      });

      const result: MongoResultType = {
        client,
        db,
      };

      if (app) {
        const { request } = app;

        Object.assign(request, {
          ...result,
          studyCollection,
          participantsCollection,
          usersCollection,
          jobsCollection,
          cvsCollection,
        });
      }

      return result;
    })
    .catch((error) => {
      throw error;
    });

export default useMongo;
