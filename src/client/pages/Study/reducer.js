/* @flow */
import { type ActionType } from 'types';
import { GET_STUDY, PUT_STUDY } from './action';

const initialState = {
  study: null,
  error: null,
};

export default (state: any = initialState, action: ActionType) => {
  switch (action.type) {
    case GET_STUDY.SUCCESS: {
      const { study } = action.payload;

      return { ...state, study };
    }
    case PUT_STUDY.ERROR:
    case GET_STUDY.ERROR: {
      return { ...state, error: action.payload };
    }
    case PUT_STUDY.SUCCESS: {
      const { study, metaData } = action.payload;

      return {
        ...state,
        study,
        metaData: { ...metaData },
      };
    }
    default:
      return { ...state };
  }
};
