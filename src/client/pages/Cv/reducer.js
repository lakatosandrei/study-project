/* @flow */
import { combineReducers } from 'redux';
import { type ActionType } from 'types';
import { DELETE_CV, GET_CVS, PUT_CVS } from './action';
import createCv from './CreateCv/reducer';
import cvDetail from './CvDetail/reducer';

const initialState = {
  cvs: [],
  metaData: {
    index: 0,
    total: 0,
  },
  error: null,
};

const cv = (state: any = initialState, action: ActionType) => {
  switch (action.type) {
    case GET_CVS.SUCCESS: {
      const { cvs, metaData } = action.payload;

      return {
        ...state,
        loadCvs: false,
        cvs: [...cvs],
        metaData: { ...metaData },
      };
    }
    case DELETE_CV.ERROR:
    case PUT_CVS.ERROR:
    case GET_CVS.ERROR: {
      return { ...state, error: action.payload };
    }
    case PUT_CVS.SUCCESS: {
      const { cvs, metaData } = action.payload;

      return {
        ...state,
        cvs: [...cvs],
        metaData: { ...metaData },
      };
    }
    case DELETE_CV.SUCCESS: {
      return {
        ...state,
        loadCvs: true
      };
    }
    default:
      return { ...state };
  }
};

export default combineReducers({ cv, cvDetail, createCv });
