import React from 'react';

function Nametag({ name }) {
    return <div className="name-tag">{name.trim()}</div>;
}

export default Nametag;
