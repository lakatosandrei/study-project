/* @flow */
import { Dispatch } from 'redux';
import type { ApiDataType } from 'types';
import { actionGenerator } from 'utils';
import { requestAction } from 'utils/request';

export const CREATE_JOB = actionGenerator('@@CREATE_JOB');

export const createJobAction = (data: Object) => (dispatch: Dispatch) =>
  dispatch(
    requestAction({
      url: '/job/create-job',
      label: CREATE_JOB.NAME,
      method: 'JOB',
      data,
      onSuccess: ({ data: res }: ApiDataType) => {
        dispatch({ type: CREATE_JOB.SUCCESS, payload: res });
      },
      onError: ({ error }: ApiDataType) => {
        dispatch({ type: CREATE_JOB.ERROR, payload: error });
      },
    }),
  );

export const DELETE_LOCAL_JOB = '@@DELETE_LOCAL_JOB';

export const deleteLocalJobAction = () => (dispatch: Dispatch) =>
  dispatch({ type: DELETE_LOCAL_JOB, payload: null });
