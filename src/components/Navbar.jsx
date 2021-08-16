import React from 'react';
import MenuIcon from '@material-ui/icons/Menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

function Navbar({ handleMenuIconClick, mobileIconVisible }) {
    let divClass = mobileIconVisible
        ? 'justify-content-between'
        : 'justify-content-end';

    return (
        <div
            className={`right-top-header d-flex align-items-center ${divClass}`}
        >
            {mobileIconVisible && (
                <button
                    onClick={handleMenuIconClick}
                    className="btn btn-primary menu-btn open-sidebar"
                >
                    <FontAwesomeIcon icon={faBars} className="open-sidebar" />
                </button>
            )}
            <p className="mb-0">Admin</p>
        </div>
    );
}

export default Navbar;
