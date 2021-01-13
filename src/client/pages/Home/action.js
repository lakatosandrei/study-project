import { toast } from 'react-toastify';
import { actionGenerator } from 'utils';
import { requestAction } from 'utils/request';

export const UPDATE_PARTICIPANT = actionGenerator('@@UPDATE_PARTICIPANT');

export const updateParticipant = (participant) => (dispatch) =>
  dispatch(
    requestAction({
      url: '/participant',
      label: UPDATE_PARTICIPANT.NAME,
      method: 'POST',
      data: { participant },
      onSuccess: ({ data: newData }) => {
        dispatch({ type: UPDATE_PARTICIPANT.SUCCESS, payload: newData });
      },
      onError: ({ error }) => {
        toast.error(error.message);
      },
    }),
  );

export const mockJoin = (data) => (dispatch) => {
  dispatch({ type: UPDATE_PARTICIPANT.SUCCESS, payload: data })
};
