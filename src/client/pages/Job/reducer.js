/* @flow */
import { combineReducers } from 'redux';
import { type ActionType } from 'types';
import { DELETE_JOB, GET_JOBS, GET_PARTICIPANTS, PUT_JOBS } from './action';
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
        loadJobs: false,
        jobs: [...jobs],
        metaData: { ...metaData },
      };
    }
    case GET_PARTICIPANTS.ERROR:
    case DELETE_JOB.ERROR:
    case PUT_JOBS.ERROR:
    case GET_JOBS.ERROR: {
      return { ...state, error: action.payload };
    }
    case PUT_JOBS.SUCCESS: {
      const { jobs, metaData } = action.payload;

      return {
        ...state,
        jobs: [...jobs],
        metaData: { ...metaData },
      };
    }
    case GET_PARTICIPANTS.SUCCESS: {
      const { participants } = action.payload;

      return {
        ...state,
        participants
      };
    }
    case DELETE_JOB.SUCCESS: {
      return {
        ...state,
        loadJobs: true
      };
    }
    default:
      return { ...state };
  }
};

export default combineReducers({ job, jobDetail, createJob });
