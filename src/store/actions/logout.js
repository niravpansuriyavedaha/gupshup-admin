import axios from 'axios';
import { TYPES } from '../../config/';
import { ActionTypes } from '../../config/actions';

const logoutDispatcher = () => {
    return {
        type: ActionTypes.Logout,
    };
};

export const logout = () => {
    return async (dispatch) => {
        try {
            let resData = await axios.post('/user/logout');
            if (resData.status === 200) {
                dispatch(logoutDispatcher());
            }
        } catch (error) {}
    };
};
