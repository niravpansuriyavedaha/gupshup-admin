import { TYPES } from './index';
import LoginScreen from '../screens/LoginScreen';
import DashboardLayout from '../layouts/DashboardLayout';
import UserScreen from '../screens/UserScreen';
import PropertyScreen from '../screens/PropertyScreen';
import ProductScreen from '../screens/ProductScreen';
import EditProductScreen from '../screens/EditProductScreen';
import AccountScreen from '../screens/AccountScreen';

export const PAGES = {
    DASHBOARD: '/dashboard',
    LOGIN: '/login',
    LOGOUT: '/logout',
};

export const Screens = {
    PRODUCTS: `${PAGES.DASHBOARD}/products`,
};

export const Sidebar = {
    [TYPES.SUPERADMIN]: [
        // { label: 'Users', route: Screens.USERS },
        // { label: 'Properties', route: Screens.PROPERTIES },
        // { label: 'Groups', route: Screens.GROUPS },
        { label: 'Products', route: Screens.PRODUCTS },
        { label: 'Account', route: Screens.PRODUCTS },
        {
            label: 'Settings',
            subRoutes: [
                { label: 'User', route: Screens.PRODUCTS },
                { label: 'Properties', route: Screens.PRODUCTS },
                // { label: 'Groups', route: Screens.GROUPS },
            ],
        },
        { label: 'Logout', route: Screens.PRODUCTS },
    ],
};

export const Routes = {
    [TYPES.SUPERADMIN]: [
        {
            path: PAGES.DASHBOARD,
            component: DashboardLayout,
        },
    ],
    [TYPES.GUEST]: [
        {
            path: PAGES.LOGIN,
            component: LoginScreen,
        },
    ],
};

export const AuthRoutes = {
    [TYPES.SUPERADMIN]: [
        {
            path: Screens.PRODUCTS,
            component: ProductScreen,
        },
    ],
};
