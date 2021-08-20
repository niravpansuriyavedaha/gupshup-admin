import { ActionTypes } from '../../config/actions';
import { TYPES } from '../../config/';

const initialUser = {
    Type: TYPES.GUEST,
};

const userReducer = (state = initialUser, action) => {
    switch (action.type) {
        case ActionTypes.Login:
            return {
                Type: action.payload.userType,
                token: action.payload.token,
            };
        case ActionTypes.Logout:
            return { ...initialUser };
        default:
            return state;
    }
};

export default userReducer;
