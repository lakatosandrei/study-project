/* @flow */
import { type Dispatch } from 'redux';
import { type ApiDataType } from 'types';
import { requestAction } from 'utils/request';
import { actionGenerator } from 'utils';

export const GET_CV_DETAIL = actionGenerator('@@GET_CV_DETAIL');

export const getCvDetailAction = (_id: string) => (dispatch: Dispatch) =>
  dispatch(
    requestAction({
      url: `/cv/detail/${_id}`,
      label: GET_CV_DETAIL.NAME,
      onSuccess: ({ data }: ApiDataType) => {
        dispatch({ type: GET_CV_DETAIL.SUCCESS, payload: data });
      },
      onError: ({ error }: ApiDataType) => {
        dispatch({ type: GET_CV_DETAIL.ERROR, payload: error });
      },
    }),
  );

export const GET_CV_CVS = actionGenerator('@@GET_CV_CVS');

export const getCvsForCvAction = (_id: string) => (dispatch: Dispatch) =>
  dispatch(
    requestAction({
      url: `/cv/get-cvs/${_id}`,
      label: GET_CV_CVS.NAME,
      onSuccess: ({ data }: ApiDataType) => {
        dispatch({ type: GET_CV_CVS.SUCCESS, payload: data });
      },
      onError: ({ error }: ApiDataType) => {
        dispatch({ type: GET_CV_CVS.ERROR, payload: error });
      },
    }),
  );

export const PUT_CVS = actionGenerator('@@PUT_CVS');

export const updateCvAction = (cv: object = {}) => (dispatch: Dispatch) =>
  dispatch(
    requestAction({
      url: '/cv/update-cvs',
      label: PUT_CVS.NAME,
      method: 'PUT',
      data: { cvs: [cv] },
      onSuccess: ({ data }: ApiDataType) => {
        dispatch({
          type: PUT_CVS.SUCCESS,
          payload: data,
        });
      },
      onError: ({ error }: ApiDataType) => {
        dispatch({
          type: PUT_CVS.ERROR,
          payload: error,
        });
      },
    }),
  );
