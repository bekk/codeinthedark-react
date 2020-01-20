import React from 'react';

function StreakContainer({ animationKey, streak, animate, exclamation }: any) {
    return (
        <div className="streak-container">
            <div className="current">Combo</div>
            <div key={animationKey} className="counter bump">
                {streak}
            </div>
            <div
                key={animationKey + 1}
                className={`bar ${animate && streak !== 0 ? 'animate' : ''}`}
            />
            <div className="exclamations">
                {exclamation && (
                    <span key={exclamation} className="exclamation">
                        {exclamation}
                    </span>
                )}
            </div>
        </div>
    );
}

export default StreakContainer;
