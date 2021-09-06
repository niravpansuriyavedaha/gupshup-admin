import './App.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
    useLocation,
    Link,
} from 'react-router-dom';
import { Routes, PAGES } from './config/routes';
import { TYPES } from './config/';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import axios from 'axios';
import { logout } from './store/actions/logout';

function App() {
    const { Type, token } = useSelector((state) => state.user);
    let settings = useSelector((state) => state).settings;
    const dispatch = useDispatch();
    // axios.interceptors.request.use(
    //     function (config) {
    //         if (
    //             !['/user/login'].includes(config.url) &&
    //             !config.headers.common.Authorization
    //         ) {
    //             config.headers.common.Authorization = `Bearer ${token}`;
    //             axios.defaults.headers.common[
    //                 'Authorization'
    //             ] = `Bearer ${token}`;
    //         }
    //         return config;
    //     },
    //     function (error) {
    //         console.log('interceptors request error', error);
    //         return Promise.reject(error);
    //     },
    // );
    // axios.interceptors.response.use(
    //     function (response) {
    //         return response;
    //     },
    //     function (error) {
    //         if (error.response.status === 401) {
    //             dispatch(logout());
    //         }
    //         return Promise.reject(error);
    //     },
    // );

    // useEffect(() => {
    //     axios.patch('/user/settings', settings);
    // }, [settings]);

    const REDIRECT_PAGE = {
        [TYPES.GUEST]: PAGES.LOGIN,
        [TYPES.SUPERADMIN]: PAGES.DASHBOARD,
        [TYPES.USER]: PAGES.DASHBOARD,
    };

    let createRoutes = () => {
        if (Type) {
            return Routes[Type].map((e, i) => (
                <Route path={e.path} component={e.component} key={i} />
            ));
        }
    };

    return (
        <>
            <Router>
                <Switch>
                    {createRoutes()}
                    <Route
                        path={PAGES.LOGOUT}
                        render={() => {
                            dispatch(logout());
                            return <Link to={PAGES.LOGIN}>Login Again</Link>;
                        }}
                    />
                    <Redirect to={REDIRECT_PAGE[Type]} />
                </Switch>
            </Router>
        </>
    );
}

export default App;
