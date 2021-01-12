/* @flow */
import { type ActionType } from 'types';
import { GET_CV_DETAIL, GET_CV_CVS } from './action';

const initialState = {
  cv: null,
  cvs: [],
  error: null,
};

export default (state: any = initialState, action: ActionType) => {
  switch (action.type) {
    case GET_CV_DETAIL.SUCCESS: {
      return { ...state, cv: action.payload };
    }
    case GET_CV_DETAIL.ERROR: {
      return { ...state, error: action.payload };
    }
    case GET_CV_CVS.SUCCESS: {
      return { ...state, cvs: [...action.payload] };
    }
    case GET_CV_CVS.ERROR: {
      return { ...state, error: { ...action.payload } };
    }
    default:
      return { ...state };
  }
};
