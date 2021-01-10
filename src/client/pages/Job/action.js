/* @flow */
import { type Dispatch } from 'redux';
import { type ApiDataType } from 'types';
import { actionGenerator } from 'utils';
import { requestAction } from 'utils/request';

export const GET_JOBS = actionGenerator('@@GET_JOBS');

export const getJobsAction = (skip: number = 0) => (dispatch: Dispatch) =>
  dispatch(
    requestAction({
      url: '/job/newest',
      label: GET_JOBS.NAME,
      params: { skip },
      onSuccess: ({ data }: ApiDataType) => {
        dispatch({ type: GET_JOBS.SUCCESS, payload: data });
      },
      onError: ({ error }: ApiDataType) => {
        dispatch({ type: GET_JOBS.ERROR, payload: error });
      },
    }),
  );
