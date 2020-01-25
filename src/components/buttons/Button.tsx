import React from 'react';

interface Props {
    onClick: () => void;
    children: String;
}

function Button({ onClick, children }: Props) {
    return (
        <button className="instructions-button" onClick={onClick}>
            {children}
        </button>
    );
}

export default Button;
