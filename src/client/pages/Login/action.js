import { toast } from 'react-toastify';
import { actionGenerator } from 'utils';
import { requestAction } from 'utils/request';
import { GET_PARTICIPANT, updateTokenAction } from 'store/action';
import cookies from 'utils/cookies';

export const LOGIN_ACTION = actionGenerator('@@LOGIN_ACTION');
export const loginAction = (data) => (dispatch) => {
  cookies.remove('participantId');
  dispatch({ type: GET_PARTICIPANT.ERROR });

  dispatch(
    requestAction({
      url: '/auth/login',
      label: LOGIN_ACTION.NAME,
      method: 'POST',
      data,
      onSuccess: ({ data: res }) => {
        dispatch(updateTokenAction({ ...res }));
      },
      onError: ({ error }) => {
        toast.error(error.message);
      },
    }),
  );
};
