/* @flow */
import { type Dispatch } from 'redux';
import { type ApiDataType } from 'types';
import { requestAction } from 'utils/request';
import { actionGenerator } from 'utils';

export const GET_STUDY = actionGenerator('@@GET_STUDY');

export const getStudyAction = (_id: string) => (dispatch: Dispatch) =>
  dispatch(
    requestAction({
      url: `/study`,
      label: GET_STUDY.NAME,
      onSuccess: ({ data }: ApiDataType) => {
        dispatch({ type: GET_STUDY.SUCCESS, payload: data });
      },
      onError: ({ error }: ApiDataType) => {
        dispatch({ type: GET_STUDY.ERROR, payload: error });
      },
    }),
  );

export const PUT_STUDY = actionGenerator('@@PUT_STUDY');

export const updateStudyAction = (study: object = {}) => (dispatch: Dispatch) =>
  dispatch(
    requestAction({
      url: '/study',
      label: PUT_STUDY.NAME,
      method: 'PUT',
      data: { study },
      onSuccess: ({ data }: ApiDataType) => {
        dispatch({
          type: PUT_STUDY.SUCCESS,
          payload: data,
        });
      },
      onError: ({ error }: ApiDataType) => {
        dispatch({
          type: PUT_STUDY.ERROR,
          payload: error,
        });
      },
    }),
  );
