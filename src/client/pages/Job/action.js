/* @flow */
import { type Dispatch } from 'redux';
import { type ApiDataType } from 'types';
import { actionGenerator } from 'utils';
import { requestAction } from 'utils/request';

export const GET_JOBS = actionGenerator('@@GET_JOBS');

export const getJobsAction = (participant) => (dispatch: Dispatch) => {
  dispatch(
    requestAction({
      url: `/job/newest`,
      label: GET_JOBS.NAME,
      params: { participant: participant?._id },
      onSuccess: ({ data }: ApiDataType) => {
        dispatch({ type: GET_JOBS.SUCCESS, payload: data });
      },
      onError: ({ error }: ApiDataType) => {
        dispatch({ type: GET_JOBS.ERROR, payload: error });
      },
    }),
  );
};

export const DELETE_JOB = actionGenerator('@@DELETE_JOB');

export const deleteJobAction = (_id: string) => (dispatch: Dispatch) =>
  dispatch(
    requestAction({
      url: `/job/delete-job/${_id}`,
      method: 'DELETE',
      label: DELETE_JOB.NAME,
      onSuccess: () => {
        dispatch({ type: DELETE_JOB.SUCCESS });
      },
      onError: ({ error }: ApiDataType) => {
        dispatch({ type: DELETE_JOB.ERROR, payload: error });
      },
    }),
  );

export const PUT_JOBS = actionGenerator('@@PUT_JOBS');

export const updateJobsAction = (jobs: array = []) => (dispatch: Dispatch) =>
  dispatch(
    requestAction({
      url: '/job/update-jobs',
      label: PUT_JOBS.NAME,
      method: 'PUT',
      data: { jobs },
      onSuccess: ({ data }: ApiDataType) => {
        dispatch({ type: PUT_JOBS.SUCCESS, payload: data });
      },
      onError: ({ error }: ApiDataType) => {
        dispatch({ type: PUT_JOBS.ERROR, payload: error });
      },
    }),
  );
