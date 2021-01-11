/* @flow */
import { type Dispatch } from 'redux';
import { type ApiDataType } from 'types';
import { requestAction } from 'utils/request';
import { actionGenerator } from 'utils';

export const GET_JOB_DETAIL = actionGenerator('@@GET_JOB_DETAIL');

export const getJobDetailAction = (_id: string) => (dispatch: Dispatch) =>
  dispatch(
    requestAction({
      url: `/job/detail/${_id}`,
      label: GET_JOB_DETAIL.NAME,
      onSuccess: ({ data }: ApiDataType) => {
        dispatch({ type: GET_JOB_DETAIL.SUCCESS, payload: data });
      },
      onError: ({ error }: ApiDataType) => {
        dispatch({ type: GET_JOB_DETAIL.ERROR, payload: error });
      },
    }),
  );

export const GET_JOB_CVS = actionGenerator('@@GET_JOB_CVS');

export const getCvsForJobAction = (_id: string) => (dispatch: Dispatch) =>
  dispatch(
    requestAction({
      url: `/cv/get-cvs/${_id}`,
      label: GET_JOB_CVS.NAME,
      onSuccess: ({ data }: ApiDataType) => {
        dispatch({ type: GET_JOB_CVS.SUCCESS, payload: data });
      },
      onError: ({ error }: ApiDataType) => {
        dispatch({ type: GET_JOB_CVS.ERROR, payload: error });
      },
    }),
  );