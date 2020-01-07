import React from 'react';

function Nametag({ name }) {
    if (!name) {
        return null;
    }
    return <div className="name-tag">{name.trim()}</div>;
}

export default Nametag;
