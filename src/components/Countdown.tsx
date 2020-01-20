import React from 'react';
import classnames from 'classnames';
import './countdown.less';

interface Props {
    tekst: string;
    waiting: boolean;
}

function Countdown({ tekst, waiting }: Props) {
    if (!waiting) return null;

    return (
        <div className={classnames('countdown', { waiting })}>
            <span>{tekst}</span>
        </div>
    );
}

export default Countdown;
