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
    USERS: `${PAGES.DASHBOARD}/users`,
    PROPERTIES: `${PAGES.DASHBOARD}/properties`,
    GROUPS: `${PAGES.DASHBOARD}/groups`,
    PRODUCTS: `${PAGES.DASHBOARD}/products`,
    ACCOUNTS: `${PAGES.DASHBOARD}/account`,
    EDIT_PRODUCT: `${PAGES.DASHBOARD}/edit-product`,
    LOGOUT: `${PAGES.DASHBOARD}/logout`,
};

export const Sidebar = {
    [TYPES.SUPERADMIN]: [
        // { label: 'Users', route: Screens.USERS },
        // { label: 'Properties', route: Screens.PROPERTIES },
        // { label: 'Groups', route: Screens.GROUPS },
        { label: 'Products', route: Screens.PRODUCTS },
        { label: 'Account', route: Screens.ACCOUNTS },
        {
            label: 'Settings',
            subRoutes: [
                { label: 'User', route: Screens.USERS },
                { label: 'Properties', route: Screens.PROPERTIES },
                // { label: 'Groups', route: Screens.GROUPS },
            ],
        },
        { label: 'Logout', route: Screens.LOGOUT },
    ],
    [TYPES.USER]: [
        { label: 'Properties', route: Screens.PROPERTIES },
        { label: 'Groups', route: Screens.GROUPS },
        { label: 'Products', route: Screens.PRODUCTS },
        { label: 'Logout', route: Screens.LOGOUT },
    ],
    [TYPES.GUEST]: [],
};

export const Routes = {
    [TYPES.SUPERADMIN]: [
        {
            path: PAGES.DASHBOARD,
            component: DashboardLayout,
        },
    ],
    [TYPES.USER]: [
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
            path: Screens.USERS,
            component: UserScreen,
        },
        {
            path: Screens.PROPERTIES,
            component: PropertyScreen,
        },
        {
            path: Screens.PRODUCTS,
            component: ProductScreen,
        },
        {
            path: Screens.EDIT_PRODUCT,
            component: EditProductScreen,
        },
        {
            path: Screens.ACCOUNTS,
            component: AccountScreen,
        },
    ],
    [TYPES.USER]: [
        {
            path: Screens.PROPERTIES,
            component: PropertyScreen,
        },
    ],
    [TYPES.GUEST]: [],
};
