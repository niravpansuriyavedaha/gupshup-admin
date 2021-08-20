import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { Switch, Route, Redirect } from 'react-router-dom';
import { AuthRoutes, Screens } from '../config/routes';
import { useSelector } from 'react-redux';
import LoadingScreen from '../screens/LoadingScreen';

function DashboardLayout() {
    const ref = useRef(null);

    const [mobileDrawerVisible, setMobileDrawerVisible] = useState(true);
    const [desktopDrawerVisible, setDesktopDrawerVisible] = useState(true);
    const [mobileIconVisible, setMobileIconVisible] = useState(true);

    const { Type } = useSelector((state) => state.user);
    const [loading, setLoading] = useState(false);

    const setScreenLoading = (flag) => setLoading(flag);

    const handleMenuIconClick = () => {
        setMobileDrawerVisible(true);
    };
    const handleMenuClose = () => {
        setMobileDrawerVisible(false);
    };

    useEffect(() => {
        //setDefault options
        handleWindowSizeChange();
        //set options on resize
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        };
    }, []);

    useEffect(() => {
        window.document.addEventListener('click', (e) => {
            if (
                !e.target.classList.contains('open-sidebar') &&
                !e.target.classList.contains('mobile-drawer')
            ) {
                setMobileDrawerVisible(false);
            }
        });
    }, []);

    function handleWindowSizeChange() {
        if (window.innerWidth <= 962) {
            //Mobile Screen
            setMobileIconVisible(true);
            setMobileDrawerVisible(false);
            setDesktopDrawerVisible(false);
        } else {
            //Desktop Screen
            setMobileIconVisible(false);
            setMobileDrawerVisible(false);
            setDesktopDrawerVisible(true);
        }
    }

    let createRoutes = () => {
        if (Type) {
            return AuthRoutes[Type].map((e, i) => (
                <Route
                    path={e.path}
                    key={i}
                    render={(props) => (
                        <e.component
                            {...props}
                            setScreenLoading={setScreenLoading}
                        />
                    )}
                />
            ));
        }
    };

    return (
        <div className="container-fluid">
            <div className="row" style={{ flexWrap: 'nowrap' }}>
                <Sidebar
                    mobileDrawerVisible={mobileDrawerVisible}
                    desktopDrawerVisible={desktopDrawerVisible}
                    mobileIconVisible={mobileIconVisible}
                    handleMenuClose={handleMenuClose}
                />
                <div className="col p-0">
                    <Navbar
                        handleMenuIconClick={handleMenuIconClick}
                        mobileIconVisible={mobileIconVisible}
                    />
                    {/* <Switch>
                        {createRoutes()} */}
                    {/* Default */}
                    {/* <Redirect to={Screens.PRODUCTS} />
                    </Switch> */}

                    <div className="loadingDiv">
                        {loading && <LoadingScreen />}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashboardLayout;
