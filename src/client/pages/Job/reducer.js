/* @flow */
import { combineReducers } from 'redux';
import { type ActionType } from 'types';
import { GET_JOBS } from './action';
import createJob from './CreateJob/reducer';
import jobDetail from './JobDetail/reducer';

const initialState = {
  jobs: [],
  metaData: {
    index: 0,
    total: 0,
  },
  error: null,
};

const job = (state: any = initialState, action: ActionType) => {
  switch (action.type) {
    case GET_JOBS.SUCCESS: {
      const { jobs, metaData } = action.payload;

      return {
        ...state,
        jobs: [...jobs],
        metaData: { ...metaData },
      };
    }
    case GET_JOBS.ERROR: {
      return { ...state, error: action.payload };
    }
    default:
      return { ...state };
  }
};

export default combineReducers({ job, jobDetail, createJob });
