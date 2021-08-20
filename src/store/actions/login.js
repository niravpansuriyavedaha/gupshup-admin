import axios from 'axios';
import { TYPES } from '../../config/';
import { ActionTypes } from '../../config/actions';

const loginDispatcher = (userType, token, data, permissions) => {
    return {
        type: ActionTypes.Login,
        payload: { userType, token },
    };
};

export const login = ({ username, password }, isLoading, setFormError) => {
    return async (dispatch) => {
        dispatch(loginDispatcher(TYPES.SUPERADMIN, 'token'));
    };
};
