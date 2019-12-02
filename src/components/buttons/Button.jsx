import React from 'react';

function Button({ onClick, children }) {
    return (
        <button className="instructions-button" onClick={onClick}>
            {children}
        </button>
    );
}

export default Button;
