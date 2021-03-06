import React, { StatelessComponent, useEffect } from 'react';
import moment from 'moment';

interface IProps {
    endTime: string | undefined;
}

const TimeLeft: StatelessComponent<IProps> = ({ endTime }) => {
    if (!endTime) {
        return null;
    }

    const [timeLeft, setTimeLeft] = React.useState(0);

    useEffect(() => {
        setInterval(() => {
            const duration = moment.duration(moment(endTime).diff(moment())).asMilliseconds();
            setTimeLeft(duration < 0 ? 0 : duration);
        }, 1000);
    }, [endTime]);

    return (
        <div className={'game-countdown'}>{`Gjenstår ${moment.utc(timeLeft).format('mm:ss')}`}</div>
    );
};

export default TimeLeft;
