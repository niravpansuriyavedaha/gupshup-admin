import axios from 'axios';
import { Screens } from '../../config/routes';
import { ActionTypes } from '../../config/actions';

export const productScreen_columnKeys = (columnKeys) => {
    return {
        type: ActionTypes.SAVE_SETTINGS,
        payload: { screen: Screens.PRODUCTS, settings: { columnKeys } },
    };
};

export const accountScreen_columnKeys = (columnKeys, accountType) => {
    return {
        type: ActionTypes.SAVE_SETTINGS,
        payload: {
            screen: Screens.ACCOUNTS,
            accountType,
            settings: { columnKeys },
        },
    };
};
