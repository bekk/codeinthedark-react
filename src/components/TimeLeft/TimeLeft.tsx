import * as React from 'react';
import moment from 'moment';

interface IProps {
    endTime: string;
}

const TimeLeft: React.StatelessComponent<IProps> = ({ endTime }) => {
    const timeLeft = moment.duration(moment(endTime).diff(moment())).asMilliseconds();
    return (
        <div className={'game-countdown'}>{`Gjenstår ${moment.utc(timeLeft).format('mm:ss')}`}</div>
    );
};

export default TimeLeft;
