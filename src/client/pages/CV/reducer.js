/* @flow */
import { type ActionType } from 'types';
import { GET_JOB_DETAIL, GET_JOB_CVS } from './action';

const initialState = {
  job: null,
  cvs: [],
  error: null,
};

export default (state: any = initialState, action: ActionType) => {
  switch (action.type) {
    case GET_JOB_DETAIL.SUCCESS: {
      return { ...state, job: action.payload };
    }
    case GET_JOB_DETAIL.ERROR: {
      return { ...state, error: action.payload };
    }
    case GET_JOB_CVS.SUCCESS: {
      return { ...state, cvs: [...action.payload] };
    }
    case GET_JOB_CVS.ERROR: {
      return { ...state, error: { ...action.payload } };
    }
    default:
      return { ...state };
  }
};
