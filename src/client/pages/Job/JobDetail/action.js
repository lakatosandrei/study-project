/* @flow */
import { type Dispatch } from 'redux';
import { type PostCommentActionType, type ApiDataType } from 'types';
import { requestAction } from 'utils/request';
import { actionGenerator } from 'utils';

export const GET_JOB_CVS = actionGenerator('@@GET_JOB_CVS');

export const getPostDetailAction = (_id: string) => (dispatch: Dispatch) =>
  dispatch(
    requestAction({
      url: `/post/detail/${_id}`,
      label: GET_JOB_CVS.NAME,
      onSuccess: ({ data }: ApiDataType) => {
        dispatch({ type: GET_JOB_CVS.SUCCESS, payload: data });
      },
      onError: ({ error }: ApiDataType) => {
        dispatch({ type: GET_JOB_CVS.ERROR, payload: error });
      },
    }),
  );
