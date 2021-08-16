import React, { useState } from 'react';

function Button({ btnClassType, className, label, onClick }) {
    const [loading, setLoading] = useState(false);

    return (
        <button
            className={`btn btn-${
                btnClassType ? btnClassType : 'primary'
            } ${className}`}
            onClick={onClick.bind(this, setLoading)}
        >
            {loading ? 'Please wait...' : label}
        </button>
    );
}

export default Button;
