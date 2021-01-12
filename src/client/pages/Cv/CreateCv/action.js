/* @flow */
import { Dispatch } from 'redux';
import type { ApiDataType } from 'types';
import { actionGenerator } from 'utils';
import { requestAction } from 'utils/request';

export const CREATE_CV = actionGenerator('@@CREATE_CV');

export const createCvAction = (data: Object, projectId: String) => (dispatch: Dispatch) =>
  dispatch(
    requestAction({
      url: `/cv/create-cv/${projectId}`,
      label: CREATE_CV.NAME,
      method: 'POST',
      data,
      onSuccess: ({ data: res }: ApiDataType) => {
        dispatch({ type: CREATE_CV.SUCCESS, payload: res });
      },
      onError: ({ error }: ApiDataType) => {
        dispatch({ type: CREATE_CV.ERROR, payload: error });
      },
    }),
  );

export const DELETE_LOCAL_CV = '@@DELETE_LOCAL_CV';

export const deleteLocalCvAction = () => (dispatch: Dispatch) =>
  dispatch({ type: DELETE_LOCAL_CV, payload: null });
