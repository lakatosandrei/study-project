/* @flow */
import type { ActionType } from 'types';
import { CREATE_CV, DELETE_LOCAL_CV } from './action';

const initialState = {
  cv: null,
  error: null,
};

export default (state: any = initialState, action: ActionType) => {
  switch (action.type) {
    case CREATE_CV.SUCCESS: {
      return { ...state, cv: action.payload, error: null };
    }
    case CREATE_CV.ERROR: {
      return { ...state, payload: null, error: action.payload };
    }
    case DELETE_LOCAL_CV: {
      return { ...state, error: null, cv: null };
    }
    default:
      return state;
  }
};
