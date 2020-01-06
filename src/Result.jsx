import * as React from 'react';

const Result = ({ game }) => {
    return (
        <>
            <div className="result__label">Resultat</div>
            <iframe className="result" srcDoc={game ? game.result_html : ''} />
        </>
    );
};

export default Result;
