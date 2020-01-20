import React from 'react';

interface Props {
    name: string;
}

function Nametag({ name }: Props) {
    if (!name) {
        return null;
    }
    return <div className="name-tag">{name.trim()}</div>;
}

export default Nametag;
