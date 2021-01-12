/* @flow */
import { type Dispatch } from 'redux';
import { type ApiDataType } from 'types';
import { actionGenerator } from 'utils';
import { requestAction } from 'utils/request';

export const GET_CVS = actionGenerator('@@GET_CVS');

export const getCvsAction = (skip: number = 0) => (dispatch: Dispatch) =>
  dispatch(
    requestAction({
      url: '/cv/newest',
      label: GET_CVS.NAME,
      params: { skip },
      onSuccess: ({ data }: ApiDataType) => {
        dispatch({ type: GET_CVS.SUCCESS, payload: data });
      },
      onError: ({ error }: ApiDataType) => {
        dispatch({ type: GET_CVS.ERROR, payload: error });
      },
    }),
  );

export const DELETE_CV = actionGenerator('@@DELETE_CV');

export const deleteCvAction = (_id: string) => (dispatch: Dispatch) =>
  dispatch(
    requestAction({
      url: `/cv/delete-cv/${_id}`,
      method: 'DELETE',
      label: DELETE_CV.NAME,
      onSuccess: () => {
        dispatch({ type: DELETE_CV.SUCCESS });
      },
      onError: ({ error }: ApiDataType) => {
        dispatch({ type: DELETE_CV.ERROR, payload: error });
      },
    }),
  );

export const PUT_CVS = actionGenerator('@@PUT_CVS');

export const updateCvsAction = (cvs: array = []) => (dispatch: Dispatch) =>
  dispatch(
    requestAction({
      url: '/cv/update-cvs',
      label: PUT_CVS.NAME,
      method: 'PUT',
      data: { cvs },
      onSuccess: ({ data }: ApiDataType) => {
        dispatch({ type: PUT_CVS.SUCCESS, payload: data });
      },
      onError: ({ error }: ApiDataType) => {
        dispatch({ type: PUT_CVS.ERROR, payload: error });
      },
    }),
  );
