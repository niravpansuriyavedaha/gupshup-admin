import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { Sidebar, Screens } from '../config/routes';
import { logout } from '../store/actions/logout';
import Hidden from '@material-ui/core/Hidden';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

const SidebarItem = ({ item, location }) => {
    const dispatch = useDispatch();
    switch (item.route) {
        case Screens.LOGOUT:
            return (
                <li
                    className={location.pathname === item.route ? 'active' : ''}
                    onClick={() => dispatch(logout())}
                >
                    {item.label}
                </li>
            );

        default:
            return (
                <Link to={item.route}>
                    <li
                        className={
                            location.pathname === item.route ? 'active' : ''
                        }
                    >
                        {item.label}
                    </li>
                </Link>
            );
    }
};

const SidebarItemWithShutter = ({ item }) => {
    const [open, setOpen] = useState(false);
    const toggleShutter = () => setOpen(!open);
    const location = useLocation();
    const activeClassName = item.subRoutes
        .map((e) => e.route)
        .includes(location.pathname)
        ? 'bg-light'
        : '';
    useEffect(() => {
        setOpen(item.subRoutes.map((e) => e.route).includes(location.pathname));
    }, []);
    return (
        <>
            <li
                onClick={toggleShutter}
                className={`open-sidebar ${activeClassName}`}
            >
                <div className="d-flex open-sidebar">
                    {item.label}
                    <div className="w-100 d-flex flex-row-reverse open-sidebar">
                        {open ? (
                            <KeyboardArrowUpIcon className="open-sidebar" />
                        ) : (
                            <KeyboardArrowDownIcon />
                        )}
                    </div>
                </div>
            </li>
            {open &&
                item.subRoutes.map((e, i) => (
                    <SidebarItem item={e} location={location} key={i} />
                ))}
        </>
    );
};

function SidebarComponent({ mobileDrawerVisible, desktopDrawerVisible }) {
    const { Type } = useSelector((state) => state.user);
    const location = useLocation();
    const drawerWidth = 240;

    let createRoutes = (arr) => {
        if (arr && arr.length) {
            return arr.map((e, i) => (
                <SidebarItem item={e} location={location} key={i} />
            ));
        }
        if (Type) {
            return Sidebar[Type].map((e, i) => {
                if (e.subRoutes) {
                    return <SidebarItemWithShutter item={e} key={i} />;
                }
                return <SidebarItem item={e} location={location} key={i} />;
            });
        }
    };

    return (
        <>
            {desktopDrawerVisible && (
                <div className="p-0" style={{ width: `${drawerWidth}px` }}>
                    <div className="left-top-header">FROST OF LONDON</div>
                    <ul className="left-nav list-group">{createRoutes()}</ul>
                </div>
            )}
            {mobileDrawerVisible && (
                <div
                    className="p-0 mobile-drawer"
                    style={{
                        width: `${drawerWidth}px`,
                    }}
                >
                    <div className="left-top-header">FROST OF LONDON</div>
                    <ul className="left-nav list-group">{createRoutes()}</ul>
                </div>
            )}
        </>
    );
}

export default SidebarComponent;
