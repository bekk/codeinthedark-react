import React from 'react';
import classnames from 'classnames';
import './countdown.less';

function Countdown({ tekst, waiting }) {
    if (!waiting) return null;

    return (
        <div className={classnames('countdown', { waiting })}>
            <span>{tekst}</span>
        </div>
    );
}

export default Countdown;
