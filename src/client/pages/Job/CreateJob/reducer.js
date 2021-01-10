/* @flow */
import type { ActionType } from 'types';
import { CREATE_JOB, DELETE_LOCAL_JOB } from './action';

const initialState = {
  job: null,
  error: null,
};

export default (state: any = initialState, action: ActionType) => {
  switch (action.type) {
    case CREATE_JOB.SUCCESS: {
      return { ...state, job: action.payload, error: null };
    }
    case CREATE_JOB.ERROR: {
      return { ...state, payload: null, error: action.payload };
    }
    case DELETE_LOCAL_JOB: {
      return { ...state, error: null, job: null };
    }
    default:
      return state;
  }
};
