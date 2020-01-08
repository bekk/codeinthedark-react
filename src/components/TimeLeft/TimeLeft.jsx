import * as React from 'react';
import * as moment from 'moment';

const TimeLeft = ({ endTime }) => {
    const timeLeft = moment.duration(moment(endTime).diff(moment())).asMilliseconds();
    return (
        <div className={'game-countdown'}>{`Gjenstår ${moment.utc(timeLeft).format('mm:ss')}`}</div>
    );
};

export default TimeLeft;
